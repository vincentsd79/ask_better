import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';

// Firebase configuration (imported from root config)
import { firebaseConfig } from '~/firebaseConfig.js';

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

export { auth };

export interface AuthResult {
  success: boolean;
  error?: string;
  user?: User;
}

export class AuthService {
  static async signUp(email: string, password: string): Promise<AuthResult> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error: any) {
      let errorMessage = error.message;
      if (error.code === 'auth/invalid-credential') {
        errorMessage = "Invalid account, please signup.";
      }
      return { success: false, error: errorMessage };
    }
  }

  static async signOut(): Promise<AuthResult> {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
  }
}
