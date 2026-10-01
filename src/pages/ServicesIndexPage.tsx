import React, { useMemo, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useNavigation } from '../context/NavigationContext';
import { useSiteContent } from '../context/SiteContentContext';
import {
  Stethoscope,
  Activity,
  HeartPulse,
  Bug,
  Baby,
  Sparkles,
  Car,
  ShieldCheck,
  Calendar,
  ArrowRight,
  ArrowUpRight,
  Clock,
  type LucideIcon,
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

const ICON_MAP: Record<string, LucideIcon> = {
  Stethoscope,
  HeartPulse,
  Activity,
  Bug,
  Baby,
  Sparkles,
  Car,
};

const FALLBACK_IMAGE = '/src/assets/images/hero_doctor_consultation_1790610946656.jpg';

type FilterType = 'all' | '24h' | 'consultation' | 'diagnostic';

export const ServicesIndexPage: React.FC = () => {
  const { t, language, isRtl } = useLanguage();
  const { navigateToService, navigateToBooking } = useNavigation();
  const { services, isLoading } = useSiteContent();
  const reduced = useReducedMotion();
  const [filter, setFilter] = useState<FilterType>('all');

  /* ------------------------------------------------------------------ */
  /* DÉDUPLICATION — évite d'afficher 2× la même carte                   */
  /* ------------------------------------------------------------------ */
  const uniqueServices = useMemo(() => {
    const seen = new Set<string>();
    return (services || []).filter((s) => {
      if (!s || !s.id) return false;
      if (seen.has(s.id)) return false;
      seen.add(s.id);
      return true;
    });
  }, [services]);

  /* ------------------------------------------------------------------ */
  /* FILTRAGE                                                            */
  /* ------------------------------------------------------------------ */
  const filteredServices = useMemo(() => {
    return uniqueServices.filter((service) => {
      if (filter === '24h') return service.is24h;
      if (filter === 'diagnostic')
        return ['imaging', 'tropical', 'driving'].includes(service.id);
      if (filter === 'consultation')
        return !service.is24h && service.id !== 'imaging';
      return true;
    });
  }, [uniqueServices, filter]);

  /* ------------------------------------------------------------------ */
  /* Service 24h séparé — exclut TOUS les 24h de la grille               */
  /* ------------------------------------------------------------------ */
  const urgentService = filteredServices.find((s) => s.is24h);
  const gridServices = filteredServices.filter(
    (s) => !s.is24h && s.id !== urgentService?.id,
  );

  /* ------------------------------------------------------------------ */
  /* Helpers                                                             */
  /* ------------------------------------------------------------------ */
  const getTitle = (s: any) => (language === 'ar' ? s.titleAr : s.titleFr) || '';
  const getShortDesc = (s: any) =>
    (language === 'ar' ? s.shortDescAr : s.shortDescFr) || '';
  const getBadge = (s: any) =>
    (language === 'ar' ? s.badgeAr : s.badgeFr) ||
    (language === 'ar' ? 'رعاية متخصصة' : 'Soins Spécialisés');

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget;
    if (target.src.includes('hero_doctor_consultation')) return;
    target.src = FALLBACK_IMAGE;
  };

  /* ------------------------------------------------------------------ */
  /* Rendu                                                               */
  /* ------------------------------------------------------------------ */
  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="min-h-screen bg-slate-50 py-10 sm:py-16"
    >
      <div className="mx-auto max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
        {/* ============================================================ */}
        {/* HEADER DE PAGE                                                */}
        {/* ============================================================ */}
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/70 bg-gradient-to-r from-blue-50 to-sky-50 px-4 py-1.5 shadow-sm">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-blue-600" />
            </span>
            <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
            <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-blue-700">
              {language === 'ar' ? 'أقطاب التميز الطبي' : 'Catalogue des Soins Médicaux'}
            </span>
          </div>

          <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            {t.services.title}
          </h1>

          <p className="text-base leading-relaxed text-slate-600 sm:text-lg">
            {language === 'ar'
              ? 'يقدم الدكتور نامبوي إيفرارد سيمبليس وفريقه الطبي المتخصص رعاية متكاملة تشمل الطب العام، المستعجلات المستمرة، الفحص بالصدى، صحة المرأة، والشهادات الطبية الرسمية.'
              : "Découvrez l'ensemble de nos spécialités médicales dispensées au Cabinet du Dr. NAMBOY à Salé Bettana. Cliquez sur un service pour consulter sa page détaillée et ses protocoles."}
          </p>
        </div>

        {/* ============================================================ */}
        {/* FILTRES                                                       */}
        {/* ============================================================ */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {(
            [
              {
                id: 'all',
                labelFr: 'Toutes nos spécialités',
                labelAr: 'كافة الخدمات',
                tone: 'blue',
              },
              {
                id: '24h',
                labelFr: 'Urgences 24h/24 & Réanimation',
                labelAr: 'طوارئ 24/24',
                tone: 'red',
              },
              {
                id: 'diagnostic',
                labelFr: 'Plateau Diagnostique & Imagerie',
                labelAr: 'الفحوصات والتصوير',
                tone: 'sky',
              },
              {
                id: 'consultation',
                labelFr: 'Consultations Spécialisées',
                labelAr: 'الاستشارات والعلاجات',
                tone: 'slate',
              },
            ] as const
          ).map((f) => {
            const isActive = filter === f.id;
            const activeClass =
              f.tone === 'red'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                : f.tone === 'sky'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                  : f.tone === 'slate'
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-blue-600 text-white shadow-md shadow-blue-600/20';

            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id as FilterType)}
                className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-bold transition-colors duration-200 ${
                  isActive
                    ? activeClass
                    : 'border border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700'
                }`}
              >
                {language === 'ar' ? f.labelAr : f.labelFr}
              </button>
            );
          })}
        </div>

        {/* ============================================================ */}
        {/* SKELETONS                                                     */}
        {/* ============================================================ */}
        {isLoading && uniqueServices.length === 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="animate-pulse overflow-hidden rounded-3xl border border-slate-200 bg-white"
              >
                <div className="aspect-[16/10] bg-slate-200" />
                <div className="space-y-3 p-6">
                  <div className="h-5 w-3/4 rounded-md bg-slate-200" />
                  <div className="h-3.5 w-full rounded-md bg-slate-200" />
                  <div className="h-3.5 w-5/6 rounded-md bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* ============================================================ */}
            {/* CARTE URGENCE 24/7 EN VEDETTE (une seule fois)               */}
            {/* ============================================================ */}
            {urgentService && (
              <motion.div
                initial={reduced ? undefined : { opacity: 0, y: 20 }}
                whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55 }}
                onClick={() => navigateToService(urgentService.id)}
                className="group relative grid cursor-pointer grid-cols-1 overflow-hidden rounded-[28px] border border-slate-200/80 bg-gradient-to-br from-white via-white to-red-50/60 shadow-xl shadow-slate-900/[0.04] transition-colors duration-500 hover:border-red-300/60 lg:grid-cols-2"
              >
                {/* Contenu texte */}
                <div className="flex flex-col justify-between p-8 sm:p-10 lg:p-12">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-red-700">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-600" />
                        </span>
                        <Clock className="h-3 w-3" />
                        24h / 7j
                      </span>
                      <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-bold text-slate-600 shadow-sm">
                        {getBadge(urgentService)}
                      </span>
                    </div>

                    <div className="mt-6 flex items-center gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/25">
                        {React.createElement(
                          ICON_MAP[urgentService.iconName] || Stethoscope,
                          { className: 'h-5 w-5' },
                        )}
                      </span>
                      <h3 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                        {getTitle(urgentService)}
                      </h3>
                    </div>

                    <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
                      {getShortDesc(urgentService)}
                    </p>
                  </div>

                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateToBooking(urgentService.id);
                      }}
                      className="group/btn relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition-shadow hover:shadow-blue-600/40"
                    >
                      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full" />
                      <Calendar className="h-4 w-4" />
                      <span>{t.nav.booking}</span>
                    </button>

                    <span className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-700 transition-colors group-hover:text-blue-800">
                      {t.services.learnMore}
                      <ArrowUpRight
                        className={`h-4 w-4 transition-transform ${
                          isRtl
                            ? 'group-hover:-translate-x-0.5 group-hover:-translate-y-0.5'
                            : 'group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
                        }`}
                      />
                    </span>
                  </div>
                </div>

                {/* Image */}
                <div className="relative order-first h-56 overflow-hidden bg-slate-100 lg:order-last lg:h-auto">
                  <img
                    src={urgentService.image}
                    alt={getTitle(urgentService)}
                    loading="lazy"
                    onError={handleImgError}
                    className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent lg:bg-gradient-to-r lg:from-white/40 lg:via-transparent lg:to-transparent" />
                </div>
              </motion.div>
            )}

            {/* ============================================================ */}
            {/* GRILLE DES AUTRES SERVICES (aucun 24h ici)                   */}
            {/* ============================================================ */}
            {gridServices.length > 0 && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {gridServices.map((service, idx) => {
                  const IconComponent = ICON_MAP[service.iconName] || Stethoscope;
                  const title = getTitle(service);
                  const shortDesc = getShortDesc(service);
                  const badge = getBadge(service);

                  return (
                    <motion.article
                      key={service.id}
                      initial={reduced ? undefined : { opacity: 0, y: 20 }}
                      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.15 }}
                      transition={{ duration: 0.5, delay: Math.min(idx * 0.05, 0.3) }}
                      onClick={() => navigateToService(service.id)}
                      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-blue-300/70 hover:shadow-2xl hover:shadow-blue-500/10"
                    >
                      {/* Image */}
                      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                        <img
                          src={service.image}
                          alt={title}
                          loading="lazy"
                          onError={handleImgError}
                          className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.08]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />

                        <div className="absolute left-4 top-4">
                          <span className="inline-flex items-center rounded-full border border-white/25 bg-white/15 px-3 py-1 text-[11px] font-bold text-white shadow-sm backdrop-blur-md">
                            {badge}
                          </span>
                        </div>

                        <div className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-white/15 text-white shadow-lg backdrop-blur-md transition-all duration-500 group-hover:scale-110 group-hover:border-white/40 group-hover:bg-white/25">
                          <IconComponent className="h-5 w-5" />
                        </div>
                      </div>

                      {/* Contenu */}
                      <div className="flex flex-1 flex-col p-6">
                        <h3 className="text-lg font-black tracking-tight text-slate-900 transition-colors group-hover:text-blue-700 sm:text-xl">
                          {title}
                        </h3>

                        <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-slate-600">
                          {shortDesc}
                        </p>

                        {/* Actions */}
                        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                          <span className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 transition-colors group-hover:text-blue-700">
                            {t.services.learnMore}
                            <ArrowRight
                              className={`h-4 w-4 transition-transform ${
                                isRtl ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'
                              }`}
                            />
                          </span>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigateToBooking(service.id);
                            }}
                            aria-label={`${t.nav.booking} — ${title}`}
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors duration-300 hover:border-blue-500 hover:bg-blue-600 hover:text-white"
                          >
                            <Calendar className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Liseré animé */}
                      <span className="pointer-events-none absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500 transition-transform duration-500 group-hover:scale-x-100" />
                    </motion.article>
                  );
                })}
              </div>
            )}

            {/* Aucun résultat */}
            {filteredServices.length === 0 && (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
                <p className="text-sm font-semibold text-slate-500">
                  {language === 'ar'
                    ? 'لا توجد خدمات مطابقة لهذا الفلتر.'
                    : 'Aucun service ne correspond à ce filtre.'}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};