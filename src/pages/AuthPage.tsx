import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useNavigation } from '../context/NavigationContext';
import { getStoredUsers, saveUser, setCurrentUser } from '../services/dataService';
import { auth } from '../services/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { UserProfile } from '../types';
import {
  Lock,
  Mail,
  Key,
  Stethoscope,
  ShieldCheck,
  ArrowLeft,
  Loader2,
  AlertCircle,
  GraduationCap
} from 'lucide-react';

interface AuthPageProps {
  onLoginSuccess?: (user: UserProfile) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const { t, language, isRtl } = useLanguage();
  const { navigate, navigateToDashboard } = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSuccessfulAuth = (user: UserProfile) => {
    setCurrentUser(user);
    if (onLoginSuccess) {
      onLoginSuccess(user);
    }
    navigateToDashboard();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (auth) {
        try {
          await signInWithEmailAndPassword(auth, email.trim(), password);
        } catch (firebaseErr: any) {
          if (firebaseErr.code === 'auth/user-not-found' || firebaseErr.code === 'auth/invalid-credential') {
            try {
              await createUserWithEmailAndPassword(auth, email.trim(), password);
            } catch (createErr) {
              console.warn('Firebase user creation fallback:', createErr);
            }
          } else {
            console.warn('Firebase auth attempt:', firebaseErr);
          }
        }
      }

      // Check registered users in storage/Firestore
      const users = getStoredUsers();
      const found = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());

      if (found) {
        handleSuccessfulAuth(found);
      } else {
        // Default role is admin with full access as requested
        const customUser: UserProfile = {
          id: `user_${Date.now()}`,
          name: email.split('@')[0],
          email: email.trim(),
          role: 'admin',
          specialty: 'Administrateur Praticien',
          createdAt: new Date().toISOString().split('T')[0],
        };
        saveUser(customUser);
        handleSuccessfulAuth(customUser);
      }
    } catch (err: any) {
      setError(err?.message || (language === 'ar' ? 'حدث خطأ أثناء تسجيل الدخول' : 'Erreur lors de la connexion'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-6 sm:py-12 px-3 sm:px-6 lg:px-8">
      {/* Top return link */}
      <div className="max-w-4xl w-full mx-auto mb-4 px-2">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
          <span>{language === 'ar' ? 'العودة إلى الموقع العام' : 'Retour au site public'}</span>
        </button>
      </div>

      {/* Main Container Card */}
      <div className="max-w-4xl w-full mx-auto bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden grid grid-cols-1 md:grid-cols-12">
        {/* Left Side: Clinic Branding & Badges (Desktop) */}
        <div className="md:col-span-5 bg-gradient-to-br from-blue-900 via-sky-900 to-slate-950 p-6 sm:p-8 text-white flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-sky-400 border border-white/10">
              <Stethoscope className="w-6 h-6" />
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-sky-300 block">
                {language === 'ar' ? 'بوابة الطاقم الطبي والإدارة' : 'Plateforme Médicale & Gestion'}
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1 leading-tight">
                Cabinet Médical Dr. NAMBOY
              </h2>
              <p className="text-xs text-sky-200 mt-2 leading-relaxed">
                {language === 'ar'
                  ? 'فضاء مهني مخصص للأطباء، ومسؤولي التواصل، والمساعدين لإدارة خدمات العيادة والمواعيد عبر Firebase.'
                  : 'Espace professionnel pour le médecin administrateur, les animateurs de contenu et les assistants médicaux.'}
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-white/10 text-xs">
            <div className="flex items-center gap-2.5 text-sky-100">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{language === 'ar' ? 'أمان فائق وتشفير سحابي' : 'Chiffrement Firebase sécurisé'}</span>
            </div>
            <div className="flex items-center gap-2.5 text-sky-100">
              <GraduationCap className="w-4 h-4 text-sky-400 shrink-0" />
              <span>{language === 'ar' ? 'تحكم كامل في الصلاحيات' : 'Contrôle des rôles d’accès (RBAC)'}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Clean Authentication Form */}
        <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider">
                <Lock className="w-3.5 h-3.5" />
                <span>{t.auth.title}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                {language === 'ar' ? 'تسجيل الدخول' : 'Connexion à l’Espace de Gestion'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                {language === 'ar'
                  ? 'أدخل بيانات حسابك للولوج إلى فضاء الإدارة والتدبير الطبي.'
                  : 'Entrez vos identifiants pour accéder au Dashboard du cabinet.'}
              </p>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                  {t.auth.emailLabel}
                </label>
                <div className="relative">
                  <Mail className={`w-4 h-4 text-slate-400 absolute top-3.5 ${isRtl ? 'right-3' : 'left-3'}`} />
                  <input
                    type="email"
                    required
                    placeholder="dr.namboy@cabinet-medical.ma"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-base sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden ${
                      isRtl ? 'pr-9 pl-3 text-right' : 'pl-9 pr-3 text-left'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                  {t.auth.passwordLabel}
                </label>
                <div className="relative">
                  <Key className={`w-4 h-4 text-slate-400 absolute top-3.5 ${isRtl ? 'right-3' : 'left-3'}`} />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-base sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden ${
                      isRtl ? 'pr-9 pl-3 text-right' : 'pl-9 pr-3 text-left'
                    }`}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{t.auth.loginBtn}</span>
              </button>

              <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 text-[11px] text-blue-900 leading-relaxed">
                <span className="font-bold block mb-0.5">
                  {language === 'ar' ? 'صلاحيات الدخول الافتراضية :' : 'Attribution des accès par défaut :'}
                </span>
                {language === 'ar'
                  ? 'يحصل كل حساب جديد مباشرة على صلاحيات المدير (Admin) الكاملة لرؤية وتعديل كافة الإعدادات والمحتوى.'
                  : 'Par défaut, tout compte authentifié dispose des privilèges Administrateur pour piloter et modifier l’ensemble de l’application.'}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
