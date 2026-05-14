import { unlink } from 'fs/promises';
import path from 'path';

const UPLOAD_ROOT = path.join(process.cwd(), 'public', 'uploads');

function resolveSafe(urlOrPath: unknown): string | null {
  if (typeof urlOrPath !== 'string') return null;
  const trimmed = urlOrPath.trim();
  if (!trimmed.startsWith('/uploads/')) return null;

  const relative = trimmed.slice('/uploads/'.length);
  const absolute = path.resolve(UPLOAD_ROOT, relative);
  if (!absolute.startsWith(UPLOAD_ROOT + path.sep)) return null;
  return absolute;
}

export async function deleteUploadedFile(urlOrPath: unknown): Promise<void> {
  const absolute = resolveSafe(urlOrPath);
  if (!absolute) return;
  try {
    await unlink(absolute);
  } catch (err: any) {
    if (err?.code !== 'ENOENT') {
      console.warn('[deleteUploadedFile] failed to delete', absolute, err.message);
    }
  }
}

export async function deleteUploadedFiles(urlsOrPaths: unknown): Promise<void> {
  if (!urlsOrPaths) return;
  const list = Array.isArray(urlsOrPaths) ? urlsOrPaths : [urlsOrPaths];
  await Promise.all(list.map(deleteUploadedFile));
}
