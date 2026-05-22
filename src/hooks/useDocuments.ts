"use client";
import { useState, useEffect, useCallback } from "react";
import {
  getUserDocuments,
  searchDocuments,
  deleteDocument,
} from "@/lib/firebase/firestore";
import { deleteFile } from "@/lib/firebase/storage";
import type { DocuSafeDocument } from "@/types";

export const useDocuments = (userId: string | null) => {
  const [documents, setDocuments] = useState<DocuSafeDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = useCallback(async () => {
    if (!userId) {
      setDocuments([]);
      setLoading(false);
      return;
    }

    setError(null);
    setLoading(true);
    try {
      setDocuments(await getUserDocuments(userId));
    } catch {
      setError("Error al cargar los documentos");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { fetchDocuments(); }, [fetchDocuments]);

  const search = useCallback(async (term: string) => {
    if (!userId) return;
    if (!term.trim()) { fetchDocuments(); return; }
    setLoading(true);
    try {
      setDocuments(await searchDocuments(userId, term));
    } catch {
      setError("Error en la búsqueda");
    } finally {
      setLoading(false);
    }
  }, [userId, fetchDocuments]);

  const remove = useCallback(async (doc: DocuSafeDocument) => {
    try {
      await deleteDocument(doc.id);
      await deleteFile(doc.filePath);
      setDocuments((prev) => prev.filter((d) => d.id !== doc.id));
    } catch {
      setError("Error al eliminar el documento");
    }
  }, []);

  return { documents, loading, error, refresh: fetchDocuments, search, remove };
};
