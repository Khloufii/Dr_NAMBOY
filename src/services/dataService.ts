import { Appointment, PatientRecord, UserProfile, BlogPost, ClinicSlot } from '../types';
import { db } from './firebase';
import { collection, doc, setDoc, deleteDoc, getDocs, onSnapshot } from 'firebase/firestore';

const APPOINTMENTS_KEY = 'cabinet_namboy_appointments';
const PATIENTS_KEY = 'cabinet_namboy_patients';
const USERS_KEY = 'cabinet_namboy_users';
const BLOG_KEY = 'cabinet_namboy_blog';
const CURRENT_USER_KEY = 'cabinet_namboy_current_user';

// Primary Doctor / Administrator account
export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'user_dr_namboy',
    name: 'Dr. Evrard Simplice NAMBOY',
    email: 'dr.namboy@cabinet-medical.ma',
    role: 'admin',
    specialty: 'Médecin Directeur & Fondateur (Accès Total)',
    phone: '+212 7 70 55 82 99',
    createdAt: '2024-01-01',
  }
];

// Production Clean Data: No fake/demo data
export const INITIAL_PATIENTS: PatientRecord[] = [];
export const INITIAL_APPOINTMENTS: Appointment[] = [];

// Initial Health Articles for the Blog
export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'post_01',
    titleFr: 'Pourquoi faire un bilan cardiovasculaire régulier avec ECG ?',
    titleAr: 'لماذا يجب إجراء فحص دوري للقلب والأوعية مع تخطيط القلب (ECG) ؟',
    summaryFr: 'L’électrocardiogramme est un examen indolore, rapide et capital pour détecter en amont les anomalies du rythme et prévenir les infarctus.',
    summaryAr: 'يعد تخطيط كهربية القلب فحصاً سريعاً، غير مؤلم وذا أهمية قصوى لاكتشاف اضطرابات النبض والوقاية من الجلطات القلبية.',
    contentFr: `Les maladies cardiovasculaires demeurent l'une des principales causes de complications graves lorsqu'elles ne sont pas dépistées à temps. À Salé Bettana, le Dr. NAMBOY Evrard Simplice reçoit régulièrement des patients souffrant d'hypertension asymptomatique.

L'électrocardiogramme (ECG) disponible directement au cabinet permet en moins de 10 minutes d'enregistrer l'activité électrique du cœur. Il met en évidence :
1. Les troubles du rythme (palpitations, fibrillation auriculaire).
2. Les signes d'ischémie myocardique ou de fatigue du muscle cardiaque.
3. Les répercussions d'une hypertension chronique mal contrôlée.

Nous recommandons un ECG annuel à partir de 45 ans, ou plus tôt en cas d'antécédents familiaux, de diabète ou de tabagisme.`,
    contentAr: `تعتبر أمراض القلب والشرايين من أبرز التحديات الصحية التي تتطلب تشخيصاً مبكراً لتفادي المضاعفات الخطيرة. في عيادتنا بسلا بطانة، يستقبل الدكتور نامبوي إيفرارد سيمبليس يومياً حالات مرتبطة بارتفاع ضغط الدم غير المشخص.

يمكن فحص تخطيط القلب (ECG) المتاح مباشرة بالعيادة من تسجيل الإشارات الكهربائية لعضلة القلب في أقل من 10 دقائق وبدقة عالية:
1. الكشف عن اضطرابات وتسرع دقات القلب.
2. مراقبة علامات نقص التروية الدموية لعضلة القلب.
3. تتبع تأثير ضغط الدم المرتفع والسكري على وظائف القلب.

ننصح بإجراء فحص سنوي ابتداءً من سن 45 عاماً أو قبل ذلك في حال وجود سوابق عائلية أو إصابة بداء السكري.`,
    categoryFr: 'Cardiologie & Prévention',
    categoryAr: 'صحة القلب والوقاية',
    author: 'Dr. Evrard Simplice NAMBOY',
    authorRole: 'Médecin Urgentiste & Praticien',
    date: '2026-09-20',
    readTime: '4 min',
  },
  {
    id: 'post_02',
    titleFr: 'L’Échographie au Premier Trimestre : Sécurité et Clés du Suivi Prénatal',
    titleAr: 'الفحص بالصدى في الأشهر الأولى من الحمل : الأهمية ومراحل المتابعة',
    summaryFr: 'L’échographie obstétricale précoce permet de dater la grossesse avec précision, de vérifier la vitalité embryonnaire et d’assurer une sérénité totale à la maman.',
    summaryAr: 'يمكّن الفحص بالموجات فوق الصوتية المبكر من تحديد عمر الحمل بدقة والاطمئنان على نبض الجنين وتوفير راحة بال تامة للأم.',
    contentFr: `L'échographie obstétricale est un moment clé de la vie d'une future maman. Réalisée au cabinet médical avec un équipement moderne haute résolution, elle répond à des questions médicales primordiales :
- Confirmation de la nidation intra-utérine.
- Datation précise du terme de la grossesse.
- Écoute précoce des bruits du cœur fœtal.
- Dépistage précoce des grossesses multiples.

Notre équipe de sages-femmes et le Dr. NAMBOY vous accueillent dans une atmosphère bienveillante pour vous accompagner mois après mois.`,
    contentAr: `تعد متابعة الحمل بواسطة جهاز الفحص بالصدى (Échographie) محطة أساسية تطمئن المرأة الحامل وعائلتها. يوفر جهاز الفحص المتطور بالعيادة صورة فائقة الوضوح للإجابة عن التساؤلات الطبية الضرورية:
- التأكد من ثبوت الحمل داخل الرحم.
- تحديد موعد الولادة المتوقع بدقة علمية.
- سماع نبضات قلب الجنين ومراقبة نموه الأولي.
- الكشف المبكر عن الحمل بتوأم ومتابعة مؤشرات السلامة.

يرافقكم الدكتور نامبوي والقابلات المؤهلات في بيئة طبية دافئة ومطمئنة طوال فترة الحمل.`,
    categoryFr: 'Santé de la Femme & Maternité',
    categoryAr: 'صحة الأم والجنين',
    author: 'Dr. Evrard Simplice NAMBOY & Sages-Femmes',
    authorRole: 'Échographie & Obstétrique',
    date: '2026-09-15',
    readTime: '5 min',
  },
  {
    id: 'post_03',
    titleFr: 'Reconnaître une Urgence Médicale : Quand Venir Consulter Immédiatement ?',
    titleAr: 'التعرف على الحالات الطارئة : متى يجب التوجه فوراً إلى العيادة ؟',
    summaryFr: 'Fièvre brutale, détresse respiratoire, douleur thoracique ou coupure profonde : découvrez les signaux d’alerte qui nécessitent une prise en charge urgente 24h/24.',
    summaryAr: 'ارتفاع مفاجئ في الحرارة، ضيق حاد في التنفس، ألم بالصدر أو جروح عميقة : إليكم العلامات التحذيرية التي تستدعي تدخلاً عاجلاً 24/24.',
    contentFr: `La permanence médicale 24h/24 du Cabinet Médical Dr. NAMBOY à Salé Bettana a été conçue pour que les résidents ne restent jamais sans solution face à une urgence nocturne ou de week-end.

Les motifs d'urgence absolue incluent :
1. Une douleur aiguë dans la poitrine irradiant vers le bras ou la mâchoire.
2. Une difficulté respiratoire brutale (asthme, étouffement).
3. Une plaie nécessitant une suture rapide pour éviter l'infection et favoriser la cicatrisation.
4. Une fièvre élevée chez l'enfant accompagnée de léthargie ou de convulsions.

En cas de doute, notre numéro direct +212 7 70 55 82 99 reste joignable à chaque instant.`,
    contentAr: `أُنشئت خدمة الطوارئ على مدار 24 ساعة في عيادة الدكتور نامبوي بسلا بطانة لضمان عدم بقاء أي مواطن دون رعاية طبية عاجلة خلال الليل أو عطل نهاية الأسبوع.

من أبرز دواعي الاستشارة الطارئة الفورية:
1. ألم حاد ومفاجئ في القفص الصدري قد يمتد إلى الذراع أو الفك.
2. ضيق تنفس حاد ومفاجئ أو نوبة ربو شديدة.
3. الجروح المفتوحة العميقة التي تتطلب خياطة فورية لمنع التلوث وتسريع الالتئام.
4. الحمى الشديدة لدى الأطفال المصحوبة بخمول أو تشنجات.

لأي استفسار طارئ، خطنا المباشر 212770558299+ متاح دائماً لاستقبالكم.`,
    categoryFr: 'Urgences & Premiers Secours',
    categoryAr: 'طوارئ وإسعافات',
    author: 'Dr. Evrard Simplice NAMBOY',
    authorRole: 'Médecin Urgentiste & Réanimateur',
    date: '2026-09-10',
    readTime: '3 min',
  },
  {
    id: 'post_04',
    titleFr: 'Maladies Tropicales & Paludisme : Précautions et Dépistage Rapide',
    titleAr: 'الأمراض المدارية والملاريا : سبل الوقاية والتشخيص السريع',
    summaryFr: 'De retour de voyage en Afrique subsaharienne ou en zone tropicale ? Toute fièvre inexpliquée doit faire l’objet d’un test de dépistage sans délai.',
    summaryAr: 'هل عدتم من سفر نحو إفريقيا أو المناطق المدارية؟ أي حمى أو قشعريرة غير مفسرة تتطلب اختباراً تشخيصياً سريعاً دون تأخير.',
    contentFr: `Fort de son expertise approfondie en médecine tropicale et infectieuse, le Dr. NAMBOY met en garde les voyageurs : le paludisme peut se déclarer plusieurs jours voire semaines après le retour.

Les symptômes trompeurs :
- Frissons intenses suivis d'une forte fièvre.
- Courbatures musculaires et fatigue inhabituelle.
- Maux de tête et troubles digestifs (nausées, diarrhée).

Le cabinet dispose de tests diagnostiques rapides (TDR) et d'un laboratoire de dépistage permettant d'instaurer le traitement antipaludique adéquat en moins d'une heure.`,
    contentAr: `انطلاقاً من خبرته المتخصصة في الأمراض المدارية والمعدية، يوجه الدكتور نامبوي نصائح للمسافرين : قد تظهر أعراض الملاريا بعد أيام أو أسابيع من العودة من السفر.

أعراض يجب الانتباه لها:
- قشعريرة شديدة متبوعة بارتفاع مفاجئ في درجات الحرارة.
- آلام في المفاصل والعضلات وإرهاق عام.
- صداع شديد واضطرابات هضمية.

توفر العيادة اختبارات كشف سريعة ودقيقة تتيح بدء العلاج المضاد للملاريا في ظرف أقل من ساعة لحماية المريض من أي مضاعفات.`,
    categoryFr: 'Médecine Tropicale & Voyages',
    categoryAr: 'طب السفر والأمراض المدارية',
    author: 'Dr. Evrard Simplice NAMBOY',
    authorRole: 'Spécialiste Médecine Tropicale',
    date: '2026-09-02',
    readTime: '4 min',
  }
];

