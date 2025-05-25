import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { AuthService } from '../services/firebase';
import { AuthState } from '../types';
import { db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  // Helper to fetch user profile from Firestore
  const fetchUserProfile = async (user: User | null) => {
    if (!user) return null;
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists()) {
      return { ...user, ...userDoc.data() };
    }
    return user;
  };

  useEffect(() => {
    const unsubscribe = AuthService.onAuthStateChanged(async (user: User | null) => {
      const userWithProfile = await fetchUserProfile(user);
      setAuthState(prev => ({
        ...prev,
        user: userWithProfile,
        loading: false,
      }));
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    const result = await AuthService.signIn(email, password);
    
    if (!result.success) {
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: result.error || 'Sign in failed' 
      }));
    } else {
      const userWithProfile = await fetchUserProfile(result.user ?? null);
      setAuthState(prev => ({ ...prev, loading: false, error: null, user: userWithProfile }));
    }
    
    return result;
  };

  const signUp = async (name: string, email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    const result = await AuthService.signUp(name, email, password);
    
    if (!result.success) {
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: result.error || 'Sign up failed' 
      }));
    } else {
      setAuthState(prev => ({ ...prev, loading: false, error: null }));
    }
    
    return result;
  };

  const signOut = async () => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    const result = await AuthService.signOut();
    
    if (!result.success) {
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: result.error || 'Sign out failed' 
      }));
    }
    
    return result;
  };

  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }));
  };

  const resetPassword = async (email: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    const result = await AuthService.resetPassword(email);
    setAuthState(prev => ({ ...prev, loading: false, error: result.error || null }));
    return result;
  };

  return {
    user: authState.user,
    loading: authState.loading,
    error: authState.error,
    signIn,
    signUp,
    signOut,
    clearError,
    resetPassword,
  };
};
