"use client";
import Link from "next/link";
import { useState } from "react";
import type { FirebaseError } from "firebase/app";
import { loginWithGoogleRedirect } from "@/lib/firebase/auth";

const getGoogleErrorMessage = (err: unknown) => {
  const code = (err as FirebaseError | undefined)?.code;

  switch (code) {
    case "auth/configuration-not-found":
      return "Firebase Authentication no esta configurado para este proyecto o Google Sign-In no esta habilitado.";
    case "auth/operation-not-allowed":
      return "Google no esta habilitado en Firebase Authentication.";
    case "auth/unauthorized-domain":
      return "Dominio no autorizado. Agrega localhost en Firebase Authentication > Settings > Authorized domains.";
    case "auth/popup-blocked":
      return "El navegador bloqueo la ventana emergente. Habilita pop-ups para este sitio.";
    case "auth/popup-closed-by-user":
      return "La ventana de Google se cerro antes de completar el inicio de sesion.";
    case "auth/cancelled-popup-request":
      return "Se cancelo el intento de inicio de sesion. Intenta de nuevo.";
    default:
      return "Error al iniciar sesion con Google.";
  }
};

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

export default function LoginForm() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogle = async () => {
    setIsLoading(true);
    setError("");
    try {
      await loginWithGoogleRedirect();
      return;
    } catch (err) {
      console.error("Google sign-in failed", err);
      setError(getGoogleErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 text-center">
        Inicia sesión con tu cuenta de Google para continuar.
      </p>
      {error && <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">{error}</p>}
      <button
        type="button"
        onClick={handleGoogle}
        disabled={isLoading}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        <GoogleIcon />
        {isLoading ? "Conectando..." : "Continuar con Google"}
      </button>
      <p className="text-xs text-slate-500 text-center leading-5">
        Al continuar aceptas nuestros{" "}
        <Link href="/terminos" className="text-blue-600 hover:underline font-medium">
          Terminos y Condiciones
        </Link>
        .
      </p>
    </div>
  );
}
