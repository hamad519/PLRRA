import imageCompression from 'browser-image-compression';

export interface UploadOptions {
  /** Subfolder inside public/uploads (e.g. "competitions", "events", "site"). */
  folder?: string;
  /** Max compressed size in MB. Default 0.5. */
  maxSizeMB?: number;
  /** Max width or height in pixels. Default 1920. */
  maxWidthOrHeight?: number;
}

/**
 * Compresses an image client-side, uploads it to /api/upload,
 * returns the public URL path (e.g. "/uploads/competitions/1234-abc.jpg").
 */
export async function uploadImage(file: File, options: UploadOptions = {}): Promise<string> {
  const folder = options.folder ?? 'misc';

  // 1) Compress
  let processed: File | Blob = file;
  if (file.type.startsWith('image/')) {
    try {
      processed = await imageCompression(file, {
        maxSizeMB: options.maxSizeMB ?? 0.5,
        maxWidthOrHeight: options.maxWidthOrHeight ?? 1920,
        fileType: 'image/jpeg',
        useWebWorker: true,
        initialQuality: 0.8,
      });
    } catch (err) {
      console.warn('Image compression failed, uploading original:', err);
    }
  }

  // Ensure we have a File (server expects File-like)
  const fileToSend = processed instanceof File
    ? processed
    : new File([processed], file.name.replace(/\.\w+$/, '.jpg'), { type: 'image/jpeg' });

  // 2) Upload
  const formData = new FormData();
  formData.append('file', fileToSend);
  formData.append('folder', folder);

  const res = await fetch('/api/upload', { method: 'POST', body: formData });
  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Upload failed');
  }

  return data.url as string;
}
