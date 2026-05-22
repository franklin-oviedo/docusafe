"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { resolveGoogleRedirect } from "@/lib/firebase/auth";
import { auth } from "@/lib/firebase/config";
import { useAuthStore } from "@/store/authStore";
import { onAuthStateChanged } from "firebase/auth";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPageClient() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    if (!auth) return;

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setLoading(false);
        router.replace("/dashboard");
      }
    });

    return unsubscribe;
  }, [router, setLoading, setUser]);

  useEffect(() => {
    const syncRedirectResult = async () => {
      try {
        if (auth && "authStateReady" in auth && typeof auth.authStateReady === "function") {
          await auth.authStateReady();
        }

        const result = await resolveGoogleRedirect();
        const signedInUser = result?.user ?? auth?.currentUser ?? null;

        if (signedInUser) {
          setUser(signedInUser);
          setLoading(false);
          router.replace("/dashboard");
        }
      } catch (error) {
        console.error("Google redirect resolution failed", error);
      }
    };

    void syncRedirectResult();
  }, [router, setLoading, setUser]);

  useEffect(() => {
    if (!loading && user) router.replace("/dashboard");
  }, [loading, router, user]);

  return <LoginForm />;
}