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
    void resolveGoogleRedirect().catch((error) => {
      console.error("Google redirect resolution failed", error);
    });
  }, []);

  useEffect(() => {
    if (!loading && user) router.replace("/dashboard");
  }, [loading, router, user]);

  return <LoginForm />;
}