/**
 * Download a file represented either as a public URL path (e.g. "/uploads/xxx.pdf")
 * or a legacy base64 data URL.
 * Works for PDFs, DOCX, images — extension is inferred from the source.
 */
export function downloadFile(source: string, fileName: string): void {
  try {
    const safeName = fileName.replace(/[\\/:*?"<>|]/g, ' ').trim() || 'download';

    // Case 1: public URL path — just trigger a normal browser download
    if (source.startsWith('/') || source.startsWith('http')) {
      const extMatch = source.match(/\.([a-zA-Z0-9]+)(?:\?|$)/);
      const extension = extMatch ? `.${extMatch[1]}` : '';

      const link = document.createElement('a');
      link.href = source;
      link.download = `${safeName}${extension}`;
      // `target="_blank"` fallback handles cross-origin cases where `download` is ignored
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    // Case 2: legacy base64 — decode and blob-download
    const parts = source.split(',');
    const mimeType = parts[0].match(/:(.*?);/)?.[1] || 'application/octet-stream';
    const base64Data = parts[1] || source;

    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });

    let extension = '.bin';
    if (mimeType.includes('pdf')) extension = '.pdf';
    else if (mimeType.includes('word') || mimeType.includes('officedocument')) extension = '.docx';
    else if (mimeType.includes('png')) extension = '.png';
    else if (mimeType.includes('jpeg') || mimeType.includes('jpg')) extension = '.jpg';
    else if (mimeType.includes('webp')) extension = '.webp';

    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `${safeName}${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error('Download error:', error);
    throw error;
  }
}

/**
 * Detect what kind of file is at the given source (path or base64).
 */
export function detectFileType(source: string): 'pdf' | 'docx' | 'image' | 'unknown' {
  if (!source) return 'unknown';

  // Path-based — check extension
  if (source.startsWith('/') || source.startsWith('http')) {
    const lower = source.toLowerCase();
    if (lower.endsWith('.pdf')) return 'pdf';
    if (lower.endsWith('.doc') || lower.endsWith('.docx')) return 'docx';
    if (lower.match(/\.(png|jpe?g|webp|gif)(\?|$)/)) return 'image';
    return 'unknown';
  }

  // Base64 data URL — check mime
  if (source.includes('application/pdf')) return 'pdf';
  if (source.includes('officedocument') || source.includes('msword')) return 'docx';
  if (source.includes('image/')) return 'image';
  return 'unknown';
}
