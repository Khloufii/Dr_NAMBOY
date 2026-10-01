import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useNavigation } from '../../context/NavigationContext';
import { useSiteContent } from '../../context/SiteContentContext';
import {
  Phone,
  MapPin,
  Mail,
  ShieldAlert,
  Globe,
  ExternalLink,
  Facebook,
  Music2,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { t, language, toggleLanguage } = useLanguage();
  const { navigate, navigateToService } = useNavigation();
  const { siteInfo, services } = useSiteContent();

  const officialMapsUrl =
    siteInfo.mapsUrl || 'https://maps.app.goo.gl/rxqWEk1fQAW8Hacj6?g_st=aw';
  const cleanPhone = (siteInfo.phoneMain || '+212770558299').replace(/\s+/g, '');
  const cleanLandline = (siteInfo.phoneLandline || '0808655817').replace(/\s+/g, '');
  const cleanSecretary = (siteInfo.phoneSecretary || '0694727915').replace(/\s+/g, '');

  /* ------------------------------------------------------------------ */
  /* Réseaux sociaux                                                     */
  /* ------------------------------------------------------------------ */
const facebookUrl =
  (siteInfo as any).facebookUrl || 'https://www.facebook.com/share/1CyTLoVtyk/';
const tiktokUrl =
  (siteInfo as any).tiktokUrl ||
  'https://www.tiktok.com/@cabinet.mdical.dr94?_r=1&_t=ZS-9AAURfYHnjp';

  return (
    <footer dir={language === 'ar' ? 'rtl' : 'ltr'} className="border-t border-slate-800 bg-slate-950 text-slate-300">
      {/* 24/7 Emergency Highlight Strip */}
      <div className="border-b border-red-700/50 bg-gradient-to-r from-red-900/90 via-red-800 to-red-950 px-4 py-4">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-start">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 animate-pulse items-center justify-center rounded-full bg-white/20 text-white">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-white sm:text-base">
                {t.footer.emergencyTitle}
              </h4>
              <p className="text-xs text-red-200">{t.footer.emergencyText}</p>
            </div>
          </div>

          <a
            href={`tel:${cleanPhone}`}
            className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs font-bold text-red-700 shadow-md transition-colors hover:bg-red-50 sm:text-sm"
          >
            <Phone className="h-4 w-4 text-red-600" />
            <span>
              {t.footer.callEmergency} ({siteInfo.phoneMain || '+212 7 70 55 82 99'})
            </span>
          </a>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12">
          {/* Brand info */}
          <div className="space-y-4 lg:col-span-4">
            <div
              onClick={() => navigate('/')}
              className="group flex cursor-pointer items-center gap-3"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 p-0.5 shadow-md">
                <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-[10px] bg-white">
                  <img
                    src="/images/favicon.jpeg"
                    alt="Cabinet Dr. NAMBOY"
                    className="h-10 w-10 object-contain"
                  />
                </div>
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-sky-400">
                  {language === 'ar' ? 'عيادة طبية' : 'Cabinet Médical'}
                </span>
                <h3 className="text-base font-bold leading-tight text-white">
                  {language === 'ar'
                    ? 'د. نامبوي إيفرارد سيمبليس'
                    : 'Dr. NAMBOY Evrard Simplice'}
                </h3>
                <span className="text-xs text-slate-400">Salé Bettana</span>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-slate-400 sm:text-sm">
              {t.footer.description}
            </p>

            {/* Réseaux sociaux */}
            <div className="space-y-2 pt-1">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                {language === 'ar' ? 'تابعنا على' : 'Suivez-nous'}
              </span>
              <div className="flex items-center gap-2">
                {/* Facebook */}
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  title={language === 'ar' ? 'فيسبوك' : 'Facebook'}
                  className="group flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-500/50 hover:bg-blue-600 hover:text-white"
                >
                  <Facebook className="h-4.5 w-4.5" />
                </a>

                {/* TikTok */}
                <a
                  href={tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  title={language === 'ar' ? 'تيك توك' : 'TikTok'}
                  className="group flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 transition-all duration-300 hover:-translate-y-0.5 hover:border-pink-500/50 hover:bg-gradient-to-br hover:from-pink-600 hover:to-black hover:text-white"
                >
                  <Music2 className="h-4.5 w-4.5" />
                </a>
              </div>
            </div>

            <button
              onClick={toggleLanguage}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-300 transition-colors hover:bg-slate-800"
            >
              <Globe className="h-3.5 w-3.5 text-blue-400" />
              <span>
                {language === 'fr'
                  ? 'Changer en Arabe (العربية)'
                  : 'Passer en Français'}
              </span>
            </button>
          </div>

          {/* Quick navigation */}
          <div className="space-y-3 lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => navigate('/')}
                  className="cursor-pointer transition-colors hover:text-white"
                >
                  {t.nav.home}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/a-propos')}
                  className="cursor-pointer transition-colors hover:text-white"
                >
                  {t.nav.about}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/services')}
                  className="cursor-pointer transition-colors hover:text-white"
                >
                  {t.nav.services}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/rendez-vous')}
                  className="cursor-pointer transition-colors hover:text-white"
                >
                  {t.nav.booking}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/conseils-sante')}
                  className="cursor-pointer transition-colors hover:text-white"
                >
                  {t.nav.blog}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/contact')}
                  className="cursor-pointer transition-colors hover:text-white"
                >
                  {t.nav.contact}
                </button>
              </li>
            </ul>
          </div>

          {/* Specialties list */}
          <div className="space-y-3 lg:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100">
              {t.footer.servicesTitle}
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              {services.slice(0, 7).map((s) => (
                <li key={s.id}>
                  <button
                    onClick={() => navigateToService(s.id)}
                    className="cursor-pointer text-start transition-colors hover:text-sky-300"
                  >
                    • {language === 'ar' ? s.titleAr : s.titleFr}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Coordinates */}
          <div className="space-y-3 lg:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100">
              {t.contact.addressTitle}
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" />
                <div>
                  <span>
                    {language === 'ar'
                      ? siteInfo.addressAr || t.contact.addressLine1
                      : siteInfo.addressFr || t.contact.addressLine1}
                  </span>
                  <a
                    href={officialMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 flex items-center gap-1 font-semibold text-sky-400 hover:underline"
                  >
                    <span>
                      {language === 'ar'
                        ? 'عرض على خرائط جوجل'
                        : 'Voir sur Google Maps'}
                    </span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-red-400" />
                <a
                  href={`tel:${cleanPhone}`}
                  className="font-semibold transition-colors hover:text-white"
                >
                  {siteInfo.phoneMain || '+212 7 70 55 82 99'} (24/7)
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-sky-400" />
                <a
                  href={`tel:${cleanLandline}`}
                  className="transition-colors hover:text-white"
                >
                  {language === 'ar' ? 'الهاتف الثابت : ' : 'Fixe : '}
                  {siteInfo.phoneLandline || '08 08 65 58 17'}
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-emerald-400" />
                <a
                  href={`tel:${cleanSecretary}`}
                  className="transition-colors hover:text-white"
                >
                  {language === 'ar' ? 'الكتابة الطبية : ' : 'Secrétariat : '}
                  {siteInfo.phoneSecretary || '06 94 72 79 15'}
                </a>
              </div>
<div className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>{siteInfo.email2 || 'cabinet.medical.dr.namboy@gmail.com'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>{siteInfo.email || 'cabinet.medical.dr.namboy@gmail.com'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-900 pt-10 text-xs text-slate-500 sm:flex-row">
          <div>
            © {new Date().getFullYear()} Cabinet Médical Dr. Evrard Simplice NAMBOY.{' '}
            {t.footer.rights}
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>{language === 'ar' ? 'سلا بطانة • المغرب' : 'Salé Bettana • Maroc'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};