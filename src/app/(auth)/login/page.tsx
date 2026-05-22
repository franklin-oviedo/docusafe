import type { Metadata } from "next";
import Image from "next/image";
import LoginPageClient from "@/components/auth/LoginPageClient";

export const metadata: Metadata = { title: "Iniciar sesión" };

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <Image
              src="/logo.png"
              alt="DocuSafe"
              width={520}
              height={130}
              className="h-24 sm:h-28 w-auto"
              priority
            />
          </div>
          <p className="text-gray-500 mt-1">Tus documentos, siempre seguros</p>
        </div>
        <div className="card shadow-md">
          <LoginPageClient />
        </div>
      </div>
    </main>
  );
}
