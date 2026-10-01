import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useSiteContent } from '../../context/SiteContentContext';
import { MessageSquare, Phone, X, Send, Sparkles } from 'lucide-react';

export const WhatsAppWidget: React.FC = () => {
  const { language, isRtl } = useLanguage();
  const { siteInfo } = useSiteContent();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const waNum = (siteInfo.whatsappNumber || '212770558299').replace(/[^0-9]/g, '');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const textToSend = message.trim() || (language === 'ar' ? 'السلام عليكم دكتور نامبوي، أود الاستفسار عن موعد طبي' : 'Bonjour Dr. NAMBOY, je souhaite des renseignements pour une consultation médicale.');
    const url = `https://wa.me/${waNum}?text=${encodeURIComponent(textToSend)}`;
    window.open(url, '_blank');
    setMessage('');
    setIsOpen(false);
  };

  return (
    <aside aria-label="Widget WhatsApp" className={`fixed bottom-6 ${isRtl ? 'left-6' : 'right-6'} z-40 flex flex-col items-end`}>
      {/* Expanded Quick Chat Box */}
      {isOpen && (
        <div className="mb-4 w-72 sm:w-80 rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-emerald-700"></span>
              </div>
              <div>
                <h4 className="text-sm font-bold leading-tight">Cabinet Dr. NAMBOY</h4>
                <p className="text-[11px] text-emerald-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
                  {language === 'ar' ? 'متاح 24/24 عبر واتساب' : 'En ligne 24h/24'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-white/10 text-white/80 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="p-4 bg-slate-50 space-y-3">
            <div className="p-3 rounded-2xl rounded-tl-xs bg-white border border-slate-200 shadow-2xs text-xs text-slate-700 space-y-1">
              <p className="font-semibold text-emerald-800">
                {language === 'ar' ? 'مرحباً بكم في العيادة الطبية !' : 'Bonjour et bienvenue !'}
              </p>
              <p>
                {language === 'ar'
                  ? 'كيف يمكن للدكتور نامبوي وفريق العمل مساعدتكم اليوم ؟'
                  : 'Comment pouvons-nous vous aider ? Posez votre question ou demandez un rendez-vous.'}
              </p>
            </div>

            <form onSubmit={handleSend} className="space-y-2 pt-1">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={language === 'ar' ? 'اكتب رسالتك هنا...' : 'Écrivez votre message...'}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
              <button
                type="submit"
                className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'بدء المحادثة على واتساب' : 'Discuter sur WhatsApp'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative group flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-xl shadow-emerald-600/40 hover:shadow-emerald-600/60 transition-all duration-300 cursor-pointer active:scale-95"
        aria-label="Contacter le Dr NAMBOY par WhatsApp"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-80"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
        <MessageSquare className="w-5 h-5" />
        <span className="hidden sm:inline">WhatsApp 24h/24</span>
      </button>
    </aside>
  );
};
