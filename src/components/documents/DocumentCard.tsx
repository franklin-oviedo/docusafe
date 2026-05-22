"use client";
import { useState } from "react";
import type { DocuSafeDocument } from "@/types";

interface Props {
  document: DocuSafeDocument;
  onPreview: (doc: DocuSafeDocument) => void;
  onDelete: (doc: DocuSafeDocument) => void;
}

const COLORS: Record<string, string> = {
  factura: "bg-yellow-100 text-yellow-800",
  transferencias: "bg-green-100 text-green-800",
  alquiler: "bg-indigo-100 text-indigo-800",
  garantia: "bg-purple-100 text-purple-800",
  contrato: "bg-blue-100 text-blue-800",
  inversion: "bg-red-100 text-red-800",
  medico: "bg-pink-100 text-pink-800",
  otro: "bg-gray-100 text-gray-800",
};

const fmtBytes = (b: number) =>
  b < 1024 ? `${b} B` : b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(1)} MB`;

const fmtDate = (d: any) =>
  new Date(d?.seconds ? d.seconds * 1000 : d)
    .toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });

export default function DocumentCard({ document: doc, onPreview, onDelete }: Props) {
  const [deleting, setDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    setIsDeleteModalOpen(false);
    setDeleting(true);
    await onDelete(doc);
  };

  return (
    <>
      <div
        onClick={() => onPreview(doc)}
        className="card cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all group"
      >
        <div className="flex items-start gap-3">
          <span className="text-3xl flex-shrink-0">{doc.fileType === "pdf" ? "📄" : "🖼️"}</span>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 truncate">{doc.name}</p>
            {doc.description && (
              <p className="text-sm text-gray-500 truncate mt-0.5">{doc.description}</p>
            )}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${COLORS[doc.category]}`}>
                {doc.category}
              </span>
              <span className="text-xs text-gray-400">{fmtBytes(doc.fileSize)}</span>
              <span className="text-xs text-gray-400">{fmtDate(doc.createdAt)}</span>
            </div>
            {doc.tags && doc.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {doc.tags.slice(0, 3).map((t) => (
                  <span key={t} className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all flex-shrink-0"
            title="Eliminar"
          >
            {deleting ? "⏳" : "🗑️"}
          </button>
        </div>
      </div>

      {isDeleteModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setIsDeleteModalOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-xl bg-white p-5 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 className="text-base font-semibold text-gray-900">Eliminar documento</h3>
            <p className="mt-2 text-sm text-gray-600">
              Esta acción eliminará &quot;{doc.name}&quot; de forma permanente.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="btn-secondary"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="btn-primary bg-red-600 hover:bg-red-700 active:bg-red-800"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
