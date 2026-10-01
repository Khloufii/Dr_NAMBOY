export interface OfficialImage {
  id: string;
  fileName: string;
  nameFr: string;
  nameAr: string;
  category: 'logo' | 'hero' | 'doctor' | 'service' | 'team' | 'equipment';
  url: string;
}

export const OFFICIAL_IMAGES: OfficialImage[] = [
  {
    id: 'wa_00',
    fileName: 'Façade-du-Bâtiment.jpeg',
    nameFr: 'Façade du Bâtiment & Entrée Cabinet Salé Bettana',
    nameAr: 'واجهة المبنى ومدخل العيادة بسلا بطانة',
    category: 'hero',
    url: '/images/Façade-du-Bâtiment.jpeg'
  },
  {
    id: 'wa_00_1',
    fileName: 'Salle de Soins.jpeg',
    nameFr: 'Salle de Soins d’Urgence & Concentrateur d’Oxygène 24h/24',
    nameAr: 'قاعة المستعجلات ومولد الأكسجين الطبي 24/24',
    category: 'service',
    url: '/images/Salle de Soins.jpeg'
  },
  {
    id: 'wa_00_2',
    fileName: 'Équipe Soignante & Soins Infirmiers d’Urgence.jpeg',
    nameFr: 'Équipe Soignante & Soins Infirmiers d’Urgence',
    nameAr: 'الطاقم التمريضي وتقديم الإسعافات الأولية',
    category: 'team',
    url: '/images/Équipe Soignante & Soins Infirmiers d’Urgence.jpeg'
  },
  {
    id: 'wa_00_3',
    fileName: 'Dr. NAMBOY en Consultation & Explications Médicales.jpeg',
    nameFr: 'Dr. NAMBOY en Consultation & Explications Médicales',
    nameAr: 'الدكتور نامبوي أثناء الاستشارة وشرح الفحوصات للمريض',
    category: 'doctor',
    url: '/images/Dr.Evrard.jpeg'
  },
  {
    id: 'wa_00_4',
    fileName: 'logo.jpeg',
    nameFr: 'Logo & Emblème Officiel du Cabinet Médical',
    nameAr: 'الشعار والهوية البصرية الرسمية للعيادة',
    category: 'logo',
    url: '/images/logo.jpeg'
  },
  {
    id: 'wa_01',
    fileName: 'Enseigne du Cabinet Médical sur Avenue Hassan II.jpeg',
    nameFr: 'Enseigne du Cabinet Médical sur Avenue Hassan II',
    nameAr: 'لافتة العيادة الطبية بشارع الحسن الثاني بسلا بطانة',
    category: 'hero',
    url: '/images/Enseigne du Cabinet Médical sur Avenue Hassan II.jpeg'
  },
  {
    id: 'wa_01_1',
    fileName: 'WSecrétariat Médical & Accueil des Patients.jpeg',
    nameFr: 'Secrétariat Médical & Accueil des Patients',
    nameAr: 'مكتب الاستقبال والكتابة الطبية لخدمة المرضى',
    category: 'team',
    url: '/images/Secrétariat Médical & Accueil des Patients.jpeg'
  },
  {
    id: 'wa_01_2',
    fileName: 'Examen de la Vue & Visite Permis de Conduire.jpeg',
    nameFr: 'Examen de la Vue & Visite Permis de Conduire',
    nameAr: 'فحص حدة البصر والكفاءة لرخصة السياقة',
    category: 'service',
    url: '/images/Examen de la Vue & Visite Permis de Conduire.jpeg'
  },
  {
    id: 'wa_01_3',
    fileName: 'Interprétation Radiologique Pulmonaire sur Négatoscope.jpeg',
    nameFr: 'Interprétation Radiologique Pulmonaire sur Négatoscope',
    nameAr: 'قراءة وتفسير صور الأشعة الصدرية على النيغاتوسكوب',
    category: 'service',
    url: '/images/Interprétation Radiologique Pulmonaire sur Négatoscope.jpeg'
  },
  {
    id: 'wa_01_4',
    fileName: 'Analyse d’Imagerie et Clichés Radiographiques.jpeg',
    nameFr: 'Analyse d’Imagerie et Clichés Radiographiques',
    nameAr: 'تحليل صور الأشعة والتقارير الطبية مع المريض',
    category: 'doctor',
    url: '/images/Analyse d’Imagerie et Clichés Radiographiques.jpeg'
  },
  {
    id: 'wa_01_5',
    fileName: 'Praticiennes & Soignantes du Cabinet.jpeg',
    nameFr: 'Praticiennes & Soignantes du Cabinet',
    nameAr: 'الطاقم التمريضي والطبي المساعد بالعيادة',
    category: 'team',
    url: '/images/Praticiennes & Soignantes du Cabinet.jpeg'
  },
  {
    id: 'wa_02',
    fileName: 'Dr. NAMBOY en Consultation Thérapeutique.jpeg',
    nameFr: 'Dr. NAMBOY en Consultation Thérapeutique',
    nameAr: 'الدكتور نامبوي أثناء كتابة الوصفة وتوجيه المريض',
    category: 'doctor',
    url: '/images/Dr. NAMBOY en Consultation Thérapeutique.jpeg'
  },
  {
    id: 'wa_02_1',
    fileName: 'Comptoir d’Accueil & Documentation Santé.jpeg',
    nameFr: 'Comptoir d’Accueil & Documentation Santé',
    nameAr: 'فضاء الاستقبال والمنشورات التوعوية بالعيادة',
    category: 'team',
    url: '/images/Comptoir d’Accueil & Documentation Santé.jpeg'
  },
  {
    id: 'wa_02_2',
    fileName: 'WhatsApp Image 2026-09-28 at 16.46.02 (2).jpeg',
    nameFr: 'Consultation Spécialisée & Examen Clinique',
    nameAr: 'فحص سريري متخصص واستشارة طبية دقيقة',
    category: 'doctor',
    url: '/images/WhatsApp Image 2026-09-28 at 16.46.02 (2).jpeg'
  },
  {
    id: 'wa_02_3',
    fileName: 'Appareil d’Échographie Doppler HD & Table d’Examen.jpeg',
    nameFr: 'Appareil d’Échographie Doppler HD & Table d’Examen',
    nameAr: 'جهاز الفحص بالصدى عالي الدقة وسرير الفحص الطبي',
    category: 'equipment',
    url: '/images/Appareil d’Échographie Doppler HD & Table d’Examen.jpeg'
  },
  {
    id: 'wa_02_4',
    fileName: 'Salle de Soins & Échelle Optométrique de Vision.jpeg',
    nameFr: 'Salle de Soins & Échelle Optométrique de Vision',
    nameAr: 'قاعة الفحوصات ولوحة قياس النظر والضغط',
    category: 'service',
    url: '/images/Salle de Soins & Échelle Optométrique de Vision.jpeg'
  },
  {
    id: 'wa_02_5',
    fileName: 'Dr. NAMBOY - Écoute & Conseils Personnalisés.jpeg',
    nameFr: 'Dr. NAMBOY - Écoute & Conseils Personnalisés',
    nameAr: 'الدكتور نامبوي - إنصات وتوجيه طبي شخصي',
    category: 'doctor',
    url: '/images/Dr. NAMBOY - Écoute & Conseils Personnalisés.jpeg'
  },
  {
    id: 'wa_03',
    fileName: 'Plateau Technique d’Échographie & Suivi de Grossesse.jpeg',
    nameFr: 'Plateau Technique d’Échographie & Suivi de Grossesse',
    nameAr: 'تجهيزات الفحص بالصدى وتتبع مراحل الحمل',
    category: 'equipment',
    url: '/images/Plateau Technique d’Échographie & Suivi de Grossesse.jpeg'
  },
  {
    id: 'wa_03_1',
    fileName: 'Consultation Médicale & Diagnostic Clinique.jpeg',
    nameFr: 'Consultation Médicale & Diagnostic Clinique',
    nameAr: 'استشارة طبية وتشخيص سريري للمريض',
    category: 'doctor',
    url: '/images/Consultation Médicale & Diagnostic Clinique.jpeg'
  },
  {
    id: 'wa_03_2',
    fileName: 'Vue Extérieure du Bâtiment - Bettana Salé.jpeg',
    nameFr: 'Vue Extérieure du Bâtiment - Bettana Salé',
    nameAr: 'منظر خارجي لمبنى العيادة - بطانة سلا',
    category: 'hero',
    url: '/images/Vue Extérieure du Bâtiment - Bettana Salé.jpeg'
  },
  {
    id: 'wa_03_3',
    fileName: 'Structure & Emplacement du Cabinet à Salé.jpeg',
    nameFr: 'Structure & Emplacement du Cabinet à Salé',
    nameAr: 'موقع العيادة ومحيطها بشارع الحسن الثاني بسلا',
    category: 'hero',
    url: '/images/Structure & Emplacement du Cabinet à Salé.jpeg'
  }
];
