import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useNavigation } from '../context/NavigationContext';
import { AboutSection } from '../components/home/AboutSection';
import { GraduationCap, Award, Users, HeartHandshake, ShieldCheck, Clock, Calendar } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { navigateToBooking, navigate } = useNavigation();

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16 animate-in fade-in duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'التفاني والخبرة الطبية' : 'Excellence & Dévouement'}</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            {language === 'ar' ? 'عن العيادة والدكتور نامبوي إيفرارد سيمبليس' : 'À Propos du Cabinet & du Dr. NAMBOY'}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            {language === 'ar'
              ? 'صرح طبي حديث ومجهز لخدمة ساكنة سلا بطانة ونواحيها على مدار 24 ساعة، يجمع بين الكفاءة العلمية العالية والرعاية الإنسانية الصادقة.'
              : 'Une structure médicale moderne et chaleureuse dédiée à la santé des habitants de Salé Bettana et de la région de Rabat-Salé.'}
          </p>
        </div>

        {/* Core Presentation Section */}
        <AboutSection />

        {/* Medical Ethics & Commitment Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              {language === 'ar' ? 'كفاءة أكاديمية مستمرة' : 'Rigueur Scientifique'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {language === 'ar'
                ? 'تكوين سريري وجامعي مستمر بأعرق مستشفيات الرباط مع مواكبة أحدث البروتوكولات العلاجية العالمية.'
                : 'Formations médicales universitaires continues à Rabat et respect scrupuleux des recommandations des sociétés savantes.'}
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              {language === 'ar' ? 'جاهزية تامة 24/24' : 'Permanence 24h/24'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {language === 'ar'
                ? 'استقبال ورعاية مستمرة للحالات الطارئة ليلاً ونهاراً دون انقطاع، بما في ذلك عطل نهاية الأسبوع والأعياد.'
                : 'Présence médicale constante pour sécuriser votre quotidien face aux imprévus et aux détresses aiguës.'}
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              {language === 'ar' ? 'إنصات وإنسانية' : 'Écoute & Humanisme'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {language === 'ar'
                ? 'كل مريض يحظى بالوقت الكافي للاستماع والشرح الواضح والتكفل الشخصي في كنف الاحترام والسرية.'
                : 'Chaque patient bénéficie d’un temps d’échange approfondi, d’une écoute sans jugement et d’un plan de soins personnalisé.'}
            </p>
          </div>
        </div>

        {/* CTA Bar */}
        <div className="bg-gradient-to-r from-blue-900 via-sky-900 to-slate-900 text-white p-8 sm:p-10 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center sm:text-start">
            <h3 className="text-xl sm:text-2xl font-bold">
              {language === 'ar' ? 'هل تودون حجز موعد مع الدكتور نامبوي ؟' : 'Besoin d’une consultation avec le Dr. NAMBOY ?'}
            </h3>
            <p className="text-xs sm:text-sm text-sky-200">
              {language === 'ar' ? 'احجزوا موعدكم في دقائق عبر نظام العيادة أو واتساب.' : 'Réservez votre créneau en quelques clics ou contactez notre secrétariat.'}
            </p>
          </div>

          <button
            onClick={() => navigateToBooking()}
            className="px-6 py-3.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm shadow-md transition-colors cursor-pointer shrink-0"
          >
            {t.hero.ctaBooking}
          </button>
        </div>
      </div>
    </div>
  );
};
