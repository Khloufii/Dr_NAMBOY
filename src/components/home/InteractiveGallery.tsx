import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useSiteContent } from '../../context/SiteContentContext';
import { OFFICIAL_IMAGES, OfficialImage } from '../../data/officialImages';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Maximize2,
  Sparkles,
  X,
  Stethoscope,
  Building2,
  ShieldAlert,
  Cpu,
  Camera,
  Grid3x3,
  GalleryHorizontalEnd,
} from 'lucide-react';

const AUTOPLAY_DURATION = 4500;

export const InteractiveGallery: React.FC = () => {
  const { t, language, isRtl } = useLanguage();
  const { siteInfo } = useSiteContent();
  const reduced = useReducedMotion();

  const allImages: OfficialImage[] = useMemo(
    () =>
      (siteInfo as any).galleryItems && (siteInfo as any).galleryItems.length > 0
        ? (siteInfo as any).galleryItems
        : OFFICIAL_IMAGES.filter((img) => img.category !== 'logo'),
    [siteInfo],
  );

  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'cinema' | 'grid'>('cinema');
  const thumbnailStripRef = useRef<HTMLDivElement | null>(null);

  const categories = [
    { id: 'ALL', labelFr: 'Toutes les photos', labelAr: 'جميع الصور', icon: Sparkles },
    { id: 'hero', labelFr: 'Locaux & Façade', labelAr: 'المبنى والافتة', icon: Building2 },
    { id: 'equipment', labelFr: 'Équipements HD', labelAr: 'التجهيزات الطبية', icon: Cpu },
    { id: 'doctor', labelFr: 'Dr. NAMBOY & Consultations', labelAr: 'الدكتور والاستشارات', icon: Stethoscope },
    { id: 'service', labelFr: 'Urgences & Soins', labelAr: 'المستعجلات والعلاجات', icon: ShieldAlert },
  ];

  const filteredImages = useMemo(
    () =>
      activeCategory === 'ALL'
        ? allImages
        : allImages.filter((img) => img.category === activeCategory),
    [activeCategory, allImages],
  );

  const total = filteredImages.length;
  const featured = filteredImages[featuredIndex] ?? filteredImages[0];

  useEffect(() => {
    setFeaturedIndex(0);
  }, [activeCategory]);

  /* ------------------------------------------------------------------ */
  /* Navigation                                                          */
  /* ------------------------------------------------------------------ */
  const goTo = useCallback(
    (idx: number) => {
      if (total === 0) return;
      setFeaturedIndex(((idx % total) + total) % total);
    },
    [total],
  );

  const next = useCallback(() => goTo(featuredIndex + 1), [featuredIndex, goTo]);
  const prev = useCallback(() => goTo(featuredIndex - 1), [featuredIndex, goTo]);

  /* ------------------------------------------------------------------ */
  /* Auto-play                                                           */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (!isPlaying || reduced || total <= 1 || lightboxIndex !== null) return;
    const timer = setInterval(() => {
      setFeaturedIndex((p) => (p + 1) % total);
    }, AUTOPLAY_DURATION);
    return () => clearInterval(timer);
  }, [isPlaying, reduced, total, lightboxIndex]);

  /* ------------------------------------------------------------------ */
  /* Scroll de la pellicule SANS bouger la page                          */
  /* Utilise scrollTo horizontal uniquement sur le conteneur             */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    const container = thumbnailStripRef.current;
    if (!container) return;

    const activeEl = container.querySelector<HTMLElement>(
      `[data-thumb-idx="${featuredIndex}"]`,
    );
    if (!activeEl) return;

    /* Vérifie si la miniature est déjà visible dans le conteneur */
    const containerRect = container.getBoundingClientRect();
    const elRect = activeEl.getBoundingClientRect();

    const isFullyVisible =
      elRect.left >= containerRect.left && elRect.right <= containerRect.right;

    if (isFullyVisible) return;

    /* Scroll horizontal uniquement : jamais la page entière */
    const targetScrollLeft =
      activeEl.offsetLeft - container.clientWidth / 2 + activeEl.clientWidth / 2;

    container.scrollTo({
      left: targetScrollLeft,
      behavior: reduced ? 'auto' : 'smooth',
    });
  }, [featuredIndex, reduced]);

  /* ------------------------------------------------------------------ */
  /* Lightbox                                                            */
  /* ------------------------------------------------------------------ */
  const openLightbox = (idx: number) => {
    setLightboxIndex(idx);
    setIsPlaying(false);
  };

  const closeLightbox = () => setLightboxIndex(null);

  const lightboxNext = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % total);
  }, [lightboxIndex, total]);

  const lightboxPrev = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + total) % total);
  }, [lightboxIndex, total]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') isRtl ? lightboxNext() : lightboxPrev();
      if (e.key === 'ArrowRight') isRtl ? lightboxPrev() : lightboxNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIndex, isRtl, lightboxNext, lightboxPrev]);

  /* ------------------------------------------------------------------ */
  /* Helpers                                                             */
  /* ------------------------------------------------------------------ */
  const getCategoryBadgeLabel = (cat: string) => {
    switch (cat) {
      case 'hero':
        return language === 'ar' ? 'الافتة والمبنى' : 'Locaux & Façade';
      case 'equipment':
        return language === 'ar' ? 'تجهيزات HD' : 'Équipement HD';
      case 'doctor':
        return language === 'ar' ? 'الدكتور نامبوي' : 'Dr. NAMBOY';
      case 'service':
        return language === 'ar' ? 'مستعجلات وصوان' : 'Soins & Urgences';
      case 'team':
        return language === 'ar' ? 'الطاقم الطبي' : 'Équipe Soignante';
      default:
        return language === 'ar' ? 'العيادة' : 'Cabinet';
    }
  };

  const currentLightboxImage = lightboxIndex !== null ? filteredImages[lightboxIndex] : null;

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="relative mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8"
    >
      {/* ============================================================ */}
      {/* HEADER                                                       */}
      {/* ============================================================ */}
      <div className="mx-auto max-w-3xl space-y-3 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-gradient-to-r from-blue-50 to-sky-50 px-4 py-1.5 shadow-sm">
          <Camera className="h-3.5 w-3.5 text-blue-600" />
          <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-blue-700">
            {language === 'ar' ? 'معرض الصور الطبية' : 'Galerie Photos du Cabinet'}
          </span>
        </div>

        <h3 className="text-2xl font-black tracking-tight text-slate-900 sm:text-4xl">
          {t.about.galleryTitle || 'Découvrez Nos Installations & Équipements'}
        </h3>

        <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
          {t.about.gallerySubtitle ||
            'Explorez en images le cadre accueillant et le plateau technique du Cabinet Dr. NAMBOY.'}
        </p>
      </div>

      {/* ============================================================ */}
      {/* FILTRES + CONTRÔLES                                          */}
      {/* ============================================================ */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`inline-flex items-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-bold transition-colors duration-200 sm:px-4 sm:py-2.5 sm:text-sm ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                    : 'border border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-blue-600'}`} />
                <span>{language === 'ar' ? cat.labelAr : cat.labelFr}</span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5">
              <Camera className="h-3.5 w-3.5 text-blue-600" />
              <span>
                {total} {language === 'ar' ? 'صورة' : total > 1 ? 'photos' : 'photo'}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying((v) => !v)}
              disabled={total <= 1}
              className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-40 sm:text-sm ${
                isPlaying
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/25'
                  : 'border border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {language === 'ar' ? 'إيقاف' : 'Pause'}
                  </span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {language === 'ar' ? 'عرض تلقائي' : 'Diaporama'}
                  </span>
                </>
              )}
            </button>

            <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1">
              <button
                onClick={() => setViewMode('cinema')}
                aria-label="Vue cinéma"
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                  viewMode === 'cinema'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                }`}
              >
                <GalleryHorizontalEnd className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                aria-label="Vue grille"
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                }`}
              >
                <Grid3x3 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* MODE CINÉMA                                                  */}
      {/* ============================================================ */}
      {viewMode === 'cinema' && featured && (
        <div className="space-y-4">
          {/* Image principale — image entièrement visible */}
          <div className="group relative w-full overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-950 shadow-xl">
            {/* Conteneur d'image avec hauteur adaptative */}
            <div className="relative flex h-[320px] w-full items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 sm:h-[420px] lg:h-[520px]">
              {/* Image en object-contain : jamais coupée */}
              {filteredImages.map((img, idx) => {
                const isActive = idx === featuredIndex;
                return (
                  <img
                    key={img.id || idx}
                    src={encodeURI(img.url)}
                    alt={language === 'ar' ? img.nameAr : img.nameFr}
                    loading={idx === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                    draggable={false}
                    className="absolute inset-0 h-full w-full object-contain p-2 transition-opacity duration-700 ease-in-out sm:p-4"
                    style={{
                      opacity: isActive ? 1 : 0,
                      willChange: 'opacity',
                    }}
                  />
                );
              })}

              {/* Dégradé discret en bas pour la lisibilité du titre */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />

              {/* Badges haut gauche */}
              <div className="absolute left-4 top-4 z-10 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm backdrop-blur-sm">
                  {getCategoryBadgeLabel(featured.category)}
                </span>
                {isPlaying && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-500/25 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-100 shadow-sm backdrop-blur-sm">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    </span>
                    {language === 'ar' ? 'عرض تلقائي' : 'Diaporama'}
                  </span>
                )}
              </div>

              {/* Compteur haut droite */}
              <div className="absolute right-4 top-4 z-10">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-slate-900/70 px-3 py-1 font-mono text-[11px] font-bold tracking-widest text-white backdrop-blur-sm">
                  {String(featuredIndex + 1).padStart(2, '0')}
                  <span className="text-white/40">/ {String(total).padStart(2, '0')}</span>
                </span>
              </div>

              {/* Bouton plein écran */}
              <button
                onClick={() => openLightbox(featuredIndex)}
                aria-label="Agrandir"
                className="absolute right-4 top-16 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-slate-900/70 text-white opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-blue-600 group-hover:opacity-100"
              >
                <Maximize2 className="h-4 w-4" />
              </button>

              {/* Titre bas */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-6 sm:p-8">
                <h4 className="text-lg font-black tracking-tight text-white drop-shadow-lg sm:text-2xl lg:text-3xl">
                  {language === 'ar' ? featured.nameAr : featured.nameFr}
                </h4>
                <p className="mt-1 text-xs font-medium text-sky-200/90 sm:text-sm">
                  Cabinet Médical Dr. NAMBOY • Salé Bettana
                </p>
              </div>

              {/* Flèches */}
              {total > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      isRtl ? next() : prev();
                    }}
                    aria-label="Précédent"
                    className="absolute left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-slate-900/60 text-white opacity-0 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-blue-600 group-hover:opacity-100 active:scale-95"
                  >
                    {isRtl ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      isRtl ? prev() : next();
                    }}
                    aria-label="Suivant"
                    className="absolute right-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-slate-900/60 text-white opacity-0 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-blue-600 group-hover:opacity-100 active:scale-95"
                  >
                    {isRtl ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                  </button>
                </>
              )}

              {/* Barre de progression autoplay */}
              {isPlaying && total > 1 && !reduced && (
                <div className="absolute inset-x-0 bottom-0 z-20 h-1 bg-white/10">
                  <motion.div
                    key={`progress-${featuredIndex}`}
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: AUTOPLAY_DURATION / 1000, ease: 'linear' }}
                    className="h-full bg-gradient-to-r from-blue-500 via-sky-400 to-cyan-400"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Pellicule — scroll horizontal uniquement, ne bouge plus la page */}
          {total > 1 && (
            <div
              ref={thumbnailStripRef}
              className="flex snap-x snap-mandatory items-center gap-2 overflow-x-auto overscroll-x-contain pb-2 [scrollbar-width:thin]"
              style={{ scrollBehavior: 'smooth' }}
            >
              {filteredImages.map((img, idx) => {
                const isActive = idx === featuredIndex;
                return (
                  <button
                    key={img.id || idx}
                    data-thumb-idx={idx}
                    onClick={() => goTo(idx)}
                    className={`group relative h-16 w-24 shrink-0 snap-center overflow-hidden rounded-xl border-2 transition-all duration-300 sm:h-20 sm:w-32 ${
                      isActive
                        ? 'border-blue-600 shadow-lg shadow-blue-500/30'
                        : 'border-slate-200 opacity-70 hover:opacity-100 hover:border-slate-300'
                    }`}
                  >
                    <img
                      src={encodeURI(img.url)}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                    <div
                      className={`absolute inset-0 transition-opacity ${
                        isActive ? 'bg-transparent' : 'bg-slate-900/30 group-hover:bg-slate-900/10'
                      }`}
                    />
                    {isActive && (
                      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* MODE GRILLE                                                  */}
      {/* ============================================================ */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filteredImages.map((img, idx) => (
            <button
              key={img.id || idx}
              onClick={() => openLightbox(idx)}
              className="group relative aspect-square overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-950 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <img
                src={encodeURI(img.url)}
                alt={language === 'ar' ? img.nameAr : img.nameFr}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent opacity-70 transition-opacity group-hover:opacity-95" />

              <div className="absolute left-2.5 top-2.5 z-10">
                <span className="rounded-lg border border-white/20 bg-slate-900/80 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur-sm sm:text-[10px]">
                  {getCategoryBadgeLabel(img.category)}
                </span>
              </div>

              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl transition-transform group-hover:scale-110">
                  <Maximize2 className="h-4 w-4" />
                </div>
              </div>

              <div className="absolute inset-x-0 bottom-0 z-10 p-3 text-start">
                <h4 className="line-clamp-1 text-xs font-bold text-white drop-shadow-md sm:text-sm">
                  {language === 'ar' ? img.nameAr : img.nameFr}
                </h4>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* ============================================================ */}
      {/* LIGHTBOX                                                     */}
      {/* ============================================================ */}
      <AnimatePresence>
        {currentLightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeLightbox}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 p-3 backdrop-blur-md sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl sm:rounded-3xl"
            >
              <div className="z-20 flex items-center justify-between border-b border-slate-800 bg-slate-900 p-4 text-white">
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-blue-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
                    {getCategoryBadgeLabel(currentLightboxImage.category)}
                  </span>
                  <span className="hidden text-xs font-semibold text-slate-400 sm:inline">
                    {lightboxIndex! + 1} / {total}
                  </span>
                </div>

                <button
                  onClick={closeLightbox}
                  aria-label="Fermer"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-white transition-colors hover:bg-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="relative flex min-h-[300px] flex-1 items-center justify-center overflow-hidden bg-black p-2">
                <img
                  key={currentLightboxImage.url}
                  src={encodeURI(currentLightboxImage.url)}
                  alt={
                    language === 'ar'
                      ? currentLightboxImage.nameAr
                      : currentLightboxImage.nameFr
                  }
                  className="max-h-[68vh] w-auto max-w-full rounded-lg object-contain shadow-2xl"
                />

                {total > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        isRtl ? lightboxNext() : lightboxPrev();
                      }}
                      aria-label="Précédent"
                      className="absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-slate-900/80 text-white shadow-xl transition-all hover:bg-blue-600"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        isRtl ? lightboxPrev() : lightboxNext();
                      }}
                      aria-label="Suivant"
                      className="absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-slate-900/80 text-white shadow-xl transition-all hover:bg-blue-600"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>

              <div className="flex flex-col items-start justify-between gap-2 border-t border-slate-800 bg-slate-900 p-4 text-white sm:flex-row sm:items-center">
                <div>
                  <h4 className="text-base font-bold text-white sm:text-lg">
                    {language === 'ar'
                      ? currentLightboxImage.nameAr
                      : currentLightboxImage.nameFr}
                  </h4>
                  <p className="text-xs text-slate-400">
                    Cabinet Médical Dr. NAMBOY • Salé Bettana
                  </p>
                </div>
                <span className="text-xs font-medium text-sky-400 sm:hidden">
                  {lightboxIndex! + 1} / {total}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};