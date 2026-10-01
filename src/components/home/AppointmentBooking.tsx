import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { generateAvailableSlots } from '../../services/dataService';
import { Appointment } from '../../types';
import confetti from 'canvas-confetti';
import { db } from '../../services/firebase';
import { doc, setDoc } from 'firebase/firestore';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  FileText,
  CheckCircle2,
  Database,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Loader2,
} from 'lucide-react';

interface AppointmentBookingProps {
  initialServiceId?: string;
  onAppointmentCreated?: (apt: Appointment) => void;
}

/** Intervalle de rafraîchissement des créneaux (ms) */
const REFRESH_INTERVAL = 30_000;

/** Combine une date (YYYY-MM-DD) + une heure (HH:MM) en objet Date local */
const combineDateTime = (dateStr: string, timeStr: string): Date => {
  const [y, m, d] = dateStr.split('-').map(Number);
  const [hh, mm] = timeStr.split(':').map(Number);
  return new Date(y, (m || 1) - 1, d || 1, hh || 0, mm || 0, 0, 0);
};

/** Vrai si le créneau est dans le passé (< maintenant) */
const isSlotInPast = (dateStr: string, timeStr: string, now: Date): boolean => {
  return combineDateTime(dateStr, timeStr).getTime() <= now.getTime();
};

/** Date du jour au format YYYY-MM-DD (heure locale) */
const getTodayString = (): string => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

