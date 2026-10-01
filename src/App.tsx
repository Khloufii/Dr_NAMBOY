import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import { NavigationProvider, useNavigation } from './context/NavigationContext';
import { SiteContentProvider } from './context/SiteContentContext';
import { Navbar } from './components/layout/Navbar';
import { HeroSlider } from './components/home/HeroSlider';
import { AboutSection } from './components/home/AboutSection';
import { ServicesSection } from './components/home/ServicesSection';
import { AppointmentBooking } from './components/home/AppointmentBooking';
import { BlogSection } from './components/home/BlogSection';
import { ContactSection } from './components/home/ContactSection';
import { Footer } from './components/layout/Footer';
import { WhatsAppWidget } from './components/home/WhatsAppWidget';
import { AuthModal } from './components/auth/AuthModal';
import { DashboardLayout } from './components/dashboard/DashboardLayout';

// Dedicated Full Pages
import { ServicesIndexPage } from './pages/ServicesIndexPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { AboutPage } from './pages/AboutPage';
import { BookingPage } from './pages/BookingPage';
import { BlogIndexPage } from './pages/BlogIndexPage';
import { BlogDetailPage } from './pages/BlogDetailPage';
import { ContactPage } from './pages/ContactPage';
import { AuthPage } from './pages/AuthPage';

import {
  getCurrentUser,
  setCurrentUser,
  getStoredAppointments,
  getStoredPatients,
  getStoredUsers,
  getStoredBlogPosts,
  updateAppointmentStatus,
  rescheduleAppointment,
  updatePatientNotes,
  updateUserRole,
  saveUser,
  deleteUser,
  saveBlogPost,
  initFirestoreSync,
} from './services/dataService';
import { UserProfile, Appointment, PatientRecord, BlogPost, UserRole } from './types';
import { ReviewsSection } from './components/home/ReviewsSection';
import { ReviewsQrCard } from './components/dashboard/ReviewsQrCard';

function MainApp() {
  const { language } = useLanguage();
  const { route, navigate, navigateToBooking, navigateToDashboard } = useNavigation();

  const [currentUser, setCurrentUserState] = useState<UserProfile | null>(() => getCurrentUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Application data state
  const [appointments, setAppointments] = useState<Appointment[]>(() => getStoredAppointments());
  const [patients, setPatients] = useState<PatientRecord[]>(() => getStoredPatients());
  const [users, setUsers] = useState<UserProfile[]>(() => getStoredUsers());
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => getStoredBlogPosts());

  // Sync state when storage changes
  const reloadData = () => {
    setAppointments(getStoredAppointments());
    setPatients(getStoredPatients());
    setUsers(getStoredUsers());
    setBlogPosts(getStoredBlogPosts());
  };

  useEffect(() => {
    const unsubscribe = initFirestoreSync(() => {
      reloadData();
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleAppointmentCreated = (apt: Appointment) => {
    reloadData();
  };

  const handlePatientCreated = (pat: PatientRecord) => {
    reloadData();
  };

  const handleUpdateStatus = (id: string, status: Appointment['status']) => {
    updateAppointmentStatus(id, status);
    reloadData();
  };

  const handleReschedule = (id: string, date: string, time: string) => {
    rescheduleAppointment(id, date, time);
    reloadData();
  };

  const handleUpdateNotes = (patientId: string, notes: string) => {
    updatePatientNotes(patientId, notes);
    reloadData();
  };

  const handleUpdateRole = (userId: string, role: UserRole) => {
    updateUserRole(userId, role);
    reloadData();
  };

  const handleAddUser = (user: UserProfile) => {
    saveUser(user);
    reloadData();
  };

  const handleDeleteUser = (userId: string) => {
    deleteUser(userId);
    reloadData();
  };

  const handlePublishArticle = (article: Omit<BlogPost, 'id' | 'date'>) => {
    saveBlogPost(article);
    reloadData();
  };

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUserState(user);
    navigateToDashboard();
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentUserState(null);
    navigate('/');
  };

  // If on Dashboard route and authenticated
  if (route.page === 'dashboard' && currentUser) {
    return (
      <DashboardLayout
        currentUser={currentUser}
        onLogout={handleLogout}
        onReturnToPublicSite={() => navigate('/')}
        appointments={appointments}
        patients={patients}
        users={users}
        onUpdateAppointmentStatus={handleUpdateStatus}
        onRescheduleAppointment={handleReschedule}
        onAppointmentCreated={handleAppointmentCreated}
        onPatientCreated={handlePatientCreated}
        onUpdatePatientNotes={handleUpdateNotes}
        onUpdateUserRole={handleUpdateRole}
        onAddUser={handleAddUser}
        onDeleteUser={handleDeleteUser}
        onPublishArticle={handlePublishArticle}
      />
    );
  }

  // Render Page Content based on current URL Route
  const renderPageContent = () => {
    switch (route.page) {
      case 'about':
        return <AboutPage />;

      case 'services':
        return <ServicesIndexPage />;

      case 'service-detail':
        return <ServiceDetailPage serviceId={route.serviceId} />;

      case 'booking':
        return <BookingPage initialServiceId={route.serviceId} />;

      case 'blog':
        return <BlogIndexPage />;

      case 'blog-detail':
        return <BlogDetailPage postId={route.postId} />;

      case 'contact':
        return <ContactPage />;

      case 'login':
      case 'dashboard':
        // Full responsive authentication page for practitioners
        return <AuthPage onLoginSuccess={handleLoginSuccess} />;

      case 'home':
      default:
        return (
          <>
            {/* 1. Dynamic Hero Slider */}
            <HeroSlider onOpenBooking={() => navigateToBooking()} />

            {/* 2. Services Overview with Photos */}
            <ServicesSection />

            {/* 3. About & Dr NAMBOY Qualifications */}
            <AboutSection />

            {/* 4. Hybrid Booking Form */}
            <div id="booking">
              <AppointmentBooking onAppointmentCreated={handleAppointmentCreated} />
            </div>

            {/* 5. Health Blog & Advice */}
            <BlogSection />

            {/* 6. Contact, Google Maps & Location */}
            <ContactSection />
            <ReviewsSection/>
          </>
        );
    }
  };
console.log('🔥 VERSION TEST v2');
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navigation */}
      <Navbar
        onOpenBooking={() => navigateToBooking()}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenDashboard={() => {
          if (currentUser) {
            navigateToDashboard();
          } else {
            setIsAuthModalOpen(true);
          }
        }}
        currentUser={currentUser}
      />

      {/* Main Dynamic Viewport */}
      <main className="flex-1">
        {renderPageContent()}
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating WhatsApp Widget */}
      <WhatsAppWidget />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}

export default function App() {
  return (
    <NavigationProvider>
      <LanguageProvider>
        <SiteContentProvider>
          <MainApp />
        </SiteContentProvider>
      </LanguageProvider>
    </NavigationProvider>
  );
}
