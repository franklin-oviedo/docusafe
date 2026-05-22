import {
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithRedirect,
  signInWithPopup,
  getRedirectResult,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { auth } from "./config";

const googleProvider = new GoogleAuthProvider();

const getClientAuth = () => {
  if (!auth) {
    throw new Error(
      "Firebase client config is missing. Set NEXT_PUBLIC_FIREBASE_* variables."
    );
  }
  return auth;
};

export const loginWithGoogle = async () => {
  const credential = await signInWithPopup(getClientAuth(), googleProvider);
  return credential.user;
};

export const loginWithGoogleRedirect = () =>
  signInWithRedirect(getClientAuth(), googleProvider);

export const resolveGoogleRedirect = () => getRedirectResult(getClientAuth());

export const signOut = () => firebaseSignOut(getClientAuth());

export const onAuthChange = (callback: (user: User | null) => void) =>
  onAuthStateChanged(getClientAuth(), callback);
