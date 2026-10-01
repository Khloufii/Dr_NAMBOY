import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useSiteContent } from '../../context/SiteContentContext';
import { MedicalService } from '../../types';
import {
  Stethoscope,
  HeartPulse,
  Activity,
  Bug,
  Baby,
  Sparkles,
  Car,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Upload,
  Image as ImageIcon,
  Clock,
  ShieldCheck,
  X,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { ImagePickerModal } from '../common/ImagePickerModal';

const AVAILABLE_ICONS = [
  { name: 'Stethoscope', label: 'Stéthoscope (Général)' },
  { name: 'HeartPulse', label: 'Cœur / Urgence' },
  { name: 'Activity', label: 'Activité / ECG / Écho' },
  { name: 'Bug', label: 'Infectieux / Tropical' },
  { name: 'Baby', label: 'Maternité / Femme' },
  { name: 'Sparkles', label: 'Drainage / Bien-être' },
  { name: 'Car', label: 'Permis de Conduire' },
];

export const ServicesManagerView: React.FC = () => {
  const { language, isRtl } = useLanguage();
  const { services, saveService, deleteService, uploadImage } = useSiteContent();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
  const [editingService, setEditingService] = useState<MedicalService | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [formData, setFormData] = useState<Partial<MedicalService>>({
    id: '',
    titleFr: '',
    titleAr: '',
    shortDescFr: '',
    shortDescAr: '',
    fullDescFr: '',
    fullDescAr: '',
    badgeFr: 'Soins Médicaux',
    badgeAr: 'رعاية طبية',
    iconName: 'Stethoscope',
    image: '/src/assets/images/hero_doctor_consultation_1790610946656.jpg',
    is24h: false,
    indicationsFr: [],
    indicationsAr: [],
    equipmentFr: [],
    equipmentAr: [],
    preparationFr: [],
    preparationAr: [],
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleOpenAdd = () => {
    setEditingService(null);
    setFormData({
      id: `service_${Date.now()}`,
      titleFr: '',
      titleAr: '',
      shortDescFr: '',
      shortDescAr: '',
      fullDescFr: '',
      fullDescAr: '',
      badgeFr: 'Soins Spécialisés',
      badgeAr: 'رعاية متخصصة',
      iconName: 'Stethoscope',
      image: '/src/assets/images/hero_doctor_consultation_1790610946656.jpg',
      is24h: false,
      indicationsFr: ['Consultation et examen approfondi', 'Prescription personnalisée'],
      indicationsAr: ['استشارة وفحص سريري دقيق', 'وصفة علاجية ملائمة'],
      equipmentFr: ['Matériel médical certifié aux normes'],
      equipmentAr: ['أجهزة طبية معتمدة وفق المعايير'],
      preparationFr: ['Apporter les anciens bilans médicaux'],
      preparationAr: ['إحضار الفحوصات والتحاليل السابقة'],
    });
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (service: MedicalService) => {
    setEditingService(service);
    setFormData({ ...service });
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMsg('');
    try {
      const url = await uploadImage(file, 'services');
      setFormData(prev => ({ ...prev, image: url }));
      showToast('Image du service téléchargée avec succès.');
    } catch (err: any) {
      setErrorMsg("Échec de l'upload de l'image.");
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titleFr?.trim() && !formData.titleAr?.trim()) {
      setErrorMsg('Veuillez renseigner le titre du service.');
      return;
    }

    setIsSaving(true);
    setErrorMsg('');
    try {
      const finalService: MedicalService = {
        id: formData.id || `service_${Date.now()}`,
        titleFr: formData.titleFr?.trim() || formData.titleAr || '',
        titleAr: formData.titleAr?.trim() || formData.titleFr || '',
        shortDescFr: formData.shortDescFr?.trim() || '',
        shortDescAr: formData.shortDescAr?.trim() || '',
        fullDescFr: formData.fullDescFr?.trim() || formData.shortDescFr || '',
        fullDescAr: formData.fullDescAr?.trim() || formData.shortDescAr || '',
        badgeFr: formData.badgeFr || 'Soins Médicaux',
        badgeAr: formData.badgeAr || 'رعاية طبية',
        iconName: formData.iconName || 'Stethoscope',
        image: formData.image || '/src/assets/images/hero_doctor_consultation_1790610946656.jpg',
        is24h: Boolean(formData.is24h),
        indicationsFr: formData.indicationsFr?.length ? formData.indicationsFr : ['Consultation médicale'],
        indicationsAr: formData.indicationsAr?.length ? formData.indicationsAr : ['استشارة طبية'],
        equipmentFr: formData.equipmentFr || [],
        equipmentAr: formData.equipmentAr || [],
        preparationFr: formData.preparationFr || [],
        preparationAr: formData.preparationAr || [],
        procedureFr: formData.procedureFr || ['Accueil et examen clinique', 'Diagnostics complémentaires si nécessaire', 'Prescription et recommandations de suivi'],
        procedureAr: formData.procedureAr || ['الاستقبال والفحص السريري الدقيق', 'فحوصات تكميلية عند الحاجة', 'تسليم الوصفة والتوجيهات الطبية'],
        faqs: formData.faqs || []
      };

      await saveService(finalService);
      setIsModalOpen(false);
      showToast(editingService ? 'Service médical mis à jour avec succès !' : 'Nouveau service ajouté avec succès !');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteService(id);
      setIsDeletingId(null);
      showToast('Service supprimé avec succès.');
    } catch (err: any) {
      alert('Erreur lors de la suppression : ' + (err?.message || 'Inconnue'));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            {language === 'ar' ? 'إدارة الخدمات والتخصصات الطبية' : 'Services & Soins Médicaux'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {language === 'ar'
              ? 'إضافة، تعديل أو حذف التخصصات والخدمات الطبية المعروضة لزوار العيادة.'
              : 'Ajoutez, modifiez ou supprimez les spécialités médicales présentées aux patients.'}
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'ar' ? 'إضافة خدمة جديدة' : 'Ajouter un service'}</span>
        </button>
      </div>

      {/* Toast message */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs sm:text-sm font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => {
          return (
            <div
              key={service.id}
              className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Image Header with Badge */}
                <div className="relative aspect-16/9 bg-slate-100 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.titleFr}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />

                  {/* 24h Badge */}
                  {service.is24h && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-xs">
                      <Clock className="w-3 h-3" />
                      <span>24h/24 & 7j/7</span>
                    </span>
                  )}

                  {/* Specialty Badge */}
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-[10px] font-bold border border-white/20">
                    {language === 'ar' ? service.badgeAr : service.badgeFr}
                  </span>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="text-sm font-bold leading-snug drop-shadow-xs">
                      {language === 'ar' ? service.titleAr : service.titleFr}
                    </h3>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-3">
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {language === 'ar' ? service.shortDescAr : service.shortDescFr}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-semibold text-blue-600">ID: {service.id}</span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                      {service.iconName}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenEdit(service)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-blue-50 hover:border-blue-300 text-slate-700 hover:text-blue-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'تعديل' : 'Modifier'}</span>
                </button>

                <button
                  onClick={() => setIsDeletingId(service.id)}
                  className="px-3 py-1.5 rounded-xl border border-red-200 bg-white hover:bg-red-50 text-red-600 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'حذف' : 'Supprimer'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Modal */}
      {isDeletingId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                {language === 'ar' ? 'تأكيد حذف الخدمة' : 'Supprimer ce service ?'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'ar'
                  ? 'سيتم حذف الخدمة نهائياً من قاعدة بيانات Firestore ولن تظهر على الموقع.'
                  : 'Cette action supprimera définitivement le service de Firestore et du site public.'}
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setIsDeletingId(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
              >
                {language === 'ar' ? 'إلغاء' : 'Annuler'}
              </button>
              <button
                onClick={() => handleDelete(isDeletingId)}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs cursor-pointer shadow-xs"
              >
                {language === 'ar' ? 'نعم، حذف' : 'Confirmer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Service Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full my-8 overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingService
                    ? (language === 'ar' ? 'تعديل الخدمة الطبية' : 'Modifier le Service Médical')
                    : (language === 'ar' ? 'إضافة خدمة طبية جديدة' : 'Nouveau Service Médical')}
                </h3>
                <span className="text-xs text-slate-500 font-medium">
                  {language === 'ar' ? 'تحديث فوري ومباشر' : 'Mise à jour directe du service médical'}
                </span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Service Titles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-600 block mb-1">
                    Titre du Service (Français) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.titleFr || ''}
                    onChange={(e) => setFormData({ ...formData, titleFr: e.target.value })}
                    placeholder="ex: Médecine Générale & Suivi Familial"
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-slate-600 block mb-1">
                    عنوان الخدمة (العربية) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.titleAr || ''}
                    onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                    placeholder="مثال: الطب العام والتتبع العائلي الشامل"
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden text-right"
                  />
                </div>
              </div>

              {/* Short Descriptions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-600 block mb-1">
                    Description Courte (Français)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.shortDescFr || ''}
                    onChange={(e) => setFormData({ ...formData, shortDescFr: e.target.value })}
                    placeholder="Résumé succinct pour les cartes d'accueil..."
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-slate-600 block mb-1">
                    الوصف المختصر (العربية)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.shortDescAr || ''}
                    onChange={(e) => setFormData({ ...formData, shortDescAr: e.target.value })}
                    placeholder="ملخص موجز للبطاقة التعريفية..."
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden text-right"
                  />
                </div>
              </div>

              {/* Full Detailed Descriptions */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-600 block mb-1">
                    Présentation Complète & Protocole (Français)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.fullDescFr || ''}
                    onChange={(e) => setFormData({ ...formData, fullDescFr: e.target.value })}
                    placeholder="Détails complets affichés sur la page dédiée du service..."
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-slate-600 block mb-1">
                    التفاصيل والبروتوكول العلاجي (العربية)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.fullDescAr || ''}
                    onChange={(e) => setFormData({ ...formData, fullDescAr: e.target.value })}
                    placeholder="تفاصيل التكفل الطبي باللغة العربية..."
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden text-right"
                  />
                </div>
              </div>

              {/* Icon, Badges & 24h Toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-600 block mb-1">
                    Icône Visuelle
                  </label>
                  <select
                    value={formData.iconName || 'Stethoscope'}
                    onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
                  >
                    {AVAILABLE_ICONS.map((ic) => (
                      <option key={ic.name} value={ic.name}>
                        {ic.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-slate-600 block mb-1">
                    Badge FR
                  </label>
                  <input
                    type="text"
                    value={formData.badgeFr || ''}
                    onChange={(e) => setFormData({ ...formData, badgeFr: e.target.value })}
                    placeholder="Soins Spécialisés"
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white"
                  />
                </div>

                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 cursor-pointer p-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={Boolean(formData.is24h)}
                      onChange={(e) => setFormData({ ...formData, is24h: e.target.checked })}
                      className="w-4 h-4 rounded text-red-600 focus:ring-red-500"
                    />
                    <span className="text-xs font-bold text-slate-800">
                      Disponible 24h/24 & 7j/7
                    </span>
                  </label>
                </div>
              </div>

              {/* Service Image & Storage Uploader */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-600 block">
                  Photo / Visuel du Service Médical
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="w-28 h-20 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 shrink-0 relative group">
                    {formData.image ? (
                      <img src={formData.image} alt="Aperçu" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsImagePickerOpen(true)}
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-50 border border-blue-200 hover:bg-blue-100 text-xs font-bold text-blue-700 cursor-pointer shadow-2xs transition-colors"
                      >
                        <Sparkles className="w-4 h-4 text-blue-600" />
                        <span>Choisir dans le catalogue HD</span>
                      </button>

                      <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-xs font-bold text-slate-700 cursor-pointer shadow-2xs transition-colors">
                        {isUploading ? (
                          <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                        ) : (
                          <Upload className="w-4 h-4 text-slate-600" />
                        )}
                        <span>{isUploading ? 'Téléversement...' : 'Importer depuis appareil'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          disabled={isUploading}
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <p className="text-[11px] text-slate-500">
                      Vous pouvez choisir parmi les 10 photos officielles du cabinet ou charger une image personnalisée.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSaving || isUploading}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>{isSaving ? 'Enregistrement...' : 'Enregistrer le service'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Picker Modal */}
      <ImagePickerModal
        isOpen={isImagePickerOpen}
        onClose={() => setIsImagePickerOpen(false)}
        currentImage={formData.image}
        title="Sélectionner la photo du service médical"
        onSelectImage={(url) => {
          setFormData((prev) => ({ ...prev, image: url }));
        }}
      />
    </div>
  );
};
