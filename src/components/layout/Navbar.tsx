import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useNavigation } from '../../context/NavigationContext';
import { useSiteContent } from '../../context/SiteContentContext';
import {
  Calendar,
  ChevronRight,
  Globe,
  Menu,
  Phone,
  ShieldAlert,
  Stethoscope,
  User,
  X,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { UserProfile } from '../../types';

interface NavbarProps {
  onOpenBooking: () => void;
  onOpenAuth: () => void;
  onOpenDashboard: () => void;
  currentUser: UserProfile | null;
}

const NAV_ITEMS = [
  { path: '/', key: 'home' },
  { path: '/a-propos', key: 'about' },
  { path: '/services', key: 'services' },
  { path: '/rendez-vous', key: 'booking' },
  { path: '/conseils-sante', key: 'blog' },
  { path: '/contact', key: 'contact' },
] as const;

export const Navbar: React.FC<NavbarProps> = ({
  onOpenBooking,
  onOpenAuth,
  onOpenDashboard,
  currentUser,
}) => {
  const { t, language, toggleLanguage, isRtl } = useLanguage();
  const { navigate, currentPath } = useNavigation();
  const { siteInfo } = useSiteContent();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduced = useReducedMotion();

  const mainPhone = siteInfo.phoneMain || '+212 7 70 55 82 99';
  const cleanMainPhone = mainPhone.replace(/\s+/g, '');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (path: string) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  const isActive = (path: string) => {
    if (path === '/' && (currentPath === '/' || currentPath === '')) return true;
    if (path !== '/' && currentPath.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      {/* Spacer pour compenser le header fixed */}
      <div aria-hidden="true" className="h-[100px] sm:h-[104px]" />

      <header
        dir={isRtl ? 'rtl' : 'ltr'}
        className={`fixed inset-x-0 top-0 z-50 border-b bg-white transition-all duration-300 ${
          scrolled
            ? 'border-slate-200 shadow-md shadow-slate-900/5'
            : 'border-slate-200/70 shadow-xs'
        }`}
      >
        {/* ============================================================ */}
        {/* BANDEAU D'URGENCE                                            */}
        {/* ============================================================ */}
        <div className="bg-gradient-to-r from-blue-900 via-sky-800 to-blue-950 text-white">
          <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-3 px-4 py-1.5 text-[11px] font-medium sm:px-6 sm:text-xs lg:px-8">
            <div className="flex min-w-0 items-center gap-2">
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-red-400/30 bg-red-500/20 px-2 py-0.5 text-[10px] font-semibold text-red-200 sm:text-[11px]">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-400" />
                </span>
                <span className="whitespace-nowrap">{t.hero.badge247}</span>
              </span>
              <span className="hidden text-slate-400 md:inline">|</span>
              <span className="hidden truncate text-slate-200 md:inline">
                {t.hero.location}
              </span>
            </div>

            <a
              href={`tel:${cleanMainPhone}`}
              className="group flex shrink-0 items-center gap-1.5 whitespace-nowrap font-semibold text-white transition-colors hover:text-sky-200"
            >
              <Phone className="h-3.5 w-3.5 text-red-400 transition-transform group-hover:scale-110" />
              <span>{mainPhone}</span>
            </a>
          </div>
        </div>

        {/* ============================================================ */}
        {/* NAVBAR PRINCIPALE                                            */}
        {/* ============================================================ */}
        <div className="mx-auto max-w-[1500px] px-3 sm:px-5 lg:px-5 xl:px-8">
          <div
            className={`flex items-center justify-between gap-2 transition-all duration-300 lg:gap-3 xl:gap-4 ${
              scrolled ? 'h-14' : 'h-16 sm:h-[68px]'
            }`}
          >
            {/* ---------------- LOGO ---------------- */}
            <div
              onClick={() => handleNavClick('/')}
              className="group flex min-w-0 flex-1 cursor-pointer items-center gap-2 sm:gap-2.5 lg:flex-none"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-700 via-sky-600 to-cyan-500 p-[1.5px] shadow-sm transition-shadow group-hover:shadow-md group-hover:shadow-blue-500/30 sm:h-11 sm:w-11">
                <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-[10px] bg-white">
                  <img
                    src="/images/favicon.jpeg"
                    alt="Cabinet Médical Dr. NAMBOY"
                    className="h-8 w-8 object-contain sm:h-9 sm:w-9"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                      const next = e.currentTarget.nextElementSibling as HTMLElement | null;
                      if (next) next.style.display = 'flex';
                    }}
                  />
                  <Stethoscope className="hidden h-5 w-5 text-blue-700" />
                </div>
              </div>

              {/* Texte du logo : IDENTIQUE sur toutes les tailles */}
              <div className="flex min-w-0 flex-col leading-tight">
                <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-sky-700 sm:text-[10px] sm:tracking-[0.14em]">
                  {language === 'ar' ? 'عيادة طبية' : 'Cabinet Médical'}
                </span>
                <span className="truncate text-[12px] font-black tracking-tight text-slate-900 sm:text-sm lg:text-[15px] xl:text-base">
                  {language === 'ar'
                    ? 'د. نامبوي إيفرارد سيمبليس'
                    : 'Dr. NAMBOY Evrard Simplice'}
                </span>
                <span className="truncate text-[9px] font-medium text-slate-500 sm:text-[10px]">
                  {language === 'ar'
                    ? 'سلا بطانة • مستعجلات 24/24'
                    : 'Salé Bettana • Urgences 24h/24'}
                </span>
              </div>
            </div>

            {/* ---------------- NAVIGATION DESKTOP ---------------- */}
            <nav className="hidden flex-1 items-center justify-center lg:flex">
              <ul className="flex items-center gap-0 xl:gap-1">
                {NAV_ITEMS.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <li key={item.path}>
                      <button
                        onClick={() => handleNavClick(item.path)}
                        className={`relative block whitespace-nowrap rounded-lg px-2 py-2 text-[12px] font-bold tracking-tight transition-colors duration-200 xl:px-3.5 xl:text-sm ${
                          active ? 'text-blue-700' : 'text-slate-700 hover:text-blue-700'
                        }`}
                      >
                        <span className="relative z-10">
                          {t.nav[item.key as keyof typeof t.nav]}
                        </span>
                        {active && (
                          <motion.span
                            layoutId="navbar-underline"
                            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                            className="absolute inset-x-1.5 -bottom-0.5 h-[3px] rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 xl:inset-x-2"
                          />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* ---------------- ACTIONS DESKTOP ---------------- */}
            {/* Tous les boutons affichent leur texte dès lg */}
            <div className="hidden shrink-0 items-center gap-1 lg:flex xl:gap-2">
              {/* Langue */}
              <button
                onClick={toggleLanguage}
                title={language === 'fr' ? 'Changer en Arabe' : 'Changer en Français'}
                className="flex h-10 items-center gap-1.5 whitespace-nowrap rounded-lg border border-slate-200 bg-slate-50 px-2 text-[11px] font-bold text-slate-700 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 xl:px-3 xl:text-xs"
              >
                <Globe className="h-3.5 w-3.5 shrink-0 text-blue-600 xl:h-4 xl:w-4" />
                <span>{language === 'fr' ? 'العربية' : 'Français'}</span>
              </button>

              {/* Rendez-vous */}
              <motion.button
                onClick={() => handleNavClick('/rendez-vous')}
                whileHover={reduced ? undefined : { y: -1 }}
                whileTap={{ scale: 0.97 }}
                className="group relative flex h-10 items-center gap-1.5 overflow-hidden whitespace-nowrap rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-2.5 text-[11px] font-bold text-white shadow-md shadow-blue-600/25 transition-shadow hover:shadow-lg hover:shadow-blue-600/40 xl:px-4 xl:text-xs"
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
                <Calendar className="h-3.5 w-3.5 shrink-0 xl:h-4 xl:w-4" />
                <span>{t.nav.booking}</span>
              </motion.button>

              {/* Dashboard / Admin */}
              {currentUser ? (
                <motion.button
                  onClick={() => handleNavClick('/dashboard')}
                  whileHover={reduced ? undefined : { y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex h-10 items-center gap-1.5 whitespace-nowrap rounded-lg border border-emerald-200 bg-emerald-50 px-2 text-[11px] font-bold text-emerald-700 transition-colors hover:border-emerald-300 hover:bg-emerald-100 xl:px-3 xl:text-xs"
                >
                  <User className="h-3.5 w-3.5 shrink-0 xl:h-4 xl:w-4" />
                  <span className="max-w-[75px] truncate xl:max-w-[110px]">
                    {currentUser.name.split(' ')[0]}
                  </span>
                </motion.button>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="flex h-10 items-center gap-1.5 whitespace-nowrap rounded-lg border border-slate-200 bg-white px-2 text-[11px] font-bold text-slate-700 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 xl:px-3 xl:text-xs"
                >
                  <User className="h-3.5 w-3.5 shrink-0 text-blue-600 xl:h-4 xl:w-4" />
                  <span>{t.nav.dashboard}</span>
                </button>
              )}
            </div>

            {/* ---------------- BOUTONS MOBILE ---------------- */}
            <div className="flex shrink-0 items-center gap-2 lg:hidden">
              <button
                onClick={() => setMobileMenuOpen((v) => !v)}
                aria-label="Toggle Navigation Menu"
                aria-expanded={mobileMenuOpen}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-800 transition-colors hover:bg-blue-50 hover:text-blue-700"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ============================================================ */}
      {/* DRAWER MOBILE                                                 */}
      {/* ============================================================ */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm lg:hidden"
            />

            <motion.div
              dir={isRtl ? 'rtl' : 'ltr'}
              initial={{ x: isRtl ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRtl ? '100%' : '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed inset-y-0 z-[70] flex w-[85%] max-w-sm flex-col border-slate-200 bg-white shadow-2xl ltr:left-0 ltr:border-r rtl:right-0 rtl:border-l lg:hidden"
            >
              {/* Header du drawer */}
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-700 to-cyan-500 p-[1.5px]">
                    <div className="flex h-full w-full items-center justify-center rounded-[8px] bg-white">
                      <Stethoscope className="h-4 w-4 text-blue-700" />
                    </div>
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700">
                      {language === 'ar' ? 'عيادة طبية' : 'Cabinet Médical'}
                    </span>
                    <span className="text-sm font-black text-slate-900">
                      {language === 'ar' ? 'د. نامبوي' : 'Dr. NAMBOY'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Fermer le menu"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Sélecteur de langue dans le drawer */}
              <div className="border-b border-slate-200 px-5 py-3">
                <button
                  onClick={toggleLanguage}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                >
                  <Globe className="h-4 w-4 text-blue-600" />
                  <span>
                    {language === 'fr' ? 'التبديل إلى العربية' : 'Passer au Français'}
                  </span>
                </button>
              </div>

              {/* Liens */}
              <nav className="flex-1 overflow-y-auto px-3 py-4">
                <ul className="space-y-1">
                  {NAV_ITEMS.map((item) => {
                    const active = isActive(item.path);
                    return (
                      <li key={item.path}>
                        <button
                          onClick={() => handleNavClick(item.path)}
                          className={`group flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200 ${
                            active
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/25'
                              : 'text-slate-800 hover:bg-blue-50 hover:text-blue-700'
                          }`}
                        >
                          <span>{t.nav[item.key as keyof typeof t.nav]}</span>
                          <ChevronRight
                            className={`h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 ${
                              isRtl ? 'rotate-180' : ''
                            } ${active ? 'text-white' : 'text-slate-400'}`}
                          />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              {/* Actions en bas */}
              <div className="space-y-2.5 border-t border-slate-200 p-5">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenBooking();
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-sm font-bold text-white shadow-md shadow-blue-600/25 active:scale-[0.98]"
                >
                  <Calendar className="h-4 w-4" />
                  <span>{t.hero.ctaBooking}</span>
                </button>

                <a
                  href={`tel:${cleanMainPhone}`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-3 text-sm font-bold text-red-700 transition-colors hover:bg-red-100"
                >
                  <ShieldAlert className="h-4 w-4" />
                  <span>{t.hero.ctaEmergency}</span>
                </a>

                {currentUser ? (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenDashboard();
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 py-3 text-sm font-bold text-emerald-700 transition-colors hover:bg-emerald-100"
                  >
                    <User className="h-4 w-4" />
                    <span className="truncate">{currentUser.name}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAuth();
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-sm font-bold text-slate-800 transition-colors hover:bg-blue-50 hover:text-blue-700"
                  >
                    <User className="h-4 w-4 text-blue-600" />
                    <span>{t.nav.dashboard}</span>
                  </button>
                )}

                <div className="pt-1 text-center text-[11px] font-medium text-slate-500">
                  {language === 'ar'
                    ? 'سلا بطانة • مستعجلات 24/24'
                    : 'Salé Bettana • Urgences 24h/24'}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};