import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useSiteContent } from '../../context/SiteContentContext';
import {
  CheckCircle,
  GraduationCap,
  Users,
  ShieldCheck,
  HeartHandshake,
  Sparkles,
  Stethoscope,
} from 'lucide-react';
import { InteractiveGallery } from './InteractiveGallery';
import { motion, useReducedMotion } from 'motion/react';

export const AboutSection: React.FC = () => {
  const { t, language, isRtl } = useLanguage();
  const { teamMembers } = useSiteContent();
  const reduced = useReducedMotion();

  /* ------------------------------------------------------------------ */
  /* Séparation Dr NAMBOY / autres membres                              */
  /* ------------------------------------------------------------------ */
  const drNamboy =
    teamMembers.find((m) => m.id === 'dr_namboy') ||
    teamMembers.find((m) => (m.name || '').toLowerCase().includes('namboy')) ||
    teamMembers[0];

  const staffMembers = teamMembers.filter((m) => m.id !== drNamboy?.id);

  const diplomas = drNamboy
    ? language === 'ar'
      ? drNamboy.diplomasAr
      : drNamboy.diplomasFr
    : t.about.diplomaList;

  const getMemberImage = (url?: string) =>
    url || '/images/WhatsApp Image 2026-09-28 at 16.46.00 (3).jpeg';

  return (
    <section
      id="about"
      dir={isRtl ? 'rtl' : 'ltr'}
      className="border-b border-slate-200/80 bg-white py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ============================================================ */}
        {/* HEADER DE SECTION                                            */}
        {/* ============================================================ */}
        <div className="mx-auto mb-16 max-w-3xl space-y-3 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{t.about.tagline}</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            {t.about.title}
          </h2>
          <p className="text-base leading-relaxed text-slate-600 sm:text-lg">
            {t.about.description1}
          </p>
        </div>

        {/* ============================================================ */}
        {/* PRÉSENTATION DU DR NAMBOY                                    */}
        {/* ============================================================ */}
        <div className="mb-20 grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Portrait */}
          <div className="lg:col-span-5">
            <div className="group relative overflow-hidden rounded-3xl border-4 border-white bg-slate-100 shadow-2xl">
              <img
                src={getMemberImage(drNamboy?.photoUrl)}
                alt={drNamboy?.name || 'Dr Evrard Simplice NAMBOY'}
                className="h-[450px] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    '/images/WhatsApp Image 2026-09-28 at 16.46.00 (3).jpeg';
                }}
              />
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent p-6 text-white sm:p-8">
                <span className="mb-2 w-fit rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white shadow-sm">
                  {language === 'ar'
                    ? drNamboy?.roleAr || 'طبيب ممارس معتمد'
                    : drNamboy?.roleFr || 'Médecin Praticien Diplômé'}
                </span>
                <h3 className="text-xl font-bold tracking-tight sm:text-2xl">
                  {drNamboy?.name || 'Dr. Evrard Simplice NAMBOY'}
                </h3>
                <p className="mt-1 text-sm font-medium text-sky-200">
                  {language === 'ar'
                    ? drNamboy?.specialtyAr ||
                      'أخصائي في المستعجلات، الفحص بالصدى والطب العام - خريج الرباط'
                    : drNamboy?.specialtyFr ||
                      'Spécialisé en Urgences, Échographie & Médecine Générale - Faculté de Rabat'}
                </p>
              </div>
            </div>

            {/* Badges */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2.5 rounded-2xl border border-slate-200/80 bg-slate-50 p-3">
                <ShieldCheck className="h-5 w-5 shrink-0 text-blue-600" />
                <span className="text-xs font-semibold text-slate-700">
                  {language === 'ar' ? 'مطابقة معايير الصحة' : 'Conformité Sanitaire'}
                </span>
              </div>
              <div className="flex items-center gap-2.5 rounded-2xl border border-slate-200/80 bg-slate-50 p-3">
                <HeartHandshake className="h-5 w-5 shrink-0 text-emerald-600" />
                <span className="text-xs font-semibold text-slate-700">
                  {language === 'ar'
                    ? 'رعاية إنسانية مستمرة'
                    : 'Écoute & Bienveillance'}
                </span>
              </div>
            </div>
          </div>

          {/* Diplômes + Engagement */}
          <div className="space-y-6 lg:col-span-7">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/20">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 sm:text-2xl">
                    {t.about.diplomasTitle}
                  </h3>
                  <p className="text-xs font-medium text-slate-500 sm:text-sm">
                    {language === 'ar'
                      ? 'مسار أكاديمي وسريري متميز بالمستشفيات الجامعية'
                      : 'Cursus clinique d’excellence et formations hospitalières universitaires'}
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                {diplomas?.map((diploma, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 rounded-xl border border-slate-200/70 bg-slate-50 p-3.5 transition-colors duration-200 hover:border-blue-300 hover:bg-blue-50/60"
                  >
                    <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                    <span className="text-sm font-semibold leading-snug text-slate-800">
                      {diploma}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 rounded-2xl bg-gradient-to-br from-blue-900 via-sky-900 to-slate-900 p-6 text-white shadow-xl">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-sky-300" />
                <h4 className="text-lg font-bold text-white">
                  {language === 'ar'
                    ? 'التزامات العيادة الطبية'
                    : 'Engagements du Cabinet Dr. NAMBOY'}
                </h4>
              </div>
              <p className="text-sm leading-relaxed text-sky-100">
                {language === 'ar'
                  ? 'يحرص الدكتور نامبوي على تقديم استشارات طبية متكاملة تشمل الفحص الدقيق، التكفل الإنساني بالمرضى، والجاهزية التامة لاستقبال الحالات الطارئة طيلة أيام الأسبوع.'
                  : 'Le Dr. NAMBOY assure des soins médicaux rigoureux avec un suivi personnalisé, une écoute attentive et une permanence d’urgence garantie 24h/24 et 7j/7 à Salé Bettana.'}
              </p>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* ✨ SECTION ÉQUIPE SOIGNANTE — À AJOUTER                      */}
        {/* ============================================================ */}
        {staffMembers.length > 0 && (
          <div className="mb-20 space-y-8">
            {/* Header équipe */}
            <div className="mx-auto max-w-2xl space-y-3 text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700">
                <Users className="h-3.5 w-3.5" />
                <span>
                  {language === 'ar' ? 'الفريق الطبي' : 'Notre Équipe Soignante'}
                </span>
              </div>
              <h3 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                {language === 'ar'
                  ? 'طاقم طبي وتمريضي في خدمتكم'
                  : 'Une équipe pluridisciplinaire à votre écoute'}
              </h3>
              <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
                {language === 'ar'
                  ? 'يضم فريق العيادة أطراً تمريضية وتقنية ذات كفاءة عالية لضمان رعاية شاملة ومتكاملة.'
                  : "Le cabinet réunit des professionnels qualifiés pour assurer une prise en charge complète et bienveillante."}
              </p>
            </div>

            {/* Grille des membres */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {staffMembers.map((member, idx) => (
                <motion.article
                  key={member.id}
                  initial={reduced ? undefined : { opacity: 0, y: 20 }}
                  whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: Math.min(idx * 0.06, 0.3) }}
                  className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-blue-300/70 hover:shadow-2xl hover:shadow-blue-500/10"
                >
                  {/* Photo du membre */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                    <img
                      src={getMemberImage(member.photoUrl)}
                      alt={member.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.08]"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          '/images/WhatsApp Image 2026-09-28 at 16.46.00 (3).jpeg';
                      }}
                    />

                    {/* Dégradé */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />

                    {/* Badge rôle en haut */}
                    {((language === 'ar' ? member.roleAr : member.roleFr) || '').trim() && (
                      <div className="absolute left-4 top-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-3 py-1 text-[11px] font-bold text-white shadow-sm backdrop-blur-md">
                          <Stethoscope className="h-3 w-3" />
                          {language === 'ar' ? member.roleAr : member.roleFr}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Contenu */}
                  <div className="flex flex-1 flex-col p-6">
                    <h4 className="text-lg font-black tracking-tight text-slate-900 transition-colors group-hover:text-blue-700">
                      {member.name}
                    </h4>

                    {/* Spécialité */}
                    {((language === 'ar' ? member.specialtyAr : member.specialtyFr) || '')
                      .trim() && (
                      <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-blue-600">
                        {language === 'ar' ? member.specialtyAr : member.specialtyFr}
                      </p>
                    )}

                    {/* Bio */}
                    {((language === 'ar' ? member.bioAr : member.bioFr) || '').trim() && (
                      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600">
                        {language === 'ar' ? member.bioAr : member.bioFr}
                      </p>
                    )}

                    {/* Diplômes */}
                    {(((language === 'ar' ? member.diplomasAr : member.diplomasFr) || [])
                      .length || 0) > 0 && (
                      <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-3">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          {language === 'ar' ? 'المؤهلات :' : 'Qualifications :'}
                        </span>
                        <ul className="space-y-1">
                          {(
                            (language === 'ar'
                              ? member.diplomasAr
                              : member.diplomasFr) || []
                          )
                            .slice(0, 2)
                            .map((d, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-1.5 text-[11px] text-slate-600"
                              >
                                <GraduationCap className="mt-0.5 h-3 w-3 shrink-0 text-blue-500" />
                                <span className="line-clamp-1">{d}</span>
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Liseré animé au hover */}
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500 transition-transform duration-500 group-hover:scale-x-100" />
                </motion.article>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* GALERIE INTERACTIVE                                          */}
        {/* ============================================================ */}
        <div className="pt-10">
          <InteractiveGallery />
        </div>
      </div>
    </section>
  );
};