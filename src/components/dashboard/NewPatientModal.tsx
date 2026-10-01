import React, { useState } from 'react';
import { PatientRecord } from '../../types';
import { db } from '../../services/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { X, Loader2, AlertCircle } from 'lucide-react';

interface NewPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPatientCreated: (p: PatientRecord) => void;
}

/** Génère un ID unique */
const generatePatientId = () =>
  `pat_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

export const NewPatientModal: React.FC<NewPatientModalProps> = ({
  isOpen,
  onClose,
  onPatientCreated,
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [cinOrId, setCinOrId] = useState('');
  const [gender, setGender] = useState<'M' | 'F'>('M');
  const [birthDate, setBirthDate] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [allergies, setAllergies] = useState('');
  const [chronicDiseases, setChronicDiseases] = useState('');
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const resetForm = () => {
    setFullName('');
    setPhone('');
    setEmail('');
    setCinOrId('');
    setGender('M');
    setBirthDate('');
    setBloodGroup('O+');
    setAllergies('');
    setChronicDiseases('');
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

    if (!fullName.trim() || !phone.trim()) {
      setErrorMsg('Veuillez renseigner le nom et le téléphone.');
      return;
    }

    setIsSaving(true);

    try {
      const patientId = generatePatientId();
      const todayStr = new Date().toISOString().split('T')[0];

      /* Objet patient final */
      const patientData: any = {
        fullName: fullName.trim(),
        phone: phone.trim(),
        gender,
        allergies: allergies
          ? allergies.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        chronicDiseases: chronicDiseases
          ? chronicDiseases.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        appointmentsCount: 0,
        createdAt: todayStr,
        lastVisit: todayStr,
      };

      /* Champs optionnels */
      if (email.trim()) patientData.email = email.trim();
      if (cinOrId.trim()) patientData.cinOrId = cinOrId.trim();
      if (birthDate) patientData.birthDate = birthDate;
      if (bloodGroup) patientData.bloodGroup = bloodGroup;
      if (notes.trim()) patientData.notes = notes.trim();

      console.log('[NewPatientModal] Creating patient:', patientId, patientData);

      /* ✅ UNIQUE écriture : directement dans Firestore */
      if (db) {
        await setDoc(doc(db, 'patients', patientId), patientData);
        console.log('[NewPatientModal] ✅ Saved to Firestore:', patientId);
      } else {
        throw new Error('Firestore non disponible');
      }

      /* Notifie le parent (optionnel — l'UI se mettra à jour via onSnapshot) */
      onPatientCreated({ ...patientData, id: patientId } as PatientRecord);

      /* Reset + fermeture */
      resetForm();
      onClose();
    } catch (err: any) {
      console.error('[NewPatientModal] Save failed:', err);
      console.error('[NewPatientModal] Error code:', err?.code);
      console.error('[NewPatientModal] Error message:', err?.message);

      let msg = 'Une erreur est survenue lors de la création du dossier.';
      if (err?.code === 'permission-denied') {
        msg = "Vous n'avez pas la permission de créer un dossier.";
      } else if (err?.code === 'unavailable') {
        msg = 'Impossible de contacter le serveur. Vérifiez votre connexion.';
      } else if (err?.message) {
        msg = err.message;
      }

      setErrorMsg(msg);
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
        className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
          <h3 className="text-lg font-bold text-slate-900">
            Nouveau Dossier Patient
          </h3>
          <button
            onClick={handleClose}
            disabled={isSaving}
            className="rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700 disabled:opacity-40"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 space-y-4 overflow-y-auto p-6"
        >
          {errorMsg && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-bold text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700">
                Nom et Prénom *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={isSaving}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
                placeholder="Ex: Fatima Zahra"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700">
                Téléphone *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isSaving}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
                placeholder="06 12 34 56 78"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-slate-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSaving}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
              placeholder="nom@exemple.com"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700">
                CIN / ID
              </label>
              <input
                type="text"
                value={cinOrId}
                onChange={(e) => setCinOrId(e.target.value)}
                disabled={isSaving}
                className="w-full rounded-xl border border-slate-300 p-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
                placeholder="AB123456"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700">
                Sexe
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'M' | 'F')}
                disabled={isSaving}
                className="w-full rounded-xl border border-slate-300 p-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
              >
                <option value="M">Masculin</option>
                <option value="F">Féminin</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700">
                Groupe Sanguin
              </label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                disabled={isSaving}
                className="w-full rounded-xl border border-slate-300 p-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
              >
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-slate-700">
              Date de Naissance
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              disabled={isSaving}
              className="w-full rounded-xl border border-slate-300 p-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-slate-700">
              Allergies (séparées par virgules)
            </label>
            <input
              type="text"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              disabled={isSaving}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
              placeholder="Pénicilline, Aspirine..."
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-slate-700">
              Pathologies Chroniques
            </label>
            <input
              type="text"
              value={chronicDiseases}
              onChange={(e) => setChronicDiseases(e.target.value)}
              disabled={isSaving}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
              placeholder="Diabète, Hypertension, Asthme..."
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-slate-700">
              Observations initiales
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={isSaving}
              className="w-full resize-none rounded-xl border border-slate-300 p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
              placeholder="Notes cliniques ou motif de première visite..."
            />
          </div>

          <div className="flex items-center gap-3 border-t border-slate-200 pt-4">
            <button
              type="submit"
              disabled={isSaving}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Création...</span>
                </>
              ) : (
                <span>Créer le Dossier Patient</span>
              )}
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={isSaving}
              className="rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-200 disabled:opacity-50"
            >
              Fermer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};