/** Demain au format YYYY-MM-DD */
const getTomorrowString = (): string => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export const AppointmentBooking: React.FC<AppointmentBookingProps> = ({
  initialServiceId,
  onAppointmentCreated,
}) => {
  const { t, language, isRtl } = useLanguage();

  /* ------------------------------------------------------------------ */
  /* États                                                               */
  /* ------------------------------------------------------------------ */
  const [serviceId, setServiceId] = useState(initialServiceId || 'general');
  const [date, setDate] = useState(getTomorrowString());
  const [time, setTime] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [bookingMethod, setBookingMethod] = useState<'database' | 'whatsapp'>('database');
  const [submittedApt, setSubmittedApt] = useState<Appointment | null>(null);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* Horloge interne : force la re-évaluation des créneaux passés */
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), REFRESH_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  /* Met à jour le serviceId si le parent change */
  useEffect(() => {
    if (initialServiceId) setServiceId(initialServiceId);
  }, [initialServiceId]);

  /* ------------------------------------------------------------------ */
  /* Services disponibles                                                */
  /* ------------------------------------------------------------------ */
  const servicesList = useMemo(
    () => [
      { id: 'general', nameFr: 'Médecine Générale & Suivi Chronique', nameAr: 'الطب العام ومتابعة الأمراض المزمنة' },
      { id: 'emergency', nameFr: 'Urgence Médicale & Soins Intensifs', nameAr: 'طوارئ طبية وعناية مستعجلة' },
      { id: 'imaging', nameFr: 'Échographie & Diagnostic ECG', nameAr: 'الفحص بالصدى وتخطيط القلب' },
      { id: 'tropical', nameFr: 'Maladies Tropicales & Dépistage Paludisme', nameAr: 'الأمراض المدارية وكشف الملاريا' },
      { id: 'women', nameFr: 'Santé de la Femme & Planning / Implants', nameAr: 'صحة المرأة وتنظيم الأسرة والكبسولات' },
      { id: 'drainage', nameFr: 'Drainage Lymphatique Thérapeutique', nameAr: 'التصريف اللمفاوي الطبي' },
      { id: 'driving', nameFr: 'Visite Médicale Permis de Conduire', nameAr: 'الفحص الطبي لرخصة السياقة' },
    ],
    [],
  );

  /* ------------------------------------------------------------------ */
  /* Créneaux horaires — filtre les créneaux passés ET déjà pris         */
  /* ------------------------------------------------------------------ */
  const availableSlots = useMemo(() => {
    const slots = generateAvailableSlots(date) || [];
    const todayStr = getTodayString();
    const isToday = date === todayStr;

    return slots.map((slot) => {
      const isPast = isToday && isSlotInPast(date, slot.time, now);
      return {
        ...slot,
        available: slot.available && !isPast,
        isPast,
      };
    });
  }, [date, now]);

  /* Nombre de créneaux réellement disponibles */
  const availableCount = useMemo(
    () => availableSlots.filter((s) => s.available).length,
    [availableSlots],
  );

  /* Auto-sélection du premier créneau disponible si l'actuel est invalide */
  useEffect(() => {
    const currentSlot = availableSlots.find((s) => s.time === time);

    if (!time || !currentSlot || !currentSlot.available) {
      const firstAvailable = availableSlots.find((s) => s.available);
      setTime(firstAvailable ? firstAvailable.time : '');
    }
  }, [availableSlots, time]);

  /* Vérifie en temps réel que le créneau sélectionné est toujours valide */
  const selectedSlot = availableSlots.find((s) => s.time === time);
  const isSelectedSlotValid = !!selectedSlot && selectedSlot.available;

  /* ------------------------------------------------------------------ */
  /* Soumission — UNE SEULE écriture Firestore                          */
  /* ------------------------------------------------------------------ */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    /* 1. Validation basique des champs */
    if (!fullName.trim() || !phone.trim()) {
      setFormError(
        language === 'ar'
          ? 'يرجى إدخال الاسم ورقم الهاتف'
          : 'Veuillez saisir votre nom et numéro de téléphone',
      );
      return;
    }

    /* 2. Aucun créneau sélectionné */
    if (!time) {
      setFormError(
        language === 'ar'
          ? 'يرجى اختيار وقت متاح للموعد'
          : 'Veuillez sélectionner un créneau horaire disponible',
      );
      return;
    }

    /* 3. Vérification en temps réel : créneau passé ? */
    if (isSlotInPast(date, time, new Date())) {
      setFormError(
        language === 'ar'
          ? 'لا يمكن حجز موعد في وقت ماضٍ. يرجى اختيار وقت لاحق.'
          : 'Impossible de réserver un rendez-vous dans le passé. Veuillez choisir un créneau ultérieur.',
      );
      return;
    }

    /* 4. Vérification en temps réel : créneau déjà pris ? */
    const freshSlots = generateAvailableSlots(date) || [];
    const freshSlot = freshSlots.find((s) => s.time === time);

    if (freshSlot && !freshSlot.available) {
      setFormError(
        language === 'ar'
          ? 'هذا الموعد محجوز للتو. يرجى اختيار وقت آخر.'
          : "Ce créneau vient d'être réservé. Veuillez en choisir un autre.",
      );
      return;
    }

    /* 5. Enregistrement — UNE SEULE écriture Firestore */
    setIsSubmitting(true);

    try {
      const selectedServiceObj =
        servicesList.find((s) => s.id === serviceId) || servicesList[0];

      const newId = `apt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

      /* Construction de l'objet RDV final */
      const newApt: any = {
        id: newId,
        patientName: fullName.trim(),
        patientPhone: phone.trim(),
        serviceId,
        serviceNameFr: selectedServiceObj.nameFr,
        serviceNameAr: selectedServiceObj.nameAr,
        date,
        time,
        status: 'confirmed',
        bookingType: bookingMethod === 'whatsapp' ? 'whatsapp' : 'online',
        createdAt: new Date().toISOString(),
      };

      /* Champs optionnels */
      if (email.trim()) newApt.patientEmail = email.trim();
      if (notes.trim()) newApt.notes = notes.trim();

      /* Nettoyage : retire tous les undefined (Firestore les refuse) */
      Object.keys(newApt).forEach((key) => {
        if (newApt[key] === undefined) delete newApt[key];
      });

      console.log('[AppointmentBooking] Creating:', newId, newApt);

      /* ✅ ÉCRITURE UNIQUE — directement dans Firestore */
      if (db) {
        try {
          const { id, ...payload } = newApt;
          await setDoc(doc(db, 'appointments', id), payload);
          console.log('[AppointmentBooking] ✅ Saved to Firestore:', id);
        } catch (fsErr: any) {
          console.error('[AppointmentBooking] ❌ Firestore save failed:', fsErr);
          console.error('Error code:', fsErr?.code);
          console.error('Error message:', fsErr?.message);

          let msg =
            language === 'ar'
              ? 'حدث خطأ أثناء الحجز.'
              : 'Une erreur est survenue lors du booking.';

          if (fsErr?.code === 'permission-denied') {
            msg =
              language === 'ar'
                ? 'لا يمكن الحجز حالياً. حاول مرة أخرى.'
                : 'Réservation impossible actuellement. Réessayez.';
          } else if (fsErr?.message?.includes('undefined')) {
            msg =
              language === 'ar'
                ? 'خطأ في البيانات المرسلة.'
                : 'Erreur dans les données envoyées.';
          } else if (fsErr?.message) {
            msg = fsErr.message;
          }

          setFormError(msg);
          setIsSubmitting(false);
          return;
        }
      }

      /* ⛔ NE PAS appeler saveAppointment() ici — c'est ce qui causait le doublon */

      /* Notifie le parent (sans réécrire dans Firestore) */
      onAppointmentCreated?.(newApt as Appointment);
      setSubmittedApt(newApt);

      /* Confetti festif */
      try {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      } catch {
        /* ignore */
      }

      /* WhatsApp optionnel */
      if (bookingMethod === 'whatsapp') {
        const serviceName =
          language === 'ar' ? selectedServiceObj.nameAr : selectedServiceObj.nameFr;
        const message = `Bonjour Dr. NAMBOY,
Je souhaite confirmer mon rendez-vous :
- Nom : ${fullName}
- Téléphone : ${phone}
- Acte : ${serviceName}
- Date : ${date} à ${time}
- Référence : ${newId}
${notes ? `- Motif : ${notes}` : ''}`;
        const waUrl = `https://wa.me/212770558299?text=${encodeURIComponent(message)}`;
        window.open(waUrl, '_blank');
      }
    } catch (err: any) {
      console.error('[AppointmentBooking] Error:', err);
      setFormError(
        err?.message ||
          (language === 'ar'
            ? 'حدث خطأ غير متوقع. يرجى المحاولة مجدداً.'
            : 'Une erreur est survenue. Veuillez réessayer.'),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmittedApt(null);
    setFullName('');
    setPhone('');
    setEmail('');
    setNotes('');
    setTime('');
    setFormError('');
    setDate(getTomorrowString());
  };

  /* ------------------------------------------------------------------ */
  /* Rendu                                                               */
  /* ------------------------------------------------------------------ */
  return (
    <section
      id="booking"
      dir={isRtl ? 'rtl' : 'ltr'}
      className="border-b border-slate-200/80 bg-white py-20"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Titre */}
        <div className="mx-auto mb-14 max-w-2xl space-y-3 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{t.booking.tagline}</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            {t.booking.title}
          </h2>
          <p className="text-base leading-relaxed text-slate-600">
            {t.booking.subtitle}
          </p>
        </div>

        {submittedApt ? (
          /* ============================================================ */
          /* CONFIRMATION                                                  */
          /* ============================================================ */
          <div className="space-y-6 rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50 via-sky-50 to-white p-8 text-center shadow-xl sm:p-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                {t.booking.successTitle}
              </h3>
              <p className="mx-auto max-w-lg text-sm text-slate-600 sm:text-base">
                {t.booking.successMessage}
              </p>
            </div>

            <div className="mx-auto max-w-md space-y-3 rounded-2xl border border-slate-200/80 bg-white p-5 text-start text-xs shadow-sm sm:text-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-medium text-slate-500">
                  {t.booking.referenceNumber} :
                </span>
                <span className="font-mono font-bold uppercase text-blue-600">
                  {submittedApt.id}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-medium text-slate-500">
                  {t.booking.fullName} :
                </span>
                <span className="font-bold text-slate-900">{submittedApt.patientName}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-medium text-slate-500">
                  {t.booking.selectService} :
                </span>
                <span className="font-semibold text-slate-800">
                  {language === 'ar' ? submittedApt.serviceNameAr : submittedApt.serviceNameFr}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-500">{t.booking.step2} :</span>
                <span className="font-bold text-slate-900">
                  {submittedApt.date} à {submittedApt.time}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a
                href={`https://wa.me/212770558299?text=${encodeURIComponent(
                  `Bonjour Dr. NAMBOY, je vous contacte concernant mon RDV ${submittedApt.id} du ${submittedApt.date} à ${submittedApt.time}`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-md transition-colors hover:bg-emerald-700"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Ouvrir WhatsApp (+212 7 70 55 82 99)</span>
              </a>

              <button
                onClick={handleReset}
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                {t.booking.addAnother}
              </button>
            </div>
          </div>
        ) : (
          /* ============================================================ */
          /* FORMULAIRE                                                    */
          /* ============================================================ */
          <form
            onSubmit={handleSubmit}
            className="space-y-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-10"
          >
            {formError && (
              <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* 1. Sélection du service */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <FileText className="h-4 w-4 text-blue-600" />
                <span>{t.booking.step1}</span>
              </label>
              <select
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-slate-50/50 p-3.5 text-sm font-semibold text-slate-900 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {servicesList.map((svc) => (
                  <option key={svc.id} value={svc.id}>
                    {language === 'ar' ? svc.nameAr : svc.nameFr}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Date & Heure */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
                    <CalendarIcon className="h-3.5 w-3.5 text-blue-600" />
                    <span>{t.booking.selectDate}</span>
                  </label>
                  <input
                    type="date"
                    min={getTodayString()}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-300 bg-slate-50/50 p-3.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
                    <Clock className="h-3.5 w-3.5 text-blue-600" />
                    <span>{t.booking.selectTime}</span>
                    {availableCount === 0 && (
                      <span className="ms-2 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">
                        {language === 'ar' ? 'لا يوجد وقت متاح' : 'Aucun créneau'}
                      </span>
                    )}
                  </label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    disabled={availableCount === 0}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50/50 p-3.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {availableCount === 0 && (
                      <option value="">
                        {language === 'ar'
                          ? 'لا توجد أوقات متاحة — اختر يوماً آخر'
                          : 'Aucun créneau disponible — changez de date'}
                      </option>
                    )}
                    {availableSlots.map((slot) => (
                      <option
                        key={slot.time}
                        value={slot.time}
                        disabled={!slot.available}
                      >
                        {slot.time}{' '}
                        {slot.available
                          ? language === 'ar'
                            ? '(متاح)'
                            : '(Disponible)'
                          : slot.isPast
                            ? language === 'ar'
                              ? '(انقضى)'
                              : '(Passé)'
                            : language === 'ar'
                              ? '(محجوز)'
                              : '(Réservé)'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Créneaux suggérés */}
              {availableCount > 0 && (
                <div className="pt-1">
                  <span className="mb-2 block text-[11px] font-semibold text-slate-500">
                    {language === 'ar'
                      ? 'أو اختر مباشرة أحد الأوقات المتاحة :'
                      : 'Ou cliquez directement sur un créneau disponible :'}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {availableSlots.map((slot) => {
                      const isSelected = time === slot.time;
                      return (
                        <button
                          type="button"
                          key={slot.time}
                          disabled={!slot.available}
                          onClick={() => setTime(slot.time)}
                          title={
                            slot.isPast
                              ? language === 'ar'
                                ? 'هذا الوقت قد انقضى'
                                : 'Ce créneau est déjà passé'
                              : !slot.available
                                ? language === 'ar'
                                  ? 'هذا الوقت محجوز'
                                  : 'Ce créneau est déjà réservé'
                                : undefined
                          }
                          className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                            isSelected && slot.available
                              ? 'bg-blue-600 text-white shadow-sm'
                              : slot.available
                                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                : 'cursor-not-allowed bg-slate-50 text-slate-300 line-through'
                          }`}
                        >
                          {slot.time}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Alerte si le créneau devient invalide */}
              {time && !isSelectedSlotValid && (
                <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs font-semibold text-amber-800">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>
                    {language === 'ar'
                      ? 'الوقت المحدد لم يعد متاحاً. يرجى اختيار وقت آخر.'
                      : "Le créneau sélectionné n'est plus disponible. Veuillez en choisir un autre."}
                  </span>
                </div>
              )}
            </div>

            {/* 3. Informations patient */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <User className="h-4 w-4 text-blue-600" />
                <span>{t.booking.step3}</span>
              </label>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600">
                    {t.booking.fullName} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={language === 'ar' ? 'محمد بناني' : 'Ex: Mohammed Bennani'}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50/50 p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600">
                    {t.booking.phone} *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="06 12 34 56 78"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50/50 p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">
                  {t.booking.email}
                </label>
                <input
                  type="email"
                  placeholder="nom@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50/50 p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">
                  {t.booking.notes}
                </label>
                <textarea
                  rows={2}
                  placeholder={
                    language === 'ar'
                      ? 'فحص دوري، أعراض حمى، تجديد وصفة طبية...'
                      : 'Bilan de santé, contrôle tension, douleurs...'
                  }
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full resize-none rounded-xl border border-slate-300 bg-slate-50/50 p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* 4. Méthode de réservation */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <ShieldCheck className="h-4 w-4 text-blue-600" />
                <span>{t.booking.step4}</span>
              </label>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div
                  onClick={() => setBookingMethod('database')}
                  className={`flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-4 transition-all ${
                    bookingMethod === 'database'
                      ? 'border-blue-600 bg-blue-50/60 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div
                    className={`mt-0.5 rounded-xl p-2 ${
                      bookingMethod === 'database'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Database className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {t.booking.methodDatabase}
                    </h4>
                    <p className="mt-0.5 text-xs leading-snug text-slate-600">
                      {t.booking.methodDatabaseDesc}
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => setBookingMethod('whatsapp')}
                  className={`flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-4 transition-all ${
                    bookingMethod === 'whatsapp'
                      ? 'border-emerald-600 bg-emerald-50/60 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div
                    className={`mt-0.5 rounded-xl p-2 ${
                      bookingMethod === 'whatsapp'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {t.booking.methodWhatsApp}
                    </h4>
                    <p className="mt-0.5 text-xs leading-snug text-slate-600">
                      {t.booking.methodWhatsAppDesc}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || !isSelectedSlotValid}
                className={`flex w-full items-center justify-center gap-3 rounded-2xl px-6 py-4 text-base font-bold text-white shadow-xl transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${
                  bookingMethod === 'whatsapp'
                    ? 'bg-emerald-600 shadow-emerald-600/30 hover:bg-emerald-700'
                    : 'bg-blue-600 shadow-blue-600/30 hover:bg-blue-700'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>
                      {language === 'ar' ? 'جارٍ الحجز...' : 'Réservation en cours...'}
                    </span>
                  </>
                ) : bookingMethod === 'whatsapp' ? (
                  <>
                    <MessageSquare className="h-5 w-5" />
                    <span>{t.booking.submitBtnWhatsApp}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-5 w-5" />
                    <span>{t.booking.submitBtnOnline}</span>
                  </>
                )}
              </button>

              <p className="mt-3 text-center text-xs text-slate-500">
                {t.booking.whatsappEmergencyText}
              </p>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};

export default AppointmentBooking;