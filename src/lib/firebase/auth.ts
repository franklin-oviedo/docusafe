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
const NOOP_UNSUBSCRIBE = () => {};

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

export const resolveGoogleRedirect = () =>
  auth ? getRedirectResult(auth) : Promise.resolve(null);

export const signOut = () =>
  auth ? firebaseSignOut(auth) : Promise.resolve();

export const onAuthChange = (callback: (user: User | null) => void) =>
  auth ? onAuthStateChanged(auth, callback) : (callback(null), NOOP_UNSUBSCRIBE);
