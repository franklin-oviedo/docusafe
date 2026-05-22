"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export default function PdfViewer({ url }: { url: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [numPages, setNumPages] = useState<number>(1);
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [pageWidth, setPageWidth] = useState(560);
  const [loadError, setLoadError] = useState<string | null>(null);

  const fileSource = useMemo(() => {
    if (!url.startsWith("data:application/pdf;base64,")) {
      return url;
    }

    const base64 = url.split(",")[1] || "";
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }

    return { data: bytes };
  }, [url]);

  useEffect(() => {
    const updateWidth = () => {
      const containerWidth = containerRef.current?.clientWidth;
      const containerHeight = containerRef.current?.clientHeight;
      const viewportWidth = typeof window !== "undefined" ? window.innerWidth - 32 : 900;
      const availableWidth = (containerWidth ?? viewportWidth) - 24;
      const availableHeight = (containerHeight ?? 820) - 86;
      const widthByHeight = availableHeight / 1.414;
      const nextWidth = Math.max(220, Math.min(620, availableWidth, widthByHeight));
      setPageWidth(nextWidth);
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);

    const observer =
      typeof ResizeObserver !== "undefined" && containerRef.current
        ? new ResizeObserver(updateWidth)
        : null;

    if (observer && containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener("resize", updateWidth);
      observer?.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col items-center gap-4 w-full h-full overflow-hidden">
      <Document
        file={fileSource}
        onLoadSuccess={({ numPages }) => {
          setLoadError(null);
          setNumPages(numPages);
        }}
        onLoadError={(error) => {
          console.error("PDF load failed", error);
          setLoadError("No se pudo cargar este PDF.");
        }}
        className="shadow-xl rounded overflow-hidden max-w-full"
        loading={
          <div className="flex items-center justify-center p-12">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        {!loadError && (
          <Page
            pageNumber={page}
            width={pageWidth}
            scale={zoom}
            renderAnnotationLayer
            renderTextLayer
          />
        )}
      </Document>
      {loadError && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {loadError}
        </p>
      )}
      <div className="flex items-center gap-2 sm:gap-4 bg-white px-3 sm:px-5 py-2.5 rounded-full shadow-md">
        <button
          type="button"
          onClick={() => setZoom((z) => Math.max(0.6, +(z - 0.2).toFixed(2)))}
          className="w-7 h-7 rounded-full text-sm text-gray-600 hover:bg-gray-100"
          aria-label="Alejar PDF"
        >
          −
        </button>
        <span className="text-xs sm:text-sm text-gray-600 font-medium tabular-nums min-w-12 text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button
          type="button"
          onClick={() => setZoom((z) => Math.min(2.5, +(z + 0.2).toFixed(2)))}
          className="w-7 h-7 rounded-full text-sm text-gray-600 hover:bg-gray-100"
          aria-label="Acercar PDF"
        >
          +
        </button>
        <button
          type="button"
          onClick={() => setZoom(1)}
          className="text-xs px-2 py-1 rounded-full text-gray-600 hover:bg-gray-100"
        >
          100%
        </button>
        {numPages > 1 && (
          <>
            <span className="w-px h-5 bg-gray-200" />
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="disabled:opacity-40 text-gray-600 hover:text-blue-600 text-lg leading-none"
            >
              ◀
            </button>
            <span className="text-xs sm:text-sm text-gray-600 font-medium tabular-nums">
              {page} / {numPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(numPages, p + 1))}
              disabled={page >= numPages}
              className="disabled:opacity-40 text-gray-600 hover:text-blue-600 text-lg leading-none"
            >
              ▶
            </button>
          </>
        )}
      </div>
    </div>
  );
}
