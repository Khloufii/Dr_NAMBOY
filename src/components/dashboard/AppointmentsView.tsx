import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { Appointment } from '../../types';
import { db } from '../../services/firebase';
import {
  doc,
  updateDoc,
  deleteDoc,
  collection,
  onSnapshot,
  getDocs,
} from 'firebase/firestore';
import {
  Calendar as CalendarIcon,
  List,
  Search,
  Check,
  Clock,
  X,
  CheckCircle2,
  CalendarDays,
  Plus,
  AlertTriangle,
  RefreshCw,
  Trash2,
  ShieldAlert,
  Loader2,
} from 'lucide-react';
import { generateAvailableSlots } from '../../services/dataService';

interface AppointmentsViewProps {
  appointments?: Appointment[];
  onUpdateStatus?: (id: string, status: Appointment['status']) => void;
  onReschedule?: (id: string, newDate: string, newTime: string) => void;
  onOpenNewAppointment?: () => void;
  onRefresh?: () => void | Promise<void>;
  onDeleteAppointment?: (id: string) => void | Promise<void>;
  onDeleteAllAppointments?: () => void | Promise<void>;
}

const AUTO_REFRESH_INTERVAL = 15_000;
const COLLECTION_NAME = 'appointments';

const getTodayString = (): string => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

/** Convertit date (YYYY-MM-DD) + heure (HH:MM) en timestamp numérique */
const getAppointmentTimestamp = (dateStr?: string, timeStr?: string): number => {
  if (!dateStr || !timeStr) return Number.MAX_SAFE_INTEGER;
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    const [hh, mm] = timeStr.split(':').map(Number);
    return new Date(y, (m || 1) - 1, d || 1, hh || 0, mm || 0, 0, 0).getTime();
  } catch {
    return Number.MAX_SAFE_INTEGER;
  }
};

const isSlotInPast = (dateStr: string, timeStr: string, now: Date): boolean => {
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    const [hh, mm] = timeStr.split(':').map(Number);
    const slotDate = new Date(y, (m || 1) - 1, d || 1, hh || 0, mm || 0, 0, 0);
    return slotDate.getTime() <= now.getTime();
  } catch {
    return false;
  }
};

const tr = (obj: any, path: string, fallback = ''): string => {
  try {
    const value = path.split('.').reduce((acc, k) => acc?.[k], obj);
    return typeof value === 'string' ? value : fallback;
  } catch {
    return fallback;
  }
};

type ConfirmAction =
  | { apt: Appointment; type: 'completed' | 'cancelled' }
  | null;

type ConfirmDelete =
  | { kind: 'one'; apt: Appointment }
  | { kind: 'all' }
  | null;

