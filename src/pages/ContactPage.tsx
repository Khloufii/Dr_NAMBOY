import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useSiteContent } from '../context/SiteContentContext';
import { ContactSection } from '../components/home/ContactSection';
import { MapPin, Phone, Clock, MessageSquare, ExternalLink, Navigation } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { siteInfo } = useSiteContent();
  const officialMapsUrl = siteInfo.mapsUrl || "https://maps.app.goo.gl/rxqWEk1fQAW8Hacj6?g_st=aw";
  const cleanPhone = (siteInfo.phoneMain || '+212770558299').replace(/\s+/g, '');
  const cleanWa = (siteInfo.whatsappNumber || '212770558299').replace(/[^0-9]/g, '');

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16 animate-in fade-in duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5" />
            <span>{t.contact.tagline}</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            {t.contact.title}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            {t.contact.subtitle}
          </p>
        </div>

        {/* Quick Action Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-start">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
              <Phone className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase">Urgences 24/7</span>
              <a href={`tel:${cleanPhone}`} className="text-base font-bold text-slate-900 block hover:text-red-600">
                {siteInfo.phoneMain || '+212 7 70 55 82 99'}
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase">WhatsApp Direct</span>
              <a
                href={`https://wa.me/${cleanWa}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-bold text-emerald-600 block hover:underline"
              >
                Discuter en direct
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Navigation className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase">Google Maps</span>
              <a
                href={officialMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-bold text-blue-600 block hover:underline flex items-center gap-1"
              >
                <span>Itinéraire GPS</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Embedded Contact & Maps Section */}
        <ContactSection />
      </div>
    </div>
  );
};
