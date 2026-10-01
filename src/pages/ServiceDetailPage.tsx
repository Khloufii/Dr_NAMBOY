import React, { useMemo, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useNavigation } from '../context/NavigationContext';
import { useSiteContent } from '../context/SiteContentContext';
import { MEDICAL_SERVICES } from '../data/servicesData';
import { AppointmentBooking } from '../components/home/AppointmentBooking';
import {
  Stethoscope,
  Activity,
  HeartPulse,
  Bug,
  Baby,
  Sparkles,
  Car,
  CheckCircle2,
  Calendar,
  MessageSquare,
  Clock,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  Info,
  HelpCircle,
  FileCheck2,
} from 'lucide-react';

interface ServiceDetailPageProps {
  serviceId: string;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Stethoscope,
  HeartPulse,
  Activity,
  Bug,
  Baby,
  Sparkles,
  Car,
};

const FALLBACK_IMAGE = '/src/assets/images/hero_doctor_consultation_1790610946656.jpg';

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({ serviceId }) => {
  const { language, isRtl } = useLanguage();
  const { navigate, navigateToService } = useNavigation();
  const { services, siteInfo } = useSiteContent();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  /* ------------------------------------------------------------------ */
  /* DÉDUPLICATION — élimine les services en double (id OU is24h)        */
  /* ------------------------------------------------------------------ */
  const uniqueServices = useMemo(() => {
    const seenIds = new Set<string>();
    let urgentAlreadyAdded = false;

    return (services || []).filter((s) => {
      if (!s || !s.id) return false;

      /* Déduplication par id */
      if (seenIds.has(s.id)) return false;

      /* Déduplication par flag is24h : un seul service 24h autorisé */
      if (s.is24h) {
        if (urgentAlreadyAdded) return false;
        urgentAlreadyAdded = true;
      }

      seenIds.add(s.id);
      return true;
    });
  }, [services]);

  /* ------------------------------------------------------------------ */
  /* Service courant                                                     */
  /* ------------------------------------------------------------------ */
  const service =
    uniqueServices.find((s) => s.id === serviceId) ||
    uniqueServices[0] ||
    MEDICAL_SERVICES[0];

  const IconComponent = ICON_MAP[service.iconName] || Stethoscope;

  /* ------------------------------------------------------------------ */
  /* Autres services (dédupliqués + sans doublon 24h)                    */
  /* ------------------------------------------------------------------ */
  const otherServices = useMemo(() => {
    return uniqueServices.filter((s) => {
      if (s.id === service.id) return false;
      /* Si le service courant est un 24h, on n'affiche pas d'autre 24h */
      if (service.is24h && s.is24h) return false;
      return true;
    });
  }, [uniqueServices, service.id, service.is24h]);

  /* ------------------------------------------------------------------ */
  /* Contenus localisés                                                  */
  /* ------------------------------------------------------------------ */
  const title = language === 'ar' ? service.titleAr : service.titleFr;
  const shortDesc = language === 'ar' ? service.shortDescAr : service.shortDescFr;
  const fullDesc = language === 'ar' ? service.fullDescAr : service.fullDescFr;
  const badge = language === 'ar' ? service.badgeAr : service.badgeFr;
  const indications =
    (language === 'ar' ? service.indicationsAr : service.indicationsFr) || [];
  const equipment =
    (language === 'ar' ? service.equipmentAr : service.equipmentFr) || [];
  const preparation =
    (language === 'ar' ? service.preparationAr : service.preparationFr) || [];
  const procedure =
    (language === 'ar' ? service.procedureAr : service.procedureFr) || [];

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget;
    if (target.src.includes('hero_doctor_consultation')) return;
    target.src = FALLBACK_IMAGE;
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="min-h-screen bg-slate-50 py-8 sm:py-12"
    >
      <div className="mx-auto max-w-6xl space-y-10 px-4 sm:px-6 lg:px-8">
        {/* ============================================================ */}
        {/* BREADCRUMB                                                    */}
        {/* ============================================================ */}
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 sm:text-sm">
          <button
            onClick={() => navigate('/')}
            className="transition-colors hover:text-blue-600"
          >
            {language === 'ar' ? 'الرئيسية' : 'Accueil'}
          </button>
          <ChevronRight className={`h-3.5 w-3.5 text-slate-400 ${isRtl ? 'rotate-180' : ''}`} />
          <button
            onClick={() => navigate('/services')}
            className="transition-colors hover:text-blue-600"
          >
            {language === 'ar' ? 'الخدمات الطبية' : 'Services & Soins'}
          </button>
          <ChevronRight className={`h-3.5 w-3.5 text-slate-400 ${isRtl ? 'rotate-180' : ''}`} />
          <span className="max-w-xs truncate font-bold text-slate-900 sm:max-w-md">
            {title}
          </span>
        </nav>

        {/* ============================================================ */}
        {/* HERO DU SERVICE                                               */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 items-center overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-md lg:grid-cols-12">
          {/* Texte + CTA */}
          <div className="space-y-5 p-6 sm:p-10 lg:col-span-7">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
                <IconComponent className="h-3.5 w-3.5" />
                <span>{badge}</span>
              </span>

              {service.is24h && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-red-600">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                  </span>
                  <span>
                    {language === 'ar' ? 'مداومة 24/24 و 7/7' : 'Permanence 24h/24'}
                  </span>
                </span>
              )}
            </div>

            <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl">
              {title}
            </h1>

            <p className="text-sm font-normal leading-relaxed text-slate-600 sm:text-base">
              {shortDesc}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#booking-section"
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-xs font-bold text-white shadow-md shadow-blue-600/20 transition-colors hover:bg-blue-700 sm:text-sm"
              >
                <Calendar className="h-4 w-4" />
                <span>
                  {language === 'ar' ? 'حجز موعد لهذا الفحص' : 'Prendre Rendez-vous'}
                </span>
              </a>

              <a
                href={`https://wa.me/212770558299?text=${encodeURIComponent(
                  `Bonjour Dr. NAMBOY, je souhaite des informations concernant le service : ${service.titleFr}`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition-colors hover:bg-emerald-700 sm:text-sm"
              >
                <MessageSquare className="h-4 w-4" />
                <span>
                  {language === 'ar' ? 'استشارة عبر واتساب' : 'Conseil WhatsApp 24/7'}
                </span>
              </a>
            </div>
          </div>

          {/* Image */}
          <div className="relative h-72 min-h-[320px] bg-slate-100 sm:h-96 lg:col-span-5 lg:h-full">
            <img
              src={service.image}
              alt={title}
              loading="lazy"
              onError={handleImgError}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent lg:hidden" />
          </div>
        </div>

        {/* ============================================================ */}
        {/* PRÉSENTATION MÉDICALE                                        */}
        {/* ============================================================ */}
        <div className="space-y-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-10">
          <div className="flex items-center gap-2.5 text-blue-600">
            <Info className="h-5 w-5 shrink-0" />
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
              {language === 'ar'
                ? 'عن هذا التخصص والرعاية الطبية المقدمة'
                : 'Présentation Médicale & Prise en Charge'}
            </h2>
          </div>
          <div className="prose prose-slate max-w-none whitespace-pre-line text-sm leading-relaxed text-slate-700 sm:text-base">
            {fullDesc}
          </div>
        </div>

        {/* ============================================================ */}
        {/* INDICATIONS + ÉQUIPEMENT                                     */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
          {/* Indications */}
          <div className="space-y-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-2.5 text-blue-700">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-blue-600" />
              <h3 className="text-lg font-bold text-slate-900">
                {language === 'ar'
                  ? 'دواعي الاستشارة والأعراض المعالجة'
                  : 'Indications & Symptômes Pris en Charge'}
              </h3>
            </div>
            <ul className="space-y-2.5">
              {indications.map((item: string, idx: number) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-xs text-slate-700 sm:text-sm"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                  <span className="leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Équipements */}
          <div className="space-y-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-2.5 text-emerald-700">
              <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-600" />
              <h3 className="text-lg font-bold text-slate-900">
                {language === 'ar'
                  ? 'التجهيزات والمعدات الطبية المعتمدة'
                  : 'Plateau Technique & Équipements'}
              </h3>
            </div>
            <ul className="space-y-2.5">
              {equipment.map((eq: string, idx: number) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-xs text-slate-700 sm:text-sm"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                  <span className="leading-snug">{eq}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ============================================================ */}
        {/* PRÉPARATION + DÉROULEMENT                                    */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
          {/* Préparation */}
          <div className="space-y-4 rounded-3xl border border-slate-200/80 bg-slate-100/70 p-6 sm:p-8">
            <div className="flex items-center gap-2.5 text-amber-700">
              <FileCheck2 className="h-5 w-5 shrink-0 text-amber-600" />
              <h3 className="text-lg font-bold text-slate-900">
                {language === 'ar'
                  ? 'إرشادات الاستعداد قبل القدوم إلى العيادة'
                  : 'Préparation & Recommandations au Patient'}
              </h3>
            </div>
            <ul className="space-y-2.5">
              {preparation.map((prep: string, idx: number) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-xs text-slate-700 sm:text-sm"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600" />
                  <span className="leading-snug">{prep}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Déroulement */}
          <div className="space-y-4 rounded-3xl border border-slate-200/80 bg-slate-100/70 p-6 sm:p-8">
            <div className="flex items-center gap-2.5 text-indigo-700">
              <Clock className="h-5 w-5 shrink-0 text-indigo-600" />
              <h3 className="text-lg font-bold text-slate-900">
                {language === 'ar'
                  ? 'مراحل الفحص وسير الاستشارة الطبية'
                  : 'Déroulement de la Consultation'}
              </h3>
            </div>
            <ul className="space-y-2.5">
              {procedure.map((step: string, idx: number) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-xs text-slate-700 sm:text-sm"
                >
                  <span className="mt-0.5 text-xs font-bold text-indigo-600">
                    {idx + 1}.
                  </span>
                  <span className="leading-snug">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ============================================================ */}
        {/* FAQ                                                          */}
        {/* ============================================================ */}
        {service.faqs && service.faqs.length > 0 && (
          <div className="space-y-6 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-10">
            <div className="flex items-center gap-2.5 text-blue-600">
              <HelpCircle className="h-5 w-5 shrink-0" />
              <h3 className="text-xl font-bold text-slate-900">
                {language === 'ar'
                  ? 'الأسئلة الشائعة حول هذا الفحص'
                  : 'Questions Fréquentes sur cet Acte Médical'}
              </h3>
            </div>

            <div className="space-y-3">
              {service.faqs.map((faq: any, idx: number) => {
                const isOpen = openFaqIndex === idx;
                const question = language === 'ar' ? faq.qAr : faq.qFr;
                const answer = language === 'ar' ? faq.aAr : faq.aFr;
                return (
                  <div
                    key={idx}
                    className="overflow-hidden rounded-2xl border border-slate-200"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="flex w-full items-center justify-between p-4 text-start text-sm font-bold text-slate-900 transition-colors hover:bg-slate-50 sm:p-5 sm:text-base"
                    >
                      <span>{question}</span>
                      <ChevronDown
                        className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-blue-600' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="border-t border-slate-100 bg-slate-50/50 p-4 pt-3 text-xs leading-relaxed text-slate-600 sm:p-5 sm:text-sm">
                        {answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* FORMULAIRE DE RENDEZ-VOUS                                    */}
        {/* ============================================================ */}
        <div id="booking-section" className="pt-4">
          <AppointmentBooking initialServiceId={service.id} />
        </div>

        {/* ============================================================ */}
        {/* AUTRES SERVICES (dédupliqués)                                */}
        {/* ============================================================ */}
        {otherServices.length > 0 && (
          <div className="space-y-6 pt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">
                {language === 'ar'
                  ? 'خدمات طبية أخرى بالعيادة'
                  : 'Découvrez Nos Autres Prestations Médicales'}
              </h3>
              <button
                onClick={() => navigate('/services')}
                className="text-xs font-bold text-blue-600 transition-colors hover:text-blue-700"
              >
                {language === 'ar' ? 'عرض كافة الخدمات' : 'Voir tout le catalogue'}
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {otherServices.slice(0, 3).map((item) => {
                const itemTitle = language === 'ar' ? item.titleAr : item.titleFr;
                const itemDesc =
                  language === 'ar' ? item.shortDescAr : item.shortDescFr;

                return (
                  <div
                    key={item.id}
                    onClick={() => navigateToService(item.id)}
                    className="group flex cursor-pointer items-center gap-3.5 rounded-2xl border border-slate-200 bg-white p-4 transition-colors hover:border-blue-400 hover:shadow-md"
                  >
                    <img
                      src={item.image}
                      alt={itemTitle}
                      loading="lazy"
                      onError={handleImgError}
                      className="h-14 w-14 shrink-0 rounded-xl object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="min-w-0">
                      <h4 className="truncate text-xs font-bold text-slate-900 transition-colors group-hover:text-blue-600 sm:text-sm">
                        {itemTitle}
                      </h4>
                      <p className="mt-0.5 line-clamp-1 text-[11px] text-slate-500">
                        {itemDesc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};