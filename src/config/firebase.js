import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDGNe1fyD7W1D64PqrZ3JXUfaO--yC5-6U",
  authDomain: "inventorywizard-d3f53.firebaseapp.com",
  projectId: "inventorywizard-d3f53",
  storageBucket: "inventorywizard-d3f53.firebasestorage.app",
  messagingSenderId: "44479201802",
  appId: "1:44479201802:web:5e08273743c6e44a5255f3",
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
