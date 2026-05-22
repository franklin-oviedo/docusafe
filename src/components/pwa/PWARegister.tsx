"use client";

import { useEffect } from "react";

export default function PWARegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    const registerSw = async () => {
      try {
        const swResponse = await fetch("/sw.js", { cache: "no-store" });
        if (!swResponse.ok) {
          return;
        }

        await navigator.serviceWorker.register("/sw.js", { scope: "/" });
      } catch (error) {
        console.error("SW registration failed", error);
      }
    };

    registerSw();
  }, []);

  return null;
}
