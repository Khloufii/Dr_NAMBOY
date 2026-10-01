import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useNavigation } from '../../context/NavigationContext';
import { useSiteContent } from '../../context/SiteContentContext';
import { Phone, MapPin, Mail, Clock, Heart, ShieldAlert, Globe, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t, language, toggleLanguage } = useLanguage();
  const { navigate, navigateToService } = useNavigation();
  const { siteInfo, services } = useSiteContent();

  const officialMapsUrl = siteInfo.mapsUrl || "https://maps.app.goo.gl/rxqWEk1fQAW8Hacj6?g_st=aw";
  const cleanPhone = (siteInfo.phoneMain || '+212770558299').replace(/\s+/g, '');
  const cleanLandline = (siteInfo.phoneLandline || '0808655817').replace(/\s+/g, '');
  const cleanSecretary = (siteInfo.phoneSecretary || '0694727915').replace(/\s+/g, '');

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      {/* 24/7 Emergency Highlight Strip */}
      <div className="bg-gradient-to-r from-red-900/90 via-red-800 to-red-950 py-4 px-4 border-b border-red-700/50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0 animate-pulse">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-extrabold text-sm sm:text-base">
                {t.footer.emergencyTitle}
              </h4>
              <p className="text-red-200 text-xs">
                {t.footer.emergencyText}
              </p>
            </div>
          </div>

          <a
            href={`tel:${cleanPhone}`}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-red-700 hover:bg-red-50 font-bold text-xs sm:text-sm shadow-md transition-colors"
          >
            <Phone className="w-4 h-4 text-red-600" />
            <span>{t.footer.callEmergency} ({siteInfo.phoneMain || '+212 7 70 55 82 99'})</span>
          </a>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Brand info */}
          <div className="lg:col-span-4 space-y-4">
            <div
              onClick={() => navigate('/')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 p-0.5 shadow-md flex items-center justify-center">
                <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center overflow-hidden">
                  <img
                    src="/images/favicon.jpeg"
                    alt="Cabinet Dr. NAMBOY"
                    className="w-10 h-10 object-contain"
                  />
                </div>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-sky-400">
                  {language === 'ar' ? 'عيادة طبية' : 'Cabinet Médical'}
                </span>
                <h3 className="text-base font-bold text-white leading-tight">
                  {language === 'ar' ? 'د. نامبوي إيفرارد سيمبليس' : 'Dr. NAMBOY Evrard Simplice'}
                </h3>
                <span className="text-xs text-slate-400">Salé Bettana</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {t.footer.description}
            </p>

            <button
              onClick={toggleLanguage}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>{language === 'fr' ? 'Changer en Arabe (العربية)' : 'Passer en Français'}</span>
            </button>
          </div>

          {/* Quick navigation */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button onClick={() => navigate('/')} className="hover:text-white transition-colors cursor-pointer">
                  {t.nav.home}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/a-propos')} className="hover:text-white transition-colors cursor-pointer">
                  {t.nav.about}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/services')} className="hover:text-white transition-colors cursor-pointer">
                  {t.nav.services}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/rendez-vous')} className="hover:text-white transition-colors cursor-pointer">
                  {t.nav.booking}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/conseils-sante')} className="hover:text-white transition-colors cursor-pointer">
                  {t.nav.blog}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/contact')} className="hover:text-white transition-colors cursor-pointer">
                  {t.nav.contact}
                </button>
              </li>
            </ul>
          </div>

          {/* Specialties list with direct links to each page */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100">
              {t.footer.servicesTitle}
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              {services.slice(0, 7).map((s) => (
                <li key={s.id}>
                  <button onClick={() => navigateToService(s.id)} className="hover:text-sky-300 transition-colors cursor-pointer text-start">
                    • {language === 'ar' ? s.titleAr : s.titleFr}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Coordinates & Google Maps */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100">
              {t.contact.addressTitle}
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <span>{language === 'ar' ? (siteInfo.addressAr || t.contact.addressLine1) : (siteInfo.addressFr || t.contact.addressLine1)}</span>
                  <a
                    href={officialMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sky-400 hover:underline mt-1 font-semibold flex items-center gap-1"
                  >
                    <span>Voir sur Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-400 shrink-0" />
                <a href={`tel:${cleanPhone}`} className="hover:text-white transition-colors font-semibold">
                  {siteInfo.phoneMain || '+212 7 70 55 82 99'} (24/7)
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                <a href={`tel:${cleanLandline}`} className="hover:text-white transition-colors">
                  Fixe : {siteInfo.phoneLandline || '08 08 65 58 17'}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`tel:${cleanSecretary}`} className="hover:text-white transition-colors">
                  Secrétariat : {siteInfo.phoneSecretary || '06 94 72 79 15'}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{siteInfo.email || 'cabinet.medical.dr.namboy@gmail.com'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{siteInfo.email2 || 'cabinet.medical.dr.namboy@gmail.com'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-10 mt-10 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Cabinet Médical Dr. Evrard Simplice NAMBOY. {t.footer.rights}
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Salé Bettana • Maroc</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
