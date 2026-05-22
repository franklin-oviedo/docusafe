export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export type DocumentCategory =
  | "factura"
  | "transferencias"
  | "alquiler"
  | "garantia"
  | "contrato"
  | "inversion"
  | "medico"
  | "otro";

export interface DocuSafeDocument {
  id: string;
  userId: string;
  name: string;
  description?: string;
  category: DocumentCategory;
  fileUrl: string;
  filePath: string;
  fileType: "pdf" | "image";
  mimeType: string;
  fileSize: number;
  createdAt: { seconds: number; nanoseconds: number } | Date;
  updatedAt: { seconds: number; nanoseconds: number } | Date;
  tags?: string[];
}

export const DOCUMENT_CATEGORIES: { value: DocumentCategory; label: string; emoji: string }[] = [
  { value: "factura", label: "Factura", emoji: "🧾" },
  { value: "transferencias", label: "Transferencias", emoji: "💸" },
  { value: "alquiler", label: "Alquiler", emoji: "🏠" },
  { value: "garantia", label: "Garantía", emoji: "🛡️" },
  { value: "contrato", label: "Contrato", emoji: "📝" },
  { value: "inversion", label: "Inversion", emoji: "📈" },
  { value: "medico", label: "Médico", emoji: "🏥" },
  { value: "otro", label: "Otro", emoji: "📁" },
];
