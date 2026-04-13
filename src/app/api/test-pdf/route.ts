import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import NationalRecord from '@/models/NationalRecord';
import PressRelease from '@/models/PressRelease';

// GET /api/test-pdf  — shows whether PDF extraction is working for stored records
// Remove this route once confirmed working.
export async function GET() {
  try {
    await dbConnect();

    const { extractPdfText } = await import('@/lib/pdfExtractor');

    const records = await NationalRecord.find({}).limit(3).lean() as any[];
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

    const pressReleases = await PressRelease.find({}).limit(2).lean() as any[];
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
