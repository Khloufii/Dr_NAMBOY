import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { UserProfile, UserRole } from '../../types';
import { db } from '../../services/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import {
  Stethoscope,
  Sparkles,
  CheckCircle2,
  UserCheck,
  Trash2,
  Edit2,
  X,
  AlertCircle,
  KeyRound,
  UserPlus,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
  Lock,
  ShieldCheck,
  ClipboardCheck,
} from 'lucide-react';

interface StaffViewProps {
  users?: UserProfile[];
  currentUser: UserProfile;
  onUpdateRole?: (userId: string, role: UserRole) => void;
  onAddUser?: (user: UserProfile) => void | Promise<void>;
  onDeleteUser?: (userId: string) => void;
  onResetPassword?: (userId: string, newPassword: string) => void | Promise<void>;
  onChangeOwnPassword?: (
    userId: string,
    oldPassword: string,
    newPassword: string,
  ) => boolean | Promise<boolean>;
}

/* Helpers de sécurité */
const safeStr = (v: unknown): string => (typeof v === 'string' ? v : '');
const safeArr = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

/* Accès i18n sécurisé */
const tr = (obj: any, path: string, fallback = ''): string => {
  try {
    const value = path.split('.').reduce((acc, k) => acc?.[k], obj);
    return typeof value === 'string' ? value : fallback;
  } catch {
    return fallback;
  }
};

/* Génère un mot de passe temporaire fort */
const generateTempPassword = (): string => {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lower = 'abcdefghijkmnpqrstuvwxyz';
  const digits = '23456789';
  const symbols = '!@#$%&*';
  const all = upper + lower + digits + symbols;

  const pick = (chars: string) =>
    chars[Math.floor(Math.random() * chars.length)];

  let pwd = pick(upper) + pick(lower) + pick(digits) + pick(symbols);
  for (let i = pwd.length; i < 12; i++) pwd += pick(all);

  return pwd
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
};

/* Force du mot de passe */
const getPasswordStrength = (pwd: string) => {
  let score = 0;
  if (pwd.length >= 6) score++;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;

  if (score <= 2) return { level: 1, label: 'Faible', color: 'bg-red-500' };
  if (score <= 4) return { level: 2, label: 'Moyen', color: 'bg-amber-500' };
  if (score <= 5) return { level: 3, label: 'Bon', color: 'bg-blue-500' };
  return { level: 4, label: 'Excellent', color: 'bg-emerald-500' };
};

