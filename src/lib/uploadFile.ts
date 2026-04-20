/**
 * Uploads a file (PDF, DOCX, etc.) to /api/upload without compression.
 * Returns the public URL path (e.g. "/uploads/press-releases/xxx.pdf").
 * For images, use uploadImage() instead — it compresses client-side first.
 */
export async function uploadFile(file: File, folder = 'misc'): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  const res = await fetch('/api/upload', { method: 'POST', body: formData });
  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Upload failed');
  }

  return data.url as string;
}