export const AppointmentsView: React.FC<AppointmentsViewProps> = ({
  appointments = [],
  onUpdateStatus,
  onReschedule,
  onOpenNewAppointment,
  onRefresh,
  onDeleteAppointment,
  onDeleteAllAppointments,
}) => {
  const { t, language } = useLanguage();
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [reschedulingApt, setReschedulingApt] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState(getTodayString());
  const [newTime, setNewTime] = useState('11:00');

  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);
  const [confirmDelete, setConfirmDelete] = useState<ConfirmDelete>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isWorking, setIsWorking] = useState(false);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [now, setNow] = useState<Date>(new Date());
  const isRefreshingRef = useRef(false);

  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  /* ------------------------------------------------------------------ */
  /* ✨ TEMPS RÉEL — abonnement Firestore                                */
  /* ------------------------------------------------------------------ */
  const [liveAppointments, setLiveAppointments] = useState<Appointment[] | null>(null);

  useEffect(() => {
    if (!db) return;

    console.log('[AppointmentsView] Subscribing to Firestore appointments...');

    const unsub = onSnapshot(
      collection(db, COLLECTION_NAME),
      (snap) => {
        const list: Appointment[] = snap.docs.map((d) => {
          const data = d.data() as Omit<Appointment, 'id'>;
          return { ...data, id: (data as any).id || d.id };
        });

        console.log('[AppointmentsView] ✅ Live snapshot:', list.length, 'RDV');
        setLiveAppointments(list);
        setLastUpdated(new Date());
      },
      (err) => {
        console.warn('[AppointmentsView] Snapshot error:', err);
      },
    );

    return () => unsub();
  }, []);

  /* Source de vérité : Firestore si dispo, sinon prop */
  const sourceAppointments = useMemo(() => {
    if (liveAppointments !== null) return liveAppointments;
    return Array.isArray(appointments) ? appointments : [];
  }, [liveAppointments, appointments]);

  /* Override optimiste local */
  const [localOverrides, setLocalOverrides] = useState<Record<string, Appointment>>({});
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());

  /* Nettoie les overrides quand Firestore confirme */
  useEffect(() => {
    if (liveAppointments === null) return;

    setDeletedIds((prev) => {
      if (prev.size === 0) return prev;
      const next = new Set(prev);
      let changed = false;
      prev.forEach((id) => {
        if (!liveAppointments.some((a) => a.id === id)) {
          next.delete(id);
          changed = true;
        }
      });
      return changed ? next : prev;
    });

    setLocalOverrides((prev) => {
      const next = { ...prev };
      let changed = false;
      Object.entries(prev).forEach(([id, override]) => {
        const fsVersion = liveAppointments.find((a) => a.id === id);
        if (!fsVersion) {
          delete next[id];
          changed = true;
        } else if (JSON.stringify(fsVersion) === JSON.stringify(override)) {
          delete next[id];
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [liveAppointments]);

  /* Liste affichée */
  const displayAppointments = useMemo(() => {
    return sourceAppointments
      .filter((a) => a && a.id && !deletedIds.has(a.id))
      .map((a) => localOverrides[a.id] ?? a);
  }, [sourceAppointments, localOverrides, deletedIds]);

  /* ------------------------------------------------------------------ */
  /* Horloge                                                             */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(timer);
  }, []);

  /* ------------------------------------------------------------------ */
  /* Rafraîchissement manuel                                             */
  /* ------------------------------------------------------------------ */
  const handleManualRefresh = useCallback(async () => {
    if (!onRefresh || isRefreshingRef.current) return;
    isRefreshingRef.current = true;
    setIsRefreshing(true);
    try {
      await onRefresh();
      setLastUpdated(new Date());
    } catch (err) {
      console.warn('[AppointmentsView] Refresh failed:', err);
    } finally {
      setIsRefreshing(false);
      isRefreshingRef.current = false;
    }
  }, [onRefresh]);

  useEffect(() => {
    if (!onRefresh) return;
    const timer = setInterval(() => {
      if (document.visibilityState !== 'visible') return;
      handleManualRefresh();
    }, AUTO_REFRESH_INTERVAL);
    return () => clearInterval(timer);
  }, [onRefresh, handleManualRefresh]);

  /* ------------------------------------------------------------------ */
  /* CHANGER STATUT (confirm/completed/cancelled) — REALTIME            */
  /* ------------------------------------------------------------------ */
  const requestStatusChange = (apt: Appointment, type: 'completed' | 'cancelled') => {
    setConfirmAction({ apt, type });
  };

  const executeConfirmedAction = async () => {
    if (!confirmAction) return;
    const { apt, type } = confirmAction;

    setIsWorking(true);

    setLocalOverrides((prev) => ({ ...prev, [apt.id]: { ...apt, status: type } }));

    try {
      if (onUpdateStatus) {
        onUpdateStatus(apt.id, type);
      } else if (db && apt.id) {
        try {
          await updateDoc(doc(db, COLLECTION_NAME, apt.id), { status: type });
          console.log('[AppointmentsView] ✅ Status updated in Firestore:', apt.id, type);
        } catch (fsErr) {
          console.warn('[AppointmentsView] Firestore status update failed:', fsErr);
        }
      }

      showToast(
        type === 'completed'
          ? language === 'ar'
            ? 'تم إنهاء الموعد.'
            : 'Rendez-vous terminé.'
          : language === 'ar'
            ? 'تم إلغاء الموعد.'
            : 'Rendez-vous annulé.',
      );
    } catch (err) {
      console.error('[AppointmentsView] Status change failed:', err);
    } finally {
      setIsWorking(false);
      setConfirmAction(null);
    }
  };

  const handleQuickConfirm = async (apt: Appointment) => {
    setIsWorking(true);
    setLocalOverrides((prev) => ({ ...prev, [apt.id]: { ...apt, status: 'confirmed' } }));

    try {
      if (onUpdateStatus) {
        onUpdateStatus(apt.id, 'confirmed');
      } else if (db && apt.id) {
        try {
          await updateDoc(doc(db, COLLECTION_NAME, apt.id), { status: 'confirmed' });
          console.log('[AppointmentsView] ✅ Confirmed in Firestore:', apt.id);
        } catch (fsErr) {
          console.warn('[AppointmentsView] Firestore confirm failed:', fsErr);
        }
      }
      showToast(
        language === 'ar' ? 'تم تأكيد الموعد.' : 'Rendez-vous confirmé.',
      );
    } catch (err) {
      console.error('[AppointmentsView] Confirm failed:', err);
    } finally {
      setIsWorking(false);
    }
  };

  const cancelConfirm = () => setConfirmAction(null);

  /* ------------------------------------------------------------------ */
  /* REPORTER — REALTIME                                                 */
  /* ------------------------------------------------------------------ */
  const handleConfirmReschedule = async () => {
    if (!reschedulingApt || !isRescheduleValid) return;

    setIsWorking(true);

    const apt = reschedulingApt;
    const targetDate = newDate;
    const targetTime = newTime;

    setLocalOverrides((prev) => ({
      ...prev,
      [apt.id]: { ...apt, date: targetDate, time: targetTime },
    }));

    try {
      if (onReschedule) {
        onReschedule(apt.id, targetDate, targetTime);
      } else if (db && apt.id) {
        try {
          await updateDoc(doc(db, COLLECTION_NAME, apt.id), {
            date: targetDate,
            time: targetTime,
          });
          console.log(
            '[AppointmentsView] ✅ Rescheduled in Firestore:',
            apt.id,
            targetDate,
            targetTime,
          );
        } catch (fsErr) {
          console.warn('[AppointmentsView] Firestore reschedule failed:', fsErr);
        }
      }

      showToast(
        language === 'ar'
          ? `تم تأجيل الموعد إلى ${targetDate} - ${targetTime}`
          : `Rendez-vous reporté au ${targetDate} à ${targetTime}`,
      );
      setReschedulingApt(null);
    } catch (err) {
      console.error('[AppointmentsView] Reschedule failed:', err);
    } finally {
      setIsWorking(false);
    }
  };

  /* ------------------------------------------------------------------ */
  /* SUPPRESSION — REALTIME                                              */
  /* ------------------------------------------------------------------ */
  const executeDelete = async () => {
    if (!confirmDelete) return;
    setIsDeleting(true);

    const firestore = db;

    try {
      if (confirmDelete.kind === 'one') {
        const aptId = confirmDelete.apt.id;

        setDeletedIds((prev) => new Set(prev).add(aptId));

        if (onDeleteAppointment) {
          await onDeleteAppointment(aptId);
        } else if (firestore && aptId) {
          try {
            await deleteDoc(doc(firestore, COLLECTION_NAME, aptId));
            console.log('[AppointmentsView] ✅ Deleted from Firestore:', aptId);
          } catch (fsErr) {
            console.warn('[AppointmentsView] Firestore delete failed:', fsErr);
          }
        }

        showToast(
          language === 'ar' ? 'تم حذف الموعد.' : 'Rendez-vous supprimé.',
        );
      } else {
        const allIds = displayAppointments
          .map((a) => a.id)
          .filter(Boolean) as string[];
        setDeletedIds(new Set(allIds));

        if (onDeleteAllAppointments) {
          await onDeleteAllAppointments();
        } else if (firestore) {
          try {
            const snapshot = await getDocs(collection(firestore, COLLECTION_NAME));
            await Promise.all(
              snapshot.docs.map((d) =>
                deleteDoc(doc(firestore, COLLECTION_NAME, d.id)),
              ),
            );
            console.log('[AppointmentsView] ✅ All RDV deleted');
          } catch (fsErr) {
            console.warn('[AppointmentsView] Firestore delete all failed:', fsErr);
          }
        }

        showToast(
          language === 'ar'
            ? 'تم حذف جميع المواعيد.'
            : 'Tous les rendez-vous ont été supprimés.',
        );
      }
    } catch (err) {
      console.error('[AppointmentsView] Delete failed:', err);
      showToast(
        language === 'ar'
          ? 'حدث خطأ أثناء الحذف.'
          : 'Une erreur est survenue lors de la suppression.',
      );
    } finally {
      setIsDeleting(false);
      setConfirmDelete(null);
    }
  };

  /* ------------------------------------------------------------------ */
  /* ✨ FILTRAGE + TRI PAR DATE/HEURE DE RDV                             */
  /*   → Prochains RDV en premier (ascendant)                            */
  /*   → RDV passés à la fin (du plus récent au plus ancien)             */
  /* ------------------------------------------------------------------ */
  const sortedAppointments = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    const filtered = (displayAppointments || []).filter((apt) => {
      if (!apt) return false;
      const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
      const name = (apt.patientName || '').toLowerCase();
      const phone = apt.patientPhone || '';
      const notes = (apt.notes || '').toLowerCase();
      const matchesSearch =
        !q || name.includes(q) || phone.includes(searchQuery) || notes.includes(q);
      return matchesStatus && matchesSearch;
    });

    const nowMs = now.getTime();

    return [...filtered].sort((a, b) => {
      const tsA = getAppointmentTimestamp(a.date, a.time);
      const tsB = getAppointmentTimestamp(b.date, b.time);

      const isPastA = tsA < nowMs;
      const isPastB = tsB < nowMs;

      /* Les RDV futurs passent avant les RDV passés */
      if (isPastA !== isPastB) return isPastA ? 1 : -1;

      /* Futurs : prochains en premier (ascendant) */
      /* Passés : le plus récent en premier (descendant) */
      return isPastA ? tsB - tsA : tsA - tsB;
    });
  }, [displayAppointments, statusFilter, searchQuery, now]);

  /* ------------------------------------------------------------------ */
  /* Créneaux de reprogrammation                                          */
  /* ------------------------------------------------------------------ */
  const availableSlotsForReschedule = useMemo(() => {
    let slots: any[] = [];
    try {
      slots = generateAvailableSlots(newDate) || [];
    } catch (err) {
      console.warn('[AppointmentsView] generateAvailableSlots failed:', err);
      slots = [];
    }
    const todayStr = getTodayString();
    const isToday = newDate === todayStr;

    return slots.map((slot) => {
      const isPast = isToday && isSlotInPast(newDate, slot.time, now);
      const isCurrentAptSlot =
        reschedulingApt?.date === newDate && reschedulingApt?.time === slot.time;
      return {
        ...slot,
        available: !!slot.available && !isPast,
        isPast,
        isCurrentAptSlot,
      };
    });
  }, [newDate, now, reschedulingApt]);

  useEffect(() => {
    if (!reschedulingApt) return;
    const current = availableSlotsForReschedule.find((s) => s.time === newTime);
    if (!current || !current.available) {
      const first = availableSlotsForReschedule.find(
        (s) => s.available && !s.isCurrentAptSlot,
      );
      if (first) setNewTime(first.time);
    }
  }, [availableSlotsForReschedule, newTime, reschedulingApt]);

  const selectedRescheduleSlot = availableSlotsForReschedule.find(
    (s) => s.time === newTime,
  );
  const isRescheduleValid = !!selectedRescheduleSlot?.available;

  /* ------------------------------------------------------------------ */
  /* Group by date (calendrier) — dates triées du plus récent au plus ancien */
  /* ------------------------------------------------------------------ */
  const groupedByDate = useMemo(() => {
    return (displayAppointments || []).reduce(
      (acc, apt) => {
        if (!apt?.date) return acc;
        if (!acc[apt.date]) acc[apt.date] = [];
        acc[apt.date].push(apt);
        return acc;
      },
      {} as Record<string, Appointment[]>,
    );
  }, [displayAppointments]);

  /* Calendrier : dates futures en premier, puis dates passées */
  const sortedDates = useMemo(() => {
    const todayStr = getTodayString();
    const all = Object.keys(groupedByDate);

    const future = all.filter((d) => d >= todayStr).sort((a, b) => a.localeCompare(b));
    const past = all.filter((d) => d < todayStr).sort((a, b) => b.localeCompare(a));

    return [...future, ...past];
  }, [groupedByDate]);

  /* ------------------------------------------------------------------ */
  /* Labels                                                               */
  /* ------------------------------------------------------------------ */
  const L = {
    title: tr(t, 'dashboard.appointments.title', 'Gestion des Rendez-vous'),
    viewList: tr(t, 'dashboard.appointments.viewList', 'Liste'),
    viewCalendar: tr(t, 'dashboard.appointments.viewCalendar', 'Calendrier'),
    all: tr(t, 'dashboard.appointments.all', 'Tous'),
    confirmed: tr(t, 'dashboard.appointments.confirmed', 'Confirmés'),
    pending: tr(t, 'dashboard.appointments.pending', 'En attente'),
    completed: tr(t, 'dashboard.appointments.completed', 'Terminés'),
    cancelled: tr(t, 'dashboard.appointments.cancelled', 'Annulés'),
    searchPatient: tr(t, 'dashboard.appointments.searchPatient', 'Rechercher un patient...'),
    thTime: tr(t, 'dashboard.appointments.tableHeader.time', 'Heure'),
    thPatient: tr(t, 'dashboard.appointments.tableHeader.patient', 'Patient'),
    thPhone: tr(t, 'dashboard.appointments.tableHeader.phone', 'Téléphone'),
    thService: tr(t, 'dashboard.appointments.tableHeader.service', 'Service'),
    thType: tr(t, 'dashboard.appointments.tableHeader.type', 'Canal'),
    thStatus: tr(t, 'dashboard.appointments.tableHeader.status', 'Statut'),
    thActions: tr(t, 'dashboard.appointments.tableHeader.actions', 'Actions'),
    rescheduleTitle: tr(t, 'dashboard.appointments.rescheduleModal.title', 'Reporter le rendez-vous'),
    newDate: tr(t, 'dashboard.appointments.rescheduleModal.newDate', 'Nouvelle date'),
    newTime: tr(t, 'dashboard.appointments.rescheduleModal.newTime', 'Nouvelle heure'),
    save: tr(t, 'dashboard.appointments.rescheduleModal.save', 'Enregistrer'),
    close: tr(t, 'dashboard.appointments.rescheduleModal.close', 'Fermer'),
  };

  const formatLastUpdated = (d: Date) => {
    try {
      return d.toLocaleTimeString(language === 'ar' ? 'ar-MA' : 'fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch {
      return d.toTimeString().slice(0, 8);
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed':
        return L.confirmed;
      case 'pending':
        return L.pending;
      case 'completed':
        return L.completed;
      case 'cancelled':
        return L.cancelled;
      default:
        return status;
    }
  };

  const confirmTexts = useMemo(() => {
    if (!confirmAction) return null;
    const isComplete = confirmAction.type === 'completed';
    return {
      title: isComplete
        ? language === 'ar'
          ? 'تأكيد إنهاء الموعد'
          : 'Terminer le rendez-vous ?'
        : language === 'ar'
          ? 'تأكيد إلغاء الموعد'
          : 'Annuler le rendez-vous ?',
      message: isComplete
        ? language === 'ar'
          ? `هل تريد تأكيد إنهاء موعد المريض "${confirmAction.apt.patientName}" ؟`
          : `Voulez-vous marquer le rendez-vous de "${confirmAction.apt.patientName}" comme terminé ?`
        : language === 'ar'
          ? `هل تريد إلغاء موعد المريض "${confirmAction.apt.patientName}" ؟`
          : `Voulez-vous annuler le rendez-vous de "${confirmAction.apt.patientName}" ?`,
      confirmLabel: isComplete
        ? language === 'ar'
          ? 'نعم، إنهاء'
          : 'Oui, terminer'
        : language === 'ar'
          ? 'نعم، إلغاء'
          : 'Oui, annuler',
      cancelLabel: language === 'ar' ? 'تراجع' : 'Retour',
    };
  }, [confirmAction, language]);

  const deleteTexts = useMemo(() => {
    if (!confirmDelete) return null;
    if (confirmDelete.kind === 'all') {
      return {
        title:
          language === 'ar'
            ? 'حذف جميع المواعيد ؟'
            : 'Supprimer tous les rendez-vous ?',
        message:
          language === 'ar'
            ? `سيتم حذف ${displayAppointments.length} موعد نهائياً.`
            : `Cette action supprimera définitivement ${displayAppointments.length} rendez-vous.`,
        confirmLabel: language === 'ar' ? 'نعم، احذف الكل' : 'Oui, tout supprimer',
      };
    }
    return {
      title:
        language === 'ar'
          ? 'حذف هذا الموعد ؟'
          : 'Supprimer ce rendez-vous ?',
      message:
        language === 'ar'
          ? `سيتم حذف موعد "${confirmDelete.apt.patientName}" (${confirmDelete.apt.date} - ${confirmDelete.apt.time}).`
          : `Le rendez-vous de "${confirmDelete.apt.patientName}" du ${confirmDelete.apt.date} à ${confirmDelete.apt.time} sera supprimé.`,
      confirmLabel: language === 'ar' ? 'نعم، احذف' : 'Oui, supprimer',
    };
  }, [confirmDelete, language, displayAppointments.length]);

  /* ------------------------------------------------------------------ */
  /* Rendu                                                                */
  /* ------------------------------------------------------------------ */
  return (
    <div dir={language === 'ar' ? 'rtl' : 'ltr'} className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-xs font-bold text-emerald-800 sm:text-sm">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
          <span>{toast}</span>
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col items-start justify-between gap-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">{L.title}</h2>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <p className="text-xs text-slate-500 sm:text-sm">
              {sortedAppointments.length} {language === 'ar' ? 'موعد' : 'rendez-vous'}
            </p>
            {liveAppointments !== null && (
              <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                <span>
                  {language === 'ar' ? 'مباشر' : 'Temps réel'} —{' '}
                  {formatLastUpdated(lastUpdated)}
                </span>
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {displayAppointments.length > 0 && (
            <button
              onClick={() => setConfirmDelete({ kind: 'all' })}
              className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700 transition-colors hover:border-red-300 hover:bg-red-100"
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">
                {language === 'ar' ? 'حذف الكل' : 'Tout supprimer'}
              </span>
            </button>
          )}

          {onRefresh && (
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">
                {language === 'ar' ? 'تحديث' : 'Actualiser'}
              </span>
            </button>
          )}

          <div className="flex items-center rounded-xl bg-slate-100 p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <List className="h-3.5 w-3.5" />
              <span>{L.viewList}</span>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                viewMode === 'calendar'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <CalendarDays className="h-3.5 w-3.5" />
              <span>{L.viewCalendar}</span>
            </button>
          </div>

          {onOpenNewAppointment && (
            <button
              onClick={onOpenNewAppointment}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md transition-colors hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">
                {language === 'ar' ? 'إضافة موعد' : 'Ajouter RDV'}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* FILTRES */}
      <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 sm:flex-row">
        <div className="relative w-full sm:w-80">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={L.searchPatient}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pe-3 ps-9 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex w-full items-center gap-1.5 overflow-x-auto pb-1 sm:w-auto sm:pb-0">
          {(['all', 'confirmed', 'pending', 'completed', 'cancelled'] as const).map(
            (status) => {
              const label =
                status === 'all'
                  ? L.all
                  : status === 'confirmed'
                    ? L.confirmed
                    : status === 'pending'
                      ? L.pending
                      : status === 'completed'
                        ? L.completed
                        : L.cancelled;

              const count =
                status === 'all'
                  ? displayAppointments.length
                  : displayAppointments.filter((a) => a.status === status).length;

              return (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                    statusFilter === status
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>{label}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                      statusFilter === status
                        ? 'bg-white/20 text-white'
                        : 'bg-white text-slate-500'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            },
          )}
        </div>
      </div>

      {/* VUE LISTE */}
      {viewMode === 'list' && (
        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs">
              <thead className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                <tr>
                  <th className="px-4 py-3.5 text-start">{L.thTime}</th>
                  <th className="px-4 py-3.5 text-start">{L.thPatient}</th>
                  <th className="px-4 py-3.5 text-start">{L.thPhone}</th>
                  <th className="px-4 py-3.5 text-start">{L.thService}</th>
                  <th className="px-4 py-3.5 text-start">{L.thType}</th>
                  <th className="px-4 py-3.5 text-start">{L.thStatus}</th>
                  <th className="px-4 py-3.5 text-end">{L.thActions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      {language === 'ar'
                        ? 'لا توجد مواعيد مطابقة للفلاتر.'
                        : 'Aucun rendez-vous trouvé correspondant aux filtres.'}
                    </td>
                  </tr>
                ) : (
                  sortedAppointments.map((apt) => {
                    const ts = getAppointmentTimestamp(apt.date, apt.time);
                    const isPast = ts < now.getTime();

                    return (
                      <tr
                        key={apt.id}
                        className={`transition-colors hover:bg-slate-50/60 ${
                          isPast ? 'opacity-70' : ''
                        }`}
                      >
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <div>
                              <div className="font-mono font-bold text-slate-900">
                                {apt.time}
                              </div>
                              <div className="text-[10px] text-slate-500">
                                {apt.date}
                              </div>
                            </div>
                            {isPast && (
                              <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold uppercase text-slate-500">
                                {language === 'ar' ? 'سابق' : 'Passé'}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-4 py-3.5">
                          <div className="font-bold text-slate-900">
                            {apt.patientName}
                          </div>
                          {apt.notes && (
                            <div className="max-w-xs truncate text-[11px] text-slate-500">
                              {apt.notes}
                            </div>
                          )}
                        </td>

                        <td className="px-4 py-3.5 font-mono text-slate-700">
                          <a href={`tel:${apt.patientPhone}`} className="hover:text-blue-600">
                            {apt.patientPhone}
                          </a>
                        </td>

                        <td className="px-4 py-3.5">
                          <span className="font-semibold text-slate-800">
                            {language === 'ar' ? apt.serviceNameAr : apt.serviceNameFr}
                          </span>
                        </td>

                        <td className="px-4 py-3.5">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              apt.bookingType === 'whatsapp'
                                ? 'bg-emerald-100 text-emerald-800'
                                : apt.bookingType === 'desk'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {(apt.bookingType || 'online').toUpperCase()}
                          </span>
                        </td>

                        <td className="px-4 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                              apt.status === 'confirmed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : apt.status === 'pending'
                                  ? 'bg-amber-100 text-amber-800'
                                  : apt.status === 'completed'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {getStatusLabel(apt.status)}
                          </span>
                        </td>

                        <td className="px-4 py-3.5 text-end">
                          <div className="flex flex-wrap items-center justify-end gap-1.5">
                            {apt.status !== 'confirmed' && apt.status !== 'completed' && (
                              <button
                                onClick={() => handleQuickConfirm(apt)}
                                disabled={isWorking}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-[11px] font-bold text-emerald-700 transition-colors hover:bg-emerald-600 hover:text-white disabled:opacity-50"
                              >
                                <Check className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">
                                  {language === 'ar' ? 'تأكيد' : 'Confirmer'}
                                </span>
                              </button>
                            )}

                            <button
                              onClick={() => {
                                setReschedulingApt(apt);
                                setNewDate(apt.date);
                                setNewTime(apt.time);
                              }}
                              disabled={isWorking}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1.5 text-[11px] font-bold text-blue-700 transition-colors hover:bg-blue-600 hover:text-white disabled:opacity-50"
                            >
                              <Clock className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">
                                {language === 'ar' ? 'إعادة جدولة' : 'Reporter'}
                              </span>
                            </button>

                            {apt.status !== 'completed' && (
                              <button
                                onClick={() => requestStatusChange(apt, 'completed')}
                                disabled={isWorking}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-2.5 py-1.5 text-[11px] font-bold text-indigo-700 transition-colors hover:bg-indigo-600 hover:text-white disabled:opacity-50"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">
                                  {language === 'ar' ? 'إنهاء' : 'Terminer'}
                                </span>
                              </button>
                            )}

                            {apt.status !== 'cancelled' && (
                              <button
                                onClick={() => requestStatusChange(apt, 'cancelled')}
                                disabled={isWorking}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-2.5 py-1.5 text-[11px] font-bold text-red-700 transition-colors hover:bg-red-600 hover:text-white disabled:opacity-50"
                              >
                                <X className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">
                                  {language === 'ar' ? 'إلغاء' : 'Annuler'}
                                </span>
                              </button>
                            )}

                            <button
                              onClick={() => setConfirmDelete({ kind: 'one', apt })}
                              disabled={isWorking}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-2 py-1.5 text-[11px] font-bold text-red-600 transition-colors hover:bg-red-600 hover:text-white disabled:opacity-50"
                              title={language === 'ar' ? 'حذف' : 'Supprimer'}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VUE CALENDRIER */}
      {viewMode === 'calendar' && (
        <div className="space-y-6">
          {sortedDates.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <p className="text-sm font-semibold text-slate-500">
                {language === 'ar' ? 'لا توجد مواعيد لعرضها.' : 'Aucun rendez-vous à afficher.'}
              </p>
            </div>
          ) : (
            sortedDates.map((dateStr) => {
              const dateApts = [...groupedByDate[dateStr]].sort((a, b) =>
                (a.time || '').localeCompare(b.time || ''),
              );
              const isPastDate = dateStr < getTodayString();

              return (
                <div
                  key={dateStr}
                  className={`space-y-4 rounded-3xl border bg-white p-6 shadow-sm ${
                    isPastDate
                      ? 'border-slate-200/60 opacity-80'
                      : 'border-slate-200/80'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <CalendarIcon
                        className={`h-5 w-5 ${
                          isPastDate ? 'text-slate-400' : 'text-blue-600'
                        }`}
                      />
                      <h3 className="text-base font-bold text-slate-900">{dateStr}</h3>
                      {isPastDate && (
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-500">
                          {language === 'ar' ? 'سابق' : 'Passé'}
                        </span>
                      )}
                    </div>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                      {dateApts.length} {language === 'ar' ? 'استشارة' : 'consultation(s)'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {dateApts.map((apt) => (
                      <div
                        key={apt.id}
                        className="group relative space-y-2 rounded-2xl border border-slate-200/70 bg-slate-50 p-4 transition-colors hover:bg-blue-50/50"
                      >
                        <div className="flex items-center justify-between">
                          <span className="rounded-md border border-slate-200 bg-white px-2 py-0.5 font-mono text-xs font-bold text-blue-700">
                            {apt.time}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                apt.status === 'confirmed'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : apt.status === 'pending'
                                    ? 'bg-amber-100 text-amber-800'
                                    : apt.status === 'completed'
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {getStatusLabel(apt.status)}
                            </span>
                            <button
                              onClick={() => setConfirmDelete({ kind: 'one', apt })}
                              className="flex h-6 w-6 items-center justify-center rounded-md text-slate-400 opacity-0 transition-all hover:bg-red-100 hover:text-red-600 group-hover:opacity-100"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                        <div className="text-sm font-bold text-slate-900">
                          {apt.patientName}
                        </div>
                        <div className="text-xs text-slate-600">
                          {language === 'ar' ? apt.serviceNameAr : apt.serviceNameFr}
                        </div>
                        <div className="text-[11px] text-slate-400">{apt.patientPhone}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* MODAL CONFIRMATION STATUT */}
      {confirmAction && confirmTexts && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-start gap-4">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                  confirmAction.type === 'completed'
                    ? 'bg-indigo-100 text-indigo-600'
                    : 'bg-red-100 text-red-600'
                }`}
              >
                {confirmAction.type === 'completed' ? (
                  <CheckCircle2 className="h-6 w-6" />
                ) : (
                  <AlertTriangle className="h-6 w-6" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-bold text-slate-900">{confirmTexts.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">
                  {confirmTexts.message}
                </p>
                <div className="mt-3 space-y-1.5 rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-slate-500">
                      {language === 'ar' ? 'التاريخ' : 'Date'}
                    </span>
                    <span className="font-mono font-bold text-slate-900">
                      {confirmAction.apt.date} • {confirmAction.apt.time}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={executeConfirmedAction}
                disabled={isWorking}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-white shadow-md transition-colors disabled:opacity-60 ${
                  confirmAction.type === 'completed'
                    ? 'bg-indigo-600 hover:bg-indigo-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {isWorking ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>...</span>
                  </>
                ) : (
                  confirmTexts.confirmLabel
                )}
              </button>
              <button
                onClick={cancelConfirm}
                disabled={isWorking}
                className="rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-200 disabled:opacity-50"
              >
                {confirmTexts.cancelLabel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL SUPPRESSION */}
      {confirmDelete && deleteTexts && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-7">
            <div className="flex justify-center">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                  confirmDelete.kind === 'all'
                    ? 'bg-red-100 text-red-600'
                    : 'bg-amber-100 text-amber-600'
                }`}
              >
                {confirmDelete.kind === 'all' ? (
                  <ShieldAlert className="h-7 w-7" />
                ) : (
                  <AlertTriangle className="h-7 w-7" />
                )}
              </div>
            </div>
            <div className="space-y-2 text-center">
              <h3 className="text-lg font-bold text-slate-900">{deleteTexts.title}</h3>
              <p className="text-sm leading-relaxed text-slate-600">
                {deleteTexts.message}
              </p>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={executeDelete}
                disabled={isDeleting}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white shadow-md transition-colors hover:bg-red-700 disabled:opacity-60"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>
                      {language === 'ar' ? 'جارٍ الحذف...' : 'Suppression...'}
                    </span>
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    <span>{deleteTexts.confirmLabel}</span>
                  </>
                )}
              </button>
              <button
                onClick={() => setConfirmDelete(null)}
                disabled={isDeleting}
                className="rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-200 disabled:opacity-50"
              >
                {language === 'ar' ? 'إلغاء' : 'Annuler'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL REPROGRAMMATION */}
      {reschedulingApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{L.rescheduleTitle}</h3>
                <p className="text-xs text-slate-500">
                  {language === 'ar' ? 'المريض' : 'Patient'} : {reschedulingApt.patientName}
                </p>
              </div>
              <button
                onClick={() => setReschedulingApt(null)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  {L.newDate}
                </label>
                <input
                  type="date"
                  min={getTodayString()}
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  {L.newTime}
                </label>
                <select
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {availableSlotsForReschedule.length === 0 && (
                    <option value={newTime}>{newTime}</option>
                  )}
                  {availableSlotsForReschedule.map((s) => (
                    <option key={s.time} value={s.time} disabled={!s.available}>
                      {s.time}{' '}
                      {s.isCurrentAptSlot
                        ? language === 'ar'
                          ? '(الحجز الحالي)'
                          : '(RDV actuel)'
                        : s.available
                          ? ''
                          : s.isPast
                            ? language === 'ar'
                              ? '(انقضى)'
                              : '(Passé)'
                            : language === 'ar'
                              ? '(محجوز)'
                              : '(Occupé)'}
                    </option>
                  ))}
                </select>
              </div>

              {!isRescheduleValid && (
                <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs font-semibold text-amber-800">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>
                    {language === 'ar'
                      ? 'هذا الوقت غير متاح. يرجى اختيار وقت آخر.'
                      : "Ce créneau n'est pas disponible. Veuillez en choisir un autre."}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleConfirmReschedule}
                disabled={!isRescheduleValid || isWorking}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isWorking ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>...</span>
                  </>
                ) : (
                  L.save
                )}
              </button>
              <button
                onClick={() => setReschedulingApt(null)}
                disabled={isWorking}
                className="rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-200 disabled:opacity-50"
              >
                {L.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsView;