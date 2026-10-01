import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { AppointmentBooking } from '../components/home/AppointmentBooking';
import { Calendar, Phone, Clock, ShieldAlert } from 'lucide-react';

interface BookingPageProps {
  initialServiceId?: string;
}

export const BookingPage: React.FC<BookingPageProps> = ({ initialServiceId }) => {
  const { t, language } = useLanguage();

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16 animate-in fade-in duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Urgent Hotline Strip */}
        <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2.5 text-center sm:text-start">
            <ShieldAlert className="w-5 h-5 shrink-0 animate-pulse text-white" />
            <span className="text-xs sm:text-sm font-bold">
              {language === 'ar'
                ? 'حالة طوارئ مستعجلة ؟ اتصلوا مباشرة دون انتظار موعد : 212770558299+'
                : 'Urgence médicale aiguë ? Ne prenez pas de rendez-vous, appelez directement : +212 7 70 55 82 99'}
            </span>
          </div>

          <a
            href="tel:+212770558299"
            className="px-4 py-2 rounded-xl bg-white text-red-700 font-bold text-xs shadow-xs hover:bg-red-50 transition-colors shrink-0"
          >
            {language === 'ar' ? 'اتصال فوري 24/24' : 'Appel Direct 24/7'}
          </a>
        </div>

        {/* Core Booking Component */}
        <AppointmentBooking initialServiceId={initialServiceId} />
      </div>
    </div>
  );
};
