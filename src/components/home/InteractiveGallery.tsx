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

/* Durée d'affichage de chaque photo (ms) */
const AUTOPLAY_DURATION = 4500;
/* Distance minimale (px) pour déclencher un swipe */
const SWIPE_THRESHOLD = 50;

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
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'cinema' | 'grid'>('cinema');

  /* ---------------- AUTOPLAY : démarre tout seul ---------------- */
  const [isPlaying, setIsPlaying] = useState(true); // ✅ actif par défaut
  const [inView, setInView] = useState(false); // galerie visible à l'écran
  const [tabVisible, setTabVisible] = useState(true); // onglet actif
  const [interacting, setInteracting] = useState(false); // survol / doigt posé

  const rootRef = useRef<HTMLDivElement | null>(null);
  const thumbnailStripRef = useRef<HTMLDivElement | null>(null);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);

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

  /* Le diaporama tourne seulement si tout est réuni */
  const running =
    isPlaying &&
    !reduced &&
    inView &&
    tabVisible &&
    !interacting &&
    total > 1 &&
    lightboxIndex === null &&
    viewMode === 'cinema';

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
  /* Détection : galerie visible + onglet actif                          */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onVisibility = () => setTabVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  /* ------------------------------------------------------------------ */
  /* Timer auto-play                                                     */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (!running) return;
    const id = setTimeout(() => {
      setFeaturedIndex((p) => (p + 1) % total);
    }, AUTOPLAY_DURATION);
    return () => clearTimeout(id);
  }, [running, featuredIndex, total]);

  /* ------------------------------------------------------------------ */
  /* Pellicule : scroll horizontal uniquement (la page ne bouge pas)     */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    const container = thumbnailStripRef.current;
    if (!container) return;

    const activeEl = container.querySelector<HTMLElement>(
      `[data-thumb-idx="${featuredIndex}"]`,
    );
    if (!activeEl) return;

    const containerRect = container.getBoundingClientRect();
    const elRect = activeEl.getBoundingClientRect();
    const isFullyVisible =
      elRect.left >= containerRect.left && elRect.right <= containerRect.right;
    if (isFullyVisible) return;

    container.scrollTo({
      left: activeEl.offsetLeft - container.clientWidth / 2 + activeEl.clientWidth / 2,
      behavior: reduced ? 'auto' : 'smooth',
    });
  }, [featuredIndex, reduced]);

  /* ------------------------------------------------------------------ */
  /* Swipe + clic sur la scène principale                                */
  /* ------------------------------------------------------------------ */
  const onStagePointerDown = (e: React.PointerEvent) => {
    pointerStart.current = { x: e.clientX, y: e.clientY };
    if (e.pointerType !== 'mouse') setInteracting(true);
  };

  const onStagePointerUp = (e: React.PointerEvent) => {
    const start = pointerStart.current;
    pointerStart.current = null;
    if (e.pointerType !== 'mouse') setInteracting(false);
    if (!start) return;

    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;

    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
      const forward = isRtl ? dx > 0 : dx < 0;
      forward ? next() : prev();
      return;
    }

    /* Simple clic (hors boutons) : ouvre le plein écran */
    if (Math.abs(dx) < 8 && Math.abs(dy) < 8) {
      if ((e.target as HTMLElement).closest('button')) return;
      openLightbox(featuredIndex);
    }
  };

  const onStageKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') isRtl ? next() : prev();
    if (e.key === 'ArrowRight') isRtl ? prev() : next();
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openLightbox(featuredIndex);
    }
  };

  /* ------------------------------------------------------------------ */
  /* Lightbox                                                            */
  /* ------------------------------------------------------------------ */
  const openLightbox = (idx: number) => setLightboxIndex(idx);
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

  /* Bloque le scroll de la page quand le plein écran est ouvert */
  useEffect(() => {
    if (lightboxIndex === null) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [lightboxIndex]);

  /* Swipe dans la lightbox */
  const lbStart = useRef<number | null>(null);
  const onLbPointerDown = (e: React.PointerEvent) => {
    lbStart.current = e.clientX;
  };
  const onLbPointerUp = (e: React.PointerEvent) => {
    if (lbStart.current === null) return;
    const dx = e.clientX - lbStart.current;
    lbStart.current = null;
    if (Math.abs(dx) > SWIPE_THRESHOLD) {
      const forward = isRtl ? dx > 0 : dx < 0;
      forward ? lightboxNext() : lightboxPrev();
    }
  };

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
        return language === 'ar' ? 'مستعجلات وعلاجات' : 'Soins & Urgences';
      case 'team':
        return language === 'ar' ? 'الطاقم الطبي' : 'Équipe Soignante';
      default:
        return language === 'ar' ? 'العيادة' : 'Cabinet';
    }
  };

  const getName = (img: OfficialImage) => (language === 'ar' ? img.nameAr : img.nameFr);
  const currentLightboxImage = lightboxIndex !== null ? filteredImages[lightboxIndex] : null;

  return (
    <div
      ref={rootRef}
      dir={isRtl ? 'rtl' : 'ltr'}
      className="relative mx-auto max-w-7xl space-y-6 px-4 sm:space-y-8 sm:px-6 lg:px-8"
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

        <h3 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
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
      <div className="space-y-4">
        {/* Filtres : défilement horizontal sur mobile, centrés sur desktop */}
        <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max items-center gap-2 sm:w-auto sm:flex-wrap sm:justify-center">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  aria-pressed={isActive}
                  className={`inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-bold transition-colors duration-200 sm:px-4 sm:py-2.5 sm:text-sm ${
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
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-4">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-500">
            <Camera className="h-3.5 w-3.5 text-blue-600" />
            {total} {language === 'ar' ? 'صورة' : total > 1 ? 'photos' : 'photo'}
          </span>

          <div className="flex items-center gap-2">
            {viewMode === 'cinema' && (
              <button
                onClick={() => setIsPlaying((v) => !v)}
                disabled={total <= 1 || !!reduced}
                aria-pressed={isPlaying}
                className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-40 sm:px-3.5 sm:text-sm ${
                  isPlaying && !reduced
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/25'
                    : 'border border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
              >
                {isPlaying && !reduced ? (
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
                      {language === 'ar' ? 'تشغيل' : 'Lecture'}
                    </span>
                  </>
                )}
              </button>
            )}

            <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1">
              <button
                onClick={() => setViewMode('cinema')}
                aria-label={language === 'ar' ? 'عرض سينمائي' : 'Vue cinéma'}
                aria-pressed={viewMode === 'cinema'}
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
                aria-label={language === 'ar' ? 'عرض شبكي' : 'Vue grille'}
                aria-pressed={viewMode === 'grid'}
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
      {/* ÉTAT VIDE                                                    */}
      {/* ============================================================ */}
      {total === 0 && (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm font-semibold text-slate-500">
          {language === 'ar' ? 'لا توجد صور في هذه الفئة.' : 'Aucune photo dans cette catégorie.'}
        </div>
      )}

      {/* ============================================================ */}
      {/* MODE CINÉMA                                                  */}
      {/* ============================================================ */}
      {viewMode === 'cinema' && featured && (
        <div className="space-y-3 sm:space-y-4">
          <div
            tabIndex={0}
            role="group"
            aria-roledescription="carousel"
            aria-label={language === 'ar' ? 'معرض الصور' : 'Galerie photos'}
            onKeyDown={onStageKeyDown}
            onPointerDown={onStagePointerDown}
            onPointerUp={onStagePointerUp}
            onPointerCancel={() => {
              pointerStart.current = null;
              setInteracting(false);
            }}
            onPointerEnter={(e) => e.pointerType === 'mouse' && setInteracting(true)}
            onPointerLeave={(e) => e.pointerType === 'mouse' && setInteracting(false)}
            onFocus={() => setInteracting(true)}
            onBlur={() => setInteracting(false)}
            style={{ touchAction: 'pan-y' }}
            className="group relative w-full cursor-zoom-in select-none overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-950 shadow-xl outline-none focus-visible:ring-4 focus-visible:ring-blue-500/40 sm:rounded-3xl"
          >
            <div className="relative aspect-[4/3] w-full sm:aspect-[16/10] lg:aspect-[16/8]">
              {/* Fond flouté : remplit l'espace autour de l'image sans la couper */}
              <AnimatePresence>
                <motion.div
                  key={`bg-${featured.url}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.55 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  aria-hidden
                  className="absolute inset-0 scale-110 bg-cover bg-center blur-2xl"
                  style={{ backgroundImage: `url("${encodeURI(featured.url)}")` }}
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-slate-950/40" />

              {/* Images en fondu enchaîné, entières (object-contain) */}
              {filteredImages.map((img, idx) => {
                const isActive = idx === featuredIndex;
                return (
                  <img
                    key={img.id || idx}
                    src={encodeURI(img.url)}
                    alt={getName(img)}
                    loading={idx === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                    draggable={false}
                    aria-hidden={!isActive}
                    className="absolute inset-0 h-full w-full object-contain p-1.5 transition-opacity duration-700 ease-in-out sm:p-4"
                    style={{ opacity: isActive ? 1 : 0, willChange: 'opacity' }}
                  />
                );
              })}

              {/* Dégradé bas */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

              {/* Badges haut gauche */}
              <div className="absolute start-3 top-3 z-10 flex flex-wrap items-center gap-2 sm:start-4 sm:top-4">
                <span className="rounded-full border border-white/20 bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm backdrop-blur-sm sm:px-3 sm:text-[11px]">
                  {getCategoryBadgeLabel(featured.category)}
                </span>
                {running && (
                  <span className="hidden items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-500/25 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-100 shadow-sm backdrop-blur-sm sm:inline-flex">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    </span>
                    {language === 'ar' ? 'عرض تلقائي' : 'Diaporama'}
                  </span>
                )}
              </div>

              {/* Compteur + plein écran haut droite */}
              <div className="absolute end-3 top-3 z-10 flex items-center gap-2 sm:end-4 sm:top-4" dir="ltr">
                <span className="rounded-full border border-white/20 bg-slate-900/70 px-2.5 py-1 font-mono text-[10px] font-bold tracking-widest text-white backdrop-blur-sm sm:px-3 sm:text-[11px]">
                  {String(featuredIndex + 1).padStart(2, '0')}
                  <span className="text-white/40"> / {String(total).padStart(2, '0')}</span>
                </span>
                <button
                  onClick={() => openLightbox(featuredIndex)}
                  aria-label={language === 'ar' ? 'تكبير' : 'Agrandir'}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-slate-900/70 text-white backdrop-blur-sm transition-colors hover:bg-blue-600 sm:h-9 sm:w-9"
                >
                  <Maximize2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
              </div>

              {/* Titre */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-4 pb-5 sm:p-6 sm:pb-7 lg:p-8">
                <h4 className="line-clamp-2 text-base font-black tracking-tight text-white drop-shadow-lg sm:text-xl lg:text-3xl">
                  {getName(featured)}
                </h4>
                <p className="mt-1 hidden text-xs font-medium text-sky-200/90 sm:block sm:text-sm">
                  Cabinet Médical Dr. NAMBOY • Salé Bettana
                </p>
              </div>

              {/* Flèches : toujours visibles sur mobile, au survol sur desktop */}
              {total > 1 && (
                <>
                  <button
                    onClick={() => (isRtl ? next() : prev())}
                    aria-label={language === 'ar' ? 'السابق' : 'Précédent'}
                    className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-slate-900/60 text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-blue-600 active:scale-95 md:left-4 md:h-11 md:w-11 md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => (isRtl ? prev() : next())}
                    aria-label={language === 'ar' ? 'التالي' : 'Suivant'}
                    className="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-slate-900/60 text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-blue-600 active:scale-95 md:right-4 md:h-11 md:w-11 md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              {/* Barre de progression : se remet à zéro à chaque photo et se met en pause avec le survol */}
              {isPlaying && !reduced && total > 1 && (
                <div className="absolute inset-x-0 bottom-0 z-20 h-1 bg-white/10" dir="ltr">
                  <motion.div
                    key={`progress-${featuredIndex}-${running}`}
                    initial={{ width: '0%' }}
                    animate={{ width: running ? '100%' : '0%' }}
                    transition={{
                      duration: running ? AUTOPLAY_DURATION / 1000 : 0,
                      ease: 'linear',
                    }}
                    className="h-full bg-gradient-to-r from-blue-500 via-sky-400 to-cyan-400"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Pellicule */}
          {total > 1 && (
            <div
              ref={thumbnailStripRef}
              className="relative -mx-4 flex snap-x snap-mandatory items-center gap-2 overflow-x-auto overscroll-x-contain px-4 pb-2 [scrollbar-width:thin] sm:mx-0 sm:px-0"
            >
              {filteredImages.map((img, idx) => {
                const isActive = idx === featuredIndex;
                return (
                  <button
                    key={img.id || idx}
                    data-thumb-idx={idx}
                    onClick={() => goTo(idx)}
                    aria-label={getName(img)}
                    aria-current={isActive}
                    className={`group relative h-14 w-20 shrink-0 snap-center overflow-hidden rounded-lg border-2 transition-all duration-300 sm:h-[72px] sm:w-28 sm:rounded-xl lg:h-20 lg:w-32 ${
                      isActive
                        ? 'border-blue-600 shadow-lg shadow-blue-500/30'
                        : 'border-slate-200 opacity-70 hover:border-slate-300 hover:opacity-100'
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
      {viewMode === 'grid' && total > 0 && (
        <div className="grid grid-flow-dense grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {filteredImages.map((img, idx) => (
            <button
              key={img.id || idx}
              onClick={() => openLightbox(idx)}
              aria-label={getName(img)}
              className={`group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-950 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl ${
                idx === 0 && total > 4
                  ? 'col-span-2 row-span-2 aspect-square sm:aspect-auto'
                  : 'aspect-square'
              }`}
            >
              <img
                src={encodeURI(img.url)}
                alt={getName(img)}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent opacity-70 transition-opacity group-hover:opacity-95" />

              <div className="absolute start-2.5 top-2.5 z-10">
                <span className="rounded-lg border border-white/20 bg-slate-900/80 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur-sm sm:text-[10px]">
                  {getCategoryBadgeLabel(img.category)}
                </span>
              </div>

              <div className="absolute inset-0 hidden items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:flex">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl transition-transform group-hover:scale-110">
                  <Maximize2 className="h-4 w-4" />
                </div>
              </div>

              <div className="absolute inset-x-0 bottom-0 z-10 p-3 text-start">
                <h4 className="line-clamp-2 text-xs font-bold text-white drop-shadow-md sm:text-sm">
                  {getName(img)}
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
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 p-0 backdrop-blur-md sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex h-full max-h-none w-full max-w-5xl flex-col overflow-hidden bg-slate-900 shadow-2xl sm:h-auto sm:max-h-[92vh] sm:rounded-3xl sm:border sm:border-white/10"
            >
              <div className="z-20 flex items-center justify-between border-b border-slate-800 bg-slate-900 p-3 text-white sm:p-4">
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-blue-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
                    {getCategoryBadgeLabel(currentLightboxImage.category)}
                  </span>
                  <span className="text-xs font-semibold text-slate-400" dir="ltr">
                    {lightboxIndex! + 1} / {total}
                  </span>
                </div>

                <button
                  onClick={closeLightbox}
                  aria-label={language === 'ar' ? 'إغلاق' : 'Fermer'}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-white transition-colors hover:bg-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div
                onPointerDown={onLbPointerDown}
                onPointerUp={onLbPointerUp}
                style={{ touchAction: 'pan-y' }}
                className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-black p-2 sm:min-h-[300px]"
              >
                <img
                  key={currentLightboxImage.url}
                  src={encodeURI(currentLightboxImage.url)}
                  alt={getName(currentLightboxImage)}
                  draggable={false}
                  className="max-h-full w-auto max-w-full rounded-lg object-contain shadow-2xl sm:max-h-[68vh]"
                />

                {total > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        isRtl ? lightboxNext() : lightboxPrev();
                      }}
                      aria-label={language === 'ar' ? 'السابق' : 'Précédent'}
                      className="absolute left-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-slate-900/80 text-white shadow-xl transition-all hover:bg-blue-600 sm:left-3 sm:h-11 sm:w-11"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        isRtl ? lightboxPrev() : lightboxNext();
                      }}
                      aria-label={language === 'ar' ? 'التالي' : 'Suivant'}
                      className="absolute right-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-slate-900/80 text-white shadow-xl transition-all hover:bg-blue-600 sm:right-3 sm:h-11 sm:w-11"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>

              <div className="border-t border-slate-800 bg-slate-900 p-3 text-white sm:p-4">
                <h4 className="text-sm font-bold text-white sm:text-lg">
                  {getName(currentLightboxImage)}
                </h4>
                <p className="text-xs text-slate-400">Cabinet Médical Dr. NAMBOY • Salé Bettana</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};