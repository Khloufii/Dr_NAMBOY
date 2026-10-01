import React, { useState } from 'react';
import { OFFICIAL_IMAGES, OfficialImage } from '../../data/officialImages';
import { useLanguage } from '../../i18n/LanguageContext';
import { X, Upload, Check, Image as ImageIcon, Link as LinkIcon, Sparkles } from 'lucide-react';

interface ImagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (imageUrl: string) => void;
  currentImage?: string;
  title?: string;
}

export const ImagePickerModal: React.FC<ImagePickerModalProps> = ({
  isOpen,
  onClose,
  onSelectImage,
  currentImage,
  title = 'Choisir une image'
}) => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'gallery' | 'upload' | 'url'>('gallery');
  const [selectedUrl, setSelectedUrl] = useState<string>(currentImage || '');
  const [customUrl, setCustomUrl] = useState<string>('');
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 1200;
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.85);
          setUploadPreview(compressed);
          setSelectedUrl(compressed);
        } else {
          setUploadPreview(ev.target?.result as string);
          setSelectedUrl(ev.target?.result as string);
        }
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleApply = () => {
    if (activeTab === 'url' && customUrl.trim()) {
      onSelectImage(customUrl.trim());
    } else if (selectedUrl) {
      onSelectImage(selectedUrl);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full my-8 overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {title}
              </h3>
              <span className="text-[11px] text-slate-500">
                {language === 'ar' ? 'اختر صورة رسمية للعيادة أو قم برفع صورة جديدة' : 'Sélectionnez une photo officielle ou importez un nouveau fichier'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50/50 px-6 pt-3 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('gallery')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'gallery'
                ? 'bg-white text-blue-600 border-t-2 border-blue-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{language === 'ar' ? 'معرض صور العيادة' : 'Photos Officielles'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'upload'
                ? 'bg-white text-blue-600 border-t-2 border-blue-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>{language === 'ar' ? 'رفع صورة من جهازك' : 'Importer un fichier'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'url'
                ? 'bg-white text-blue-600 border-t-2 border-blue-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LinkIcon className="w-4 h-4" />
            <span>{language === 'ar' ? 'رابط خارجي (URL)' : 'Lien Web (URL)'}</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'gallery' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">
                {language === 'ar'
                  ? 'انقر على الصورة المناسبة لتطبيقها فوراً :'
                  : 'Cliquez sur l’image de votre choix parmi les visuels officiels du cabinet :'}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                {OFFICIAL_IMAGES.map((img) => {
                  const isSelected = selectedUrl === img.url;
                  return (
                    <div
                      key={img.id}
                      onClick={() => setSelectedUrl(img.url)}
                      className={`group relative rounded-2xl overflow-hidden border-2 cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? 'border-blue-600 ring-2 ring-blue-600/30 shadow-md scale-[1.02]'
                          : 'border-slate-200 hover:border-slate-400 hover:shadow-xs'
                      }`}
                    >
                      <div className="aspect-4/3 bg-slate-100 overflow-hidden relative">
                        <img
                          src={img.url}
                          alt={img.nameFr}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <div className="p-2.5 bg-white">
                        <p className="text-[11px] font-bold text-slate-800 line-clamp-1">
                          {language === 'ar' ? img.nameAr : img.nameFr}
                        </p>
                        <span className="text-[9px] uppercase font-semibold text-slate-400">
                          {img.category}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="space-y-4">
              <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer bg-slate-50/50 hover:bg-blue-50/20 transition-all text-center">
                <Upload className="w-8 h-8 text-blue-600" />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    {language === 'ar' ? 'انقر لاختيار صورة من جهازك' : 'Cliquez pour sélectionner une photo'}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    PNG, JPG, WEBP (optimisation automatique)
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {uploadPreview && (
                <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-slate-700 block">
                    Aperçu de la nouvelle image :
                  </span>
                  <div className="aspect-video max-h-48 rounded-xl overflow-hidden bg-slate-200">
                    <img
                      src={uploadPreview}
                      alt="Aperçu"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'url' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-slate-600 block mb-1.5">
                  URL de l’image
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  value={customUrl}
                  onChange={(e) => {
                    setCustomUrl(e.target.value);
                    setSelectedUrl(e.target.value);
                  }}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              {customUrl.trim() && (
                <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-slate-700 block">
                    Aperçu :
                  </span>
                  <div className="aspect-video max-h-48 rounded-xl overflow-hidden bg-slate-200">
                    <img
                      src={customUrl}
                      alt="Aperçu URL"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-200 flex items-center justify-between bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 cursor-pointer"
          >
            {language === 'ar' ? 'إلغاء' : 'Annuler'}
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>{language === 'ar' ? 'تطبيق هذه الصورة' : 'Appliquer cette photo'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
