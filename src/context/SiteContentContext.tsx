import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteInfo, MedicalService, TeamMember, BlogPost } from '../types';
import { db, storage } from '../services/firebase';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  DEFAULT_SITE_INFO,
  DEFAULT_SERVICES,
  DEFAULT_TEAM_MEMBERS,
  LS_SITE_INFO,
  LS_SERVICES,
  LS_TEAM,
  seedFirestore,
  autoCheckAndSeed
} from '../services/seedFirestore';
import { getStoredBlogPosts, saveBlogPost as saveBlogPostLocal } from '../services/dataService';

interface SiteContentContextType {
  siteInfo: SiteInfo;
  services: MedicalService[];
  teamMembers: TeamMember[];
  blogPosts: BlogPost[];
  isLoading: boolean;
  updateSiteInfo: (info: Partial<SiteInfo>) => Promise<void>;
  saveService: (service: MedicalService) => Promise<void>;
  deleteService: (serviceId: string) => Promise<void>;
  saveTeamMember: (member: TeamMember) => Promise<void>;
  deleteTeamMember: (memberId: string) => Promise<void>;
  saveBlogPost: (post: BlogPost | Omit<BlogPost, 'id' | 'date'>) => Promise<void>;
  deleteBlogPost: (postId: string) => Promise<void>;
  uploadImage: (file: File, folder?: string) => Promise<string>;
  resetToDefaults: () => Promise<void>;
}

const SiteContentContext = createContext<SiteContentContextType | undefined>(undefined);

