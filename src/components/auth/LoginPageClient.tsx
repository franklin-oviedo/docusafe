"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { resolveGoogleRedirect } from "@/lib/firebase/auth";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPageClient() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    const syncRedirectResult = async () => {
      try {
        const result = await resolveGoogleRedirect();
        if (result?.user) {
          router.replace("/dashboard");
        }
      } catch (error) {
        console.error("Google redirect resolution failed", error);
      }
    };

    void syncRedirectResult();
  }, [router]);

  useEffect(() => {
    if (!loading && user) router.replace("/dashboard");
  }, [loading, router, user]);

  return <LoginForm />;
}