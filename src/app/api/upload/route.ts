import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const UPLOAD_ROOT = path.join(process.cwd(), 'public', 'uploads');

const IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/quicktime',
];
const ALLOWED_TYPES = [...IMAGE_TYPES, ...DOCUMENT_TYPES, ...VIDEO_TYPES];

const MAX_IMAGE_BYTES = 20 * 1024 * 1024; // 20 MB for images
const MAX_DOC_BYTES = 25 * 1024 * 1024; // 25 MB for PDFs / DOCX
const MAX_VIDEO_BYTES = 25 * 1024 * 1024; // 25 MB for videos

function extFromMime(mime: string): string {
  switch (mime) {
    case 'image/jpeg':
    case 'image/jpg':
      return 'jpg';
    case 'image/png':
      return 'png';
    case 'image/webp':
      return 'webp';
    case 'image/gif':
      return 'gif';
    case 'application/pdf':
      return 'pdf';
    case 'application/msword':
      return 'doc';
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return 'docx';
    case 'video/mp4':
      return 'mp4';
    case 'video/webm':
      return 'webm';
    case 'video/ogg':
      return 'ogv';
    case 'video/quicktime':
      return 'mov';
    default:
      return 'bin';
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string | null) || 'misc';

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file provided' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: `Unsupported file type: ${file.type}` },
        { status: 400 }
      );
    }

    const isDocument = DOCUMENT_TYPES.includes(file.type);
    const isVideo = VIDEO_TYPES.includes(file.type);
    const maxBytes = isDocument ? MAX_DOC_BYTES : isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
    if (file.size > maxBytes) {
      return NextResponse.json(
        { success: false, message: `File too large (max ${maxBytes / 1024 / 1024} MB)` },
        { status: 400 }
      );
    }

    // Sanitise folder to prevent path traversal
    const safeFolder = folder.replace(/[^a-zA-Z0-9_-]/g, '');
    const dir = path.join(UPLOAD_ROOT, safeFolder);
    await mkdir(dir, { recursive: true });

    const ext = extFromMime(file.type);
    const filename = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}.${ext}`;
    const fullPath = path.join(dir, filename);

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(fullPath, buffer);

    const url = `/uploads/${safeFolder}/${filename}`;
    return NextResponse.json({ success: true, url });
  } catch (error: any) {
    console.error('[POST /api/upload]', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
