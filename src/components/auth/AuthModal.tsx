import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { getStoredUsers, saveUser, setCurrentUser } from '../../services/dataService';
import { auth } from '../../services/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { UserProfile } from '../../types';
import {
  Lock,
  Mail,
  Key,
  X,
  Loader2,
  AlertCircle
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const { t, language, isRtl } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

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

      // Check registered users
      const users = getStoredUsers();
      const found = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());

      if (found) {
        setCurrentUser(found);
        onLoginSuccess(found);
        onClose();
      } else {
        // Default role is admin with full access
        const customUser: UserProfile = {
          id: `user_${Date.now()}`,
          name: email.split('@')[0],
          email: email.trim(),
          role: 'admin',
          specialty: 'Administrateur Praticien',
          createdAt: new Date().toISOString().split('T')[0],
        };
        saveUser(customUser);
        setCurrentUser(customUser);
        onLoginSuccess(customUser);
        onClose();
      }
    } catch (err: any) {
      setError(err?.message || (language === 'ar' ? 'حدث خطأ أثناء تسجيل الدخول' : 'Erreur lors de la connexion'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[calc(100dvh-1.5rem)] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                {t.auth.title}
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 leading-snug">
                Cabinet Dr. NAMBOY • Salé Bettana
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
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

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 leading-relaxed">
              <span className="font-bold text-slate-800 block mb-0.5">
                {language === 'ar' ? 'صلاحيات الدخول الافتراضية :' : 'Rôle attribué par défaut :'}
              </span>
              {language === 'ar'
                ? 'الحسابات الجديدة تحصل تلقائياً على صفة المدير (Admin) بصلاحيات كاملة للتحكم في المنصة.'
                : 'Par défaut, chaque utilisateur authentifié accède avec les privilèges Administrateur (contrôle total).'}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
