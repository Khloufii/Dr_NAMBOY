import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useSiteContent } from '../../context/SiteContentContext';
import { UserProfile, Appointment, PatientRecord, BlogPost, UserRole } from '../../types';
import { db } from '../../services/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { OverviewView } from './OverviewView';
import { GeneralInfoView } from './GeneralInfoView';
import { ServicesManagerView } from './ServicesManagerView';
import { MedicalTeamManagerView } from './MedicalTeamManagerView';
import { AppointmentsView } from './AppointmentsView';
import { PatientsView } from './PatientsView';
import { StaffView } from './StaffView';
import { BlogEditorView } from './BlogEditorView';
import { GalleryManagerView } from './GalleryManagerView';
import { NewAppointmentModal } from './NewAppointmentModal';
import { NewPatientModal } from './NewPatientModal';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Shield,
  BookOpen,
  LogOut,
  ArrowLeft,
  Globe,
  Stethoscope,
  Building2,
  UserCheck,
  RotateCcw,
  Menu,
  X,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Image as ImageIcon,
} from 'lucide-react';

interface DashboardLayoutProps {
  currentUser: UserProfile;
  onLogout: () => void;
  onReturnToPublicSite: () => void;
  appointments: Appointment[];
  patients: PatientRecord[];
  users: UserProfile[];
  onUpdateAppointmentStatus: (id: string, status: Appointment['status']) => void;
  onRescheduleAppointment: (id: string, date: string, time: string) => void;
  onAppointmentCreated: (apt: Appointment) => void;
  onPatientCreated: (p: PatientRecord) => void;
  onUpdatePatientNotes: (patientId: string, notes: string) => void;
  onUpdateUserRole: (userId: string, role: UserRole) => void;
  onAddUser?: (user: UserProfile) => void;
  onDeleteUser?: (userId: string) => void;
  onPublishArticle: (article: Omit<BlogPost, 'id' | 'date'>) => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  currentUser,
  onLogout,
  onReturnToPublicSite,
  appointments: propAppointments,
  patients: propPatients,
  users,
  onUpdateAppointmentStatus,
  onRescheduleAppointment,
  onAppointmentCreated,
  onPatientCreated,
  onUpdatePatientNotes,
  onUpdateUserRole,
  onAddUser,
  onDeleteUser,
  onPublishArticle,
}) => {
  const { t, language, toggleLanguage, isRtl } = useLanguage();
  const { resetToDefaults } = useSiteContent();

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isNewAptModalOpen, setIsNewAptModalOpen] = useState(false);
  const [isNewPatientModalOpen, setIsNewPatientModalOpen] = useState(false);

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccessToast, setResetSuccessToast] = useState(false);

  /* ------------------------------------------------------------------ */
  /* ✨ TEMPS RÉEL — RDV + Patients (pour OverviewView & cohérence)      */
  /* ------------------------------------------------------------------ */
  const [liveAppointments, setLiveAppointments] = useState<Appointment[] | null>(null);
  const [livePatients, setLivePatients] = useState<PatientRecord[] | null>(null);

  useEffect(() => {
    if (!db) return;

    console.log('[DashboardLayout] Subscribing to appointments + patients...');

    /* RDV */
    const unsubApts = onSnapshot(
      collection(db, 'appointments'),
      (snap) => {
        const list: Appointment[] = snap.docs.map((d) => {
          const data = d.data() as Omit<Appointment, 'id'>;
          return { ...data, id: (data as any).id || d.id };
        });
        setLiveAppointments(list);
      },
      (err) => console.warn('[DashboardLayout] appointments snapshot error:', err),
    );

    /* Patients */
    const unsubPats = onSnapshot(
      collection(db, 'patients'),
      (snap) => {
        const list: PatientRecord[] = snap.docs.map((d) => {
          const data = d.data() as Omit<PatientRecord, 'id'>;
          return { ...data, id: (data as any).id || d.id };
        });
        setLivePatients(list);
      },
      (err) => console.warn('[DashboardLayout] patients snapshot error:', err),
    );

    return () => {
      unsubApts();
      unsubPats();
    };
  }, []);

  /* Source de vérité : Firestore si dispo, sinon props */
  const appointments = useMemo(() => {
    if (liveAppointments !== null) return liveAppointments;
    return Array.isArray(propAppointments) ? propAppointments : [];
  }, [liveAppointments, propAppointments]);

  const patients = useMemo(() => {
    if (livePatients !== null) return livePatients;
    return Array.isArray(propPatients) ? propPatients : [];
  }, [livePatients, propPatients]);

  /* ------------------------------------------------------------------ */
  /* RBAC                                                                */
  /* ------------------------------------------------------------------ */
  const isAdmin = currentUser.role === 'admin';
  const isDoctorOrAdmin = currentUser.role === 'admin' || currentUser.role === 'doctor';
  const isSecretary = currentUser.role === 'secretary';
  const isCommunicator = currentUser.role === 'communicator';
  const canManageSite = isDoctorOrAdmin || isCommunicator;

  const handleResetData = async () => {
    setIsResetting(true);
    try {
      await resetToDefaults();
      setIsResetConfirmOpen(false);
      setResetSuccessToast(true);
      setTimeout(() => setResetSuccessToast(false), 5000);
    } catch (err: any) {
      alert(
        'Erreur lors de la réinitialisation : ' + (err?.message || 'Inconnue'),
      );
    } finally {
      setIsResetting(false);
    }
  };

  const navItems = [
    {
      id: 'overview',
      label: t.dashboard.tabs.overview,
      icon: LayoutDashboard,
      visible: true,
    },
    {
      id: 'general-info',
      label: language === 'ar' ? 'معلومات وهوية العيادة' : 'Infos Cabinet & Accueil',
      icon: Building2,
      visible: canManageSite,
    },
    {
      id: 'services',
      label: language === 'ar' ? 'الخدمات الطبية والتخصصات' : 'Services & Soins Médicaux',
      icon: Stethoscope,
      visible: canManageSite,
    },
    {
      id: 'medical-team',
      label: language === 'ar' ? 'الطاقم الطبي والشواهد' : 'Équipe Médicale & Diplômes',
      icon: UserCheck,
      visible: canManageSite,
    },
    {
      id: 'blog',
      label: language === 'ar' ? 'المقالات والنصائح الطبية' : 'Blog & Conseils Santé',
      icon: BookOpen,
      visible: canManageSite,
    },
    {
      id: 'gallery',
      label: language === 'ar' ? 'معرض صور العيادة' : 'Galerie Photo',
      icon: ImageIcon,
      visible: canManageSite,
    },
    {
      id: 'appointments',
      label: t.dashboard.tabs.appointments,
      icon: Calendar,
      visible: isDoctorOrAdmin || isSecretary,
    },
    {
      id: 'patients',
      label: t.dashboard.tabs.patients,
      icon: Users,
      visible: isDoctorOrAdmin || isSecretary,
    },
    {
      id: 'team',
      label: language === 'ar' ? 'إدارة المستخدمين والأدوار' : 'Gestion des Rôles & Accès',
      icon: Shield,
      visible: isDoctorOrAdmin,
    },
  ].filter((i) => i.visible);

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="flex min-h-screen flex-col bg-slate-100 font-sans">
      {/* HEADER */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white px-4 py-3.5 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 md:hidden"
            >
              {mobileSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <div
              onClick={onReturnToPublicSite}
              className="group flex cursor-pointer items-center gap-2.5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm transition-transform group-hover:scale-105">
                <Stethoscope className="h-5 w-5" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-sm font-bold leading-tight text-slate-900">
                  Cabinet Dr. NAMBOY
                </h1>
                <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                  {language === 'ar'
                    ? 'فضاء الإدارة والتدبير الطبي'
                    : 'Plateforme de Gestion Médicale Sécurisée'}
                  {(liveAppointments !== null || livePatients !== null) && (
                    <span className="ml-1 inline-flex items-center gap-1">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      </span>
                      <span className="text-emerald-600">
                        {language === 'ar' ? 'مباشر' : 'Temps réel'}
                      </span>
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {isAdmin && (
              <button
                onClick={() => setIsResetConfirmOpen(true)}
                className="flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-800 transition-colors hover:bg-amber-100"
              >
                <RotateCcw className="h-3.5 w-3.5 text-amber-600" />
                <span className="hidden lg:inline">
                  {language === 'ar'
                    ? 'استعادة البيانات الأصلية'
                    : 'Restaurer données par défaut'}
                </span>
              </button>
            )}

            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              <Globe className="h-3.5 w-3.5 text-blue-600" />
              <span>{language === 'fr' ? 'AR' : 'FR'}</span>
            </button>

            <div className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-slate-50 px-3 py-1.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold text-white">
                {currentUser.name.charAt(0)}
              </div>
              <div className="hidden text-start md:block">
                <span className="block text-xs font-bold leading-tight text-slate-900">
                  {currentUser.name}
                </span>
                <span className="text-[10px] font-semibold uppercase text-blue-600">
                  {currentUser.role === 'admin'
                    ? 'Administrateur'
                    : currentUser.role === 'doctor'
                      ? 'Médecin Praticien'
                      : currentUser.role === 'secretary'
                        ? 'Assistant(e) Médical(e)'
                        : 'Animateur de Contenu'}
                </span>
              </div>
            </div>

            <button
              onClick={onReturnToPublicSite}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100"
            >
              <ArrowLeft className={`h-3.5 w-3.5 ${isRtl ? 'rotate-180' : ''}`} />
              <span className="hidden sm:inline">{t.auth.backToSite}</span>
            </button>

            <button
              onClick={onLogout}
              className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
              title={t.nav.logout}
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Bannière succès reset */}
      {resetSuccessToast && (
        <div className="flex items-center justify-center gap-2 bg-emerald-600 px-4 py-2 text-xs font-bold text-white">
          <CheckCircle2 className="h-4 w-4" />
          <span>
            {language === 'ar'
              ? 'تمت استعادة البيانات الأصلية للعيادة بنجاح !'
              : 'Les données d’origine du Cabinet Dr. NAMBOY ont été restaurées avec succès !'}
          </span>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-6 px-4 py-6 sm:px-6">
        {/* SIDEBAR DESKTOP */}
        <aside className="sticky top-24 hidden h-[calc(100vh-120px)] w-64 shrink-0 flex-col justify-between overflow-y-auto rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm md:flex">
          <div className="space-y-6">
            <div className="flex items-center justify-between px-3">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Menu Gestionnaire
              </span>
              <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700">
                Système Actif
              </span>
            </div>

            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="mt-6 space-y-2 rounded-2xl bg-gradient-to-br from-blue-900 to-sky-950 p-4 text-white">
            <div className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-sky-400" />
              <span className="text-xs font-bold">Dr. NAMBOY</span>
            </div>
            <p className="text-[11px] leading-tight text-sky-200">
              Permanence d’urgence 24/24 joignable au +212 7 70 55 82 99.
            </p>
          </div>
        </aside>

        {/* DRAWER MOBILE */}
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <div
              className="h-full w-72 space-y-4 overflow-y-auto bg-white p-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold uppercase text-slate-500">
                  Navigation Gestion
                </span>
                <button onClick={() => setMobileSidebarOpen(false)}>
                  <X className="h-5 w-5 text-slate-400" />
                </button>
              </div>

              <div className="space-y-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileSidebarOpen(false);
                      }}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start text-xs font-bold ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* CONTENU PRINCIPAL */}
        <main className="min-w-0 flex-1">
          {activeTab === 'overview' && (
            <OverviewView
              appointments={appointments}
              patients={patients}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenNewAppointment={() => setIsNewAptModalOpen(true)}
              onOpenNewPatient={() => setIsNewPatientModalOpen(true)}
            />
          )}

          {activeTab === 'general-info' && <GeneralInfoView />}

          {activeTab === 'services' && <ServicesManagerView />}

          {activeTab === 'medical-team' && <MedicalTeamManagerView />}

          {activeTab === 'blog' && (
            <BlogEditorView
              currentUser={currentUser}
              onPublishArticle={onPublishArticle}
            />
          )}

          {activeTab === 'gallery' && <GalleryManagerView />}

          {activeTab === 'appointments' && (
            <AppointmentsView
              appointments={appointments}
              onUpdateStatus={onUpdateAppointmentStatus}
              onReschedule={onRescheduleAppointment}
              onOpenNewAppointment={() => setIsNewAptModalOpen(true)}
              /* Les handlers delete sont optionnels :
                 AppointmentsView écrit directement dans Firestore via fallback */
            />
          )}

          {activeTab === 'patients' && (
            <PatientsView
              patients={patients}
              appointments={appointments}
              currentUser={currentUser}
              onUpdatePatientNotes={onUpdatePatientNotes}
              onOpenNewPatient={() => setIsNewPatientModalOpen(true)}
            />
          )}

          {activeTab === 'team' && (
            <StaffView
              users={users}
              currentUser={currentUser}
              onUpdateRole={onUpdateUserRole}
              onAddUser={onAddUser}
              onDeleteUser={onDeleteUser}
            />
          )}
        </main>
      </div>

      {/* MODALES GLOBALES */}
      <NewAppointmentModal
        isOpen={isNewAptModalOpen}
        onClose={() => setIsNewAptModalOpen(false)}
        onAppointmentCreated={onAppointmentCreated}
      />

      <NewPatientModal
        isOpen={isNewPatientModalOpen}
        onClose={() => setIsNewPatientModalOpen(false)}
        onPatientCreated={onPatientCreated}
      />

      {/* MODALE RESET */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md space-y-4 rounded-3xl border border-amber-200 bg-white p-6 shadow-2xl">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
              <AlertTriangle className="h-6 w-6" />
            </div>

            <div className="space-y-2 text-center">
              <h3 className="text-base font-bold text-slate-900">
                {language === 'ar'
                  ? 'استعادة البيانات الأصلية للعيادة ؟'
                  : 'Restaurer les données initiales du cabinet ?'}
              </h3>
              <p className="text-xs leading-relaxed text-slate-600">
                {language === 'ar'
                  ? 'سيتم استعادة معلومات العيادة، أرقام الهواتف الرسمية، الخدمات الطبية الكاملة، وسيرة ودبلومات الدكتور نامبوي الأصلية.'
                  : 'Cette action restaurera toutes les données initiales du Dr. NAMBOY : téléphones officiels, services médicaux et présentation officielle.'}
              </p>
            </div>

            <div className="flex gap-3 pt-3">
              <button
                type="button"
                disabled={isResetting}
                onClick={() => setIsResetConfirmOpen(false)}
                className="flex-1 rounded-xl border border-slate-300 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                {language === 'ar' ? 'إلغاء' : 'Annuler'}
              </button>
              <button
                type="button"
                disabled={isResetting}
                onClick={handleResetData}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-600 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-amber-700"
              >
                {isResetting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>
                      {language === 'ar' ? 'جارٍ الاستعادة...' : 'Restauration...'}
                    </span>
                  </>
                ) : (
                  <>
                    <RotateCcw className="h-4 w-4" />
                    <span>
                      {language === 'ar' ? 'تأكيد الاستعادة' : 'Confirmer'}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;