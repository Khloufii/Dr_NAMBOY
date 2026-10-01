import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useNavigation } from '../../context/NavigationContext';
import { useSiteContent } from '../../context/SiteContentContext';
import { AnimatePresence, motion, useReducedMotion, type Variants } from 'motion/react';
import {
  Activity,
  ArrowRight,
  Award,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  MessageSquare,
  Phone,
  Stethoscope,
} from 'lucide-react';

interface HeroSliderProps {
  onOpenBooking?: () => void;
}

const DEFAULT_SLIDES = [
  {
    image: '/images/WhatsApp Image 2026-09-28 at 16.46.00.jpeg',
    tagFr: 'Cabinet Médical Moderne à Salé Bettana',
    tagAr: 'عيادة طبية حديثة ومجهزة في سلا بطانة',
    descFr: 'Structure médicale complète, consultations de jour & urgences 24h/24',
    descAr: 'صرح طبي متكامل، استشارات نهارية ومستعجلات على مدار 24 ساعة',
    route: '/services',
  },
  {
    image: '/images/WhatsApp Image 2026-09-28 at 16.46.00 (3).jpeg',
    tagFr: 'Dr. NAMBOY Evrard Simplice',
    tagAr: 'الدكتور نامبوي إيفرارد سيمبليس',
    descFr: 'Médecin diplômé de Rabat en urgences, réanimation, échographie et gériatrie',
    descAr: 'طبيب خريج جامعة الرباط في المستعجلات، الإنعاش، الفحص بالصدى وطب الشيخوخة',
    route: '/a-propos',
  },
  {
    image: '/images/WhatsApp Image 2026-09-28 at 16.46.00 (1).jpeg',
    tagFr: 'Urgences Médicales & Garde 24h/24 et 7j/7',
    tagAr: 'مستعجلات طبية ومداومة 24/24 و7/7 أيام',
    descFr: 'Prise en charge immédiate, oxygénothérapie, perfusions et surveillance continue',
    descAr: 'تكفل فوري بالحالات الطارئة، علاج بالأكسجين، محاليل وريدية ومراقبة سريرية',
    route: '/services/emergency',
  },
  {
    image: '/images/WhatsApp Image 2026-09-28 at 16.46.02 (3).jpeg',
    tagFr: 'Plateau Technique & Échographie Doppler HD',
    tagAr: 'تجهيزات متطورة وفحص بالصدى عالي الدقة',
    descFr: 'Échographie abdominale, pelvienne, obstétrique et ECG numérique avec bilan immédiat',
    descAr: 'فحص بالصدى للبطن، الحوض، تتبع الحمل وتخطيط القلب مع تقرير فوري',
    route: '/services/imaging',
  },
  {
    image: '/images/WhatsApp Image 2026-09-28 at 16.46.01 (1).jpeg',
    tagFr: 'Secrétariat & Accueil des Patients',
    tagAr: 'مكتب الاستقبال والكتابة الطبية لخدمة المرضى',
    descFr: 'Accueil chaleureux, gestion des rendez-vous et accompagnement personnalisé',
    descAr: 'استقبال لائق، تنظيم المواعيد ومرافقة شخصية للمرضى',
    route: '/a-propos',
  },
];

/** Durée d'affichage d'un slide (ms) */
const SLIDE_DURATION = 6000;
/** Durée du fondu enchaîné (ms) */
const FADE_DURATION = 1200;
/** Durée du cycle complet de zoom (aller-retour) = 2 × SLIDE_DURATION */
const ZOOM_CYCLE = SLIDE_DURATION * 2;

