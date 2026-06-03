import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User,
  sendPasswordResetEmail
} from 'firebase/auth';
import { getFirestore, doc, setDoc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';

// Firebase configuration (imported from root config)
import { firebaseConfig } from '~/firebaseConfig.js';

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

export { auth, db };

export interface AuthResult {
  success: boolean;
  error?: string;
  user?: User;
}

export class AuthService {
  static async signUp(name: string, email: string, password: string): Promise<AuthResult> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // Store user info in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name,
        email
      });
      return { success: true, user };
    } catch (error: any) {
      let errorMessage = "Unable to create an account with these details.";
      if (error.code === 'auth/weak-password') {
        errorMessage = "Please use a stronger password.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Please enter a valid email address.";
      }
      return { success: false, error: errorMessage };
    }
  }

  static async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error: any) {
      let errorMessage = error.message;
      if (
        error.code === 'auth/invalid-credential' ||
        error.code === 'auth/user-not-found' ||
        error.code === 'auth/wrong-password'
      ) {
        errorMessage = "Invalid email or password. Please try again.";
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

  static async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        return { success: true };
      }
      const errorMessage = error.code === 'auth/invalid-email'
        ? "Please enter a valid email address."
        : "Unable to send a password reset email right now.";
      return { success: false, error: errorMessage };
    }
  }
}

export async function saveChatHistory(userId: string, chatLog: any[], timestamp: number = Date.now()) {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    chatHistory: arrayUnion({ chatLog, timestamp })
  });
}

export async function getChatHistory(userId: string) {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    return userSnap.data().chatHistory || [];
  }
  return [];
}
