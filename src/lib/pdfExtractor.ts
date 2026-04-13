export async function extractPdfText(buffer: Buffer): Promise<string> {
  try {
    // eval('require') bypasses Webpack static analysis — pdf-parse must load at runtime only
    const req = eval('require');

    // pdf-parse@2.x and pdfjs-dist need these globals in Node.js environments
    if (typeof process !== 'undefined' && !(process as any).getBuiltinModule) {
      (process as any).getBuiltinModule = (id: string) => {
        try { return req(id); } catch { return undefined; }
      };
    }
    const g = globalThis as any;
    if (typeof g.DOMMatrix === 'undefined') g.DOMMatrix = class DOMMatrix {};
    if (typeof g.ImageData === 'undefined') g.ImageData = class ImageData {};
    if (typeof g.Path2D === 'undefined') g.Path2D = class Path2D {};

    // Load the package — pdf-parse@2.x exports a PDFParse class, not a plain function
    const pdfParseModule = req('pdf-parse');
    const PDFParse =
      pdfParseModule?.PDFParse ??
      pdfParseModule?.default?.PDFParse ??
      pdfParseModule?.default;

    if (typeof PDFParse !== 'function') {
      console.error('[pdfExtractor] PDFParse class not found. Module keys:', Object.keys(pdfParseModule ?? {}));
      return '';
    }

    // Constructor takes { data: Buffer | Uint8Array }
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    const text = result?.text ?? '';

    if (!text.trim()) {
      console.warn('[pdfExtractor] PDF parsed but returned empty text — file may be image-based (scanned).');
    }

    return text;
  } catch (err: any) {
    console.error('[pdfExtractor] PDF extraction error:', err?.message ?? err);
    return '';
  }
}
