import { MEDICAL_SERVICES } from '../data/servicesData';
import { db } from './firebase';
import { doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';

export const DEFAULT_SITE_INFO = {
  cabinetNameFr: 'Cabinet Médical Dr. NAMBOY Evrard Simplice',
  cabinetNameAr: 'العيادة الطبية للدكتور نامبوي إيفرارد سيمبليس',
  doctorName: 'Dr. Evrard Simplice NAMBOY',
  phoneMain: '+212 7 70 55 82 99',
  phoneLandline: '08 08 65 58 17',
  phoneSecretary: '06 94 72 79 15',
  whatsappNumber: '212770558299',
  email: 'dr.namboy.evard.simplice.cm@gmail.com',
  email2: 'cabinet.medical.dr.namboy@gmail.com',
  addressFr: 'Cabinet Médical Bettana, Avenue Hassan II, Salé Bettana, Maroc',
  addressAr: 'العيادة الطبية بطانة، شارع الحسن الثاني، سلا بطانة، المغرب',
  hoursFr: 'Urgences & Garde Médicale : 24h/24 et 7j/7 • Consultations de jour sur RDV ou sans RDV',
  hoursAr: 'المستعجلات والمداومة الطبية : 24/24 ساعة و7/7 أيام • استشارات نهارية بموعد وبدون موعد',
  mapsUrl: 'https://maps.google.com/?q=Sale+Bettana+Cabinet+Medical+Dr+Namboy',
  heroTitleFr: 'Cabinet Médical Dr. NAMBOY Evrard Simplice',
  heroTitleAr: 'العيادة الطبية للدكتور نامبوي إيفرارد سيمبليس',
  heroSubtitleFr: 'Médecine Générale, Urgences 24h/24, Échographie Doppler HD, Bilan ECG et Soins Spécialisés à Salé Bettana.',
  heroSubtitleAr: 'الطب العام، المستعجلات 24/24، الفحص بالصدى عالي الدقة، تخطيط القلب والرعاية الطبية الشاملة بسلا بطانة.',
  heroImages: [
    '/images/Echographie-cardiaque-ce-que-montre-cet-examen-du-coeur.jpg',
    '/images/Consultation Médicale & Diagnostic Clinique.jpeg',
    '/images/Structure & Emplacement du Cabinet à Salé.jpeg',
    '/images/troubles-cognitifs-un-tiers-des-seniors-prend-encore-des-medicaments-prescrits-qui-abiment-le-750x410.webp',
    '/images/Drainage-Lymphatique.jpg',
    '/images/Interprétation Radiologique Pulmonaire sur Négatoscope.jpeg',
    '/images/WhatsApp Image 2026-09-28 at 16.46.02 (2).jpeg'
  ]
};

// Team: ONLY Dr. Evrard Simplice NAMBOY.
export const DEFAULT_TEAM_MEMBERS = [
  {
    id: 'dr_namboy',
    name: 'Dr. Evrard Simplice NAMBOY',
    roleFr: 'Médecin Directeur & Praticien',
    roleAr: 'طبيب ممارس ومدير العيادة',
    specialtyFr: 'Médecine Générale, Urgences 24h/24, Échographie Doppler HD & Réanimation',
    specialtyAr: 'الطب العام، المستعجلات 24/24، الفحص بالصدى والدوبلر والإنعاش',
    bioFr: 'Médecin diplômé de la Faculté de Médecine et de Pharmacie de Rabat. Fort d’une solide expérience hospitalière et urgentiste au Maroc, le Dr. NAMBOY assure des consultations rigoureuses, des diagnostics par échographie haute résolution et la permanence des soins d’urgence 24h/24.',
    bioAr: 'طبيب خريج كلية الطب والصيدلة بالرباط. يتمتع بخبرة استشفائية وسريرية واسعة في طب المستعجلات بالمغرب، ويشرف على الفحوصات الطبية الدقيقة، التشخيص بالصدى عالي الدقة والمداومة المستمرة 24/24 ساعة.',
    diplomasFr: [
      'Doctorat en Médecine Générale (Faculté de Médecine et de Pharmacie de Rabat)',
      'Diplôme Universitaire (DU) en Médecine d’Urgence & Prise en Charge des Détresses Aiguës',
      'Diplôme Universitaire (DU) en Réanimation Médicale & Gestes d’Urgence',
      'Diplôme Universitaire (DU) en Échographie Clinique & Imagerie Doppler',
      'Diplôme Universitaire (DU) en Gériatrie & Prise en Charge des Pathologies du Sujet Âgé',
      'Formation Spécialisée en Drainage Lymphatique Manuel Médical'
    ],
    diplomasAr: [
      'دكتوراه في الطب العام - كلية الطب بالرباط',
      'دبلوم جامعي في طب المستعجلات والتكفل بالحالات الحرجة',
      'دبلوم جامعي في الإنعاش الطبي والإسعافات المتقدمة',
      'دبلوم جامعي في الفحص بالصدى والتصوير بالدوبلر (البطن، الحوض، تتبع الحمل)',
      'دبلوم جامعي في طب الشيخوخة وأمراض المسنين',
      'تكوين متخصص في التصريف اللمفاوي الطبي وعلاج الوذمات'
    ],
    photoUrl: '/images/Dr.Evrard.jpeg',
    order: 1
  }
];

export const DEFAULT_SERVICES = MEDICAL_SERVICES;

export const LS_SITE_INFO = 'cabinet_site_info';
export const LS_SERVICES = 'cabinet_services';
export const LS_TEAM = 'cabinet_team';

export async function seedFirestore(force = false) {
  let seededCount = 0;

  try {
    localStorage.setItem(LS_SITE_INFO, JSON.stringify(DEFAULT_SITE_INFO));
    localStorage.setItem(LS_SERVICES, JSON.stringify(DEFAULT_SERVICES));
    localStorage.setItem(LS_TEAM, JSON.stringify(DEFAULT_TEAM_MEMBERS));
  } catch (err) {
    console.warn("Storage cache error:", err);
  }

  if (!db) {
    return {
      success: true,
      message: "Données initiales préparées avec succès.",
      seededCount: DEFAULT_SERVICES.length + DEFAULT_TEAM_MEMBERS.length + 1
    };
  }

  try {
    const generalDocRef = doc(db, 'site_data', 'general');
    const generalSnap = await getDoc(generalDocRef);

    if (force || !generalSnap.exists()) {
      await setDoc(generalDocRef, DEFAULT_SITE_INFO);
      seededCount++;
    }

    const servicesSnap = await getDocs(collection(db, 'services'));
    if (force || servicesSnap.empty) {
      for (const service of DEFAULT_SERVICES) {
        await setDoc(doc(db, 'services', service.id), service);
        seededCount++;
      }
    }

    const teamSnap = await getDocs(collection(db, 'team_members'));
    if (force || teamSnap.empty) {
      for (const member of DEFAULT_TEAM_MEMBERS) {
        await setDoc(doc(db, 'team_members', member.id), member);
        seededCount++;
      }
    }

    return {
      success: true,
      message: `Initialisation réussie (${seededCount} éléments enregistrés).`,
      seededCount
    };
  } catch (error) {
    console.warn("Database initialization error:", error);
    return {
      success: false,
      message: error?.message || "Erreur d'initialisation",
      seededCount
    };
  }
}

export async function autoCheckAndSeed() {
  try {
    if (!localStorage.getItem(LS_SITE_INFO)) {
      localStorage.setItem(LS_SITE_INFO, JSON.stringify(DEFAULT_SITE_INFO));
    }
    if (!localStorage.getItem(LS_SERVICES)) {
      localStorage.setItem(LS_SERVICES, JSON.stringify(DEFAULT_SERVICES));
    }
    if (!localStorage.getItem(LS_TEAM)) {
      localStorage.setItem(LS_TEAM, JSON.stringify(DEFAULT_TEAM_MEMBERS));
    }

    if (db) {
      const generalDocRef = doc(db, 'site_data', 'general');
      const snap = await getDoc(generalDocRef);
      if (!snap.exists()) {
        await seedFirestore(false);
      }
    }
  } catch (err) {
    console.warn("Auto-check notice:", err);
  }
}
