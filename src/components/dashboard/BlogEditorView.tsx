import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useSiteContent } from '../../context/SiteContentContext';
import { BlogPost, UserProfile } from '../../types';
import {
  Sparkles,
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  User,
  Tag,
  Upload,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
  Eye,
  ArrowLeft,
  X
} from 'lucide-react';
import { ImagePickerModal } from '../common/ImagePickerModal';

interface BlogEditorViewProps {
  currentUser: UserProfile;
  onPublishArticle?: (article: Omit<BlogPost, 'id' | 'date'>) => void;
}

export const BlogEditorView: React.FC<BlogEditorViewProps> = ({ currentUser, onPublishArticle }) => {
  const { language, isRtl } = useLanguage();
  const { blogPosts, saveBlogPost, deleteBlogPost, uploadImage } = useSiteContent();

  const [viewMode, setViewMode] = useState<'list' | 'editor'>('list');
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    id: '',
    titleFr: '',
    titleAr: '',
    categoryFr: 'Cardiologie & Prévention',
    categoryAr: 'صحة القلب والوقاية',
    summaryFr: '',
    summaryAr: '',
    contentFr: '',
    contentAr: '',
    author: currentUser.name || 'Dr. Evrard Simplice NAMBOY',
    authorRole: currentUser.specialty || 'Médecin Praticien',
    readTime: '4 min',
    imageUrl: '/src/assets/images/hero_doctor_consultation_1790610946656.jpg',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleOpenNew = () => {
    setEditingPost(null);
    setFormData({
      id: `post_${Date.now()}`,
      titleFr: '',
      titleAr: '',
      categoryFr: 'Médecine Préventive',
      categoryAr: 'الطب الوقائي',
      summaryFr: '',
      summaryAr: '',
      contentFr: '',
      contentAr: '',
      author: currentUser.name || 'Dr. Evrard Simplice NAMBOY',
      authorRole: currentUser.specialty || 'Médecin Directeur',
      readTime: '4 min',
      imageUrl: '/src/assets/images/hero_doctor_consultation_1790610946656.jpg',
    });
    setErrorMsg('');
    setViewMode('editor');
  };

  const handleOpenEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({ ...post });
    setErrorMsg('');
    setViewMode('editor');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMsg('');
    try {
      const url = await uploadImage(file, 'blog_covers');
      setFormData(prev => ({ ...prev, imageUrl: url }));
      showToast('Illustration d’article téléversée avec succès.');
    } catch (err: any) {
      setErrorMsg("Échec du téléversement de l'image.");
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titleFr?.trim() && !formData.titleAr?.trim()) {
      setErrorMsg('Veuillez renseigner le titre de l’article.');
      return;
    }

    setIsSaving(true);
    setErrorMsg('');
    try {
      const finalPost: BlogPost = {
        id: formData.id || `post_${Date.now()}`,
        titleFr: formData.titleFr?.trim() || formData.titleAr || '',
        titleAr: formData.titleAr?.trim() || formData.titleFr || '',
        categoryFr: formData.categoryFr || 'Santé Générale',
        categoryAr: formData.categoryAr || 'صحة عامة',
        summaryFr: formData.summaryFr?.trim() || 'Conseil médical du cabinet.',
        summaryAr: formData.summaryAr?.trim() || 'نصيحة طبية من العيادة.',
        contentFr: formData.contentFr?.trim() || formData.summaryFr || '',
        contentAr: formData.contentAr?.trim() || formData.summaryAr || '',
        author: formData.author?.trim() || currentUser.name,
        authorRole: formData.authorRole?.trim() || 'Équipe Dr. NAMBOY',
        date: formData.date || new Date().toISOString().split('T')[0],
        readTime: formData.readTime || '4 min',
        imageUrl: formData.imageUrl || '/src/assets/images/hero_doctor_consultation_1790610946656.jpg',
      };

      await saveBlogPost(finalPost);

      if (onPublishArticle) {
        onPublishArticle(finalPost);
      }

      showToast(editingPost ? 'Article mis à jour avec succès !' : 'Nouvel article publié avec succès !');
      setViewMode('list');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Erreur lors de la publication');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBlogPost(id);
      setIsDeletingId(null);
      showToast('Article supprimé avec succès.');
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
            {language === 'ar' ? 'إدارة المقالات والنصائح الطبية' : 'Blog & Conseils Médicaux'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {language === 'ar'
              ? 'كتابة، نشر، وتعديل المقالات التوعوية والإرشادات الطبية للمرضى.'
              : 'Rédigez, publiez, modifiez ou supprimez les articles de santé publique visibles sur le site.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {viewMode === 'editor' ? (
            <button
              onClick={() => setViewMode('list')}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{language === 'ar' ? 'العودة للقائمة' : 'Voir la liste'}</span>
            </button>
          ) : (
            <button
              onClick={handleOpenNew}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'ar' ? 'مقال طبي جديد' : 'Rédiger un article'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs sm:text-sm font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* VIEW MODE 1: LIST OF ARTICLES */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Articles Publiés ({blogPosts.length})
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-16/9 bg-slate-100 overflow-hidden">
                    <img
                      src={post.imageUrl || '/src/assets/images/hero_doctor_consultation_1790610946656.jpg'}
                      alt={post.titleFr}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-purple-600/90 text-white text-[10px] font-bold shadow-xs">
                      {language === 'ar' ? post.categoryAr : post.categoryFr}
                    </span>
                    <span className="absolute bottom-3 left-3 text-[11px] text-slate-200 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{post.readTime || '4 min'}</span>
                    </span>
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                      {language === 'ar' ? post.titleAr : post.titleFr}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {language === 'ar' ? post.summaryAr : post.summaryFr}
                    </p>
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="font-semibold text-slate-700">{post.author}</span>
                      <span>{post.date}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleOpenEdit(post)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'تعديل' : 'Modifier'}</span>
                  </button>

                  <button
                    onClick={() => setIsDeletingId(post.id)}
                    className="px-3 py-1.5 rounded-xl border border-red-200 bg-white hover:bg-red-50 text-red-600 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'حذف' : 'Supprimer'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW MODE 2: FORM EDITOR */}
      {viewMode === 'editor' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-5 h-5 text-purple-600" />
              <h3 className="text-base font-bold text-slate-900">
                {editingPost ? 'Modifier l’Article' : 'Rédiger un Nouvel Article Médical'}
              </h3>
            </div>
            <span className="text-xs text-purple-600 font-bold px-3 py-1 rounded-full bg-purple-50">
              {language === 'ar' ? 'نشر مباشر' : 'Publication Directe'}
            </span>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Titles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold uppercase text-slate-600 block mb-1.5">
                  Titre de l’article (Français) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.titleFr || ''}
                  onChange={(e) => setFormData({ ...formData, titleFr: e.target.value })}
                  placeholder="ex: L'importance vitale d'un ECG lors de douleurs thoraciques"
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-600 block mb-1.5">
                  عنوان المقال الطبي (العربية) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.titleAr || ''}
                  onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                  placeholder="مثال: الأهمية الحيوية لتخطيط القلب الفوري عند الشعور بآلام في الصدر"
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-purple-500 focus:outline-hidden text-right"
                />
              </div>
            </div>

            {/* Categories & Read time */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="text-xs font-bold uppercase text-slate-600 block mb-1.5">
                  Catégorie (Français)
                </label>
                <input
                  type="text"
                  value={formData.categoryFr || ''}
                  onChange={(e) => setFormData({ ...formData, categoryFr: e.target.value })}
                  placeholder="Cardiologie & Prévention"
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-600 block mb-1.5">
                  التصنيف (العربية)
                </label>
                <input
                  type="text"
                  value={formData.categoryAr || ''}
                  onChange={(e) => setFormData({ ...formData, categoryAr: e.target.value })}
                  placeholder="صحة القلب والوقاية"
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm text-right"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-600 block mb-1.5">
                  Temps de Lecture Estimé
                </label>
                <input
                  type="text"
                  value={formData.readTime || '4 min'}
                  onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                  placeholder="4 min"
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm"
                />
              </div>
            </div>

            {/* Summaries */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold uppercase text-slate-600 block mb-1.5">
                  Résumé d'introduction (Français)
                </label>
                <textarea
                  rows={3}
                  value={formData.summaryFr || ''}
                  onChange={(e) => setFormData({ ...formData, summaryFr: e.target.value })}
                  placeholder="Bref aperçu affiché dans les cartes de conseils..."
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-600 block mb-1.5">
                  الملخص التمهيدي (العربية)
                </label>
                <textarea
                  rows={3}
                  value={formData.summaryAr || ''}
                  onChange={(e) => setFormData({ ...formData, summaryAr: e.target.value })}
                  placeholder="ملخص يظهر في بطاقات النصائح الطبية..."
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-purple-500 focus:outline-hidden text-right"
                />
              </div>
            </div>

            {/* Full Body Content */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-slate-600 block mb-1.5">
                  Contenu Médical Détaillé (Français)
                </label>
                <textarea
                  rows={6}
                  value={formData.contentFr || ''}
                  onChange={(e) => setFormData({ ...formData, contentFr: e.target.value })}
                  placeholder="Corps complet de l'article, explications médicales, recommandations..."
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-600 block mb-1.5">
                  المحتوى الطبي المفصل (العربية)
                </label>
                <textarea
                  rows={6}
                  value={formData.contentAr || ''}
                  onChange={(e) => setFormData({ ...formData, contentAr: e.target.value })}
                  placeholder="المحتوى الكامل للمقال والنصائح الطبية للمرضى..."
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-purple-500 focus:outline-hidden text-right"
                />
              </div>
            </div>

            {/* Image Cover Uploader & Gallery Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-600 block">
                Image de Couverture de l’Article
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="w-28 h-20 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 shrink-0">
                  {formData.imageUrl ? (
                    <img src={formData.imageUrl} alt="Cover" className="w-full h-full object-cover" />
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
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-50 border border-purple-200 hover:bg-purple-100 text-xs font-bold text-purple-700 cursor-pointer shadow-2xs transition-colors"
                    >
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <span>Catalogue Photos HD</span>
                    </button>

                    <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-xs font-bold text-slate-700 cursor-pointer shadow-2xs transition-colors">
                      {isUploading ? (
                        <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
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
                    Sélectionnez une photo officielle ou importez un nouveau visuel.
                  </p>
                </div>
              </div>
            </div>

            {/* Author info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div>
                <label className="text-xs font-bold uppercase text-slate-600 block mb-1">
                  Auteur de l'article
                </label>
                <input
                  type="text"
                  value={formData.author || ''}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="Dr. Evrard Simplice NAMBOY"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-600 block mb-1">
                  Titre professionnel de l'auteur
                </label>
                <input
                  type="text"
                  value={formData.authorRole || ''}
                  onChange={(e) => setFormData({ ...formData, authorRole: e.target.value })}
                  placeholder="Médecin Urgentiste & Praticien"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white"
                />
              </div>
            </div>

            {/* Form Action Buttons */}
            <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSaving || isUploading}
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm cursor-pointer"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>{isSaving ? 'Publication...' : 'Publier l’article'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete confirmation modal */}
      {isDeletingId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                Supprimer cet article ?
              </h3>
              <p className="text-xs text-slate-500">
                Cet article sera définitivement retiré du blog.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setIsDeletingId(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(isDeletingId)}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs cursor-pointer shadow-xs"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Picker Modal */}
      <ImagePickerModal
        isOpen={isImagePickerOpen}
        onClose={() => setIsImagePickerOpen(false)}
        currentImage={formData.imageUrl}
        title="Sélectionner l’image de couverture de l’article"
        onSelectImage={(url) => {
          setFormData((prev) => ({ ...prev, imageUrl: url }));
        }}
      />
    </div>
  );
};
