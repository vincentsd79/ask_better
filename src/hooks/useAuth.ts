import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { AuthService } from '../services/firebase';
import { AuthState } from '../types';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const unsubscribe = AuthService.onAuthStateChanged((user: User | null) => {
      setAuthState(prev => ({
        ...prev,
        user,
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
      setAuthState(prev => ({ ...prev, loading: false, error: null }));
    }
    
    return result;
  };

  const signUp = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    const result = await AuthService.signUp(email, password);
    
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

  return {
    user: authState.user,
    loading: authState.loading,
    error: authState.error,
    signIn,
    signUp,
    signOut,
    clearError,
  };
};
