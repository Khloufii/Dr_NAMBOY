import React, { useState, useMemo, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { PatientRecord, Appointment, UserProfile } from '../../types';
import { db } from '../../services/firebase';
import {
  doc,
  deleteDoc,
  collection,
  onSnapshot,
  setDoc,
} from 'firebase/firestore';
import {
  Users,
  Search,
  Plus,
  FileText,
  Save,
  CheckCircle2,
  Trash2,
  AlertTriangle,
  Loader2,
  ShieldAlert,
  Edit3,
  X,
  Phone,
  Mail,
  IdCard,
  Calendar,
  Droplet,
} from 'lucide-react';

interface PatientsViewProps {
  patients?: PatientRecord[];
  appointments?: Appointment[];
  currentUser?: UserProfile;
  onUpdatePatientNotes?: (patientId: string, notes: string) => void;
  onOpenNewPatient?: () => void;
  onUpdatePatient?: (patient: PatientRecord) => void | Promise<void>;
  onDeletePatient?: (patientId: string) => void | Promise<void>;
  onDeleteAllPatients?: () => void | Promise<void>;
}

const safeStr = (v: unknown): string => (typeof v === 'string' ? v : '');
const safeArr = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

type ConfirmDelete =
  | { type: 'one'; patient: PatientRecord }
  | { type: 'all' }
  | null;

type EditForm = {
  fullName: string;
  phone: string;
  email: string;
  cinOrId: string;
  birthDate: string;
  bloodGroup: string;
  allergiesText: string;
  chronicDiseasesText: string;
};

const EMPTY_FORM: EditForm = {
  fullName: '',
  phone: '',
  email: '',
  cinOrId: '',
  birthDate: '',
  bloodGroup: '',
  allergiesText: '',
  chronicDiseasesText: '',
};

const BLOOD_GROUPS = ['', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

/** Collection Firestore */
const PATIENTS_COLLECTION = 'patients';

export const PatientsView: React.FC<PatientsViewProps> = ({
  patients = [],
  appointments = [],
  currentUser,
  onUpdatePatientNotes,
  onOpenNewPatient,
  onUpdatePatient,
  onDeletePatient,
  onDeleteAllPatients,
}) => {
  const { t, language, isRtl } = useLanguage();
  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);
  const [editingNotes, setEditingNotes] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  /* ------------------------------------------------------------------ */
  /* ✨ TEMPS RÉEL — abonnement Firestore direct dans le composant       */
  /* ------------------------------------------------------------------ */
  const [livePatients, setLivePatients] = useState<PatientRecord[] | null>(null);
  const [liveLoaded, setLiveLoaded] = useState(false);

  useEffect(() => {
    if (!db) {
      setLiveLoaded(true);
      return;
    }

    console.log('[PatientsView] Subscribing to Firestore patients...');

    const unsub = onSnapshot(
      collection(db, PATIENTS_COLLECTION),
      (snap) => {
        const list: PatientRecord[] = snap.docs.map((d) => {
          const data = d.data() as Omit<PatientRecord, 'id'>;
          return { ...data, id: (data as any).id || d.id };
        });

        console.log('[PatientsView] ✅ Live snapshot:', list.length, 'patients');
        setLivePatients(list);
        setLiveLoaded(true);
      },
      (err) => {
        console.warn('[PatientsView] Snapshot error:', err);
        setLiveLoaded(true);
      },
    );

    return () => unsub();
  }, []);

  /* Source de vérité : Firestore si dispo, sinon prop du parent */
  const sourcePatients = useMemo(() => {
    if (livePatients !== null) return livePatients;
    return Array.isArray(patients) ? patients : [];
  }, [livePatients, patients]);

  /* Override local (pour répondre instantanément avant le snapshot) */
  const [localOverrides, setLocalOverrides] = useState<Record<string, PatientRecord>>({});
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());

  /* Nettoie les overrides/deleted quand Firestore confirme les changements */
  useEffect(() => {
    if (livePatients === null) return;

    /* Nettoie les IDs supprimés qui ne sont plus dans Firestore */
    setDeletedIds((prev) => {
      if (prev.size === 0) return prev;
      const next = new Set(prev);
      let changed = false;
      prev.forEach((id) => {
        const exists = livePatients.some((p) => p.id === id);
        if (!exists) {
          next.delete(id);
          changed = true;
        }
      });
      return changed ? next : prev;
    });

    /* Nettoie les overrides qui correspondent à Firestore */
    setLocalOverrides((prev) => {
      const next = { ...prev };
      let changed = false;
      Object.entries(prev).forEach(([id, override]) => {
        const firestoreVersion = livePatients.find((p) => p.id === id);
        if (!firestoreVersion) {
          delete next[id];
          changed = true;
        } else if (
          JSON.stringify(firestoreVersion) === JSON.stringify(override)
        ) {
          delete next[id];
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [livePatients]);

  /* Liste finale affichée : Firestore + overrides - supprimés */
/* Liste finale affichée : Firestore + overrides - supprimés
   + Déduplication stricte (par id ET par contenu identique) */
const displayPatients = useMemo(() => {
  const seenIds = new Set<string>();
  const seenKeys = new Set<string>();
  const result: PatientRecord[] = [];

  for (const p of sourcePatients) {
    if (!p || !p.id) continue;
    if (deletedIds.has(p.id)) continue;
    if (seenIds.has(p.id)) continue;

    /* Clé composite : détecte les doublons avec IDs différents mais mêmes infos */
    const phoneKey = safeStr(p.phone).replace(/\s+/g, '');
    const nameKey = safeStr(p.fullName).trim().toLowerCase();
    const compositeKey = `${phoneKey}__${nameKey}`;

    if (phoneKey && nameKey && seenKeys.has(compositeKey)) {
      /* Doublon de contenu → on l'ignore */
      console.warn(
        '[PatientsView] Doublon ignoré:',
        p.id,
        compositeKey,
      );
      continue;
    }

    seenIds.add(p.id);
    if (phoneKey && nameKey) seenKeys.add(compositeKey);

    result.push(localOverrides[p.id] ?? p);
  }

  return result;
}, [sourcePatients, localOverrides, deletedIds]);

  /* Modales */
  const [confirmDelete, setConfirmDelete] = useState<ConfirmDelete>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState('');

  /* Édition */
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<EditForm>(EMPTY_FORM);
  const [editError, setEditError] = useState('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  /* ------------------------------------------------------------------ */
  /* Filtrage                                                            */
  /* ------------------------------------------------------------------ */
  const filtered = useMemo(() => {
    const list = Array.isArray(displayPatients) ? displayPatients : [];
    const q = search.toLowerCase().trim();
    if (!q) return list;

    return list.filter((p) => {
      if (!p) return false;
      const name = safeStr(p.fullName).toLowerCase();
      const phone = safeStr(p.phone);
      const cin = safeStr(p.cinOrId).toLowerCase();
      return name.includes(q) || phone.includes(search) || cin.includes(q);
    });
  }, [displayPatients, search]);

  /* ------------------------------------------------------------------ */
  /* Sélection                                                           */
  /* ------------------------------------------------------------------ */
  const handleSelectPatient = (patient: PatientRecord) => {
    setSelectedPatient(patient);
    setEditingNotes(safeStr(patient?.notes));
    setSaveSuccess(false);
  };

  /* ------------------------------------------------------------------ */
  /* Notes                                                               */
  /* ------------------------------------------------------------------ */
  const handleSaveNotes = () => {
    if (!selectedPatient || !onUpdatePatientNotes) return;
    try {
      onUpdatePatientNotes(selectedPatient.id, editingNotes);
      const updated = { ...selectedPatient, notes: editingNotes };
      setSelectedPatient(updated);
      setLocalOverrides((prev) => ({ ...prev, [updated.id]: updated }));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('[PatientsView] Save notes failed:', err);
    }
  };

  /* ------------------------------------------------------------------ */
  /* ÉDITION                                                             */
  /* ------------------------------------------------------------------ */
  const openEditModal = (patient: PatientRecord) => {
    setEditForm({
      fullName: safeStr(patient.fullName),
      phone: safeStr(patient.phone),
      email: safeStr((patient as any).email),
      cinOrId: safeStr(patient.cinOrId),
      birthDate: safeStr(patient.birthDate),
      bloodGroup: safeStr(patient.bloodGroup),
      allergiesText: safeArr<string>(patient.allergies).join(', '),
      chronicDiseasesText: safeArr<string>(patient.chronicDiseases).join(', '),
    });
    setEditError('');
    setIsEditOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedPatient) return;
    setEditError('');

    if (!editForm.fullName.trim()) {
      setEditError(
        language === 'ar' ? 'الاسم الكامل مطلوب.' : 'Le nom complet est requis.',
      );
      return;
    }
    if (!editForm.phone.trim()) {
      setEditError(
        language === 'ar' ? 'رقم الهاتف مطلوب.' : 'Le téléphone est requis.',
      );
      return;
    }

    setIsSavingEdit(true);

    try {
      const parseList = (txt: string): string[] =>
        txt
          .split(/[,;]/)
          .map((s) => s.trim())
          .filter(Boolean);

      const updated: any = {
        ...selectedPatient,
        fullName: editForm.fullName.trim(),
        phone: editForm.phone.trim(),
        allergies: parseList(editForm.allergiesText),
        chronicDiseases: parseList(editForm.chronicDiseasesText),
      };

      const optionalFields: Record<string, string> = {
        email: editForm.email.trim(),
        cinOrId: editForm.cinOrId.trim(),
        birthDate: editForm.birthDate.trim(),
        bloodGroup: editForm.bloodGroup.trim(),
      };

      Object.entries(optionalFields).forEach(([key, value]) => {
        if (value) {
          updated[key] = value;
        } else {
          delete updated[key];
        }
      });

      Object.keys(updated).forEach((key) => {
        if (updated[key] === undefined) delete updated[key];
      });

      console.log('[PatientsView] Updating patient:', updated.id, updated);

      const firestore = db;

      if (onUpdatePatient) {
        await onUpdatePatient(updated);
      } else if (firestore && updated.id) {
        try {
          const { id, ...firestorePayload } = updated;

          const cleanPayload: Record<string, any> = {};
          Object.keys(firestorePayload).forEach((k) => {
            if (firestorePayload[k] !== undefined) {
              cleanPayload[k] = firestorePayload[k];
            }
          });

          console.log('[PatientsView] Firestore payload:', cleanPayload);

          await setDoc(doc(firestore, PATIENTS_COLLECTION, updated.id), cleanPayload, {
            merge: true,
          });
          console.log('[PatientsView] ✅ Updated in Firestore:', updated.id);
        } catch (fsErr) {
          console.error('[PatientsView] ❌ Firestore update failed:', fsErr);
          throw fsErr;
        }
      }

      /* Optimistic update */
      setLocalOverrides((prev) => ({ ...prev, [updated.id]: updated }));
      setSelectedPatient(updated);

      setIsEditOpen(false);
      showToast(
        language === 'ar'
          ? 'تم تحديث ملف المريض بنجاح.'
          : 'Dossier patient mis à jour avec succès.',
      );
    } catch (err: any) {
      console.error('[PatientsView] Update failed:', err);
      console.error('[PatientsView] Error code:', err?.code);
      console.error('[PatientsView] Error message:', err?.message);

      let msg =
        language === 'ar'
          ? 'حدث خطأ أثناء الحفظ.'
          : 'Une erreur est survenue lors de la sauvegarde.';

      if (err?.code === 'permission-denied') {
        msg =
          language === 'ar'
            ? 'ليس لديك صلاحية لتعديل هذا الملف.'
            : "Vous n'avez pas la permission de modifier ce dossier.";
      } else if (err?.code === 'unavailable') {
        msg =
          language === 'ar'
            ? 'لا يمكن الاتصال بالخادم. تحقق من الإنترنت.'
            : 'Impossible de contacter le serveur. Vérifiez votre connexion.';
      }

      setEditError(msg);
    } finally {
      setIsSavingEdit(false);
    }
  };

  /* ------------------------------------------------------------------ */
  /* SUPPRESSION                                                         */
  /* ------------------------------------------------------------------ */
  const executeDelete = async () => {
    if (!confirmDelete) return;
    setIsDeleting(true);

    const firestore = db;

    try {
      if (confirmDelete.type === 'one') {
        const patientId = confirmDelete.patient.id;
        const patientName = safeStr(confirmDelete.patient.fullName);

        /* Optimistic : retire immédiatement de l'UI */
        setDeletedIds((prev) => new Set(prev).add(patientId));

        if (onDeletePatient) {
          await onDeletePatient(patientId);
        } else if (firestore && patientId) {
          try {
            await deleteDoc(doc(firestore, PATIENTS_COLLECTION, patientId));
            console.log('[PatientsView] ✅ Deleted from Firestore:', patientId);
          } catch (fsErr) {
            console.warn('[PatientsView] Firestore delete failed:', fsErr);
          }
        }

        if (selectedPatient?.id === patientId) {
          setSelectedPatient(null);
          setEditingNotes('');
        }

        showToast(
          language === 'ar'
            ? `تم حذف ملف "${patientName}".`
            : `Dossier de "${patientName}" supprimé.`,
        );
      } else {
        const allIds = displayPatients.map((p) => p.id).filter(Boolean);
        setDeletedIds(new Set(allIds));

        if (onDeleteAllPatients) {
          await onDeleteAllPatients();
        } else if (firestore) {
          try {
            const { getDocs } = await import('firebase/firestore');
            const snapshot = await getDocs(
              collection(firestore, PATIENTS_COLLECTION),
            );
            await Promise.all(
              snapshot.docs.map((d) =>
                deleteDoc(doc(firestore, PATIENTS_COLLECTION, d.id)),
              ),
            );
            console.log('[PatientsView] ✅ All patients deleted');
          } catch (fsErr) {
            console.warn('[PatientsView] Firestore delete all failed:', fsErr);
          }
        }

        setSelectedPatient(null);
        setEditingNotes('');
        showToast(
          language === 'ar'
            ? 'تم حذف جميع ملفات المرضى.'
            : 'Tous les dossiers patients ont été supprimés.',
        );
      }
    } catch (err) {
      console.error('[PatientsView] Delete failed:', err);
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
  /* RDV du patient                                                      */
  /* ------------------------------------------------------------------ */
  const patientApts = useMemo(() => {
    if (!selectedPatient) return [];
    const list = Array.isArray(appointments) ? appointments : [];
    const targetPhone = safeStr(selectedPatient.phone).trim();
    const targetName = safeStr(selectedPatient.fullName).toLowerCase().trim();

    return list.filter((a) => {
      if (!a) return false;
      const aptPhone = safeStr(a.patientPhone).trim();
      const aptName = safeStr(a.patientName).toLowerCase().trim();
      return (
        (targetPhone && aptPhone === targetPhone) ||
        (targetName && aptName === targetName)
      );
    });
  }, [appointments, selectedPatient]);

  /* ------------------------------------------------------------------ */
  /* Labels                                                              */
  /* ------------------------------------------------------------------ */
  const L = {
    title: t?.dashboard?.patients?.title || 'Gestion des Patients',
    addPatient: t?.dashboard?.patients?.addPatient || 'Nouveau patient',
    searchPlaceholder:
      t?.dashboard?.patients?.searchPlaceholder || 'Rechercher un patient...',
    clinicalNotes:
      t?.dashboard?.patients?.clinicalNotes || 'Observations cliniques',
    saveNotes: t?.dashboard?.patients?.saveNotes || 'Enregistrer',
    notesSaved: t?.dashboard?.patients?.notesSaved || 'Notes enregistrées',
    appointmentsHistory:
      t?.dashboard?.patients?.appointmentsHistory || 'Historique des consultations',
  };

  const patientCount = displayPatients.length;

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col items-start justify-between gap-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">{L.title}</h2>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <p className="text-xs text-slate-500 sm:text-sm">
              {patientCount}{' '}
              {language === 'ar'
                ? 'ملف طبي'
                : patientCount > 1
                  ? 'dossiers médicaux'
                  : 'dossier médical'}
            </p>
            {livePatients !== null && (
              <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                <span>{language === 'ar' ? 'مباشر' : 'Temps réel'}</span>
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {patientCount > 0 && (
            <button
              onClick={() => setConfirmDelete({ type: 'all' })}
              className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-bold text-red-700 transition-colors hover:border-red-300 hover:bg-red-100"
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">
                {language === 'ar' ? 'حذف الكل' : 'Tout supprimer'}
              </span>
            </button>
          )}

          {onOpenNewPatient && (
            <button
              onClick={onOpenNewPatient}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md transition-colors hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              <span>{L.addPatient}</span>
            </button>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-xs font-bold text-emerald-800 sm:text-sm">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
          <span>{toast}</span>
        </div>
      )}

      {/* GRILLE */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* LISTE */}
        <div className="space-y-4 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm lg:col-span-5">
          <div className="relative">
            <Search className="absolute start-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder={L.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pe-3 ps-9 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="max-h-[600px] space-y-2 overflow-y-auto pe-1">
            {!liveLoaded && patients.length === 0 ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-16 animate-pulse rounded-2xl bg-slate-100"
                  />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                {language === 'ar'
                  ? 'لا يوجد مرضى مطابقون.'
                  : 'Aucun patient trouvé.'}
              </div>
            ) : (
              filtered.map((patient) => {
                const patientId =
                  patient?.id || `${patient?.phone || ''}_${patient?.fullName || ''}`;
                const isActive = selectedPatient?.id === patient?.id;

                return (
                  <div
                    key={patientId}
                    onClick={() => handleSelectPatient(patient)}
                    className={`group relative cursor-pointer rounded-2xl border p-3.5 transition-all ${
                      isActive
                        ? 'border-blue-600 bg-blue-50/70 shadow-sm'
                        : 'border-slate-200/70 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="truncate text-sm font-bold text-slate-900">
                        {safeStr(patient?.fullName) || '—'}
                      </h4>
                      <div className="flex items-center gap-1.5">
                        {patient?.bloodGroup && (
                          <span className="shrink-0 rounded-md bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-800">
                            {patient.bloodGroup}
                          </span>
                        )}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectPatient(patient);
                            openEditModal(patient);
                          }}
                          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-slate-400 opacity-0 transition-all hover:bg-blue-100 hover:text-blue-600 group-hover:opacity-100"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmDelete({ type: 'one', patient });
                          }}
                          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-slate-400 opacity-0 transition-all hover:bg-red-100 hover:text-red-600 group-hover:opacity-100"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
                      <span className="truncate font-mono">
                        {safeStr(patient?.phone) || '—'}
                      </span>
                      <span className="shrink-0">
                        {patient?.appointmentsCount ?? 0}{' '}
                        {language === 'ar' ? 'زيارة' : 'visite(s)'}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* DOSSIER PATIENT */}
        <div className="space-y-6 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-7 lg:col-span-7">
          {selectedPatient ? (
            <>
              <div className="flex flex-col items-start justify-between gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-center">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-lg font-bold text-white">
                    {safeStr(selectedPatient.fullName).charAt(0).toUpperCase() || '?'}
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-xl font-bold text-slate-900">
                      {safeStr(selectedPatient.fullName) || '—'}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      {selectedPatient.cinOrId && (
                        <span>
                          {language === 'ar' ? 'ب.ت.و' : 'CIN'}:{' '}
                          {selectedPatient.cinOrId}
                        </span>
                      )}
                      {selectedPatient.birthDate && (
                        <span>
                          •{' '}
                          {language === 'ar'
                            ? `مولود(ة) في ${selectedPatient.birthDate}`
                            : `Né(e) le ${selectedPatient.birthDate}`}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(selectedPatient)}
                    className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 transition-colors hover:bg-blue-100"
                  >
                    <Edit3 className="h-4 w-4" />
                    <span className="hidden sm:inline">
                      {language === 'ar' ? 'تعديل' : 'Modifier'}
                    </span>
                  </button>

                  <button
                    onClick={() =>
                      setConfirmDelete({ type: 'one', patient: selectedPatient })
                    }
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-600 transition-colors hover:bg-red-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
                <div className="rounded-xl border border-slate-200/70 bg-slate-50 p-3">
                  <span className="block text-[10px] font-bold uppercase text-slate-500">
                    {language === 'ar' ? 'الهاتف' : 'Téléphone'}
                  </span>
                  {selectedPatient.phone ? (
                    <a
                      href={`tel:${selectedPatient.phone}`}
                      className="block truncate font-semibold text-blue-600"
                    >
                      {selectedPatient.phone}
                    </a>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </div>

                <div className="rounded-xl border border-slate-200/70 bg-slate-50 p-3">
                  <span className="block text-[10px] font-bold uppercase text-slate-500">
                    {language === 'ar' ? 'فصيلة الدم' : 'Groupe Sanguin'}
                  </span>
                  <span className="font-bold text-red-600">
                    {selectedPatient.bloodGroup || '—'}
                  </span>
                </div>

                <div className="rounded-xl border border-slate-200/70 bg-slate-50 p-3">
                  <span className="block text-[10px] font-bold uppercase text-slate-500">
                    {language === 'ar' ? 'الحساسية' : 'Allergies'}
                  </span>
                  <span className="block truncate font-semibold text-slate-800">
                    {safeArr<string>(selectedPatient.allergies).join(', ') ||
                      (language === 'ar' ? 'لا يوجد' : 'Aucune')}
                  </span>
                </div>

                <div className="rounded-xl border border-slate-200/70 bg-slate-50 p-3">
                  <span className="block text-[10px] font-bold uppercase text-slate-500">
                    {language === 'ar' ? 'الأمراض المزمنة' : 'Pathologies'}
                  </span>
                  <span className="block truncate font-semibold text-slate-800">
                    {safeArr<string>(selectedPatient.chronicDiseases).join(', ') ||
                      (language === 'ar' ? 'لا يوجد' : 'Néant')}
                  </span>
                </div>
              </div>

              <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      {L.clinicalNotes}
                    </h4>
                  </div>
                  {saveSuccess && (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {L.notesSaved}
                    </span>
                  )}
                </div>

                <textarea
                  rows={4}
                  value={editingNotes}
                  onChange={(e) => setEditingNotes(e.target.value)}
                  className="w-full resize-none rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                />

                <div className="flex justify-end">
                  <button
                    onClick={handleSaveNotes}
                    disabled={!onUpdatePatientNotes}
                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Save className="h-3.5 w-3.5" />
                    <span>{L.saveNotes}</span>
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  {L.appointmentsHistory}
                </h4>
                <div className="max-h-48 space-y-2 overflow-y-auto">
                  {patientApts.length === 0 ? (
                    <p className="py-3 text-xs text-slate-400">
                      {language === 'ar'
                        ? 'لا توجد استشارات مسجلة.'
                        : 'Aucune consultation enregistrée.'}
                    </p>
                  ) : (
                    patientApts.map((apt, idx) => (
                      <div
                        key={apt?.id || idx}
                        className="flex items-center justify-between rounded-xl border border-slate-200/60 bg-slate-50 p-3 text-xs"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="shrink-0 font-mono font-bold text-slate-900">
                            {safeStr(apt?.date) || '—'}
                          </span>
                          <span className="truncate text-slate-600">
                            {language === 'ar'
                              ? safeStr(apt?.serviceNameAr)
                              : safeStr(apt?.serviceNameFr)}
                          </span>
                        </div>
                        <span className="shrink-0 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800">
                          {safeStr(apt?.status) || '—'}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-2 py-20 text-center text-slate-400">
              <Users className="mx-auto h-10 w-10 text-slate-300" />
              <p className="text-sm font-medium">
                {language === 'ar'
                  ? 'اختر مريضاً من القائمة لعرض ملفه الطبي.'
                  : 'Sélectionnez un patient dans la liste pour consulter son dossier médical.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* MODALE D'ÉDITION */}
      {isEditOpen && selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
          <div className="my-8 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                  <Edit3 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {language === 'ar'
                      ? 'تعديل بيانات المريض'
                      : 'Modifier le dossier patient'}
                  </h3>
                  <span className="text-xs font-medium text-slate-500">
                    {safeStr(selectedPatient.fullName)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsEditOpen(false)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto p-6">
              {editError && (
                <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-bold text-red-700">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-red-600" />
                  <span>{editError}</span>
                </div>
              )}

              <div>
                <label className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase text-slate-600">
                  <Users className="h-3.5 w-3.5 text-blue-600" />
                  {language === 'ar' ? 'الاسم الكامل *' : 'Nom complet *'}
                </label>
                <input
                  type="text"
                  required
                  value={editForm.fullName}
                  onChange={(e) =>
                    setEditForm({ ...editForm, fullName: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase text-slate-600">
                    <Phone className="h-3.5 w-3.5 text-blue-600" />
                    {language === 'ar' ? 'الهاتف *' : 'Téléphone *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={editForm.phone}
                    onChange={(e) =>
                      setEditForm({ ...editForm, phone: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase text-slate-600">
                    <Mail className="h-3.5 w-3.5 text-blue-600" />
                    {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                  </label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) =>
                      setEditForm({ ...editForm, email: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase text-slate-600">
                    <IdCard className="h-3.5 w-3.5 text-blue-600" />
                    {language === 'ar' ? 'ب.ت.و' : 'CIN'}
                  </label>
                  <input
                    type="text"
                    value={editForm.cinOrId}
                    onChange={(e) =>
                      setEditForm({ ...editForm, cinOrId: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase text-slate-600">
                    <Calendar className="h-3.5 w-3.5 text-blue-600" />
                    {language === 'ar' ? 'تاريخ الميلاد' : 'Date de naissance'}
                  </label>
                  <input
                    type="date"
                    value={editForm.birthDate}
                    onChange={(e) =>
                      setEditForm({ ...editForm, birthDate: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase text-slate-600">
                  <Droplet className="h-3.5 w-3.5 text-red-500" />
                  {language === 'ar' ? 'فصيلة الدم' : 'Groupe sanguin'}
                </label>
                <select
                  value={editForm.bloodGroup}
                  onChange={(e) =>
                    setEditForm({ ...editForm, bloodGroup: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>
                      {bg || (language === 'ar' ? 'غير محدد' : 'Non renseigné')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-slate-600">
                  {language === 'ar' ? 'الحساسية' : 'Allergies'}
                </label>
                <input
                  type="text"
                  value={editForm.allergiesText}
                  onChange={(e) =>
                    setEditForm({ ...editForm, allergiesText: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-slate-600">
                  {language === 'ar' ? 'الأمراض المزمنة' : 'Pathologies chroniques'}
                </label>
                <input
                  type="text"
                  value={editForm.chronicDiseasesText}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      chronicDiseasesText: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="rounded-xl border border-slate-300 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  {language === 'ar' ? 'إلغاء' : 'Annuler'}
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  disabled={isSavingEdit}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60"
                >
                  {isSavingEdit ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>
                    {isSavingEdit
                      ? language === 'ar'
                        ? 'جارٍ الحفظ...'
                        : 'Enregistrement...'
                      : language === 'ar'
                        ? 'حفظ'
                        : 'Enregistrer'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODALE SUPPRESSION */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-7">
            <div className="flex justify-center">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                  confirmDelete.type === 'all'
                    ? 'bg-red-100 text-red-600'
                    : 'bg-amber-100 text-amber-600'
                }`}
              >
                {confirmDelete.type === 'all' ? (
                  <ShieldAlert className="h-7 w-7" />
                ) : (
                  <AlertTriangle className="h-7 w-7" />
                )}
              </div>
            </div>

            <div className="space-y-2 text-center">
              <h3 className="text-lg font-bold text-slate-900">
                {confirmDelete.type === 'all'
                  ? language === 'ar'
                    ? 'حذف جميع ملفات المرضى ؟'
                    : 'Supprimer tous les patients ?'
                  : language === 'ar'
                    ? 'حذف هذا الملف الطبي ؟'
                    : 'Supprimer ce dossier médical ?'}
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                {confirmDelete.type === 'all' ? (
                  language === 'ar' ? (
                    <>
                      سيتم حذف <strong>{patientCount}</strong> ملف طبي نهائياً.
                    </>
                  ) : (
                    <>
                      Cette action supprimera définitivement{' '}
                      <strong>{patientCount}</strong> dossier(s).
                    </>
                  )
                ) : language === 'ar' ? (
                  <>
                    سيتم حذف ملف المريض{' '}
                    <strong>"{safeStr(confirmDelete.patient.fullName)}"</strong>.
                  </>
                ) : (
                  <>
                    Le dossier de{' '}
                    <strong>"{safeStr(confirmDelete.patient.fullName)}"</strong>{' '}
                    sera définitivement supprimé.
                  </>
                )}
              </p>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={executeDelete}
                disabled={isDeleting}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white shadow-md transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
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
                    <span>
                      {language === 'ar' ? 'نعم، احذف' : 'Oui, supprimer'}
                    </span>
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
    </div>
  );
};

export default PatientsView;