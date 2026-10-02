import React, { useMemo } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useNavigation } from '../../context/NavigationContext';
import { useSiteContent } from '../../context/SiteContentContext';
import {
  Stethoscope,
  Activity,
  HeartPulse,
  Bug,
  Baby,
  Sparkles,
  Car,
  Ambulance,
  Video,
  Home,
  Plane,
  Phone,
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
  Ambulance,
  Video,
  Home,
  Plane,
};

const FALLBACK_IMAGE = '/src/assets/images/hero_doctor_consultation_1790610946656.jpg';
const ASSISTANCE_IDS = ['evacuation', 'teleconsultation', 'homecare', 'evacuation-maroc'];
const EMERGENCY_PHONE = '+212770558299';

interface ServicesSectionProps {
  onSelectServiceForBooking?: (serviceId: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = () => {
  const { t, language, isRtl } = useLanguage();
  const { navigateToService, navigateToBooking, navigate } = useNavigation();
  const { services, isLoading } = useSiteContent();
  const reduced = useReducedMotion();

  /* Déduplication */
  const uniqueServices = useMemo(() => {
    const seen = new Set<string>();
    return (services || []).filter((s) => {
      if (!s || !s.id) return false;
      if (seen.has(s.id)) return false;
      seen.add(s.id);
      return true;
    });
  }, [services]);

  const urgentService = uniqueServices.find((s) => s.is24h);
  const gridServices = uniqueServices.filter(
    (s) => !s.is24h && !ASSISTANCE_IDS.includes(s.id),
  );
  const assistanceServices = uniqueServices.filter((s) =>
    ASSISTANCE_IDS.includes(s.id),
  );

  /* Helpers */
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

  return (
    <section
      id="services"
      dir={isRtl ? 'rtl' : 'ltr'}
      className="relative overflow-hidden bg-white py-20 sm:py-24 lg:py-28"
    >
      {/* Décor de fond */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-100/40 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-cyan-100/40 blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#e2e8f0_1px,transparent_0)] opacity-40 [background-size:28px_28px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={reduced ? undefined : { opacity: 0, y: 12 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-blue-200/70 bg-gradient-to-r from-blue-50 to-sky-50 px-4 py-1.5 shadow-sm"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-blue-600" />
            </span>
            <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
            <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-blue-700">
              {t.services.tagline}
            </span>
          </motion.div>

          <motion.h2
            initial={reduced ? undefined : { opacity: 0, y: 16 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="mt-6 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl"
          >
            {t.services.title}
          </motion.h2>

          <motion.p
            initial={reduced ? undefined : { opacity: 0, y: 16 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg"
          >
            {t.services.subtitle}
          </motion.p>
        </div>

        {/* SKELETONS */}
        {isLoading && uniqueServices.length === 0 ? (
          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
            {/* URGENCE 24/7 */}
            {urgentService && (
              <motion.div
                initial={reduced ? undefined : { opacity: 0, y: 24 }}
                whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6 }}
                className="mt-16"
              >
                <div
                  onClick={() => navigateToService(urgentService.id)}
                  className="group relative grid cursor-pointer grid-cols-1 overflow-hidden rounded-[28px] border border-slate-200/80 bg-gradient-to-br from-white via-white to-red-50/60 shadow-xl shadow-slate-900/[0.04] transition-all duration-500 hover:border-red-300/60 hover:shadow-2xl hover:shadow-red-500/10 lg:grid-cols-2"
                >
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
                </div>
              </motion.div>
            )}

            {/* GRILLE CLASSIQUE */}
            {gridServices.length > 0 && (
              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {gridServices.map((service, idx) => {
                  const IconComponent = ICON_MAP[service.iconName] || Stethoscope;
                  const title = getTitle(service);

                  return (
                    <motion.article
                      key={service.id}
                      initial={reduced ? undefined : { opacity: 0, y: 24 }}
                      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.15 }}
                      transition={{ duration: 0.5, delay: Math.min(idx * 0.06, 0.35) }}
                      onClick={() => navigateToService(service.id)}
                      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-blue-300/70 hover:shadow-2xl hover:shadow-blue-500/10"
                    >
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
                            {getBadge(service)}
                          </span>
                        </div>

                        <div className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-white/15 text-white shadow-lg backdrop-blur-md transition-all duration-500 group-hover:scale-110 group-hover:border-white/40 group-hover:bg-white/25">
                          <IconComponent className="h-5 w-5" />
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col p-6">
                        <h3 className="text-lg font-black tracking-tight text-slate-900 transition-colors group-hover:text-blue-700 sm:text-xl">
                          {title}
                        </h3>

                        <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-slate-600">
                          {getShortDesc(service)}
                        </p>

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
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-all duration-300 hover:border-blue-500 hover:bg-blue-600 hover:text-white hover:shadow-md hover:shadow-blue-500/25"
                          >
                            <Calendar className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <span className="pointer-events-none absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500 transition-transform duration-500 group-hover:scale-x-100" />
                    </motion.article>
                  );
                })}
              </div>
            )}

            {/* SECTION ASSISTANCE — STYLE SOMBRE */}
            {assistanceServices.length > 0 && (
              <motion.section
                initial={reduced ? undefined : { opacity: 0, y: 24 }}
                whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.6 }}
                className="relative mt-12 overflow-hidden rounded-[32px] bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 shadow-2xl sm:p-10"
              >
                <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

                <div className="relative mb-8 flex flex-col items-start justify-between gap-5 lg:flex-row lg:items-end">
                  <div className="max-w-2xl space-y-3">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-cyan-200 backdrop-blur">
                      <Plane className="h-3.5 w-3.5" />
                      {language === 'ar' ? 'خدمات المساعدة' : 'Services d’assistance'}
                    </span>
                    <h3 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                      {language === 'ar'
                        ? 'المرافقة والإجلاء والرعاية عن بعد وبالمنزل'
                        : 'Accompagnement, évacuations & soins là où vous êtes'}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-300 sm:text-base">
                      {language === 'ar'
                        ? 'حلول طبية متنقلة تصلكم أينما كنتم: إجلاء بالإسعاف أو الطائرة، استشارات عن بعد، علاج بالمنزل وتكفل كامل بإجراءات الإجلاء نحو المغرب.'
                        : 'Des solutions médicales mobiles : évacuations en ambulance ou en avion, téléconsultations, soins à domicile et prise en charge complète des démarches d’évacuation vers le Maroc.'}
                    </p>
                  </div>

                  <a
                    href={`tel:${EMERGENCY_PHONE}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900 shadow-lg transition hover:bg-cyan-50"
                  >
                    <Phone className="h-4 w-4 text-indigo-600" />
                    <span dir="ltr">08 08 65 58 17</span>
                  </a>
                </div>

                <div className="relative grid grid-cols-1 gap-5 md:grid-cols-2">
                  {assistanceServices.map((service, idx) => {
                    const IconComponent = ICON_MAP[service.iconName] || Stethoscope;
                    const title = getTitle(service);

                    return (
                      <motion.article
                        key={service.id}
                        initial={reduced ? undefined : { opacity: 0, y: 20 }}
                        whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.15 }}
                        transition={{ duration: 0.5, delay: Math.min(idx * 0.08, 0.3) }}
                        onClick={() => navigateToService(service.id)}
                        className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-cyan-400/40 hover:bg-white/[0.1] sm:flex-row"
                      >
                        <div className="relative h-44 shrink-0 overflow-hidden sm:h-auto sm:w-2/5">
                          <img
                            src={service.image}
                            alt={title}
                            loading="lazy"
                            onError={handleImgError}
                            className="h-full w-full object-cover opacity-90 transition-transform duration-[1200ms] group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent sm:bg-gradient-to-r" />
                          <span className="absolute left-3 top-3 text-4xl font-black leading-none text-white/30">
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                        </div>

                        <div className="flex flex-1 flex-col p-5">
                          <div className="flex items-center gap-2.5">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-500 text-white shadow-lg shadow-indigo-500/30">
                              <IconComponent className="h-5 w-5" />
                            </span>
                            <span className="rounded-full border border-cyan-300/30 bg-cyan-400/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-cyan-200">
                              {getBadge(service)}
                            </span>
                          </div>

                          <h4 className="mt-3 text-base font-black leading-snug text-white sm:text-lg">
                            {title}
                          </h4>
                          <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-slate-300">
                            {getShortDesc(service)}
                          </p>

                          <div className="mt-auto flex items-center justify-between pt-5">
                            <span className="inline-flex items-center gap-1.5 text-sm font-bold text-cyan-300 transition-colors group-hover:text-cyan-200">
                              {t.services.learnMore}
                              <ArrowRight
                                className={`h-4 w-4 transition-transform ${
                                  isRtl
                                    ? 'rotate-180 group-hover:-translate-x-1'
                                    : 'group-hover:translate-x-1'
                                }`}
                              />
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigateToBooking(service.id);
                              }}
                              aria-label={`${t.nav.booking} — ${title}`}
                              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-cyan-300 hover:bg-cyan-400 hover:text-slate-900"
                            >
                              <Calendar className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </motion.article>
                    );
                  })}
                </div>
              </motion.section>
            )}
          </>
        )}

        {/* BANNIÈRE CTA — CATALOGUE COMPLET */}
        <motion.div
          initial={reduced ? undefined : { opacity: 0, y: 20 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="relative mt-16 overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 px-8 py-10 shadow-xl sm:px-12 sm:py-12"
        >
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-blue-500/25 blur-3xl" />
            <div className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_0)] [background-size:32px_32px]" />
          </div>

          <div className="relative flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-start">
            <div className="max-w-2xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-sky-300">
                {language === 'ar' ? 'دليل طبي متكامل' : 'Catalogue médical complet'}
              </p>
              <h3 className="mt-2 text-xl font-black tracking-tight text-white sm:text-2xl">
                {language === 'ar'
                  ? 'استكشف جميع تخصصاتنا الطبية'
                  : 'Découvrez toutes nos spécialités médicales'}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                {language === 'ar'
                  ? 'من الفحوصات العامة إلى الاستعجالات، نغطي كل احتياجاتك الصحية.'
                  : 'Des consultations générales aux urgences, nous couvrons tous vos besoins de santé.'}
              </p>
            </div>

            <button
              onClick={() => navigate('/services')}
              className="group relative inline-flex shrink-0 items-center gap-2 overflow-hidden rounded-2xl bg-white px-6 py-3.5 text-sm font-bold text-slate-900 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-blue-100/60 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative">
                {language === 'ar' ? 'عرض جميع الخدمات' : 'Voir tous les services'}
              </span>
              <ArrowRight
                className={`relative h-4 w-4 transition-transform ${
                  isRtl ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'
                }`}
              />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};