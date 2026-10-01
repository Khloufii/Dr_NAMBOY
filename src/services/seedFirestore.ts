import { SiteInfo, MedicalService, TeamMember, BlogPost } from '../types';
import { MEDICAL_SERVICES } from '../data/servicesData';
import { db } from './firebase';
import { doc, setDoc, getDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';

export const DEFAULT_SITE_INFO: SiteInfo = {
  cabinetNameFr: 'Cabinet Médical Dr. NAMBOY Evrard Simplice',
  cabinetNameAr: 'العيادة الطبية للدكتور نامبوي إيفرارد سيمبليس',
  doctorName: 'Dr. Evrard Simplice NAMBOY',
  phoneMain: '+212 7 70 55 82 99',
  phoneLandline: '08 08 65 58 17',
  phoneSecretary: '06 94 72 79 15',
  whatsappNumber: '212770558299',
  email: 'contact@cabinet-medical.ma',
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

// Team: ONLY Dr. Evrard Simplice NAMBOY. No invented names.
export const DEFAULT_TEAM_MEMBERS: TeamMember[] = [
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

// Local storage backup keys
export const LS_SITE_INFO = 'cabinet_site_info';
export const LS_SERVICES = 'cabinet_services';
export const LS_TEAM = 'cabinet_team';

/**
 * Initializes clinic information into the database if empty or reset.
 */
export async function seedFirestore(force = false): Promise<{ success: boolean; message: string; seededCount: number }> {
  let seededCount = 0;

  // Clear any legacy local storage cache to avoid stale browser state
  try {
    localStorage.removeItem(LS_SITE_INFO);
    localStorage.removeItem(LS_SERVICES);
    localStorage.removeItem(LS_TEAM);
    localStorage.removeItem('cabinet_data_version');
  } catch {
    // ignore
  }

  if (!db) {
    return {
      success: true,
      message: "Données initiales chargées directement depuis le code.",
      seededCount: DEFAULT_SERVICES.length + DEFAULT_TEAM_MEMBERS.length + 1
    };
  }

  try {
    // 1. Site Info: general doc
    const generalDocRef = doc(db, 'site_data', 'general');
    await setDoc(generalDocRef, DEFAULT_SITE_INFO);
    seededCount++;

    // 2. Services: remove stale docs not in code defaults when force seeding
    const servicesSnap = await getDocs(collection(db, 'services'));
    if (force) {
      const validIds = new Set(DEFAULT_SERVICES.map(s => s.id));
      for (const d of servicesSnap.docs) {
        if (!validIds.has(d.id)) {
          await deleteDoc(doc(db, 'services', d.id));
        }
      }
    }
    for (const service of DEFAULT_SERVICES) {
      await setDoc(doc(db, 'services', service.id), service);
      seededCount++;
    }

    // 3. Team Members: remove stale docs not in code defaults when force seeding
    const teamSnap = await getDocs(collection(db, 'team_members'));
    if (force) {
      const validTeamIds = new Set(DEFAULT_TEAM_MEMBERS.map(m => m.id));
      for (const d of teamSnap.docs) {
        if (!validTeamIds.has(d.id)) {
          await deleteDoc(doc(db, 'team_members', d.id));
        }
      }
    }
    for (const member of DEFAULT_TEAM_MEMBERS) {
      await setDoc(doc(db, 'team_members', member.id), member);
      seededCount++;
    }

    return {
      success: true,
      message: `Initialisation réussie (${seededCount} éléments enregistrés).`,
      seededCount
    };
  } catch (error: any) {
    console.warn("Database sync error:", error);
    return {
      success: false,
      message: error?.message || "Erreur de synchronisation",
      seededCount
    };
  }
}

export async function autoCheckAndSeed(): Promise<void> {
  try {
    if (db) {
      await seedFirestore(true);
    }
  } catch (err) {
    console.warn("Auto-check notice:", err);
  }
}
