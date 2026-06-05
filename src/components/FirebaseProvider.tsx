import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc 
} from 'firebase/firestore';
import { 
  auth, 
  db, 
  loginWithGoogle, 
  loginWithEmailAndPassword,
  signUpWithEmailAndPassword,
  logoutUser, 
  handleFirestoreError, 
  OperationType 
} from '../lib/firebase';
import { toast } from 'sonner';

interface UserProfile {
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  portfolio: string;
  isPro: boolean;
}

interface FirebaseContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  login: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Fetch or create profile
        const profileRef = doc(db, 'users', currentUser.uid);
        try {
          const docSnap = await getDoc(profileRef);
          
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
          } else {
            // Setup a default initial profile based on authenticated user info
            const initialProfile: UserProfile = {
              userId: currentUser.uid,
              fullName: currentUser.displayName || '',
              email: currentUser.email || '',
              phone: currentUser.phoneNumber || '',
              location: '',
              linkedin: '',
              portfolio: '',
              isPro: false,
            };
            
            await setDoc(profileRef, initialProfile);
            setProfile(initialProfile);
          }
        } catch (error) {
          console.error('Error fetching/creating profile:', error);
          // Don't crash, fallback to local tracking
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      setLoading(true);
      await loginWithGoogle();
      toast.success('Successfully signed in with Google!');
    } catch (error: any) {
      let friendlyMsg = 'Google Sign-in failed';
      if (error && error.code === 'auth/unauthorized-domain') {
        friendlyMsg = 'Unauthorized Domain: This website domain must be added to your Firebase Authorized Domains';
      } else if (error && error.code === 'auth/popup-blocked') {
        friendlyMsg = 'Popup block active. Please allow popups for this site.';
      }
      toast.error(friendlyMsg);
      setLoading(false);
      throw error;
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    try {
      setLoading(true);
      await loginWithEmailAndPassword(email, pass);
      toast.success('Successfully signed in!');
    } catch (error: any) {
      let friendlyMsg = error.message || 'Email Sign-in failed';
      if (error && error.code === 'auth/operation-not-allowed') {
        friendlyMsg = 'Email/Password authentication provider is disabled in your Firebase console. Please enable it under Auth > Sign-in method.';
      }
      toast.error(friendlyMsg);
      setLoading(false);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, pass: string, fullName: string) => {
    try {
      setLoading(true);
      const user = await signUpWithEmailAndPassword(email, pass, fullName);
      if (user) {
        // Explicitly write/overwrite the profile with the active full name to prevent empty displayName races in onAuthStateChanged
        const profileRef = doc(db, 'users', user.uid);
        const initialProfile: UserProfile = {
          userId: user.uid,
          fullName: fullName,
          email: user.email || email,
          phone: '',
          location: '',
          linkedin: '',
          portfolio: '',
          isPro: false,
        };
        await setDoc(profileRef, initialProfile);
        setProfile(initialProfile);
      }
      toast.success('Successfully registered and signed in!');
    } catch (error: any) {
      let friendlyMsg = error.message || 'Registration failed';
      if (error && error.code === 'auth/operation-not-allowed') {
        friendlyMsg = 'Email/Password authentication provider is disabled in your Firebase console. Please enable it under Auth > Sign-in method.';
      }
      toast.error(friendlyMsg);
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await logoutUser();
      toast.success('Successfully signed out');
    } catch (error) {
      toast.error('Logout failed');
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    const profileRef = doc(db, 'users', user.uid);
    try {
      await updateDoc(profileRef, data);
      setProfile(prev => prev ? { ...prev, ...data } : null);
      toast.success('Profile updated successfully');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  return (
    <FirebaseContext.Provider value={{ user, profile, loading, login, loginWithEmail, signUpWithEmail, logout, updateProfile }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};
