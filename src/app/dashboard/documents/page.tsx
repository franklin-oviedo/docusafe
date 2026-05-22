"use client";
import { useState, useEffect, useMemo, Suspense } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useDocuments } from "@/hooks/useDocuments";
import DocumentCard from "@/components/documents/DocumentCard";
import SearchBar from "@/components/documents/SearchBar";
import type { DocuSafeDocument } from "@/types";

const DocumentUpload = dynamic(() => import("@/components/documents/DocumentUpload"), {
  ssr: false,
});

const DocumentPreview = dynamic(() => import("@/components/documents/DocumentPreview"), {
  ssr: false,
});

function DocumentsContent() {
  const { user } = useAuthStore();
  const { documents, loading, error, search, remove, refresh } = useDocuments(
    user?.uid ?? null
  );
  const [showUpload, setShowUpload] = useState(false);
  const [preview, setPreview] = useState<DocuSafeDocument | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("upload") === "1") setShowUpload(true);
  }, [searchParams]);

  const filtered = useMemo(
    () => (categoryFilter ? documents.filter((d) => d.category === categoryFilter) : documents),
    [documents, categoryFilter]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Mis documentos</h1>
        <button onClick={() => setShowUpload(true)} className="btn-primary flex items-center gap-2 flex-shrink-0">
          <span className="text-lg leading-none">+</span>
          <span className="hidden sm:inline">Subir</span>
        </button>
      </div>

      <SearchBar onSearch={search} onCategoryFilter={setCategoryFilter} />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 px-4">
          <p className="text-6xl mb-4">📂</p>
          <p className="text-gray-600 font-semibold text-lg">
            {categoryFilter ? "No hay documentos en esta categoría" : "Aún no tienes documentos"}
          </p>
          <p className="text-gray-400 text-sm mt-1">
            {categoryFilter ? "Prueba con otra categoría" : "Sube tu primer documento para empezar"}
          </p>
          {!categoryFilter && (
            <button onClick={() => setShowUpload(true)} className="btn-primary mt-5">
              Subir primer documento
            </button>
          )}
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-400">{filtered.length} documento{filtered.length !== 1 ? "s" : ""}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((doc) => (
              <DocumentCard key={doc.id} document={doc} onPreview={setPreview} onDelete={remove} />
            ))}
          </div>
        </>
      )}

      {showUpload && (
        <DocumentUpload
          onSuccess={() => { setShowUpload(false); refresh(); }}
          onCancel={() => setShowUpload(false)}
        />
      )}
      {preview && <DocumentPreview document={preview} onClose={() => setPreview(null)} />}
    </div>
  );
}

export default function DocumentsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <DocumentsContent />
    </Suspense>
  );
}
