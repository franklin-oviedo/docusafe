"use client";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { onAuthChange } from "@/lib/firebase/auth";

export const useAuth = () => {
  const { user, loading, setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const unsub = onAuthChange((u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, [setUser, setLoading]);

  return { user, loading };
};
