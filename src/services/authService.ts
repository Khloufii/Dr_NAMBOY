import { initializeApp, deleteApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from './firebase';
import { setCurrentUser, saveUser } from './dataService';
import { UserProfile } from '../types';

export type AuthErrorCode =
  | 'unavailable'
  | 'invalid'
  | 'not-authorized'
  | 'too-many'
  | 'network'
  | 'disabled'
  | 'email-in-use'
  | 'weak-password'
  | 'unknown';

export class AuthError extends Error {
  code: AuthErrorCode;
  constructor(code: AuthErrorCode) {
    super(code);
    this.code = code;
    Object.setPrototypeOf(this, AuthError.prototype);
  }
}

const normalize = (email: string) => email.trim().toLowerCase();

const mapFirebaseError = (err: any): AuthError => {
  switch (err?.code) {
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-email':
      return new AuthError('invalid');
    case 'auth/too-many-requests':
      return new AuthError('too-many');
    case 'auth/network-request-failed':
      return new AuthError('network');
    case 'auth/user-disabled':
      return new AuthError('disabled');
    default:
      return new AuthError('unknown');
  }
};

/** Cherche le profil dans Firestore (jamais dans le localStorage, modifiable par n'importe qui). */
export const findStaffProfile = async (email: string): Promise<UserProfile | null> => {
  if (!db) throw new AuthError('unavailable');
  const target = normalize(email);
  const snap = await getDocs(collection(db, 'users'));

  for (const d of snap.docs) {
    const u = d.data() as UserProfile;
    if (u?.email && normalize(u.email) === target) {
      return { ...u, id: u.id || d.id };
    }
  }
  return null;
};

/** Connexion : aucun compte n'est créé, aucun rôle n'est attribué par défaut. */
export const loginStaff = async (email: string, password: string): Promise<UserProfile> => {
  if (!auth || !db) throw new AuthError('unavailable');

  let authEmail: string;
  try {
    const cred = await signInWithEmailAndPassword(auth, normalize(email), password);
    authEmail = cred.user.email || normalize(email);
  } catch (err) {
    throw mapFirebaseError(err);
  }

  try {
    const profile = await findStaffProfile(authEmail);
    if (!profile) {
      await signOut(auth);
      throw new AuthError('not-authorized');
    }
    setCurrentUser(profile);
    return profile;
  } catch (err) {
    if (err instanceof AuthError) throw err;
    await signOut(auth).catch(() => {});
    throw new AuthError('network');
  }
};

export const logoutStaff = async (): Promise<void> => {
  try {
    if (auth) await signOut(auth);
  } finally {
    setCurrentUser(null);
  }
};

/**
 * Surveille la session. Si Firebase n'a pas de session valide, ou si l'email
 * n'est plus dans la base, l'utilisateur est déconnecté.
 */
export const watchStaffSession = (onChange: (user: UserProfile | null) => void): (() => void) => {
  const firebaseAuth = auth;

  if (!firebaseAuth) {
    setCurrentUser(null);
    onChange(null);
    return () => {};
  }

  return onAuthStateChanged(firebaseAuth, async (fbUser) => {
    if (!fbUser?.email) {
      setCurrentUser(null);
      onChange(null);
      return;
    }
    try {
      const profile = await findStaffProfile(fbUser.email);
      if (!profile) {
        await signOut(firebaseAuth);
        setCurrentUser(null);
        onChange(null);
        return;
      }
      setCurrentUser(profile);
      onChange(profile);
    } catch {
      setCurrentUser(null);
      onChange(null);
    }
  });
};

/* ====================================================================== */
/* CRÉATION D'UN MEMBRE DU PERSONNEL (par un admin connecté)               */
/* ====================================================================== */

export interface NewStaffInput {
  name: string;
  email: string;
  password: string;
  role: UserProfile['role'];
  specialty?: string;
  phone?: string;
}

/**
 * Crée le compte de connexion (Firebase Auth) ET le profil (Firestore).
 * Utilise une app Firebase secondaire : la session de l'admin reste intacte.
 * Le mot de passe n'est JAMAIS écrit dans Firestore : Firebase Auth le stocke haché.
 */
export const createStaffAccount = async (input: NewStaffInput): Promise<UserProfile> => {
  if (!auth || !db) throw new AuthError('unavailable');

  const email = normalize(input.email);
  if (input.password.length < 6) throw new AuthError('weak-password');

  const existing = await findStaffProfile(email);
  if (existing) throw new AuthError('email-in-use');

  const secondary = initializeApp(auth.app.options, `staff-create-${Date.now()}`);
  const secondaryAuth = getAuth(secondary);

  try {
    const cred = await createUserWithEmailAndPassword(secondaryAuth, email, input.password);
    await signOut(secondaryAuth);

    const profile: UserProfile = {
      id: cred.user.uid,
      name: input.name.trim(),
      email,
      role: input.role,
      specialty: input.specialty?.trim() || '',
      phone: input.phone?.trim() || '',
      createdAt: new Date().toISOString().split('T')[0],
    };
    saveUser(profile); // aucun champ "password" dans le profil
    return profile;
  } catch (err: any) {
    if (err instanceof AuthError) throw err;
    if (err?.code === 'auth/email-already-in-use') throw new AuthError('email-in-use');
    if (err?.code === 'auth/weak-password') throw new AuthError('weak-password');
    if (err?.code === 'auth/network-request-failed') throw new AuthError('network');
    throw new AuthError('unknown');
  } finally {
    await deleteApp(secondary).catch(() => {});
  }
};

/* ====================================================================== */
/* MOTS DE PASSE                                                           */
/* ====================================================================== */

/** Changement de son propre mot de passe : réauthentification puis mise à jour (Firebase Auth). */
export const changeOwnPassword = async (
  oldPassword: string,
  newPassword: string,
): Promise<void> => {
  const firebaseAuth = auth;
  const user = firebaseAuth?.currentUser;
  if (!firebaseAuth || !user?.email) throw new AuthError('unavailable');
  if (newPassword.length < 6) throw new AuthError('weak-password');

  try {
    const credential = EmailAuthProvider.credential(user.email, oldPassword);
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
  } catch (err: any) {
    switch (err?.code) {
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        throw new AuthError('invalid');
      case 'auth/weak-password':
        throw new AuthError('weak-password');
      case 'auth/too-many-requests':
        throw new AuthError('too-many');
      case 'auth/network-request-failed':
        throw new AuthError('network');
      default:
        throw new AuthError('unknown');
    }
  }
};

/** Envoie à l'utilisateur un email Firebase pour choisir un nouveau mot de passe. */
export const sendStaffPasswordReset = async (email: string): Promise<void> => {
  const firebaseAuth = auth;
  if (!firebaseAuth) throw new AuthError('unavailable');
  try {
    await sendPasswordResetEmail(firebaseAuth, normalize(email));
  } catch (err: any) {
    if (err?.code === 'auth/too-many-requests') throw new AuthError('too-many');
    if (err?.code === 'auth/network-request-failed') throw new AuthError('network');
    throw new AuthError('unknown');
  }
};

/* ====================================================================== */
/* MESSAGES D'ERREUR                                                       */
/* ====================================================================== */

export const authErrorMessage = (code: AuthErrorCode, lang: 'fr' | 'ar'): string => {
  const fr: Record<AuthErrorCode, string> = {
    unavailable: 'Service de connexion indisponible. Réessayez plus tard.',
    invalid: 'Email ou mot de passe incorrect.',
    'not-authorized': 'Ce compte n’est pas autorisé. Contactez l’administrateur du cabinet.',
    'too-many': 'Trop de tentatives. Patientez quelques minutes puis réessayez.',
    network: 'Problème de connexion. Vérifiez votre réseau et réessayez.',
    disabled: 'Ce compte a été désactivé.',
    'email-in-use': 'Cet email est déjà utilisé.',
    'weak-password': 'Mot de passe trop faible (6 caractères minimum).',
    unknown: 'Une erreur est survenue. Réessayez.',
  };
  const ar: Record<AuthErrorCode, string> = {
    unavailable: 'خدمة تسجيل الدخول غير متاحة حالياً. أعد المحاولة لاحقاً.',
    invalid: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
    'not-authorized': 'هذا الحساب غير مخول. تواصل مع مسؤول العيادة.',
    'too-many': 'محاولات كثيرة. انتظر بضع دقائق ثم أعد المحاولة.',
    network: 'مشكل في الاتصال. تحقق من الشبكة وأعد المحاولة.',
    disabled: 'تم تعطيل هذا الحساب.',
    'email-in-use': 'هذا البريد الإلكتروني مستعمل بالفعل.',
    'weak-password': 'كلمة المرور ضعيفة (6 أحرف على الأقل).',
    unknown: 'حدث خطأ. أعد المحاولة.',
  };
  return (lang === 'ar' ? ar : fr)[code];
};