"use client";
import { useState, useEffect } from "react";
import type { DocuSafeDocument } from "@/types";

interface Props {
  document: DocuSafeDocument;
  onClose: () => void;
}

export default function DocumentPreview({ document: doc, onClose }: Props) {
  const [PdfViewer, setPdfViewer] = useState<React.ComponentType<{ url: string }> | null>(null);
  const [imageZoom, setImageZoom] = useState(1);

  useEffect(() => {
    if (doc.fileType !== "pdf") return;
    import("./PdfViewer").then((m) => setPdfViewer(() => m.default)).catch(console.error);
  }, [doc.fileType]);

  useEffect(() => {
    setImageZoom(1);
  }, [doc.id]);

  const handleDownload = () => {
    const a = window.document.createElement("a");
    a.href = doc.fileUrl;
    a.download = doc.name;
    a.target = "_blank";
    a.click();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[88vh] h-[88vh] flex flex-col shadow-2xl">
        <div className="flex items-center gap-3 p-4 border-b border-gray-100 flex-shrink-0">
          <span className="text-2xl">{doc.fileType === "pdf" ? "📄" : "🖼️"}</span>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 truncate">{doc.name}</p>
            <p className="text-xs text-gray-400 capitalize">
              {doc.category} · {(doc.fileSize / 1048576).toFixed(2)} MB
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={handleDownload} className="btn-secondary text-sm px-3 py-1.5 flex items-center gap-1.5">
              ⬇️ <span className="hidden sm:inline">Descargar</span>
            </button>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400">
              ✕
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden bg-gray-100 flex items-center justify-center p-3 sm:p-4 rounded-b-2xl">
          {doc.fileType === "image" ? (
            <div className="w-full h-full min-h-0 flex flex-col bg-gradient-to-b from-slate-100 to-slate-200 rounded-xl p-2 sm:p-3 gap-2">
              <div className="flex-1 min-h-0 overflow-hidden flex items-center justify-center">
                <img
                  src={doc.fileUrl}
                  alt={doc.name}
                  className="max-w-full max-h-full w-auto h-auto object-contain rounded-lg shadow-lg transition-transform duration-150"
                  style={{ transform: `scale(${imageZoom})`, transformOrigin: "center center" }}
                />
              </div>
              <div className="flex items-center justify-center">
                <div className="flex items-center gap-2 sm:gap-3 bg-white/95 border border-gray-200 rounded-full px-3 sm:px-4 py-2 shadow-sm">
                  <button
                    type="button"
                    onClick={() => setImageZoom((z) => Math.max(0.6, +(z - 0.2).toFixed(2)))}
                    className="w-7 h-7 rounded-full text-sm text-gray-600 hover:bg-gray-100"
                    aria-label="Alejar imagen"
                  >
                    −
                  </button>
                  <span className="text-xs sm:text-sm text-gray-600 min-w-12 text-center tabular-nums">
                    {Math.round(imageZoom * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={() => setImageZoom((z) => Math.min(2.5, +(z + 0.2).toFixed(2)))}
                    className="w-7 h-7 rounded-full text-sm text-gray-600 hover:bg-gray-100"
                    aria-label="Acercar imagen"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageZoom(1)}
                    className="text-xs px-2 py-1 rounded-full text-gray-600 hover:bg-gray-100"
                  >
                    100%
                  </button>
                </div>
              </div>
            </div>
          ) : PdfViewer ? (
            <PdfViewer url={doc.fileUrl} />
          ) : (
            <div className="text-center text-gray-500">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm">Cargando PDF…</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
