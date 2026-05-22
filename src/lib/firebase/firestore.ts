import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./config";
import type { DocuSafeDocument } from "@/types";

const COL = "documents";
const DUPLICATE_DOCUMENT_NAME_ERROR = "DOCUMENT_NAME_EXISTS";

const normalizeDocumentName = (name: string) => name.trim().toLowerCase();

const getClientDb = () => {
  if (!db) {
    throw new Error(
      "Firebase client config is missing. Set NEXT_PUBLIC_FIREBASE_* variables."
    );
  }
  return db;
};

export const createDocument = async (
  userId: string,
  payload: Omit<DocuSafeDocument, "id" | "createdAt" | "updatedAt">
) => {
  const alreadyExists = await documentNameExists(userId, payload.name);
  if (alreadyExists) {
    throw new Error(DUPLICATE_DOCUMENT_NAME_ERROR);
  }

  const ref = await addDoc(collection(getClientDb(), COL), {
    ...payload,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
};

export const getUserDocuments = async (userId: string): Promise<DocuSafeDocument[]> => {
  const colRef = collection(getClientDb(), COL);

  try {
    const orderedQuery = query(
      colRef,
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(orderedQuery);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as DocuSafeDocument[];
  } catch {
    const fallbackQuery = query(colRef, where("userId", "==", userId));
    const snap = await getDocs(fallbackQuery);
    const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as DocuSafeDocument[];

    return docs.sort((a, b) => {
      const aSeconds =
        typeof a.createdAt === "object" && a.createdAt && "seconds" in a.createdAt
          ? a.createdAt.seconds
          : 0;
      const bSeconds =
        typeof b.createdAt === "object" && b.createdAt && "seconds" in b.createdAt
          ? b.createdAt.seconds
          : 0;

      return bSeconds - aSeconds;
    });
  }
};

export const documentNameExists = async (
  userId: string,
  name: string,
  excludeId?: string
): Promise<boolean> => {
  const normalizedInput = normalizeDocumentName(name);
  if (!normalizedInput) return false;

  const docs = await getUserDocuments(userId);
  return docs.some(
    (d) => normalizeDocumentName(d.name) === normalizedInput && d.id !== excludeId
  );
};

export const getDocumentById = async (id: string): Promise<DocuSafeDocument | null> => {
  const snap = await getDoc(doc(getClientDb(), COL, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as DocuSafeDocument;
};

export const updateDocument = async (
  id: string,
  data: Partial<Omit<DocuSafeDocument, "id" | "userId" | "createdAt">>
) => {
  await updateDoc(doc(getClientDb(), COL, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const deleteDocument = async (id: string) =>
  deleteDoc(doc(getClientDb(), COL, id));

export const searchDocuments = async (
  userId: string,
  term: string
): Promise<DocuSafeDocument[]> => {
  const all = await getUserDocuments(userId);
  const lower = term.toLowerCase();
  return all.filter(
    (d) =>
      d.name.toLowerCase().includes(lower) ||
      d.description?.toLowerCase().includes(lower) ||
      d.category.toLowerCase().includes(lower) ||
      d.tags?.some((t) => t.toLowerCase().includes(lower))
  );
};
