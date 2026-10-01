import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useSiteContent } from '../../context/SiteContentContext';
import { SiteInfo } from '../../types';
import {
  Save,
  CheckCircle2,
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  Upload,
  Trash2,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
  Plus
} from 'lucide-react';
import { ImagePickerModal } from '../common/ImagePickerModal';

export const GeneralInfoView: React.FC = () => {
  const { language, isRtl } = useLanguage();
  const { siteInfo, updateSiteInfo, uploadImage } = useSiteContent();

  const [formData, setFormData] = useState<SiteInfo>(siteInfo);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setFormData(siteInfo);
  }, [siteInfo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg('');
    try {
      await updateSiteInfo(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Erreur lors de la mise à jour Firestore');
    } finally {
      setIsSaving(false);
    }
  };

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMsg('');
    try {
      const url = await uploadImage(file, 'hero_slides');
      const currentImages = formData.heroImages || [];
      const updatedImages = [...currentImages, url];
      setFormData(prev => ({ ...prev, heroImages: updatedImages }));
      await updateSiteInfo({ heroImages: updatedImages });
    } catch (err: any) {
      setErrorMsg("Erreur lors de l'upload de l'image");
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleRemoveImage = async (index: number) => {
    const currentImages = formData.heroImages || [];
    const updatedImages = currentImages.filter((_, idx) => idx !== index);
    setFormData(prev => ({ ...prev, heroImages: updatedImages }));
    await updateSiteInfo({ heroImages: updatedImages });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            {language === 'ar' ? 'إدارة المعلومات العامة للعيادة' : 'Informations Générales & Coordonnées'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {language === 'ar'
              ? 'تعديل بيانات العيادة وأرقام الهواتف ونصوص الواجهة الرئيسية.'
              : 'Modifiez l’identité, les téléphones officiels, les textes d’accueil et l’adresse du cabinet.'}
          </p>
        </div>

        {saveSuccess && (
          <div className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{language === 'ar' ? 'تم حفظ التعديلات بنجاح !' : 'Modifications enregistrées avec succès !'}</span>
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Cabinet Identity */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Building2 className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">
              {language === 'ar' ? 'هوية العيادة' : 'Identité du Cabinet'}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-bold uppercase text-slate-600 block mb-1.5">
                Nom du Cabinet (Français)
              </label>
              <input
                type="text"
                required
                value={formData.cabinetNameFr || ''}
                onChange={(e) => setFormData({ ...formData, cabinetNameFr: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-slate-600 block mb-1.5">
                اسم العيادة (بالعربية)
              </label>
              <input
                type="text"
                required
                value={formData.cabinetNameAr || ''}
                onChange={(e) => setFormData({ ...formData, cabinetNameAr: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden text-right"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold uppercase text-slate-600 block mb-1.5">
                Médecin Directeur
              </label>
              <input
                type="text"
                required
                value={formData.doctorName || ''}
                onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Contact Numbers & WhatsApp */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Phone className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">
              {language === 'ar' ? 'أرقام الاتصال والمستعجلات' : 'Téléphones & Lignes Directes'}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="text-xs font-bold uppercase text-slate-600 block mb-1.5">
                Urgences 24/7 & WhatsApp
              </label>
              <input
                type="text"
                required
                placeholder="+212 7 70 55 82 99"
                value={formData.phoneMain || ''}
                onChange={(e) => setFormData({ ...formData, phoneMain: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-slate-600 block mb-1.5">
                Téléphone Fixe Cabinet
              </label>
              <input
                type="text"
                required
                placeholder="08 08 65 58 17"
                value={formData.phoneLandline || ''}
                onChange={(e) => setFormData({ ...formData, phoneLandline: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-slate-600 block mb-1.5">
                Ligne Secrétariat
              </label>
              <input
                type="text"
                required
                placeholder="06 94 72 79 15"
                value={formData.phoneSecretary || ''}
                onChange={(e) => setFormData({ ...formData, phoneSecretary: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-slate-600 block mb-1.5">
                Numéro WhatsApp (Format international sans +)
              </label>
              <input
                type="text"
                required
                placeholder="212770558299"
                value={formData.whatsappNumber || ''}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-mono"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold uppercase text-slate-600 block mb-1.5">
                Adresse Email Officielle
              </label>
              <input
                type="email"
                required
                placeholder="contact@cabinet-dr-namboy.ma"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Address & Google Maps */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <MapPin className="w-5 h-5 text-red-600" />
            <h3 className="text-base font-bold text-slate-900">
              {language === 'ar' ? 'العنوان وتحديد الموقع على الخريطة' : 'Adresse & Lien Google Maps'}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-bold uppercase text-slate-600 block mb-1.5">
                Adresse Détaillée (Français)
              </label>
              <textarea
                rows={2}
                required
                value={formData.addressFr || ''}
                onChange={(e) => setFormData({ ...formData, addressFr: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-slate-600 block mb-1.5">
                العنوان المفصل (بالعربية)
              </label>
              <textarea
                rows={2}
                required
                value={formData.addressAr || ''}
                onChange={(e) => setFormData({ ...formData, addressAr: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden resize-none text-right"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold uppercase text-slate-600 block mb-1.5">
                URL Officielle Google Maps (Itinéraire GPS)
              </label>
              <input
                type="url"
                required
                placeholder="https://maps.app.goo.gl/rxqWEk1fQAW8Hacj6?g_st=aw"
                value={formData.mapsUrl || ''}
                onChange={(e) => setFormData({ ...formData, mapsUrl: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-slate-600 block mb-1.5">
                Horaires d’Ouverture (Français)
              </label>
              <input
                type="text"
                required
                value={formData.hoursFr || ''}
                onChange={(e) => setFormData({ ...formData, hoursFr: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-slate-600 block mb-1.5">
                أوقات العمل (بالعربية)
              </label>
              <input
                type="text"
                required
                value={formData.hoursAr || ''}
                onChange={(e) => setFormData({ ...formData, hoursAr: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden text-right"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Hero Content & Slider Images */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h3 className="text-base font-bold text-slate-900">
              {language === 'ar' ? 'نصوص وصور الواجهة الرئيسية (Hero)' : 'Textes & Photos du Hero Slider'}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-bold uppercase text-slate-600 block mb-1.5">
                Titre Principal Hero (Français)
              </label>
              <input
                type="text"
                required
                value={formData.heroTitleFr || ''}
                onChange={(e) => setFormData({ ...formData, heroTitleFr: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-slate-600 block mb-1.5">
                عنوان الواجهة الرئيسي (بالعربية)
              </label>
              <input
                type="text"
                required
                value={formData.heroTitleAr || ''}
                onChange={(e) => setFormData({ ...formData, heroTitleAr: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-bold text-right"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-slate-600 block mb-1.5">
                Sous-titre Hero (Français)
              </label>
              <textarea
                rows={3}
                required
                value={formData.heroSubtitleFr || ''}
                onChange={(e) => setFormData({ ...formData, heroSubtitleFr: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-slate-600 block mb-1.5">
                النص الوصفي للواجهة (بالعربية)
              </label>
              <textarea
                rows={3}
                required
                value={formData.heroSubtitleAr || ''}
                onChange={(e) => setFormData({ ...formData, heroSubtitleAr: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden resize-none text-right"
              />
            </div>
          </div>

          {/* Slider Images Gallery Management */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  {language === 'ar' ? 'صور شريط التمرير (Slider)' : 'Images du Carrousel d’Arrière-Plan'}
                </h4>
                <p className="text-xs text-slate-500">
                  {language === 'ar'
                    ? 'الصور المعروضة في خلفية الصفحة الرئيسية مع التبديل التلقائي.'
                    : 'Ces images défilent automatiquement en arrière-plan avec transitions douces.'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsImagePickerOpen(true)}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-700 text-xs font-bold shadow-2xs cursor-pointer transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Catalogue HD</span>
                </button>

                <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer transition-colors">
                  {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  <span>{isUploading ? 'Téléversement...' : 'Importer'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isUploading}
                    onChange={handleHeroImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {(formData.heroImages || []).map((imgUrl, index) => (
                <div key={index} className="relative group rounded-2xl overflow-hidden aspect-video bg-slate-100 border border-slate-200 shadow-xs">
                  <img
                    src={imgUrl}
                    alt={`Slide ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700 shadow-md cursor-pointer transition-colors"
                      title="Supprimer cette image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-sm shadow-lg shadow-blue-600/30 active:scale-95 transition-all cursor-pointer"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{isSaving ? 'Enregistrement en cours...' : 'Enregistrer les modifications'}</span>
          </button>
        </div>
      </form>

      {/* Image Picker Modal */}
      <ImagePickerModal
        isOpen={isImagePickerOpen}
        onClose={() => setIsImagePickerOpen(false)}
        title="Ajouter une image au carrousel d’accueil"
        onSelectImage={(url) => {
          const current = formData.heroImages || [];
          const updated = [...current, url];
          setFormData({ ...formData, heroImages: updated });
        }}
      />
    </div>
  );
};