export const SiteContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Clear any legacy local storage cache on initialization
  useEffect(() => {
    try {
      localStorage.removeItem(LS_SITE_INFO);
      localStorage.removeItem(LS_SERVICES);
      localStorage.removeItem(LS_TEAM);
      localStorage.removeItem('cabinet_data_version');
    } catch {
      // ignore
    }
  }, []);

  // Direct initial state from code defaults in seedFirestore.ts
  const [siteInfo, setSiteInfo] = useState<SiteInfo>(DEFAULT_SITE_INFO);
  const [services, setServices] = useState<MedicalService[]>(DEFAULT_SERVICES);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(DEFAULT_TEAM_MEMBERS);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => getStoredBlogPosts());
  const [isLoading, setIsLoading] = useState(true);

  // Auto-seed Firestore on mount if needed
  useEffect(() => {
    autoCheckAndSeed();
  }, []);

  // Connect real-time Firestore listeners
  useEffect(() => {
    let unsubs: (() => void)[] = [];

    if (db) {
      try {
        // 1. Listen to site_data/general
        const unsubSite = onSnapshot(
          doc(db, 'site_data', 'general'),
          (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data() as SiteInfo;
              setSiteInfo(data);
            }
          },
          (err) => console.warn('Firestore onSnapshot site_data:', err)
        );
        unsubs.push(unsubSite);

        // 2. Listen to services collection
        const unsubServices = onSnapshot(
          collection(db, 'services'),
          (snapshot) => {
            if (!snapshot.empty) {
              const list: MedicalService[] = [];
              snapshot.forEach((d) => list.push(d.data() as MedicalService));
              setServices(list);
            }
          },
          (err) => console.warn('Firestore onSnapshot services:', err)
        );
        unsubs.push(unsubServices);

     // 3. Listen to team_members collection (ALL members, real-time)
const unsubTeam = onSnapshot(
  collection(db, 'team_members'),
  (snapshot) => {
    const list: TeamMember[] = [];

    snapshot.forEach((d) => {
      const data = d.data() as TeamMember;
      // On s'assure que l'id est toujours présent
      list.push({ ...data, id: data.id || d.id });
    });

    // Tri par ordre d'affichage
    list.sort((a, b) => (a.order || 0) - (b.order || 0));

    // Si Firestore est vide, on garde les valeurs par défaut
    if (list.length === 0) {
      setTeamMembers(DEFAULT_TEAM_MEMBERS);
    } else {
      setTeamMembers(list);
    }
  },
  (err) => console.warn('Firestore onSnapshot team_members:', err)
);
unsubs.push(unsubTeam);

        // 4. Listen to blog_posts collection
        const unsubBlog = onSnapshot(
          collection(db, 'blog_posts'),
          (snapshot) => {
            if (!snapshot.empty) {
              const list: BlogPost[] = [];
              snapshot.forEach((d) => list.push(d.data() as BlogPost));
              list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
              setBlogPosts(list);
            }
          },
          (err) => console.warn('Firestore onSnapshot blog_posts:', err)
        );
        unsubs.push(unsubBlog);
      } catch (err) {
        console.warn('Real-time listener setup error:', err);
      }
    }

    // Finished initial load
    setIsLoading(false);

    return () => {
      unsubs.forEach((u) => {
        try {
          u();
        } catch {
          // ignore
        }
      });
    };
  }, []);

  // Update general site info
  const updateSiteInfo = async (newInfo: Partial<SiteInfo>) => {
    const merged = { ...siteInfo, ...newInfo };
    setSiteInfo(merged);

    if (db) {
      try {
        await setDoc(doc(db, 'site_data', 'general'), merged, { merge: true });
      } catch (e) {
        console.warn('Firestore updateSiteInfo error:', e);
      }
    }
  };

  // Add or update a medical service
  const saveService = async (service: MedicalService) => {
    const updated = [...services.filter((s) => s.id !== service.id), service];
    setServices(updated);

    if (db) {
      try {
        await setDoc(doc(db, 'services', service.id), service);
      } catch (e) {
        console.warn('Firestore saveService error:', e);
      }
    }
  };

  // Delete a medical service
  const deleteService = async (serviceId: string) => {
    const updated = services.filter((s) => s.id !== serviceId);
    setServices(updated);

    if (db) {
      try {
        await deleteDoc(doc(db, 'services', serviceId));
      } catch (e) {
        console.warn('Firestore deleteService error:', e);
      }
    }
  };

  // Add or update a team member
  const saveTeamMember = async (member: TeamMember) => {
    const updated = [...teamMembers.filter((m) => m.id !== member.id), member];
    updated.sort((a, b) => (a.order || 0) - (b.order || 0));
    setTeamMembers(updated);

    if (db) {
      try {
        await setDoc(doc(db, 'team_members', member.id), member);
      } catch (e) {
        console.warn('Firestore saveTeamMember error:', e);
      }
    }
  };

  // Delete a team member
  const deleteTeamMember = async (memberId: string) => {
    const updated = teamMembers.filter((m) => m.id !== memberId);
    setTeamMembers(updated);

    if (db) {
      try {
        await deleteDoc(doc(db, 'team_members', memberId));
      } catch (e) {
        console.warn('Firestore deleteTeamMember error:', e);
      }
    }
  };

  // Save blog post
  const saveBlogPost = async (post: BlogPost | Omit<BlogPost, 'id' | 'date'>) => {
    const fullPost: BlogPost = {
      ...post,
      id: 'id' in post ? post.id : `post_${Date.now()}`,
      date: 'date' in post ? post.date : new Date().toISOString().split('T')[0]
    };

    const updated = [fullPost, ...blogPosts.filter((p) => p.id !== fullPost.id)];
    setBlogPosts(updated);

    if (db) {
      try {
        await setDoc(doc(db, 'blog_posts', fullPost.id), fullPost);
      } catch (e) {
        console.warn('Firestore saveBlogPost error:', e);
      }
    }
  };

  // Delete blog post
  const deleteBlogPost = async (postId: string) => {
    const updated = blogPosts.filter((p) => p.id !== postId);
    setBlogPosts(updated);

    if (db) {
      try {
        await deleteDoc(doc(db, 'blog_posts', postId));
      } catch (e) {
        console.warn('Firestore deleteBlogPost error:', e);
      }
    }
  };

  // Upload an image via Firebase Storage with Canvas compression & Data-URL fallback
  const uploadImage = async (file: File, folder = 'clinic_media'): Promise<string> => {
    if (storage) {
      try {
        const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
        const fileRef = ref(storage, `${folder}/${Date.now()}_${cleanName}`);
        const snapshot = await uploadBytes(fileRef, file);
        const downloadUrl = await getDownloadURL(snapshot.ref);
        return downloadUrl;
      } catch (err) {
        console.warn('Storage upload fallback triggered:', err);
      }
    }

    // High quality Canvas compressed Data URL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 1200;
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.85));
          } else {
            resolve(ev.target?.result as string);
          }
        };
        img.onerror = () => resolve(ev.target?.result as string);
        img.src = ev.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Reset to original default data directly from code defaults
  const resetToDefaults = async () => {
    try {
      localStorage.removeItem(LS_SITE_INFO);
      localStorage.removeItem(LS_SERVICES);
      localStorage.removeItem(LS_TEAM);
      localStorage.removeItem('cabinet_data_version');
      localStorage.removeItem('cabinet_namboy_blog');
    } catch {
      // ignore
    }
    await seedFirestore(true);
    setSiteInfo(DEFAULT_SITE_INFO);
    setServices(DEFAULT_SERVICES);
    setTeamMembers(DEFAULT_TEAM_MEMBERS);
    setBlogPosts(getStoredBlogPosts());
  };

  return (
    <SiteContentContext.Provider
      value={{
        siteInfo,
        services,
        teamMembers,
        blogPosts,
        isLoading,
        updateSiteInfo,
        saveService,
        deleteService,
        saveTeamMember,
        deleteTeamMember,
        saveBlogPost,
        deleteBlogPost,
        uploadImage,
        resetToDefaults
      }}
    >
      {children}
    </SiteContentContext.Provider>
  );
};

export const useSiteContent = (): SiteContentContextType => {
  const context = useContext(SiteContentContext);
  if (!context) {
    throw new Error('useSiteContent must be used within a SiteContentProvider');
  }
  return context;
};
