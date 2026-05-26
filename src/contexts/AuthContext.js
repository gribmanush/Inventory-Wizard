import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const AuthContext = createContext();

async function fetchProfile(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : {};
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const profile = await fetchProfile(firebaseUser.uid);
        setUser({ user_id: firebaseUser.uid, email: firebaseUser.email, ...profile });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signup = async ({ fullName, email, password, businessName }) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const now = new Date().toISOString();
      const freePeriodEnd = new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000).toISOString();
      const profile = {
        full_name: fullName,
        business_name: businessName || null,
        signup_date: now,
        free_period_end: freePeriodEnd,
        subscription_status: 'free',
        avatar_uri: null,
      };
      await setDoc(doc(db, 'users', cred.user.uid), profile);
      setUser({ user_id: cred.user.uid, email, ...profile });
      return { success: true };
    } catch (e) {
      if (e.code === 'auth/email-already-in-use') {
        return { success: false, error: 'An account with this email already exists.' };
      }
      return { success: false, error: 'Sign up failed. Please try again.' };
    }
  };

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (e) {
      if (e.code === 'auth/user-not-found' || e.code === 'auth/invalid-credential' || e.code === 'auth/invalid-email') {
        return { success: false, error: 'No account found with that email.' };
      }
      if (e.code === 'auth/wrong-password') {
        return { success: false, error: 'Incorrect password.' };
      }
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const refreshUser = async () => {
    if (auth.currentUser) {
      const profile = await fetchProfile(auth.currentUser.uid);
      setUser({ user_id: auth.currentUser.uid, email: auth.currentUser.email, ...profile });
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