/** Classes complètes (JIT Tailwind) */
const TONES: Record<string, string> = {
  blue: 'bg-blue-500/15 text-blue-300 ring-blue-400/30 group-hover:bg-blue-500 group-hover:text-white group-hover:ring-blue-400',
  emerald:
    'bg-emerald-500/15 text-emerald-300 ring-emerald-400/30 group-hover:bg-emerald-500 group-hover:text-white group-hover:ring-emerald-400',
  sky: 'bg-sky-500/15 text-sky-300 ring-sky-400/30 group-hover:bg-sky-500 group-hover:text-white group-hover:ring-sky-400',
  amber:
    'bg-amber-500/15 text-amber-300 ring-amber-400/30 group-hover:bg-amber-500 group-hover:text-white group-hover:ring-amber-400',
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export const HeroSlider: React.FC<HeroSliderProps> = ({ onOpenBooking }) => {
  const { t, language, isRtl } = useLanguage();
  const { navigate, navigateToBooking } = useNavigation();
  const { siteInfo } = useSiteContent();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const reduced = useReducedMotion();

  /* ------------------------------------------------------------------ */
  /* Slides dynamiques                                                   */
  /* ------------------------------------------------------------------ */
  const activeSlides = useMemo(() => {
    const images =
      siteInfo?.heroImages && siteInfo.heroImages.length > 0
        ? siteInfo.heroImages
        : DEFAULT_SLIDES.map((s) => s.image);

    return images.map((img: string, idx: number) => {
      const base = DEFAULT_SLIDES[idx % DEFAULT_SLIDES.length];
      return {
        image: img,
        tagFr: base.tagFr,
        tagAr: base.tagAr,
        descFr: base.descFr,
        descAr: base.descAr,
        route: base.route,
        /* Alterne le sens du zoom : pair = zoom avant, impair = zoom arrière */
        zoomDirection: (idx % 2 === 0 ? 'in' : 'out') as 'in' | 'out',
      };
    });
  }, [siteInfo?.heroImages]);

  const total = activeSlides.length;

  const goTo = useCallback(
    (idx: number) => setCurrentSlide(((idx % total) + total) % total),
    [total],
  );
  const next = useCallback(() => setCurrentSlide((p) => (p + 1) % total), [total]);
  const prev = useCallback(() => setCurrentSlide((p) => (p - 1 + total) % total), [total]);

  /* Sécurité index */
  useEffect(() => {
    if (currentSlide >= total) setCurrentSlide(0);
  }, [currentSlide, total]);

  /* Préchargement de toutes les images → supprime les micro-freezes */
  useEffect(() => {
    activeSlides.forEach((slide) => {
      const img = new Image();
      img.decoding = 'async';
      img.src = encodeURI(slide.image);
    });
  }, [activeSlides]);

  /* Autoplay */
  useEffect(() => {
    if (isPaused || reduced || total <= 1) return;
    const timer = setInterval(next, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [isPaused, next, reduced, total]);

  const currentInfo = activeSlides[currentSlide] ?? activeSlides[0];

  /* ------------------------------------------------------------------ */
  /* Contenus                                                            */
  /* ------------------------------------------------------------------ */
  const dynamicTitle =
    language === 'ar' ? siteInfo?.heroTitleAr || t.hero.title : siteInfo?.heroTitleFr || t.hero.title;
  const dynamicSubtitle =
    language === 'ar'
      ? siteInfo?.heroSubtitleAr || t.hero.subtitle
      : siteInfo?.heroSubtitleFr || t.hero.subtitle;

  const titleWords = dynamicTitle.split(' ');

  const cleanPhone = (siteInfo?.phoneMain || '+212770558299').replace(/\s+/g, '');
  const cleanWa = (siteInfo?.whatsappNumber || '212770558299').replace(/[^0-9]/g, '');
  const waLink = `https://wa.me/${cleanWa}?text=Bonjour%20Dr.%20NAMBOY,%20je%20souhaite%20prendre%20un%20renseignement%20ou%20un%20rendez-vous`;

  const handleBooking = useCallback(() => {
    if (onOpenBooking) onOpenBooking();
    else navigateToBooking();
  }, [onOpenBooking, navigateToBooking]);

  const stats = [
    {
      icon: Clock,
      tone: 'blue',
      value: '24h / 7j',
      label: language === 'ar' ? 'مستعجلات سلا' : 'Urgences Salé',
      route: '/services/emergency',
    },
    {
      icon: Award,
      tone: 'emerald',
      value: t.hero.statExp,
      label: language === 'ar' ? 'شهادات الرباط' : 'Diplômes Rabat',
      route: '/a-propos',
    },
    {
      icon: Activity,
      tone: 'sky',
      value: language === 'ar' ? 'الفحص بالصدى' : 'Échographie',
      label: language === 'ar' ? 'تخطيط القلب بالعيادة' : 'ECG sur place',
      route: '/services/imaging',
    },
    {
      icon: Stethoscope,
      tone: 'amber',
      value: t.hero.statTeam,
      label: language === 'ar' ? 'العلاجات التمريضية' : 'Soins infirmiers',
      route: '/a-propos',
    },
  ];

  return (
    <section
      id="hero"
      dir={isRtl ? 'rtl' : 'ltr'}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative isolate flex min-h-[680px] flex-col overflow-hidden bg-slate-950 lg:min-h-[820px]"
    >
      {/* ============================================================ */}
      {/* KEYFRAMES CSS — Zoom en boucle infinie, jamais bloqué        */}
      {/* ============================================================ */}
      <style>{`
        @keyframes hero-kb-in {
          0%   { transform: translate3d(0, 0, 0) scale(1); }
          50%  { transform: translate3d(0, 0, 0) scale(1.15); }
          100% { transform: translate3d(0, 0, 0) scale(1); }
        }
        @keyframes hero-kb-out {
          0%   { transform: translate3d(0, 0, 0) scale(1.15); }
          50%  { transform: translate3d(0, 0, 0) scale(1); }
          100% { transform: translate3d(0, 0, 0) scale(1.15); }
        }
      `}</style>

      {/* ============================================================ */}
      {/* BACKGROUND : images empilées + crossfade + animation CSS     */}
      {/* ============================================================ */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {activeSlides.map((slide, idx) => {
          const isActive = idx === currentSlide;
          const zoomIn = slide.zoomDirection === 'in';
          const animationName = zoomIn ? 'hero-kb-in' : 'hero-kb-out';

          return (
            <div
              key={idx}
              className="absolute inset-0"
              style={{
                opacity: isActive ? 1 : 0,
                transition: `opacity ${FADE_DURATION}ms ease-in-out`,
                pointerEvents: 'none',
              }}
            >
              <img
                src={encodeURI(slide.image)}
                alt=""
                aria-hidden="true"
                loading={idx === 0 ? 'eager' : 'lazy'}
                decoding="async"
                draggable={false}
                className="h-full w-full object-cover object-center"
                style={{
                  transform: 'translate3d(0, 0, 0)',
                  transformOrigin: 'center center',
                  animation:
                    isActive && !reduced
                      ? `${animationName} ${ZOOM_CYCLE}ms linear infinite`
                      : 'none',
                }}
              />
            </div>
          );
        })}

        {/* Dégradés directionnels (lisibilité + RTL) */}
        <div
          className={`absolute inset-0 hidden lg:block ${
            isRtl ? 'bg-gradient-to-l' : 'bg-gradient-to-r'
          } from-slate-950 via-slate-950/85 to-slate-950/20`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/35 lg:hidden" />

        {/* Voile global léger */}
        <div className="absolute inset-0 bg-slate-950/20" />

        {/* Halo unique animé — opacity seule = 0 lag */}
        {!reduced && (
          <motion.div
            aria-hidden="true"
            animate={{ opacity: [0.25, 0.5, 0.25] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            className="pointer-events-none absolute -top-32 left-1/4 h-[500px] w-[500px] rounded-full bg-blue-500/20 blur-[100px]"
            style={{ willChange: 'opacity', transform: 'translateZ(0)' }}
          />
        )}

        {/* Grille technique subtile */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:64px_64px]" />
      </div>

      {/* ============================================================ */}
      {/* CONTENU                                                       */}
      {/* ============================================================ */}
      <div className="relative z-10 flex flex-1 items-center">
        <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="max-w-3xl"
          >
            {/* --- Badge dynamique --- */}
            <motion.div variants={itemVariants} className="mb-7">
              <div
                onClick={() => navigate(currentInfo?.route || '/services')}
                role="link"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') navigate(currentInfo?.route || '/services');
                }}
                className="group inline-flex max-w-full cursor-pointer items-center gap-3 rounded-full border border-white/15 bg-white/[0.07] px-4 py-2 backdrop-blur-md transition-all duration-300 hover:border-white/30 hover:bg-white/[0.12] sm:px-5"
              >
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
                </span>

                <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-300 sm:text-xs">
                  {t.hero.badge247}
                </span>

                <span className="hidden h-4 w-px shrink-0 bg-white/20 sm:block" />

                <div className="relative min-w-0 overflow-hidden">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={currentSlide}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      className="block truncate text-xs font-semibold text-slate-100 sm:text-sm"
                    >
                      {language === 'ar' ? currentInfo?.tagAr : currentInfo?.tagFr}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            {/* --- Titre --- */}
            <motion.h1
              variants={itemVariants}
              className="text-[2.15rem] font-black leading-[1.08] tracking-tight text-white drop-shadow-sm sm:text-5xl lg:text-6xl xl:text-7xl"
            >
              {titleWords.map((word, i) => (
                <span
                  key={`${word}-${i}`}
                  className={
                    i >= titleWords.length - 2
                      ? 'bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent'
                      : ''
                  }
                >
                  {word}
                  {i < titleWords.length - 1 ? ' ' : ''}
                </span>
              ))}
            </motion.h1>

            {/* --- Sous-titre --- */}
            <motion.p
              variants={itemVariants}
              className="mt-6 max-w-2xl text-base font-medium leading-relaxed text-slate-300 sm:text-lg lg:text-xl"
            >
              {dynamicSubtitle}
            </motion.p>

            {/* --- Ligne spécifique au slide --- */}
            <motion.div
              variants={itemVariants}
              onClick={() => navigate(currentInfo?.route || '/services')}
              className="mt-7 inline-flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur-sm transition-colors hover:border-white/20 hover:bg-white/[0.1]"
            >
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
              <div className="relative overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={currentSlide}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="block text-sm font-semibold text-slate-100 sm:text-base"
                  >
                    {language === 'ar' ? currentInfo?.descAr : currentInfo?.descFr}
                  </motion.span>
                </AnimatePresence>
              </div>
            </motion.div>

            {/* --- CTA --- */}
            <motion.div
              variants={itemVariants}
              className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
            >
              <motion.button
                type="button"
                onClick={handleBooking}
                whileHover={reduced ? undefined : { y: -3 }}
                whileTap={{ scale: 0.97 }}
                className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-7 py-4 text-base font-bold text-white shadow-lg shadow-blue-600/30 transition-shadow duration-300 hover:shadow-xl hover:shadow-blue-600/45"
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
                <Calendar className="h-5 w-5 shrink-0" />
                <span>{t.hero.ctaBooking}</span>
                <ArrowRight
                  className={`h-4 w-4 shrink-0 transition-transform duration-300 ${
                    isRtl ? 'rotate-180' : 'group-hover:translate-x-1'
                  }`}
                />
              </motion.button>

              <motion.a
                href={`tel:${cleanPhone}`}
                whileHover={reduced ? undefined : { y: -3 }}
                whileTap={{ scale: 0.97 }}
                className="group inline-flex items-center justify-center gap-3 rounded-2xl border border-white/15 bg-white/[0.07] px-6 py-4 text-base font-bold text-white backdrop-blur-md transition-colors duration-300 hover:border-red-400/40 hover:bg-red-500/15"
              >
                <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-500/15 text-red-400 ring-1 ring-red-400/30">
                  <span className="absolute inset-0 animate-ping rounded-full bg-red-500/25" />
                  <Phone className="relative z-10 h-4 w-4" />
                </span>
                <span>{t.hero.ctaEmergency}</span>
              </motion.a>

              <motion.a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={reduced ? undefined : { y: -3 }}
                whileTap={{ scale: 0.97 }}
                className="group inline-flex items-center justify-center gap-3 rounded-2xl border border-emerald-400/25 bg-emerald-500/10 px-6 py-4 text-base font-bold text-emerald-300 backdrop-blur-md transition-colors duration-300 hover:border-emerald-400/50 hover:bg-emerald-500/20"
              >
                <MessageSquare className="h-5 w-5 shrink-0" />
                <span>{t.hero.ctaWhatsApp}</span>
              </motion.a>
            </motion.div>

            {/* --- Statistiques / raccourcis --- */}
            <motion.div
              variants={itemVariants}
              className="mt-12 grid grid-cols-2 gap-3 border-t border-white/10 pt-8 sm:gap-4 lg:grid-cols-4"
            >
              {stats.map((stat) => (
                <motion.button
                  key={stat.label}
                  type="button"
                  onClick={() => navigate(stat.route)}
                  whileHover={reduced ? undefined : { y: -6 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                  className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] p-3 text-start backdrop-blur-md transition-colors duration-300 hover:border-white/20 hover:bg-white/[0.1] sm:p-4"
                >
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 transition-all duration-300 ${TONES[stat.tone]}`}
                  >
                    <stat.icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold text-white sm:text-base">
                      {stat.value}
                    </span>
                    <span className="block truncate text-[10px] font-medium uppercase tracking-wider text-slate-400 sm:text-xs">
                      {stat.label}
                    </span>
                  </span>
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* CONTRÔLES DU SLIDER                                           */}
      {/* ============================================================ */}
      <div className="relative z-10">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-4 pb-8 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            {activeSlides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => goTo(idx)}
                aria-label={`${language === 'ar' ? 'الشريحة' : 'Slide'} ${idx + 1}`}
                aria-current={idx === currentSlide}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  idx === currentSlide
                    ? 'w-10 bg-gradient-to-r from-sky-400 to-blue-500'
                    : 'w-2.5 bg-white/25 hover:bg-white/50'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden font-mono text-xs tracking-widest text-white/60 sm:block">
              {String(currentSlide + 1).padStart(2, '0')}
              <span className="text-white/25"> / {String(total).padStart(2, '0')}</span>
            </span>

            <button
              type="button"
              onClick={prev}
              aria-label={language === 'ar' ? 'السابق' : 'Précédent'}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.07] text-white/80 backdrop-blur-md transition-all duration-300 hover:border-white/30 hover:bg-white/[0.15] hover:text-white active:scale-95"
            >
              {isRtl ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </button>

            <button
              type="button"
              onClick={next}
              aria-label={language === 'ar' ? 'التالي' : 'Suivant'}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.07] text-white/80 backdrop-blur-md transition-all duration-300 hover:border-white/30 hover:bg-white/[0.15] hover:text-white active:scale-95"
            >
              {isRtl ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};