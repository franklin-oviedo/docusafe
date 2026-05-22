"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "@/lib/firebase/auth";
import { useAuthStore } from "@/store/authStore";

const navLinks = [
  { href: "/dashboard", label: "Inicio", exact: true },
  { href: "/dashboard/documents", label: "Documentos", exact: false },
];

export default function Navbar() {
  const { user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      router.push("/login");
    } finally {
      setIsSigningOut(false);
    }
  };

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          <Link href="/dashboard" className="flex items-center">
            <Image
              src="/logo.png"
              alt="DocuSafe"
              width={340}
              height={85}
              className="h-14 w-auto"
              priority
            />
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(l.href, l.exact)
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-3">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
                {(user?.displayName || user?.email || "U")[0].toUpperCase()}
              </div>
            )}
            <span className="text-sm text-gray-600 max-w-[160px] truncate">
              {user?.displayName || user?.email}
            </span>
            <button
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="btn-secondary text-sm px-3 py-1.5 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSigningOut ? "Saliendo..." : "Salir"}
            </button>
          </div>
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Menú"
          >
            <div className="space-y-1.5">
              <span className={`block w-5 h-0.5 bg-gray-600 transition-transform ${open ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block w-5 h-0.5 bg-gray-600 transition-opacity ${open ? "opacity-0" : ""}`} />
              <span className={`block w-5 h-0.5 bg-gray-600 transition-transform ${open ? "-rotate-45 -translate-y-2" : ""}`} />
            </div>
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                isActive(l.href, l.exact) ? "bg-blue-50 text-blue-700" : "text-gray-600"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <button
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSigningOut ? "Cerrando sesión..." : "Cerrar sesión"}
          </button>
        </div>
      )}
    </header>
  );
}