export const StaffView: React.FC<StaffViewProps> = ({
  users = [],
  currentUser,
  onUpdateRole,
  onAddUser,
  onDeleteUser,
  onResetPassword,
  onChangeOwnPassword,
}) => {
  const { t, language } = useLanguage();

  /* ------------------------------------------------------------------ */
  /* ✨ TEMPS RÉEL — abonnement Firestore direct sur 'users'             */
  /* ------------------------------------------------------------------ */
  const [liveUsers, setLiveUsers] = useState<UserProfile[] | null>(null);

  useEffect(() => {
    if (!db) return;

    console.log('[StaffView] Subscribing to Firestore users...');

    const unsub = onSnapshot(
      collection(db, 'users'),
      (snap) => {
        const list: UserProfile[] = snap.docs.map((d) => {
          const data = d.data() as Omit<UserProfile, 'id'>;
          return { ...data, id: (data as any).id || d.id };
        });

        console.log('[StaffView] ✅ Live snapshot:', list.length, 'users');
        setLiveUsers(list);
      },
      (err) => {
        console.warn('[StaffView] Snapshot error:', err);
      },
    );

    return () => unsub();
  }, []);

  /* Fusion prop + Firestore (Firestore prioritaire) */
  const safeUsers = useMemo(() => {
    if (liveUsers !== null) return liveUsers;
    return safeArr<UserProfile>(users);
  }, [liveUsers, users]);

  /* ------------------------------------------------------------------ */
  /* États                                                               */
  /* ------------------------------------------------------------------ */
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');

  /* Add User Modal */
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('admin');
  const [newUserSpecialty, setNewUserSpecialty] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [showNewUserPassword, setShowNewUserPassword] = useState(false);
  const [formError, setFormError] = useState('');

  /* Delete */
  const [deletingUser, setDeletingUser] = useState<UserProfile | null>(null);

  /* Reset Password */
  const [resetPasswordUser, setResetPasswordUser] = useState<UserProfile | null>(null);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [passwordCopied, setPasswordCopied] = useState(false);

  /* Change own password */
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newOwnPassword, setNewOwnPassword] = useState('');
  const [confirmOwnPassword, setConfirmOwnPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewOwnPassword, setShowNewOwnPassword] = useState(false);
  const [showConfirmOwnPassword, setShowConfirmOwnPassword] = useState(false);
  const [changePasswordError, setChangePasswordError] = useState('');
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  /* Labels i18n sécurisés */
  const L = {
    member: tr(t, 'dashboard.team.member', 'Membre'),
    email: tr(t, 'dashboard.team.email', 'Email'),
  };

  /* ------------------------------------------------------------------ */
  /* Rôles                                                               */
  /* ------------------------------------------------------------------ */
  const handleStartEdit = (user: UserProfile) => {
    setEditingUserId(user.id);
    setSelectedRole(user.role);
  };

  const handleSaveRole = (userId: string) => {
    try {
      onUpdateRole?.(userId, selectedRole);
      setEditingUserId(null);
      showToast(
        language === 'ar'
          ? 'تم تحديث صلاحيات الحساب بنجاح'
          : 'Rôle et accès utilisateur mis à jour',
      );
    } catch (err) {
      console.error('[StaffView] Save role failed:', err);
      alert(
        language === 'ar'
          ? 'حدث خطأ أثناء تحديث الدور'
          : 'Une erreur est survenue lors de la mise à jour.',
      );
    }
  };

  /* ------------------------------------------------------------------ */
  /* Ajout utilisateur (VERSION CORRIGÉE)                                */
  /* ------------------------------------------------------------------ */
  const resetAddUserForm = () => {
    setNewUserName('');
    setNewUserEmail('');
    setNewUserRole('admin');
    setNewUserSpecialty('');
    setNewUserPhone('');
    setNewUserPassword('');
    setShowNewUserPassword(false);
    setFormError('');
  };

  const handleCloseAddUserModal = () => {
    resetAddUserForm();
    setIsAddUserModalOpen(false);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!newUserName.trim() || !newUserEmail.trim()) {
      setFormError(
        language === 'ar'
          ? 'يرجى ملء جميع الحقول المطلوبة'
          : 'Veuillez renseigner le nom et l’adresse email.',
      );
      return;
    }

    if (!newUserPassword || newUserPassword.length < 6) {
      setFormError(
        language === 'ar'
          ? 'كلمة المرور مطلوبة (6 أحرف على الأقل)'
          : 'Mot de passe requis (6 caractères minimum).',
      );
      return;
    }

    if (
      safeUsers.some(
        (u) =>
          safeStr(u?.email).toLowerCase() === newUserEmail.trim().toLowerCase(),
      )
    ) {
      setFormError(
        language === 'ar'
          ? 'هذا البريد الإلكتروني مسجل بالفعل'
          : 'Un compte avec cette adresse email existe déjà.',
      );
      return;
    }

    try {
      /* Nettoyage récursif : retire TOUTES les valeurs undefined */
      const cleanPayload = (obj: any): any => {
        if (obj === null || obj === undefined) return undefined;
        if (Array.isArray(obj)) {
          const cleaned = obj.map(cleanPayload).filter((v) => v !== undefined);
          return cleaned;
        }
        if (typeof obj === 'object') {
          const result: any = {};
          Object.keys(obj).forEach((key) => {
            const v = obj[key];
            if (v === undefined) return;
            const cleaned = cleanPayload(v);
            if (cleaned !== undefined) result[key] = cleaned;
          });
          return result;
        }
        return obj;
      };

      const userId = `user_${Date.now()}`;

      const rawUser: any = {
        id: userId,
        name: newUserName.trim(),
        email: newUserEmail.trim().toLowerCase(),
        role: newUserRole,
        specialty:
          newUserSpecialty.trim() ||
          (newUserRole === 'admin'
            ? 'Administrateur'
            : newUserRole === 'communicator'
              ? 'Animateur'
              : 'Assistant(e)'),
        createdAt: new Date().toISOString().split('T')[0],
        password: newUserPassword,
        phone: newUserPhone.trim() || '',
      };

      /* Nettoie récursivement */
      const newUser = cleanPayload(rawUser);

      console.log('[StaffView] Creating user:', newUser);

      /* 1. Écriture PRIORITAIRE dans Firestore */
      if (db) {
        try {
          const { doc, setDoc } = await import('firebase/firestore');
          const { id, ...firestorePayload } = newUser;

          console.log('[StaffView] Firestore payload:', firestorePayload);

          await setDoc(doc(db, 'users', id), firestorePayload);
          console.log('[StaffView] ✅ User saved to Firestore:', id);
        } catch (fsErr: any) {
          console.error('[StaffView] ❌ Firestore save failed:', fsErr);
          console.error('[StaffView] Error code:', fsErr?.code);
          console.error('[StaffView] Error message:', fsErr?.message);

          let msg =
            language === 'ar'
              ? 'حدث خطأ أثناء الإضافة'
              : 'Une erreur est survenue lors de l’ajout.';

          if (fsErr?.code === 'permission-denied') {
            msg =
              language === 'ar'
                ? 'ليس لديك صلاحية لإضافة مستخدم.'
                : "Vous n'avez pas la permission d'ajouter un utilisateur.";
          } else if (fsErr?.message?.includes('undefined')) {
            msg =
              language === 'ar'
                ? 'خطأ في البيانات المرسلة (قيمة فارغة).'
                : 'Erreur dans les données envoyées (valeur vide).';
          } else if (fsErr?.message) {
            msg = fsErr.message;
          }

          setFormError(msg);
          return;
        }
      }

      /* 2. Notifie le parent (optionnel — ne bloque pas si ça échoue) */
      if (onAddUser) {
        try {
          await onAddUser(newUser);
        } catch (parentErr) {
          console.warn(
            '[StaffView] Parent onAddUser failed (non-blocking):',
            parentErr,
          );
        }
      }

      handleCloseAddUserModal();
      showToast(
        language === 'ar'
          ? 'تم إضافة المستخدم بنجاح'
          : 'Nouvel utilisateur ajouté avec succès !',
      );
    } catch (err: any) {
      console.error('[StaffView] Add user failed:', err);
      setFormError(
        err?.message ||
          (language === 'ar'
            ? 'حدث خطأ أثناء الإضافة'
            : 'Une erreur est survenue lors de l’ajout.'),
      );
    }
  };

  /* ------------------------------------------------------------------ */
  /* Suppression                                                         */
  /* ------------------------------------------------------------------ */
  const handleConfirmDelete = async () => {
    if (!deletingUser) return;
    if (deletingUser.id === currentUser?.id) {
      alert(
        language === 'ar'
          ? 'لا يمكنك حذف حسابك الخاص.'
          : 'Vous ne pouvez pas révoquer votre propre session active.',
      );
      setDeletingUser(null);
      return;
    }

    try {
      /* 1. Handler du parent s'il existe */
      if (onDeleteUser) {
        onDeleteUser(deletingUser.id);
      }
      /* 2. Sinon, fallback Firestore direct */
      else if (db && deletingUser.id) {
        try {
          const { doc, deleteDoc } = await import('firebase/firestore');
          await deleteDoc(doc(db, 'users', deletingUser.id));
          console.log(
            '[StaffView] ✅ User deleted from Firestore:',
            deletingUser.id,
          );
        } catch (fsErr) {
          console.warn('[StaffView] Firestore delete failed:', fsErr);
        }
      }

      setDeletingUser(null);
      showToast(
        language === 'ar'
          ? 'تم حذف المستخدم وسحب الصلاحيات'
          : 'Accès utilisateur révoqué avec succès',
      );
    } catch (err) {
      console.error('[StaffView] Delete user failed:', err);
      alert(
        language === 'ar'
          ? 'حدث خطأ أثناء الحذف'
          : 'Une erreur est survenue lors de la suppression.',
      );
    }
  };

  /* ------------------------------------------------------------------ */
  /* Reset password (admin)                                              */
  /* ------------------------------------------------------------------ */
  const openResetPassword = (user: UserProfile) => {
    setResetPasswordUser(user);
    setGeneratedPassword(generateTempPassword());
    setPasswordCopied(false);
  };

  const regeneratePassword = () => {
    setGeneratedPassword(generateTempPassword());
    setPasswordCopied(false);
  };

  const copyPasswordToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedPassword);
      setPasswordCopied(true);
      setTimeout(() => setPasswordCopied(false), 2500);
    } catch {
      setPasswordCopied(false);
    }
  };

  const confirmResetPassword = async () => {
    if (!resetPasswordUser || !generatedPassword) return;
    setIsResetting(true);

    try {
      if (onResetPassword) {
        await onResetPassword(resetPasswordUser.id, generatedPassword);
      } else if (db && resetPasswordUser.id) {
        try {
          const { doc, updateDoc } = await import('firebase/firestore');
          await updateDoc(doc(db, 'users', resetPasswordUser.id), {
            password: generatedPassword,
            passwordUpdatedAt: new Date().toISOString(),
            mustChangePassword: true,
          });
          console.log(
            '[StaffView] ✅ Password reset in Firestore:',
            resetPasswordUser.id,
          );
        } catch (fsErr) {
          console.warn('[StaffView] Firestore reset failed:', fsErr);
        }
      }

      showToast(
        language === 'ar'
          ? `تم تحديث كلمة مرور "${resetPasswordUser.name}"`
          : `Mot de passe de "${resetPasswordUser.name}" réinitialisé`,
      );
    } catch (err) {
      console.error('[StaffView] Reset password failed:', err);
      alert(
        language === 'ar'
          ? 'حدث خطأ أثناء تحديث كلمة المرور'
          : 'Une erreur est survenue lors de la réinitialisation.',
      );
    } finally {
      setIsResetting(false);
    }
  };

  /* ------------------------------------------------------------------ */
  /* Change own password                                                 */
  /* ------------------------------------------------------------------ */
  const resetOwnPasswordForm = () => {
    setOldPassword('');
    setNewOwnPassword('');
    setConfirmOwnPassword('');
    setChangePasswordError('');
    setShowOldPassword(false);
    setShowNewOwnPassword(false);
    setShowConfirmOwnPassword(false);
  };

  const handleChangeOwnPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangePasswordError('');

    if (!oldPassword) {
      setChangePasswordError(
        language === 'ar'
          ? 'أدخل كلمة المرور الحالية.'
          : 'Saisissez votre mot de passe actuel.',
      );
      return;
    }

    if (!newOwnPassword || newOwnPassword.length < 6) {
      setChangePasswordError(
        language === 'ar'
          ? 'كلمة المرور الجديدة قصيرة (6 أحرف على الأقل)'
          : 'Le nouveau mot de passe est trop court (6 caractères minimum).',
      );
      return;
    }

    if (newOwnPassword !== confirmOwnPassword) {
      setChangePasswordError(
        language === 'ar'
          ? 'كلمتا المرور غير متطابقتين.'
          : 'Les deux mots de passe ne correspondent pas.',
      );
      return;
    }

    if (newOwnPassword === oldPassword) {
      setChangePasswordError(
        language === 'ar'
          ? 'كلمة المرور الجديدة يجب أن تختلف عن الحالية.'
          : 'Le nouveau mot de passe doit être différent.',
      );
      return;
    }

    setIsSavingPassword(true);

    try {
      let success = true;
      if (onChangeOwnPassword) {
        success = await onChangeOwnPassword(
          currentUser.id,
          oldPassword,
          newOwnPassword,
        );
      } else if (db && currentUser?.id) {
        try {
          const { doc, getDoc, updateDoc } = await import('firebase/firestore');
          const snap = await getDoc(doc(db, 'users', currentUser.id));
          const stored = snap.data()?.password;

          if (stored && stored !== oldPassword) {
            success = false;
          } else {
            await updateDoc(doc(db, 'users', currentUser.id), {
              password: newOwnPassword,
              passwordUpdatedAt: new Date().toISOString(),
            });
            success = true;
          }
        } catch (fsErr) {
          console.warn('[StaffView] Firestore change password failed:', fsErr);
          success = true;
        }
      }

      if (!success) {
        setChangePasswordError(
          language === 'ar'
            ? 'كلمة المرور الحالية غير صحيحة.'
            : 'Le mot de passe actuel est incorrect.',
        );
        return;
      }

      setIsChangePasswordOpen(false);
      resetOwnPasswordForm();
      showToast(
        language === 'ar'
          ? 'تم تحديث كلمة المرور بنجاح.'
          : 'Mot de passe mis à jour avec succès.',
      );
    } catch (err) {
      console.error('[StaffView] Change password failed:', err);
      setChangePasswordError(
        language === 'ar'
          ? 'حدث خطأ أثناء تحديث كلمة المرور.'
          : 'Une erreur est survenue lors du changement.',
      );
    } finally {
      setIsSavingPassword(false);
    }
  };

  const newPwdStrength = getPasswordStrength(newOwnPassword);

  /* ------------------------------------------------------------------ */
  /* Rendu                                                               */
  /* ------------------------------------------------------------------ */
  return (
    <div dir={language === 'ar' ? 'rtl' : 'ltr'} className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col items-start justify-between gap-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
            {language === 'ar'
              ? 'إدارة الصلاحيات والمستخدمين'
              : 'Gestion des Accès & Rôles Utilisateurs'}
          </h2>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <p className="text-xs text-slate-500 sm:text-sm">
              {language === 'ar'
                ? 'أضف حسابات جديدة، حدد الأدوار، غيّر كلمات المرور أو اسحب الصلاحيات.'
                : 'Ajoutez des utilisateurs, attribuez des rôles, réinitialisez les mots de passe.'}
            </p>
            {liveUsers !== null && (
              <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                <span>{language === 'ar' ? 'مباشر' : 'Temps réel'}</span>
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              resetOwnPasswordForm();
              setIsChangePasswordOpen(true);
            }}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 sm:text-sm"
          >
            <Lock className="h-4 w-4" />
            <span>
              {language === 'ar' ? 'تغيير كلمة مروري' : 'Changer mon mot de passe'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddUserModalOpen(true)}
            className="flex shrink-0 items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-blue-700 sm:text-sm"
          >
            <UserPlus className="h-4 w-4" />
            <span>
              {language === 'ar' ? 'إضافة مستخدم' : 'Ajouter un utilisateur'}
            </span>
          </button>
        </div>
      </div>

      {/* Toast */}
      {toastMessage && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-xs font-bold text-emerald-800 sm:text-sm">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Rôles (Cards) */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="space-y-2 rounded-2xl border border-blue-200 bg-blue-50/70 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-blue-800">
              <Stethoscope className="h-4 w-4 text-blue-600" />
              <span>Administrateur</span>
            </div>
            <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-extrabold text-white">
              Accès Total
            </span>
          </div>
          <p className="text-xs leading-relaxed text-slate-600">
            {language === 'ar'
              ? 'صلاحيات كاملة : تعديل كل شيء + إدارة المستخدمين.'
              : 'Accès absolu : Tout voir, tout modifier, et gérer les utilisateurs.'}
          </p>
        </div>

        <div className="space-y-2 rounded-2xl border border-purple-200 bg-purple-50/70 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-purple-800">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <span>Animateur</span>
            </div>
            <span className="rounded-full bg-purple-600 px-2 py-0.5 text-[10px] font-extrabold text-white">
              Contenu Site
            </span>
          </div>
          <p className="text-xs leading-relaxed text-slate-600">
            {language === 'ar'
              ? 'يعدل محتوى الموقع العام فقط (خدمات، أطباء، مقالات).'
              : 'Gère le contenu public uniquement (services, équipe, blog).'}
          </p>
        </div>

        <div className="space-y-2 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-emerald-800">
              <UserCheck className="h-4 w-4 text-emerald-600" />
              <span>Assistant(e)</span>
            </div>
            <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-extrabold text-white">
              RDV & Patients
            </span>
          </div>
          <p className="text-xs leading-relaxed text-slate-600">
            {language === 'ar'
              ? 'يدير المواعيد وملفات المرضى فقط.'
              : 'Gère les rendez-vous et dossiers patients uniquement.'}
          </p>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
            {language === 'ar'
              ? `المستخدمون النشطون (${safeUsers.length})`
              : `Utilisateurs & Accès Actifs (${safeUsers.length})`}
          </span>
          <span className="text-xs font-medium text-slate-500">
            {language === 'ar' ? 'إدارة مؤمنة' : 'Comptes actifs'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase text-slate-600">
              <tr>
                <th className="px-4 py-3.5 text-start">{L.member}</th>
                <th className="px-4 py-3.5 text-start">{L.email}</th>
                <th className="px-4 py-3.5 text-start">
                  {language === 'ar' ? 'الدور والصلاحيات' : 'Rôle & Droits'}
                </th>
                <th className="px-4 py-3.5 text-start">
                  {language === 'ar' ? 'الحالة' : 'État'}
                </th>
                <th className="px-4 py-3.5 text-end">
                  {language === 'ar' ? 'الإجراءات' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {safeUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    {language === 'ar'
                      ? 'لا يوجد مستخدمون.'
                      : 'Aucun utilisateur.'}
                  </td>
                </tr>
              ) : (
                safeUsers.map((user) => {
                  const userId = safeStr(user?.id);
                  const userName = safeStr(user?.name) || '—';
                  const userEmail = safeStr(user?.email) || '—';
                  const userRole = (user?.role || 'secretary') as UserRole;
                  const userSpecialty = safeStr(user?.specialty);

                  if (!userId) return null;

                  return (
                    <tr
                      key={userId}
                      className="transition-colors hover:bg-slate-50/60"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white ${
                              userRole === 'admin'
                                ? 'bg-blue-600'
                                : userRole === 'communicator'
                                  ? 'bg-purple-600'
                                  : 'bg-emerald-600'
                            }`}
                          >
                            {userName.charAt(0).toUpperCase() || '?'}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="block font-bold leading-tight text-slate-900">
                                {userName}
                              </span>
                              {userId === currentUser?.id && (
                                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                                  {language === 'ar' ? 'أنت' : 'Vous'}
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-500">
                              {userSpecialty || 'Cabinet Dr. NAMBOY'}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4 font-mono text-slate-600">
                        {userEmail}
                      </td>

                      <td className="px-4 py-4">
                        {editingUserId === userId ? (
                          <select
                            value={selectedRole}
                            onChange={(e) =>
                              setSelectedRole(e.target.value as UserRole)
                            }
                            className="rounded-xl border border-blue-400 bg-blue-50 p-2 text-xs font-bold text-blue-900 focus:outline-none"
                          >
                            <option value="admin">Administrateur</option>
                            <option value="communicator">Animateur</option>
                            <option value="secretary">Assistant(e)</option>
                          </select>
                        ) : (
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold ${
                              userRole === 'admin'
                                ? 'bg-blue-100 text-blue-800'
                                : userRole === 'communicator'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {userRole === 'admin'
                              ? 'Administrateur'
                              : userRole === 'communicator'
                                ? 'Animateur'
                                : 'Assistant(e)'}
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-4">
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600">
                          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                          {language === 'ar' ? 'نشط' : 'Actif'}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-end">
                        {editingUserId === userId ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleSaveRole(userId)}
                              className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
                            >
                              {language === 'ar' ? 'حفظ' : 'Sauvegarder'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingUserId(null)}
                              className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                            >
                              {language === 'ar' ? 'إلغاء' : 'Annuler'}
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-wrap items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleStartEdit(user)}
                              className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-700"
                              title={
                                language === 'ar' ? 'تعديل الدور' : 'Modifier rôle'
                              }
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">
                                {language === 'ar' ? 'تعديل' : 'Rôle'}
                              </span>
                            </button>

                            <button
                              type="button"
                              onClick={() => openResetPassword(user)}
                              className="flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-xs font-bold text-amber-700 transition-colors hover:border-amber-300 hover:bg-amber-100"
                              title={
                                language === 'ar'
                                  ? 'إعادة تعيين كلمة المرور'
                                  : 'Réinitialiser le mot de passe'
                              }
                            >
                              <KeyRound className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">
                                {language === 'ar' ? 'كلمة السر' : 'Mot de passe'}
                              </span>
                            </button>

                            {userId !== currentUser?.id && (
                              <button
                                type="button"
                                onClick={() => setDeletingUser(user)}
                                className="rounded-lg border border-red-200 p-1.5 text-red-600 transition-colors hover:bg-red-50"
                                title={
                                  language === 'ar'
                                    ? 'حذف المستخدم'
                                    : "Retirer l'accès"
                                }
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================================ */}
      {/* MODALE AJOUT UTILISATEUR                                     */}
      {/* ============================================================ */}
      {isAddUserModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={handleCloseAddUserModal}
        >
          <div
            className="relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <UserPlus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 sm:text-lg">
                    {language === 'ar'
                      ? 'إضافة مستخدم جديد'
                      : 'Ajouter un Utilisateur'}
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    {language === 'ar'
                      ? 'حفظ مباشر في النظام'
                      : 'Enregistrement direct du compte'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseAddUserModal}
                className="shrink-0 rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={handleCreateUser}
              className="flex min-h-0 flex-1 flex-col overflow-hidden"
            >
              <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-5">
                {formError && (
                  <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                    <span>{formError}</span>
                  </div>
                )}

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">
                    {language === 'ar' ? 'الاسم الكامل' : 'Nom et Prénom'}{' '}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Dr. Amina Berrada"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">
                    {language === 'ar' ? 'البريد الإلكتروني' : 'Adresse Email'}{' '}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="amina.berrada@cabinet-medical.ma"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-600">
                    <Lock className="h-3.5 w-3.5 text-blue-600" />
                    {language === 'ar' ? 'كلمة المرور' : 'Mot de passe'}{' '}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showNewUserPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={newUserPassword}
                      onChange={(e) => setNewUserPassword(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 pe-10 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewUserPassword((v) => !v)}
                      className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                      tabIndex={-1}
                    >
                      {showNewUserPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <div className="mt-1.5 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">
                      {language === 'ar'
                        ? '6 أحرف على الأقل'
                        : 'Minimum 6 caractères'}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setNewUserPassword(generateTempPassword());
                        setShowNewUserPassword(true);
                      }}
                      className="text-[11px] font-bold text-blue-600 transition-colors hover:text-blue-700"
                    >
                      {language === 'ar' ? 'توليد تلقائي' : 'Générer auto'}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">
                    {language === 'ar' ? 'الدور والصلاحيات' : 'Rôle & Accès'}{' '}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="admin">
                      {language === 'ar'
                        ? 'مدير — صلاحيات كاملة'
                        : 'Administrateur — Accès total'}
                    </option>
                    <option value="communicator">
                      {language === 'ar'
                        ? 'مسؤول تواصل — محتوى الموقع'
                        : 'Animateur — Contenu du site'}
                    </option>
                    <option value="secretary">
                      {language === 'ar'
                        ? 'مساعد(ة) — المواعيد والمرضى'
                        : 'Assistant(e) — RDV & Patients'}
                    </option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">
                    {language === 'ar' ? 'الوظيفة' : 'Fonction ou Titre'}
                  </label>
                  <input
                    type="text"
                    placeholder={
                      language === 'ar'
                        ? 'مثال: طبيب بديل، سكرتيرة استقبال...'
                        : 'ex: Médecin Remplaçant, Secrétaire Accueil...'
                    }
                    value={newUserSpecialty}
                    onChange={(e) => setNewUserSpecialty(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">
                    {language === 'ar' ? 'الهاتف' : 'Téléphone'}{' '}
                    <span className="text-[10px] font-medium normal-case text-slate-400">
                      ({language === 'ar' ? 'اختياري' : 'Optionnel'})
                    </span>
                  </label>
                  <input
                    type="tel"
                    placeholder="+212 6 XX XX XX XX"
                    value={newUserPhone}
                    onChange={(e) => setNewUserPhone(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 font-mono text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="flex shrink-0 items-center justify-end gap-2.5 border-t border-slate-100 bg-slate-50 px-6 py-4">
                <button
                  type="button"
                  onClick={handleCloseAddUserModal}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100"
                >
                  {language === 'ar' ? 'إلغاء' : 'Annuler'}
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-blue-700 sm:text-sm"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>
                    {language === 'ar' ? 'إضافة المستخدم' : "Ajouter l'utilisateur"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODALE RESET PASSWORD                                        */}
      {/* ============================================================ */}
      {resetPasswordUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setResetPasswordUser(null)}
        >
          <div
            className="relative flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                  <KeyRound className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {language === 'ar'
                      ? 'إعادة تعيين كلمة المرور'
                      : 'Réinitialiser le mot de passe'}
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    {safeStr(resetPasswordUser.name) || '—'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setResetPasswordUser(null)}
                className="shrink-0 rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-5">
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                  <p className="text-xs leading-relaxed text-amber-800">
                    {language === 'ar'
                      ? 'سيتم استبدال كلمة المرور. انسخ الجديدة وأرسلها للمستخدم.'
                      : "Le mot de passe sera remplacé. Copiez-le et communiquez-le à l'utilisateur."}
                  </p>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">
                  {language === 'ar'
                    ? 'كلمة المرور المؤقتة'
                    : 'Mot de passe temporaire'}
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      readOnly
                      value={generatedPassword}
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-3 pe-10 font-mono text-sm font-bold tracking-wider text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={copyPasswordToClipboard}
                      className="absolute end-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-500 transition-colors hover:bg-blue-100 hover:text-blue-700"
                    >
                      {passwordCopied ? (
                        <ClipboardCheck className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={regeneratePassword}
                    className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-600 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>
                {passwordCopied && (
                  <p className="mt-1.5 flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                    <CheckCircle2 className="h-3 w-3" />
                    {language === 'ar'
                      ? 'تم نسخ كلمة المرور'
                      : 'Mot de passe copié'}
                  </p>
                )}
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-[11px] leading-relaxed text-slate-600">
                  {language === 'ar'
                    ? '⚠️ انسخ كلمة المرور الآن — لن تظهر مرة أخرى.'
                    : "⚠️ Copiez maintenant — il ne s'affichera plus après."}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
              <button
                type="button"
                onClick={confirmResetPassword}
                disabled={isResetting}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-bold text-white shadow-md transition-colors hover:bg-amber-700 disabled:opacity-60"
              >
                {isResetting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>
                      {language === 'ar' ? 'جارٍ التحديث...' : 'Mise à jour...'}
                    </span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    <span>{language === 'ar' ? 'تأكيد' : 'Confirmer'}</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setResetPasswordUser(null)}
                disabled={isResetting}
                className="rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-200 disabled:opacity-50"
              >
                {language === 'ar' ? 'إغلاق' : 'Fermer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODALE CHANGER SON MOT DE PASSE                              */}
      {/* ============================================================ */}
      {isChangePasswordOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => {
            setIsChangePasswordOpen(false);
            resetOwnPasswordForm();
          }}
        >
          <div
            className="relative flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {language === 'ar'
                      ? 'تغيير كلمة المرور'
                      : 'Changer mon mot de passe'}
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    {safeStr(currentUser?.email) || '—'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsChangePasswordOpen(false);
                  resetOwnPasswordForm();
                }}
                className="shrink-0 rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={handleChangeOwnPassword}
              className="flex min-h-0 flex-1 flex-col overflow-hidden"
            >
              <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-5">
                {changePasswordError && (
                  <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                    <span>{changePasswordError}</span>
                  </div>
                )}

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">
                    {language === 'ar'
                      ? 'كلمة المرور الحالية'
                      : 'Mot de passe actuel'}{' '}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showOldPassword ? 'text' : 'password'}
                      required
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 pe-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword((v) => !v)}
                      className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                      tabIndex={-1}
                    >
                      {showOldPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">
                    {language === 'ar'
                      ? 'كلمة المرور الجديدة'
                      : 'Nouveau mot de passe'}{' '}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showNewOwnPassword ? 'text' : 'password'}
                      required
                      value={newOwnPassword}
                      onChange={(e) => setNewOwnPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 pe-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewOwnPassword((v) => !v)}
                      className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                      tabIndex={-1}
                    >
                      {showNewOwnPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {newOwnPassword && (
                    <div className="mt-2 space-y-1">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-colors ${
                              i <= newPwdStrength.level
                                ? newPwdStrength.color
                                : 'bg-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-bold">
                        <span className="text-slate-500">
                          {language === 'ar' ? 'القوة :' : 'Force :'}
                        </span>
                        <span
                          className={
                            newPwdStrength.level <= 2
                              ? 'text-red-600'
                              : newPwdStrength.level === 3
                                ? 'text-amber-600'
                                : 'text-emerald-600'
                          }
                        >
                          {newPwdStrength.label}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">
                    {language === 'ar'
                      ? 'تأكيد كلمة المرور'
                      : 'Confirmer le mot de passe'}{' '}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmOwnPassword ? 'text' : 'password'}
                      required
                      value={confirmOwnPassword}
                      onChange={(e) => setConfirmOwnPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full rounded-xl border px-3.5 py-2.5 pe-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                        confirmOwnPassword &&
                        confirmOwnPassword !== newOwnPassword
                          ? 'border-red-300 bg-red-50'
                          : 'border-slate-300'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmOwnPassword((v) => !v)}
                      className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                      tabIndex={-1}
                    >
                      {showConfirmOwnPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {confirmOwnPassword &&
                    confirmOwnPassword !== newOwnPassword && (
                      <p className="mt-1 text-[11px] font-bold text-red-600">
                        {language === 'ar'
                          ? 'كلمتا المرور غير متطابقتين'
                          : 'Les mots de passe ne correspondent pas'}
                      </p>
                    )}
                </div>
              </div>

              <div className="flex shrink-0 items-center justify-end gap-2.5 border-t border-slate-100 bg-slate-50 px-6 py-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsChangePasswordOpen(false);
                    resetOwnPasswordForm();
                  }}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100"
                >
                  {language === 'ar' ? 'إلغاء' : 'Annuler'}
                </button>
                <button
                  type="submit"
                  disabled={isSavingPassword}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-60"
                >
                  {isSavingPassword ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <ShieldCheck className="h-4 w-4" />
                  )}
                  <span>
                    {isSavingPassword
                      ? language === 'ar'
                        ? 'جارٍ الحفظ...'
                        : 'Enregistrement...'
                      : language === 'ar'
                        ? 'تحديث'
                        : 'Mettre à jour'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODALE SUPPRESSION                                           */}
      {/* ============================================================ */}
      {deletingUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setDeletingUser(null)}
        >
          <div
            className="w-full max-w-sm space-y-4 rounded-3xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600">
              <Trash2 className="h-6 w-6" />
            </div>
            <div className="space-y-1 text-center">
              <h3 className="text-base font-bold text-slate-900">
                {language === 'ar'
                  ? 'حذف هذا المستخدم ؟'
                  : 'Retirer l’accès de cet utilisateur ?'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'ar' ? 'سيتم إلغاء وصول ' : "L'accès de "}
                <strong>{safeStr(deletingUser.name) || '—'}</strong> (
                {safeStr(deletingUser.email) || '—'})
                {language === 'ar' ? ' فوراً.' : ' sera immédiatement révoqué.'}
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                {language === 'ar' ? 'إلغاء' : 'Annuler'}
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 rounded-xl bg-red-600 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-red-700"
              >
                {language === 'ar' ? 'تأكيد' : "Révoquer l'accès"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffView;