import React, { createContext, useContext, useState, useEffect } from 'react';

export type AppRoute =
  | { page: 'home' }
  | { page: 'about' }
  | { page: 'services' }
  | { page: 'service-detail'; serviceId: string }
  | { page: 'booking'; serviceId?: string }
  | { page: 'blog' }
  | { page: 'blog-detail'; postId: string }
  | { page: 'contact' }
  | { page: 'dashboard' }
  | { page: 'login' };

interface NavigationContextType {
  route: AppRoute;
  navigate: (path: string) => void;
  navigateToService: (serviceId: string) => void;
  navigateToBooking: (serviceId?: string) => void;
  navigateToBlogDetail: (postId: string) => void;
  navigateToDashboard: () => void;
  navigateToLogin: () => void;
  currentPath: string;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

const parsePath = (path: string): AppRoute => {
  // Clean path
  const clean = path.replace(/^\/|\/$/g, '');

  if (!clean || clean === 'home') return { page: 'home' };
  if (clean === 'a-propos' || clean === 'about') return { page: 'about' };
  if (clean === 'services') return { page: 'services' };
  
  if (clean.startsWith('services/')) {
    const parts = clean.split('/');
    return { page: 'service-detail', serviceId: parts[1] || 'general' };
  }

  if (clean === 'rendez-vous' || clean === 'booking') return { page: 'booking' };
  
  if (clean.startsWith('rendez-vous/')) {
    const parts = clean.split('/');
    return { page: 'booking', serviceId: parts[1] };
  }

  if (clean === 'conseils-sante' || clean === 'blog') return { page: 'blog' };

  if (clean.startsWith('conseils-sante/') || clean.startsWith('blog/')) {
    const parts = clean.split('/');
    return { page: 'blog-detail', postId: parts[1] || '' };
  }

  if (clean === 'contact' || clean === 'acces') return { page: 'contact' };
  if (clean === 'dashboard') return { page: 'dashboard' };
  if (clean === 'login' || clean === 'connexion' || clean === 'espace-praticien' || clean === 'auth') return { page: 'login' };

  return { page: 'home' };
};

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const [route, setRoute] = useState<AppRoute>(() => parsePath(window.location.pathname));

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname || '/';
      setCurrentPath(path);
      setRoute(parsePath(path));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    const formatted = path.startsWith('/') ? path : `/${path}`;
    window.history.pushState({}, '', formatted);
    setCurrentPath(formatted);
    setRoute(parsePath(formatted));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToService = (serviceId: string) => {
    navigate(`/services/${serviceId}`);
  };

  const navigateToBooking = (serviceId?: string) => {
    if (serviceId) {
      navigate(`/rendez-vous/${serviceId}`);
    } else {
      navigate('/rendez-vous');
    }
  };

  const navigateToBlogDetail = (postId: string) => {
    navigate(`/conseils-sante/${postId}`);
  };

  const navigateToDashboard = () => {
    navigate('/dashboard');
  };

  const navigateToLogin = () => {
    navigate('/espace-praticien');
  };

  return (
    <NavigationContext.Provider
      value={{
        route,
        navigate,
        navigateToService,
        navigateToBooking,
        navigateToBlogDetail,
        navigateToDashboard,
        navigateToLogin,
        currentPath,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
