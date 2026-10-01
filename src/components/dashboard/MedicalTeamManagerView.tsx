import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useSiteContent } from '../../context/SiteContentContext';
import { TeamMember } from '../../types';
import {
  GraduationCap,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Upload,
  Image as ImageIcon,
  X,
  Loader2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { ImagePickerModal } from '../common/ImagePickerModal';

export const MedicalTeamManagerView: React.FC = () => {
  const { language } = useLanguage();
  const {
    teamMembers,
    saveTeamMember,
    deleteTeamMember,
    uploadImage,
  } = useSiteContent();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  /* ------------------------------------------------------------------ */
  /* OPTIMISTIC STATE — évite que l'UI attende le refresh du contexte     */
  /* ------------------------------------------------------------------ */
  const [localMembers, setLocalMembers] = useState<TeamMember[]>([]);

  /* Synchronise le state local avec le contexte à chaque changement */
  useEffect(() => {
    if (Array.isArray(teamMembers)) {
      setLocalMembers(teamMembers);
    }
  }, [teamMembers]);

  /* Utilise localMembers comme source de vérité pour l'affichage */
  const displayMembers = localMembers.length > 0 ? localMembers : teamMembers || [];

  /* ------------------------------------------------------------------ */
  /* Form State                                                          */
  /* ------------------------------------------------------------------ */
  const [formData, setFormData] = useState<Partial<TeamMember>>({
    id: '',
    name: '',
    roleFr: '',
    roleAr: '',
    specialtyFr: '',
    specialtyAr: '',
    bioFr: '',
    bioAr: '',
    diplomasFr: [],
    diplomasAr: [],
    photoUrl: '/src/assets/images/hero_doctor_consultation_1790610946656.jpg',
    order: 1,
  });

  const [diplomasFrText, setDiplomasFrText] = useState('');
  const [diplomasArText, setDiplomasArText] = useState('');

  /* ------------------------------------------------------------------ */
  /* Helpers                                                             */
  /* ------------------------------------------------------------------ */
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  /* Génère un ID unique et sûr */
  const generateId = () =>
    `member_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  /* ------------------------------------------------------------------ */
  /* Ouverture modales                                                    */
  /* ------------------------------------------------------------------ */
  const handleOpenAdd = () => {
    setEditingMember(null);
    setFormData({
      id: generateId(),
      name: '',
      roleFr: 'Praticien / Soignant',
      roleAr: 'ممارس طبي / إطار صحي',
      specialtyFr: '',
      specialtyAr: '',
      bioFr: '',
      bioAr: '',
      diplomasFr: [],
      diplomasAr: [],
      photoUrl: '/src/assets/images/hero_medical_team_1790610980924.jpg',
      order: displayMembers.length + 1,
    });
    setDiplomasFrText('');
    setDiplomasArText('');
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (member: TeamMember) => {
    setEditingMember(member);
    setFormData({ ...member });
    setDiplomasFrText((member.diplomasFr || []).join('\n'));
    setDiplomasArText((member.diplomasAr || []).join('\n'));
    setErrorMsg('');
    setIsModalOpen(true);
  };

  /* ------------------------------------------------------------------ */
  /* Upload photo                                                        */
  /* ------------------------------------------------------------------ */
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMsg('');
    try {
      const url = await uploadImage(file, 'team_photos');
      setFormData((prev) => ({ ...prev, photoUrl: url }));
      showToast('Photo téléversée avec succès.');
    } catch (err) {
      console.error('[TeamManager] Upload failed:', err);
      setErrorMsg("Échec de l'upload de la photo.");
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  /* ------------------------------------------------------------------ */
  /* Soumission                                                          */
  /* ------------------------------------------------------------------ */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    /* 1. Validation */
    if (!formData.name?.trim()) {
      setErrorMsg(
        language === 'ar'
          ? 'يرجى إدخال اسم الممارس.'
          : 'Veuillez renseigner le nom du praticien.',
      );
      return;
    }

    setIsSaving(true);

    try {
      /* 2. Construction de l'objet final */
      const parsedDiplomasFr = diplomasFrText
        .split('\n')
        .map((d) => d.trim())
        .filter(Boolean);

      const parsedDiplomasAr = diplomasArText
        .split('\n')
        .map((d) => d.trim())
        .filter(Boolean);

      const finalMember: TeamMember = {
        id: formData.id || generateId(),
        name: formData.name.trim(),
        roleFr: formData.roleFr?.trim() || 'Praticien',
        roleAr: formData.roleAr?.trim() || 'ممارس طبي',
        specialtyFr: formData.specialtyFr?.trim() || '',
        specialtyAr: formData.specialtyAr?.trim() || '',
        bioFr: formData.bioFr?.trim() || '',
        bioAr: formData.bioAr?.trim() || '',
        diplomasFr: parsedDiplomasFr,
        diplomasAr: parsedDiplomasAr,
        photoUrl:
          formData.photoUrl ||
          '/src/assets/images/hero_doctor_consultation_1790610946656.jpg',
        order: Number(formData.order) || displayMembers.length + 1,
      };

      console.log('[TeamManager] Saving member:', finalMember);
      console.log('[TeamManager] isEdit:', !!editingMember);

      /* 3. OPTIMISTIC UPDATE — mise à jour immédiate de l'UI */
      setLocalMembers((prev) => {
        const exists = prev.some((m) => m.id === finalMember.id);
        if (exists) {
          /* Edit : remplace l'entrée existante */
          return prev.map((m) => (m.id === finalMember.id ? finalMember : m));
        }
        /* Add : ajoute à la fin */
        return [...prev, finalMember];
      });

      /* 4. Sauvegarde réelle (Firestore / contexte) */
      await saveTeamMember(finalMember);

      console.log('[TeamManager] Save succeeded');

      /* 5. Fermeture + toast */
      setIsModalOpen(false);
      showToast(
        editingMember
          ? language === 'ar'
            ? 'تم تحديث بطاقة الممارس بنجاح.'
            : 'Fiche mise à jour avec succès !'
          : language === 'ar'
            ? 'تمت إضافة الممارس الجديد بنجاح.'
            : 'Nouveau soignant ajouté avec succès !',
      );
    } catch (err: any) {
      console.error('[TeamManager] Save failed:', err);
      setErrorMsg(
        err?.message ||
          (language === 'ar'
            ? 'حدث خطأ أثناء الحفظ.'
            : 'Erreur lors de la sauvegarde.'),
      );
      /* Rollback : en cas d'échec, on recharge depuis le contexte */
      setLocalMembers(teamMembers || []);
    } finally {
      setIsSaving(false);
    }
  };

  /* ------------------------------------------------------------------ */
  /* Suppression                                                         */
  /* ------------------------------------------------------------------ */
  const handleDelete = async (id: string) => {
    try {
      /* Optimistic : retire immédiatement */
      setLocalMembers((prev) => prev.filter((m) => m.id !== id));

      await deleteTeamMember(id);
      setIsDeletingId(null);
      showToast(
        language === 'ar'
          ? 'تم حذف العضو بنجاح.'
          : 'Membre retiré avec succès.',
      );
    } catch (err: any) {
      console.error('[TeamManager] Delete failed:', err);
      alert(
        (language === 'ar' ? 'خطأ أثناء الحذف : ' : 'Erreur lors de la suppression : ') +
          (err?.message || 'Inconnue'),
      );
      /* Rollback */
      setLocalMembers(teamMembers || []);
    }
  };

  /* ------------------------------------------------------------------ */
  /* Séparation Dr NAMBOY / autres membres (corrigée)                    */
  /* ------------------------------------------------------------------ */
  const drNamboy = useMemo(
    () =>
      displayMembers.find((m) => m.id === 'dr_namboy') ||
      displayMembers.find((m) =>
        (m.name || '').toLowerCase().includes('namboy'),
      ) ||
      displayMembers[0],
    [displayMembers],
  );

  const otherMembers = useMemo(
    () => displayMembers.filter((m) => m.id !== drNamboy?.id),
    [displayMembers, drNamboy?.id],
  );

  /* ------------------------------------------------------------------ */
  /* Rendu                                                               */
  /* ------------------------------------------------------------------ */
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
            {language === 'ar'
              ? 'إدارة الطاقم الطبي والشواهد'
              : 'Équipe Médicale & Diplômes'}
          </h2>
          <p className="text-xs text-slate-500 sm:text-sm">
            {language === 'ar'
              ? 'تعديل السيرة الذاتية والشواهد والمسار المهني للدكتور نامبوي وكافة الأطر التمريضية والإدارية.'
              : 'Gérez la présentation, les diplômes universitaires et les rôles du Dr. NAMBOY et de son équipe soignante.'}
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex shrink-0 items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-blue-700 sm:text-sm"
        >
          <Plus className="h-4 w-4" />
          <span>
            {language === 'ar' ? 'إضافة ممارس / إطار صحي' : 'Ajouter un membre'}
          </span>
        </button>
      </div>

      {/* Toast */}
      {toastMessage && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-xs font-bold text-emerald-800 sm:text-sm">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Debug info (à retirer en production) */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-[10px] font-mono text-slate-500">
        Total membres : {displayMembers.length} | Dr : {drNamboy?.name || '—'} |
        Autres : {otherMembers.length}
      </div>

      {/* Fiche vedette Dr. NAMBOY */}
      {drNamboy && (
        <div className="relative overflow-hidden rounded-3xl border border-blue-800 bg-gradient-to-br from-blue-900 via-sky-900 to-slate-950 p-6 text-white shadow-md sm:p-8">
          <div className="relative z-10 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-2 border-sky-400 bg-sky-950 shadow-md sm:h-28 sm:w-28">
                <img
                  src={drNamboy.photoUrl}
                  alt={drNamboy.name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      '/src/assets/images/hero_doctor_consultation_1790610946656.jpg';
                  }}
                />
              </div>

              <div className="space-y-1.5">
                <span className="rounded-full border border-sky-400/30 bg-sky-400/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sky-300">
                  {language === 'ar' ? 'الطبيب المدير' : 'Médecin Directeur & Fondateur'}
                </span>
                <h3 className="text-xl font-extrabold text-white sm:text-2xl">
                  {drNamboy.name}
                </h3>
                <p className="text-xs font-medium text-sky-200 sm:text-sm">
                  {language === 'ar' ? drNamboy.specialtyAr : drNamboy.specialtyFr}
                </p>
                <p className="max-w-xl pt-1 text-xs leading-relaxed text-slate-300">
                  {language === 'ar' ? drNamboy.bioAr : drNamboy.bioFr}
                </p>
              </div>
            </div>

            <button
              onClick={() => handleOpenEdit(drNamboy)}
              className="flex shrink-0 items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              <Edit2 className="h-4 w-4 text-sky-300" />
              <span>
                {language === 'ar'
                  ? 'تعديل بيانات الدكتور'
                  : 'Modifier la présentation'}
              </span>
            </button>
          </div>

          {/* Diplômes */}
          {(drNamboy.diplomasFr?.length || 0) > 0 && (
            <div className="mt-6 border-t border-white/10 pt-5">
              <span className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-sky-300">
                {language === 'ar'
                  ? `الشواهد المسجلة (${drNamboy.diplomasAr?.length || 0})`
                  : `Diplômes enregistrés (${drNamboy.diplomasFr?.length || 0})`}
              </span>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                {(language === 'ar'
                  ? drNamboy.diplomasAr
                  : drNamboy.diplomasFr
                )?.slice(0, 4).map((dip, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-xs text-slate-200"
                  >
                    <GraduationCap className="h-3.5 w-3.5 shrink-0 text-sky-400" />
                    <span className="truncate">{dip}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Grille autres membres */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-slate-900">
          {language === 'ar'
            ? 'باقي الفريق الطبي والتمريضي'
            : 'Autres Membres du Personnel & Soignants'}
        </h3>

        {otherMembers.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <p className="text-sm font-semibold text-slate-500">
              {language === 'ar'
                ? 'لا يوجد أعضاء إضافيون. انقر على "إضافة ممارس" لإضافة واحد.'
                : 'Aucun membre supplémentaire. Cliquez sur "Ajouter un membre" pour en créer un.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {otherMembers.map((member) => (
              <div
                key={member.id}
                className="flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                      <img
                        src={member.photoUrl}
                        alt={member.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            '/src/assets/images/hero_doctor_consultation_1790610946656.jpg';
                        }}
                      />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                        {language === 'ar' ? member.roleAr : member.roleFr}
                      </span>
                      <h4 className="truncate text-sm font-bold text-slate-900">
                        {member.name}
                      </h4>
                      <p className="line-clamp-1 text-[11px] font-medium text-slate-500">
                        {language === 'ar' ? member.specialtyAr : member.specialtyFr}
                      </p>
                    </div>
                  </div>

                  <p className="line-clamp-3 text-xs leading-relaxed text-slate-600">
                    {language === 'ar' ? member.bioAr : member.bioFr}
                  </p>

                  {(member.diplomasFr?.length || 0) > 0 && (
                    <div className="space-y-1 border-t border-slate-100 pt-2 text-[11px] text-slate-500">
                      <span className="block font-semibold text-slate-700">
                        {language === 'ar' ? 'الشواهد :' : 'Diplômes :'}
                      </span>
                      <ul className="list-inside list-disc space-y-0.5 text-[10px]">
                        {(language === 'ar'
                          ? member.diplomasAr
                          : member.diplomasFr
                        )
                          ?.slice(0, 2)
                          .map((d, i) => (
                            <li key={i} className="truncate">
                              {d}
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
                  <button
                    onClick={() => handleOpenEdit(member)}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-700"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    <span>{language === 'ar' ? 'تعديل' : 'Modifier'}</span>
                  </button>

                  <button
                    onClick={() => setIsDeletingId(member.id)}
                    className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-white px-3 py-1.5 text-xs font-bold text-red-600 transition-colors hover:bg-red-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>{language === 'ar' ? 'حذف' : 'Supprimer'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal suppression */}
      {isDeletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm space-y-4 rounded-3xl bg-white p-6 shadow-xl">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600">
              <Trash2 className="h-6 w-6" />
            </div>
            <div className="space-y-1 text-center">
              <h3 className="text-base font-bold text-slate-900">
                {language === 'ar'
                  ? 'حذف هذا الملف الطبي ؟'
                  : 'Supprimer ce profil soignant ?'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'ar'
                  ? 'سيتم إزالة هذا الملف نهائياً.'
                  : 'Cette fiche sera retirée définitivement.'}
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setIsDeletingId(null)}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                {language === 'ar' ? 'إلغاء' : 'Annuler'}
              </button>
              <button
                onClick={() => handleDelete(isDeletingId)}
                className="flex-1 rounded-xl bg-red-600 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-red-700"
              >
                {language === 'ar' ? 'تأكيد الحذف' : 'Confirmer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal ajout/édition */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
          <div className="my-8 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 p-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingMember
                    ? `${language === 'ar' ? 'تعديل : ' : 'Modifier : '}${editingMember.name}`
                    : language === 'ar'
                      ? 'ممارس أو إطار صحي جديد'
                      : 'Nouveau Praticien ou Soignant'}
                </h3>
                <span className="text-xs font-medium text-slate-500">
                  {language === 'ar'
                    ? 'تحديث فوري ومباشر'
                    : 'Enregistrement direct et instantané'}
                </span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex-1 space-y-5 overflow-y-auto p-6"
            >
              {errorMsg && (
                <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-bold text-red-700">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-bold uppercase text-slate-600">
                    {language === 'ar'
                      ? 'الاسم الكامل *'
                      : 'Nom & Prénom du Praticien *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="ex: Dr. Evrard Simplice NAMBOY"
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-slate-600">
                    {language === 'ar' ? 'الترتيب' : "Ordre d'affichage"}
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.order || 1}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        order: parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 p-2.5 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-slate-600">
                    Titre / Rôle (Français)
                  </label>
                  <input
                    type="text"
                    value={formData.roleFr || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, roleFr: e.target.value })
                    }
                    placeholder="ex: Médecin Urgentiste"
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-slate-600">
                    الصفة / الدور (العربية)
                  </label>
                  <input
                    type="text"
                    value={formData.roleAr || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, roleAr: e.target.value })
                    }
                    placeholder="مثال: طبيب ممارس في المستعجلات"
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-right text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-slate-600">
                    Spécialités (Français)
                  </label>
                  <input
                    type="text"
                    value={formData.specialtyFr || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, specialtyFr: e.target.value })
                    }
                    placeholder="ex: Médecine Générale, Échographie"
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-slate-600">
                    التخصصات (العربية)
                  </label>
                  <input
                    type="text"
                    value={formData.specialtyAr || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, specialtyAr: e.target.value })
                    }
                    placeholder="مثال: الطب العام، الفحص بالصدى"
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-right text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-slate-600">
                    Biographie (Français)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.bioFr || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, bioFr: e.target.value })
                    }
                    placeholder="Parcours hospitalier et universitaire..."
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-slate-600">
                    السيرة الذاتية (العربية)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.bioAr || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, bioAr: e.target.value })
                    }
                    placeholder="المسار الجامعي والمستشفوي..."
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-right text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-bold uppercase text-slate-700">
                    {language === 'ar'
                      ? 'الشواهد والدبلومات (سطر واحد لكل دبلوم)'
                      : 'Diplômes & Titres (1 par ligne)'}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-[11px] font-bold text-slate-600">
                      Diplômes en Français
                    </label>
                    <textarea
                      rows={4}
                      value={diplomasFrText}
                      onChange={(e) => setDiplomasFrText(e.target.value)}
                      placeholder="Doctorat en Médecine (Rabat)&#10;DU Médecine d'Urgence"
                      className="w-full rounded-xl border border-slate-300 p-2.5 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-[11px] font-bold text-slate-600">
                      الشواهد بالعربية
                    </label>
                    <textarea
                      rows={4}
                      value={diplomasArText}
                      onChange={(e) => setDiplomasArText(e.target.value)}
                      placeholder="دكتوراه في الطب العام&#10;دبلوم في طب المستعجلات"
                      className="w-full rounded-xl border border-slate-300 p-2.5 text-right font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase text-slate-600">
                  {language === 'ar' ? 'صورة الملف' : 'Photo de Profil'}
                </label>
                <div className="flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-slate-300 bg-slate-200">
                    {formData.photoUrl ? (
                      <img
                        src={formData.photoUrl}
                        alt="Photo"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-400">
                        <ImageIcon className="h-6 w-6" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsImagePickerOpen(true)}
                        className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-2 text-xs font-bold text-blue-700 transition-colors hover:bg-blue-100"
                      >
                        <Sparkles className="h-4 w-4 text-blue-600" />
                        <span>
                          {language === 'ar'
                            ? 'اختيار من المكتبة'
                            : 'Choisir dans le catalogue'}
                        </span>
                      </button>

                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100">
                        {isUploading ? (
                          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                        ) : (
                          <Upload className="h-4 w-4 text-slate-600" />
                        )}
                        <span>
                          {isUploading
                            ? language === 'ar'
                              ? 'جارٍ التحميل...'
                              : 'Téléversement...'
                            : language === 'ar'
                              ? 'تحميل من الجهاز'
                              : 'Importer'}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          disabled={isUploading}
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-300 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  {language === 'ar' ? 'إلغاء' : 'Annuler'}
                </button>
                <button
                  type="submit"
                  disabled={isSaving || isUploading}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 disabled:bg-blue-400 sm:text-sm"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  <span>
                    {isSaving
                      ? language === 'ar'
                        ? 'جارٍ الحفظ...'
                        : 'Enregistrement...'
                      : language === 'ar'
                        ? 'حفظ الملف'
                        : 'Enregistrer le profil'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Picker */}
      <ImagePickerModal
        isOpen={isImagePickerOpen}
        onClose={() => setIsImagePickerOpen(false)}
        currentImage={formData.photoUrl}
        title={
          language === 'ar'
            ? 'اختيار صورة عضو الفريق'
            : "Sélectionner la photo du membre"
        }
        onSelectImage={(url) => {
          setFormData((prev) => ({ ...prev, photoUrl: url }));
        }}
      />
    </div>
  );
};