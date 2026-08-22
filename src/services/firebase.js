import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA1S6QouNmYLjml_uCcFVoDDCaX8iluZH0",
  authDomain: "nysapp-e1144.firebaseapp.com",
  projectId: "nysapp-e1144",
  storageBucket: "nysapp-e1144.firebasestorage.app",
  messagingSenderId: "112874487499",
  appId: "1:112874487499:web:f5f568db178b81e415a54e",
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
