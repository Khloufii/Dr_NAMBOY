import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useSiteContent } from '../../context/SiteContentContext';
import { ImagePickerModal } from '../common/ImagePickerModal';
import { OFFICIAL_IMAGES, OfficialImage } from '../../data/officialImages';
import { Sparkles, Edit2, Image as ImageIcon, CheckCircle2, Save, Plus, Trash2 } from 'lucide-react';

export const GalleryManagerView: React.FC = () => {
  const { language, isRtl } = useLanguage();
  const { siteInfo, updateSiteInfo } = useSiteContent();

  const [galleryItems, setGalleryItems] = useState<OfficialImage[]>(() => {
    // If siteInfo has custom gallery items, use them, otherwise default to OFFICIAL_IMAGES
    return (siteInfo as any).galleryItems || OFFICIAL_IMAGES;
  });

  const [editingItem, setEditingItem] = useState<OfficialImage | null>(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const handleSaveItem = (updated: OfficialImage) => {
    const updatedList = galleryItems.map(item => item.id === updated.id ? updated : item);
    setGalleryItems(updatedList);
    setEditingItem(null);
  };

  const handleSaveChangesToFirestore = async () => {
    setIsSaving(true);
    try {
      await updateSiteInfo({
        ...siteInfo,
        galleryItems: galleryItems as any
      } as any);
      setSuccessMessage(true);
      setTimeout(() => setSuccessMessage(false), 4000);
    } catch (err) {
      console.error(err);
      alert('Erreur lors de l’enregistrement de la galerie.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gestion de la Galerie Photo</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {language === 'ar' ? 'معرض صور العيادة (21 صورة رسمية)' : 'Galerie Photo & Visuels du Cabinet (21 photos)'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {language === 'ar'
              ? 'تعديل نصوص، تصنيفات وصور معارض العيادة بدقة عالية.'
              : 'Modifiez les titres, catégories (Fr & Ar) et les visuels de chaque carte de la galerie.'}
          </p>
        </div>

        <button
          onClick={handleSaveChangesToFirestore}
          disabled={isSaving}
          className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50 transition-colors"
        >
          {isSaving ? <span className="animate-spin">⏳</span> : <Save className="w-4 h-4" />}
          <span>{isSaving ? 'Enregistrement...' : 'Enregistrer la Galerie'}</span>
        </button>
      </div>

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Galerie mise à jour et synchronisée avec succès !</span>
        </div>
      )}

      {/* Gallery Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleryItems.map((item) => (
          <div
            key={item.id}
            className="rounded-3xl bg-white border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="relative aspect-16/10 bg-slate-100 overflow-hidden group">
              <img
                src={item.url}
                alt={item.nameFr}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 right-3">
                <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wide">
                  {item.category}
                </span>
              </div>
            </div>

            <div className="p-5 space-y-3">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">
                  {item.fileName}
                </span>
                <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                  {language === 'ar' ? item.nameAr : item.nameFr}
                </h3>
              </div>

              <button
                onClick={() => setEditingItem(item)}
                className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Modifier la carte (Texte & Image)</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal for Card Text & Image */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-extrabold text-slate-900">
                Modifier la Carte de Galerie
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Image Preview & Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-600 block">
                  Visuel de la carte
                </label>
                <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="w-24 h-16 rounded-xl overflow-hidden bg-slate-200 shrink-0">
                    <img src={editingItem.url} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPickerOpen(true)}
                    className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs"
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>Changer l'image HD</span>
                  </button>
                </div>
              </div>

              {/* Title FR */}
              <div>
                <label className="text-xs font-bold uppercase text-slate-600 block mb-1">
                  Titre (Français)
                </label>
                <input
                  type="text"
                  value={editingItem.nameFr}
                  onChange={(e) => setEditingItem({ ...editingItem, nameFr: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white font-medium"
                />
              </div>

              {/* Title AR */}
              <div>
                <label className="text-xs font-bold uppercase text-slate-600 block mb-1">
                  العنوان (بالعربية)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={editingItem.nameAr}
                  onChange={(e) => setEditingItem({ ...editingItem, nameAr: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white font-medium"
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-xs font-bold uppercase text-slate-600 block mb-1">
                  Catégorie
                </label>
                <select
                  value={editingItem.category}
                  onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value as any })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white font-medium"
                >
                  <option value="hero">Façade & Extérieur</option>
                  <option value="doctor">Consultation & Dr. NAMBOY</option>
                  <option value="service">Urgences & Soins</option>
                  <option value="equipment">Échographie & Imagerie</option>
                  <option value="team">Accueil & Secrétariat</option>
                  <option value="logo">Identité & Logo</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-2 border-t border-slate-100">
              <button
                onClick={() => setEditingItem(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
              >
                Annuler
              </button>
              <button
                onClick={() => handleSaveItem(editingItem)}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                Appliquer les modifications
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Picker Modal for editing item image */}
      <ImagePickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        currentImage={editingItem?.url}
        title="Sélectionner une photo officielle"
        onSelectImage={(url) => {
          if (editingItem) {
            setEditingItem({ ...editingItem, url });
          }
        }}
      />
    </div>
  );
};
