import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { Appointment } from '../../types';
import { db } from '../../services/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { generateAvailableSlots } from '../../services/dataService';
import { X, Loader2, AlertCircle, Calendar, Clock, User, Phone } from 'lucide-react';

interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAppointmentCreated: (apt: Appointment) => void;
}

const APPOINTMENTS_COLLECTION = 'appointments';

const generateId = () =>
  `apt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const getTodayString = (): string => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export const NewAppointmentModal: React.FC<NewAppointmentModalProps> = ({
  isOpen,
  onClose,
  onAppointmentCreated,
}) => {
  const { t, language } = useLanguage();
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [serviceId, setServiceId] = useState('general');
  const [date, setDate] = useState(getTodayString());
  const [time, setTime] = useState('11:00');
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const services = [
    { id: 'general', fr: 'Médecine Générale', ar: 'الطب العام' },
    { id: 'emergency', fr: 'Urgence 24h/24', ar: 'طوارئ 24/24' },
    { id: 'imaging', fr: 'Échographie & ECG', ar: 'فحص بالصدى وتخطيط القلب' },
    { id: 'tropical', fr: 'Maladies Tropicales', ar: 'أمراض مدارية' },
    { id: 'women', fr: 'Santé Femme / Implants', ar: 'صحة المرأة وتنظيم الأسرة' },
    { id: 'drainage', fr: 'Drainage Lymphatique', ar: 'تصريف لمفاوي' },
    { id: 'driving', fr: 'Permis de Conduire', ar: 'رخصة السياقة' },
  ];

  const availableSlots = generateAvailableSlots(date) || [];

  const resetForm = () => {
    setPatientName('');
    setPatientPhone('');
    setServiceId('general');
    setDate(getTodayString());
    setTime('11:00');
    setNotes('');
    setErrorMsg('');
  };

  const handleClose = () => {
    if (isSaving) return;
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!patientName.trim() || !patientPhone.trim()) {
      setErrorMsg(
        language === 'ar'
          ? 'يرجى إدخال الاسم ورقم الهاتف'
          : 'Veuillez saisir le nom et le téléphone.',
      );
      return;
    }

    setIsSaving(true);

    try {
      const svc = services.find((s) => s.id === serviceId) || services[0];
      const newId = generateId();

      /* Construction de l'objet RDV */
      const newApt: any = {
        id: newId,
        patientName: patientName.trim(),
        patientPhone: patientPhone.trim(),
        serviceId,
        serviceNameFr: svc.fr,
        serviceNameAr: svc.ar,
        date,
        time,
        status: 'confirmed',
        bookingType: 'desk',
        createdAt: new Date().toISOString(),
      };

      /* Notes optionnelles */
      if (notes.trim()) newApt.notes = notes.trim();

      /* Nettoyage : retire tous les undefined */
      Object.keys(newApt).forEach((key) => {
        if (newApt[key] === undefined) delete newApt[key];
      });

      console.log('[NewAppointmentModal] Creating:', newId, newApt);

      /* ✅ Écriture directe dans Firestore (source de vérité) */
      if (db) {
        try {
          const { id, ...payload } = newApt;
          await setDoc(doc(db, APPOINTMENTS_COLLECTION, id), payload);
          console.log(
            '[NewAppointmentModal] ✅ Saved to Firestore:',
            id,
          );
        } catch (fsErr: any) {
          console.error(
            '[NewAppointmentModal] ❌ Firestore save failed:',
            fsErr,
          );
          console.error('Error code:', fsErr?.code);
          console.error('Error message:', fsErr?.message);

          let msg =
            language === 'ar'
              ? 'حدث خطأ أثناء الحفظ'
              : "Une erreur est survenue lors de l'enregistrement.";

          if (fsErr?.code === 'permission-denied') {
            msg =
              language === 'ar'
                ? 'ليس لديك صلاحية لإنشاء موعد.'
                : "Vous n'avez pas la permission de créer un rendez-vous.";
          } else if (fsErr?.message?.includes('undefined')) {
            msg =
              language === 'ar'
                ? 'خطأ في البيانات (قيمة فارغة).'
                : 'Erreur dans les données (valeur vide).';
          } else if (fsErr?.message) {
            msg = fsErr.message;
          }

          setErrorMsg(msg);
          return;
        }
      }

      /* Notifie le parent */
      onAppointmentCreated(newApt as Appointment);

      /* Reset + fermeture */
      resetForm();
      onClose();
    } catch (err: any) {
      console.error('[NewAppointmentModal] Error:', err);
      setErrorMsg(
        err?.message ||
          (language === 'ar'
            ? 'حدث خطأ غير متوقع.'
            : 'Une erreur est survenue.'),
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="relative flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {language === 'ar'
                  ? 'موعد جديد (الاستقبال)'
                  : 'Nouveau Rendez-vous (Accueil)'}
              </h3>
              <span className="text-[11px] text-slate-500">
                {language === 'ar'
                  ? 'حفظ مباشر في قاعدة البيانات'
                  : 'Enregistrement direct en base'}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={isSaving}
            className="shrink-0 rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700 disabled:opacity-40"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col overflow-hidden"
        >
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-5">
            {errorMsg && (
              <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Nom */}
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">
                {language === 'ar' ? 'اسم المريض' : 'Nom du Patient'}{' '}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                disabled={isSaving}
                placeholder="Ex: Youssef Alami"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-50"
              />
            </div>

            {/* Téléphone */}
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">
                {language === 'ar' ? 'الهاتف' : 'Téléphone'}{' '}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
                disabled={isSaving}
                placeholder="06 00 00 00 00"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 font-mono text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-50"
              />
            </div>

            {/* Service */}
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">
                {language === 'ar' ? 'الفحص الطبي' : 'Acte Médical'}
              </label>
              <select
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                disabled={isSaving}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-50"
              >
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {language === 'ar' ? s.ar : s.fr}
                  </option>
                ))}
              </select>
            </div>

            {/* Date + Heure */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">
                  {language === 'ar' ? 'التاريخ' : 'Date'}
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  disabled={isSaving}
                  min={getTodayString()}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-50"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">
                  {language === 'ar' ? 'الوقت' : 'Créneau'}
                </label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  disabled={isSaving}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-50"
                >
                  {availableSlots.length === 0 && (
                    <option value={time}>{time}</option>
                  )}
                  {availableSlots.map((s) => (
                    <option
                      key={s.time}
                      value={s.time}
                      disabled={!s.available}
                    >
                      {s.time} {s.available ? '' : '(Occupé)'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">
                {language === 'ar' ? 'ملاحظات' : 'Motif / Notes'}
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={isSaving}
                placeholder={
                  language === 'ar'
                    ? 'فحص روتيني...'
                    : 'Consultation de routine...'
                }
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-50"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex shrink-0 items-center justify-end gap-2.5 border-t border-slate-100 bg-slate-50 px-6 py-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSaving}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100 disabled:opacity-50"
            >
              {language === 'ar' ? 'إلغاء' : 'Fermer'}
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-60"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>
                    {language === 'ar' ? 'جارٍ الحفظ...' : 'Enregistrement...'}
                  </span>
                </>
              ) : (
                <>
                  <Calendar className="h-4 w-4" />
                  <span>
                    {language === 'ar'
                      ? 'حفظ الموعد'
                      : 'Enregistrer le RDV'}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewAppointmentModal;