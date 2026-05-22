const toDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("Failed to read file as base64 data URL."));
        return;
      }
      resolve(reader.result);
    };

    reader.onerror = () => reject(reader.error || new Error("FileReader failed."));
    reader.readAsDataURL(file);
  });

export const uploadFile = async (
  userId: string,
  file: File,
  onProgress?: (pct: number) => void
): Promise<{ url: string; path: string }> => {
  onProgress?.(5);
  const dataUrl = await toDataUrl(file);
  onProgress?.(100);

  // Keep a pseudo-path for compatibility with existing document schema.
  return { url: dataUrl, path: `inline-base64/${userId}/${Date.now()}` };
};

export const deleteFile = async (_filePath: string) => {
  // Files are stored inline in Firestore documents, so there is no separate object to delete.
  return;
};
