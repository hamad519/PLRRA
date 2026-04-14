import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const { extractPdfText } = await import('@/lib/pdfExtractor');

    const records = await prisma.nationalRecord.findMany({ take: 3 });
    const results: any[] = [];

    for (const r of records) {
      let text = '';
      let error = '';
      if (r.pdfBase64) {
        try {
          const base64Data = r.pdfBase64.includes(',') ? r.pdfBase64.split(',')[1] : r.pdfBase64;
          const buffer = Buffer.from(base64Data, 'base64');
          text = await extractPdfText(buffer);
        } catch (e: any) {
          error = e.message;
        }
      }
      results.push({
        title: r.title,
        year: r.year,
        hasPdf: !!r.pdfBase64,
        textLength: text.length,
        preview: text.substring(0, 200),
        error: error || undefined,
      });
    }

    const pressReleases = await prisma.pressRelease.findMany({ take: 2 });
    const prResults: any[] = [];
    for (const pr of pressReleases) {
      let text = '';
      let error = '';
      if (pr.pdfBase64) {
        try {
          const base64Data = pr.pdfBase64.includes(',') ? pr.pdfBase64.split(',')[1] : pr.pdfBase64;
          const buffer = Buffer.from(base64Data, 'base64');
          text = await extractPdfText(buffer);
        } catch (e: any) {
          error = e.message;
        }
      }
      prResults.push({
        title: pr.title,
        hasPdf: !!pr.pdfBase64,
        textLength: text.length,
        preview: text.substring(0, 200),
        error: error || undefined,
      });
    }

    return NextResponse.json({ nationalRecords: results, pressReleases: prResults });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
