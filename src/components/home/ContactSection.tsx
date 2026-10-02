import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useSiteContent } from '../../context/SiteContentContext';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, Navigation, MessageSquare } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { t, language, isRtl } = useLanguage();
  const { siteInfo } = useSiteContent();
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });

  const cleanMainPhone = (siteInfo.phoneMain || '+212770558299').replace(/\s+/g, '');
  const cleanLandline = (siteInfo.phoneLandline || '0808655817').replace(/\s+/g, '');
  const cleanSecretary = (siteInfo.phoneSecretary || '0694727915').replace(/\s+/g, '');
  const cleanWa = (siteInfo.whatsappNumber || '212770558299').replace(/[^0-9]/g, '');
  const mapsLink = siteInfo.mapsUrl || 'https://maps.app.goo.gl/rxqWEk1fQAW8Hacj6?g_st=aw';

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
    setTimeout(() => {
      setFormSent(false);
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 4000);
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5" />
            <span>{t.contact.tagline}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t.contact.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            {t.contact.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Contact Cards & Info */}
          <div className="lg:col-span-5 space-y-6">
            {/* Address Card */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {t.contact.addressTitle}
                </h3>
              </div>
              <p className="text-sm text-slate-700 font-semibold pt-1">
                {language === 'ar' ? (siteInfo.addressAr || t.contact.addressLine1) : (siteInfo.addressFr || t.contact.addressLine1)}
              </p>
              <p className="text-xs text-slate-500 font-medium">
                {t.contact.addressLine2}
              </p>
            </div>

            {/* Phones & Emergency Card */}
            <div className="p-6 rounded-2xl bg-red-50/70 border border-red-200 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center animate-pulse">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-red-950">
                    {t.contact.phoneTitle}
                  </h3>
                  <span className="text-[11px] font-bold text-red-700 uppercase">
                    Service d’Urgence Médicale 24/7
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-1 text-xs sm:text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-medium">Urgences  :</span>
                  <a
                    href={`tel:${cleanMainPhone}`}
                    className="font-bold text-red-700 hover:text-red-800 transition-colors"
                  >
                    {siteInfo.phoneMain || '+212 7 70 55 82 99'}
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-medium">WhatsApp :</span>
                  <a
                    href={`tel:${cleanLandline}`}
                    className="font-semibold text-slate-800 hover:text-blue-600 transition-colors"
                  >
                    {'07 70 55 82 99'}
                  </a>
                </div>
                
              </div>
            </div>

            {/* Hours Card */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {t.contact.hoursTitle}
                </h3>
              </div>

              <div className="space-y-2 text-xs sm:text-sm pt-1">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/60">
                  <span className="font-semibold text-red-700">
                    {language === 'ar' ? (siteInfo.hoursAr || t.contact.hours24) : (siteInfo.hoursFr || t.contact.hours24)}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-bold text-[10px]">24/7</span>
                </div>
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/60">
                  <span className="text-slate-600">{t.contact.hoursRegular}</span>
                </div>
                <div className="text-slate-500 text-xs">
                  {t.contact.hoursSunday}
                </div>
              </div>
            </div>

            {/* Fast WhatsApp Callout */}
            <a
              href={`https://wa.me/${cleanWa}?text=Bonjour%20Cabinet%20Dr.%20NAMBOY,%20je%20vous%20contacte%20depuis%20votre%20site%20web`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Contacter sur WhatsApp +212 7 70 55 82 99</span>
            </a>
          </div>

          {/* Right Column: Google Maps & Message Form */}
          <div className="lg:col-span-7 space-y-6">
            {/* Embedded Google Maps container for Salé Bettana */}
            <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-md bg-slate-100 relative group">
              <iframe
                title="Localisation Google Maps - Cabinet Médical Dr. NAMBOY Salé Bettana"
                src="https://maps.google.com/maps?q=Dr.+NAMBOY+Evrard+Simplice+-+M%C3%A9decin+G%C3%A9n%C3%A9raliste+et+Urgentiste+offrant+le+meilleur+des+soins&t=&z=16&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="320"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
              />
              <div className="p-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></div>
                  <span className="text-xs font-bold text-slate-800">
                    Dr. NAMBOY Evrard Simplice • Salé Bettana (au-dessus du Café Anas & Cabinet Dentaire)
                  </span>
                </div>
                <a
                  href={mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-xs"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>{t.contact.openInMaps}</span>
                </a>
              </div>
            </div>

            {/* Quick Contact Form */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-slate-900">
                {t.contact.formTitle}
              </h3>

              {formSent ? (
                <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-800 text-sm font-semibold flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 shrink-0 text-emerald-700" />
                  <span>{t.contact.formSuccess}</span>
                </div>
              ) : (
                <form onSubmit={handleSend} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        {t.contact.formName} *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        {t.contact.formPhone} *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      {t.contact.formEmail}
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      {t.contact.formMessage} *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{t.contact.formSend}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
