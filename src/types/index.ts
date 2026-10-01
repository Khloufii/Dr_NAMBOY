export type Language = 'fr' | 'ar';

export type UserRole = 'admin' | 'doctor' | 'secretary' | 'communicator';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  phone?: string;
  specialty?: string;
  createdAt: string;
}

export type AppointmentStatus = 'confirmed' | 'pending' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  serviceId: string;
  serviceNameFr: string;
  serviceNameAr: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  status: AppointmentStatus;
  notes?: string;
  bookingType: 'online' | 'whatsapp' | 'desk';
  createdAt: string;
}

export interface PatientRecord {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  cinOrId?: string;
  birthDate?: string;
  gender: 'M' | 'F';
  bloodGroup?: string;
  allergies?: string[];
  chronicDiseases?: string[];
  notes?: string;
  appointmentsCount: number;
  lastVisit?: string;
  createdAt: string;
}

export interface ServiceFAQ {
  qFr: string;
  qAr: string;
  aFr: string;
  aAr: string;
}

export interface MedicalService {
  id: string;
  titleFr: string;
  titleAr: string;
  shortDescFr: string;
  shortDescAr: string;
  fullDescFr: string;
  fullDescAr: string;
  image: string;
  iconName: string;
  badgeFr?: string;
  badgeAr?: string;
  is24h?: boolean;
  indicationsFr: string[];
  indicationsAr: string[];
  equipmentFr: string[];
  equipmentAr: string[];
  preparationFr: string[];
  preparationAr: string[];
  procedureFr: string[];
  procedureAr: string[];
  faqs: ServiceFAQ[];
}

export interface BlogPost {
  id: string;
  titleFr: string;
  titleAr: string;
  summaryFr: string;
  summaryAr: string;
  contentFr: string;
  contentAr: string;
  categoryFr: string;
  categoryAr: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  imageUrl?: string;
}

export interface ClinicSlot {
  time: string;
  available: boolean;
}

export interface SiteInfo {
  cabinetNameFr: string;
  cabinetNameAr: string;
  doctorName: string;
  phoneMain: string;       // +212 7 70 55 82 99 (WhatsApp & Urgence)
  phoneLandline: string;   // 08 08 65 58 17 (Fixe)
  phoneSecretary: string;  // 06 94 72 79 15 (Secrétariat)
  whatsappNumber: string;  // 212770558299
  email: string;
  addressFr: string;
  addressAr: string;
  mapsUrl: string;
  hoursFr: string;
  hoursAr: string;
  heroTitleFr: string;
  heroTitleAr: string;
  heroSubtitleFr: string;
  heroSubtitleAr: string;
  heroImages: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  roleFr: string;
  roleAr: string;
  specialtyFr: string;
  specialtyAr: string;
  bioFr: string;
  bioAr: string;
  diplomasFr: string[];
  diplomasAr: string[];
  photoUrl: string;
  order: number;
}
