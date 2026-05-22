"use client";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { FirebaseError } from "firebase/app";
import { uploadFile } from "@/lib/firebase/storage";
import { createDocument, documentNameExists } from "@/lib/firebase/firestore";
import { DOCUMENT_CATEGORIES, type DocumentCategory } from "@/types";
import { useAuthStore } from "@/store/authStore";

const schema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(100),
  description: z.string().max(300).optional(),
  category: z.enum(["factura", "transferencias", "alquiler", "garantia", "contrato", "inversion", "medico", "otro"]),
  tags: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

const ACCEPTED = {
  "application/pdf": [".pdf"],
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
};

interface Props {
  onSuccess: () => void;
  onCancel: () => void;
}

const MAX_FILE_SIZE_BYTES = 700 * 1024;

const getUploadErrorMessage = (err: unknown) => {
  const firebaseError = err as FirebaseError | undefined;
  const code = firebaseError?.code;
  const message = firebaseError?.message || "";

  if (message.includes("DOCUMENT_NAME_EXISTS")) {
    return "Ya existe un documento con ese nombre. Usa un nombre diferente.";
  }

  if (code === "permission-denied") {
    return "No tienes permisos para guardar documentos en Firestore.";
  }

  if (code === "invalid-argument" || message.includes("Unsupported field value: undefined")) {
    return "El documento contiene datos invalidos para Firestore. Intenta de nuevo.";
  }

  if (code === "resource-exhausted") {
    return "El archivo excede el limite para guardar en Firestore. Usa un archivo mas pequeno.";
  }

  return "Error al guardar el documento en Firestore. Prueba con un archivo mas pequeno.";
};

export default function DocumentUpload({ onSuccess, onCancel }: Props) {
  const { user } = useAuthStore();
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { category: "otro" },
  });

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) setFile(accepted[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED,
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE_BYTES,
    onDropRejected: () =>
      setError("Archivo no válido. Usa PDF, PNG o JPEG (máx. 700 KB)."),
  });

  const onSubmit = async (data: FormData) => {
    if (!file || !user) return;
    setUploading(true);
    setError("");
    try {
      const nameInUse = await documentNameExists(user.uid, data.name);
      if (nameInUse) {
        setError("Ya existe un documento con ese nombre. Usa un nombre diferente.");
        return;
      }

      const { url, path } = await uploadFile(user.uid, file, setProgress);
      const fileType: "pdf" | "image" =
        file.type === "application/pdf" ? "pdf" : "image";

      const payload = {
        userId: user.uid,
        name: data.name,
        category: data.category as DocumentCategory,
        fileUrl: url,
        filePath: path,
        fileType,
        mimeType: file.type,
        fileSize: file.size,
        tags: data.tags ? data.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        ...(data.description?.trim() ? { description: data.description.trim() } : {}),
      };

      await createDocument(user.uid, payload);
      onSuccess();
    } catch (err) {
      console.error("Document upload failed", err);
      setError(getUploadErrorMessage(err));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white p-5 border-b border-gray-100 flex items-center justify-between rounded-t-2xl">
          <h2 className="font-bold text-lg text-gray-900">Subir documento</h2>
          <button onClick={onCancel} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
              isDragActive
                ? "border-blue-500 bg-blue-50 scale-[1.01]"
                : file
                ? "border-green-400 bg-green-50"
                : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
            }`}
          >
            <input {...getInputProps()} />
            {file ? (
              <>
                <p className="text-3xl mb-1">{file.type === "application/pdf" ? "📄" : "🖼️"}</p>
                <p className="font-medium text-gray-900 text-sm truncate">{file.name}</p>
                <p className="text-xs text-gray-400 mt-1">{(file.size / 1048576).toFixed(2)} MB · <span className="text-blue-500 hover:underline">cambiar</span></p>
              </>
            ) : (
              <>
                <p className="text-4xl mb-2">☁️</p>
                <p className="text-gray-600 text-sm">
                  Arrastra aquí o <span className="text-blue-600 font-medium">selecciona un archivo</span>
                </p>
                <p className="text-xs text-gray-400 mt-1">PDF, PNG, JPG, JPEG — máx. 700 KB</p>
              </>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
            <input {...register("name")} className="input-field" placeholder="Ej: Factura enero 2024" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría *</label>
            <select {...register("category")} className="input-field">
              {DOCUMENT_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              {...register("description")}
              className="input-field resize-none"
              rows={2}
              placeholder="Descripción opcional…"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Etiquetas</label>
            <input
              {...register("tags")}
              className="input-field"
              placeholder="factura, empresa, 2024 (separadas por coma)"
            />
          </div>

          {uploading && (
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                <span>Subiendo archivo…</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {error && <p className="text-red-500 text-sm bg-red-50 p-2 rounded-lg">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onCancel} className="btn-secondary flex-1" disabled={uploading}>
              Cancelar
            </button>
            <button type="submit" disabled={!file || uploading} className="btn-primary flex-1">
              {uploading ? "Subiendo…" : "Guardar documento"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
