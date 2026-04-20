import imageCompression from 'browser-image-compression';

export interface CompressOptions {
  /** Max final file size in MB. Default 0.5 MB (500 KB). */
  maxSizeMB?: number;
  /** Max width or height in pixels. Default 1920. */
  maxWidthOrHeight?: number;
  /** Output format. Default 'image/jpeg' (smallest). Use 'image/webp' for even smaller. */
  fileType?: string;
}

/**
 * Compress an image File and return base64 data URL.
 * Resizes large images, converts to JPEG, and reduces quality.
 * Skips compression for non-image files (returns base64 of original).
 */
export async function optimizeImageToBase64(file: File, options: CompressOptions = {}): Promise<string> {
  const isImage = file.type.startsWith('image/');

  // Non-images: just return base64 as-is
  if (!isImage) {
    return fileToBase64(file);
  }

  const opts = {
    maxSizeMB: options.maxSizeMB ?? 0.5,
    maxWidthOrHeight: options.maxWidthOrHeight ?? 1920,
    fileType: options.fileType ?? 'image/jpeg',
    useWebWorker: true,
    initialQuality: 0.8,
  };

  try {
    const compressed = await imageCompression(file, opts);
    return fileToBase64(compressed);
  } catch (err) {
    console.warn('Image compression failed, using original:', err);
    return fileToBase64(file);
  }
}

function fileToBase64(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}