// Helper to generate 20-min slots
export const generateAvailableSlots = (dateString: string): ClinicSlot[] => {
  const allSlots = [
    '09:00', '09:20', '09:40',
    '10:00', '10:20', '10:40',
    '11:00', '11:20', '11:40',
    '12:00', '12:20',
    '14:00', '14:20', '14:40',
    '15:00', '15:20', '15:40',
    '16:00', '16:20', '16:40',
    '17:00', '17:20', '17:40',
    '18:00', '18:20', '18:40',
    '19:00', '19:20', '19:40'
  ];

  const appointments = getStoredAppointments();
  const bookedForDate = appointments
    .filter(a => a.date === dateString && a.status !== 'cancelled')
    .map(a => a.time);

  return allSlots.map(time => ({
    time,
    available: !bookedForDate.includes(time)
  }));
};

export const getStoredAppointments = (): Appointment[] => {
  try {
    const raw = localStorage.getItem(APPOINTMENTS_KEY);
    if (!raw) return [];
    const parsed: Appointment[] = JSON.parse(raw);
    // Purge any old demo appointments
    return parsed.filter(a => !['apt_101', 'apt_102', 'apt_103', 'apt_104', 'apt_105'].includes(a.id));
  } catch {
    return [];
  }
};

export const saveAppointment = (appointment: Omit<Appointment, 'id' | 'createdAt'>): Appointment => {
  const current = getStoredAppointments();
  const newAppointment: Appointment = {
    ...appointment,
    id: `apt_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  const updated = [newAppointment, ...current];
  localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(updated));

  // Sync with Firebase Firestore
  if (db) {
    try {
      setDoc(doc(db, 'appointments', newAppointment.id), newAppointment).catch((err) => {
        console.warn('Firestore sync warning (saveAppointment):', err);
      });
    } catch (e) {
      console.warn('Firestore write error:', e);
    }
  }

  // Also sync or create patient record if needed
  syncPatientFromAppointment(newAppointment);
  return newAppointment;
};

export const updateAppointmentStatus = (id: string, status: Appointment['status']): void => {
  const current = getStoredAppointments();
  const updated = current.map(item => item.id === id ? { ...item, status } : item);
  localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(updated));

  if (db) {
    try {
      setDoc(doc(db, 'appointments', id), { status }, { merge: true }).catch((err) => {
        console.warn('Firestore sync warning (updateAppointmentStatus):', err);
      });
    } catch (e) {
      console.warn('Firestore write error:', e);
    }
  }
};

export const rescheduleAppointment = (id: string, newDate: string, newTime: string): void => {
  const current = getStoredAppointments();
  const updated = current.map(item => item.id === id ? { ...item, date: newDate, time: newTime, status: 'confirmed' as const } : item);
  localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(updated));

  if (db) {
    try {
      setDoc(doc(db, 'appointments', id), { date: newDate, time: newTime, status: 'confirmed' }, { merge: true }).catch((err) => {
        console.warn('Firestore sync warning (rescheduleAppointment):', err);
      });
    } catch (e) {
      console.warn('Firestore write error:', e);
    }
  }
};

export const getStoredPatients = (): PatientRecord[] => {
  try {
    const raw = localStorage.getItem(PATIENTS_KEY);
    if (!raw) return [];
    const parsed: PatientRecord[] = JSON.parse(raw);
    // Purge any old demo patients
    return parsed.filter(p => !['pat_001', 'pat_002', 'pat_003', 'pat_004', 'pat_005'].includes(p.id));
  } catch {
    return [];
  }
};

export const savePatient = (patient: Omit<PatientRecord, 'id' | 'createdAt' | 'appointmentsCount'>): PatientRecord => {
  const current = getStoredPatients();
  const newPatient: PatientRecord = {
    ...patient,
    id: `pat_${Date.now()}`,
    appointmentsCount: 0,
    createdAt: new Date().toISOString().split('T')[0],
  };
  const updated = [newPatient, ...current];
  localStorage.setItem(PATIENTS_KEY, JSON.stringify(updated));

  if (db) {
    try {
      setDoc(doc(db, 'patients', newPatient.id), newPatient).catch((err) => {
        console.warn('Firestore sync warning (savePatient):', err);
      });
    } catch (e) {
      console.warn('Firestore write error:', e);
    }
  }

  return newPatient;
};

export const updatePatientNotes = (patientId: string, notes: string): void => {
  const current = getStoredPatients();
  const updated = current.map(p => p.id === patientId ? { ...p, notes } : p);
  localStorage.setItem(PATIENTS_KEY, JSON.stringify(updated));

  if (db) {
    try {
      setDoc(doc(db, 'patients', patientId), { notes }, { merge: true }).catch((err) => {
        console.warn('Firestore sync warning (updatePatientNotes):', err);
      });
    } catch (e) {
      console.warn('Firestore write error:', e);
    }
  }
};

export const syncPatientFromAppointment = (apt: Appointment): void => {
  const patients = getStoredPatients();
  const existing = patients.find(p => p.phone === apt.patientPhone || p.fullName.toLowerCase() === apt.patientName.toLowerCase());
  
  if (existing) {
    const updatedPatient = {
      ...existing,
      appointmentsCount: existing.appointmentsCount + 1,
      lastVisit: apt.date
    };
    const updated = patients.map(p => p.id === existing.id ? updatedPatient : p);
    localStorage.setItem(PATIENTS_KEY, JSON.stringify(updated));

    if (db) {
      try {
        setDoc(doc(db, 'patients', existing.id), updatedPatient, { merge: true }).catch((err) => {
          console.warn('Firestore sync warning (syncPatient):', err);
        });
      } catch (e) {
        console.warn('Firestore write error:', e);
      }
    }
  } else {
    const newPat: PatientRecord = {
      id: `pat_${Date.now()}`,
      fullName: apt.patientName,
      phone: apt.patientPhone,
      email: apt.patientEmail,
      gender: 'M',
      appointmentsCount: 1,
      lastVisit: apt.date,
      notes: `Consultation initiale pour ${apt.serviceNameFr}. ${apt.notes || ''}`,
      createdAt: apt.date,
    };
    localStorage.setItem(PATIENTS_KEY, JSON.stringify([newPat, ...patients]));

    if (db) {
      try {
        setDoc(doc(db, 'patients', newPat.id), newPat).catch((err) => {
          console.warn('Firestore sync warning (syncPatient new):', err);
        });
      } catch (e) {
        console.warn('Firestore write error:', e);
      }
    }
  }
};

export const getStoredUsers = (): UserProfile[] => {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) {
      localStorage.setItem(USERS_KEY, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    const parsed: UserProfile[] = JSON.parse(raw);
    const filtered = parsed.filter(u => !['user_sec_fatima', 'user_comm_animateur', 'user_comm_yassine'].includes(u.id));
    return filtered.length > 0 ? filtered : INITIAL_USERS;
  } catch {
    return INITIAL_USERS;
  }
};

export const saveUser = (user: UserProfile): void => {
  const users = getStoredUsers();
  const index = users.findIndex(u => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase());
  let updated: UserProfile[];
  if (index >= 0) {
    updated = [...users];
    updated[index] = { ...updated[index], ...user };
  } else {
    updated = [user, ...users];
  }
  localStorage.setItem(USERS_KEY, JSON.stringify(updated));

  if (db) {
    try {
      setDoc(doc(db, 'users', user.id), user, { merge: true }).catch((err) => {
        console.warn('Firestore sync warning (saveUser):', err);
      });
    } catch (e) {
      console.warn('Firestore write error:', e);
    }
  }
};

export const deleteUser = (userId: string): void => {
  const users = getStoredUsers();
  const updated = users.filter(u => u.id !== userId);
  localStorage.setItem(USERS_KEY, JSON.stringify(updated));

  if (db) {
    try {
      deleteDoc(doc(db, 'users', userId)).catch((err) => {
        console.warn('Firestore sync warning (deleteUser):', err);
      });
    } catch (e) {
      console.warn('Firestore delete error:', e);
    }
  }
};

export const updateUserRole = (userId: string, role: UserProfile['role']): void => {
  const users = getStoredUsers();
  const updated = users.map(u => u.id === userId ? { ...u, role } : u);
  localStorage.setItem(USERS_KEY, JSON.stringify(updated));

  if (db) {
    try {
      setDoc(doc(db, 'users', userId), { role }, { merge: true }).catch((err) => {
        console.warn('Firestore sync warning (updateUserRole):', err);
      });
    } catch (e) {
      console.warn('Firestore write error:', e);
    }
  }
};

export const getCurrentUser = (): UserProfile | null => {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const setCurrentUser = (user: UserProfile | null): void => {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

export const getStoredBlogPosts = (): BlogPost[] => {
  try {
    const raw = localStorage.getItem(BLOG_KEY);
    if (!raw) {
      localStorage.setItem(BLOG_KEY, JSON.stringify(INITIAL_BLOG_POSTS));
      return INITIAL_BLOG_POSTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_BLOG_POSTS;
  }
};

export const saveBlogPost = (post: Omit<BlogPost, 'id' | 'date'>): BlogPost => {
  const current = getStoredBlogPosts();
  const newPost: BlogPost = {
    ...post,
    id: `post_${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
  };
  const updated = [newPost, ...current];
  localStorage.setItem(BLOG_KEY, JSON.stringify(updated));

  if (db) {
    try {
      setDoc(doc(db, 'blog_posts', newPost.id), newPost).catch((err) => {
        console.warn('Firestore sync warning (saveBlogPost):', err);
      });
    } catch (e) {
      console.warn('Firestore write error:', e);
    }
  }

  return newPost;
};

// Real-time Firestore sync listener
export const initFirestoreSync = (onDataUpdate: () => void): (() => void) => {
  if (!db) return () => {};

  try {
    const unsubs: (() => void)[] = [];

    // Appointments listener
    const unsubApts = onSnapshot(
      collection(db, 'appointments'),
      (snapshot) => {
        if (!snapshot.empty) {
          const remoteApts: Appointment[] = [];
          snapshot.forEach((d) => remoteApts.push(d.data() as Appointment));
          const localApts = getStoredAppointments();
          const map = new Map<string, Appointment>();
          localApts.forEach((a) => map.set(a.id, a));
          remoteApts.forEach((a) => map.set(a.id, a));
          const merged = Array.from(map.values());
          localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(merged));
          onDataUpdate();
        }
      },
      (err) => console.warn('Firestore live listener warning (appointments):', err)
    );
    unsubs.push(unsubApts);

    // Users & Roles listener
    const unsubUsers = onSnapshot(
      collection(db, 'users'),
      (snapshot) => {
        if (!snapshot.empty) {
          const remoteUsers: UserProfile[] = [];
          snapshot.forEach((d) => remoteUsers.push(d.data() as UserProfile));
          const localUsers = getStoredUsers();
          const map = new Map<string, UserProfile>();
          localUsers.forEach((u) => map.set(u.id, u));
          remoteUsers.forEach((u) => map.set(u.id, u));
          const merged = Array.from(map.values());
          localStorage.setItem(USERS_KEY, JSON.stringify(merged));
          onDataUpdate();
        }
      },
      (err) => console.warn('Firestore live listener warning (users):', err)
    );
    unsubs.push(unsubUsers);

    return () => {
      unsubs.forEach((u) => {
        try {
          u();
        } catch {
          // ignore
        }
      });
    };
  } catch (e) {
    console.warn('Firestore listener initialization error:', e);
    return () => {};
  }
};
