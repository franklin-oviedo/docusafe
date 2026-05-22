"use client";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useDocuments } from "@/hooks/useDocuments";
import { DOCUMENT_CATEGORIES } from "@/types";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { documents, loading } = useDocuments(user?.uid ?? null);
  const firstName = user?.displayName?.split(" ")[0] || "Usuario";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Hola, {firstName} 👋</h1>
        <p className="text-gray-500 mt-1">Resumen de tus documentos</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card text-center animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-14 mx-auto" />
              <div className="h-3 bg-gray-100 rounded w-20 mx-auto mt-2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="card text-center">
            <p className="text-3xl font-bold text-blue-600">{documents.length}</p>
            <p className="text-sm text-gray-500 mt-1">Total</p>
          </div>
          {DOCUMENT_CATEGORIES.slice(0, 3).map((cat) => (
            <div key={cat.value} className="card text-center">
              <p className="text-3xl font-bold text-gray-800">
                {documents.filter((d) => d.category === cat.value).length}
              </p>
              <p className="text-sm text-gray-500 mt-1">{cat.label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/dashboard/documents" className="card flex items-center gap-4 hover:shadow-md transition-all hover:-translate-y-0.5">
          <span className="text-4xl">📂</span>
          <div>
            <p className="font-semibold text-gray-900">Mis documentos</p>
            <p className="text-sm text-gray-500">Ver y gestionar todos tus archivos</p>
          </div>
        </Link>
        <Link href="/dashboard/documents?upload=1" className="card flex items-center gap-4 hover:shadow-md transition-all hover:-translate-y-0.5">
          <span className="text-4xl">⬆️</span>
          <div>
            <p className="font-semibold text-gray-900">Subir documento</p>
            <p className="text-sm text-gray-500">PDF, PNG, JPG o JPEG (máx. 20MB)</p>
          </div>
        </Link>
      </div>

      {loading && (
        <div>
          <h2 className="font-semibold text-gray-900 mb-3">Recientes</h2>
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded bg-gray-200" />
                  <div className="flex-1">
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="h-2 bg-gray-100 rounded w-1/3 mt-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && documents.length > 0 && (
        <div>
          <h2 className="font-semibold text-gray-900 mb-3">Recientes</h2>
          <div className="space-y-2">
            {documents.slice(0, 3).map((doc) => (
              <Link key={doc.id} href="/dashboard/documents" className="card flex items-center gap-3 hover:shadow-sm transition-shadow">
                <span className="text-xl">{doc.fileType === "pdf" ? "📄" : "🖼️"}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-900 truncate">{doc.name}</p>
                  <p className="text-xs text-gray-400 capitalize">{doc.category}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
