import dbConnect from './dbConnect';
import Event from '@/models/Event';
import NationalRecord from '@/models/NationalRecord';
import PastResultRecord from '@/models/PastResultRecord';
import PressRelease from '@/models/PressRelease';
import SiteSettings from '@/models/SiteSettings';

async function extractTextFromBase64(base64String: string): Promise<string> {
  if (!base64String || typeof base64String !== 'string') return '';

  try {
    const base64Data = base64String.includes(',')
      ? base64String.split(',')[1]
      : base64String;
    const buffer = Buffer.from(base64Data, 'base64');

    const isWord =
      base64String.includes('officedocument') || base64String.includes('msword');

    if (isWord) {
      try {
        const mammoth = require('mammoth');
        const result = await mammoth.extractRawText({ buffer });
        if (result?.value?.trim()) return result.value;
      } catch (e: any) {
        console.error('Word parsing failed:', e.message);
      }
    }

    // Try PDF extraction for everything else (or as fallback)
    try {
      const { extractPdfText } = await import('./pdfExtractor');
      const text = await extractPdfText(buffer);
      if (text?.trim()) return text;
    } catch (e: any) {
      console.error('PDF extraction failed in extractTextFromBase64:', e.message);
    }

    return '';
  } catch (error) {
    console.error('General document parsing error:', error);
    return '';
  }
}

/**
 * Detects what type of data the user is asking about
 * based on keywords in their query.
 */
function detectQueryIntent(query: string) {
  const q = query.toLowerCase();
  return {
    wantsNationalRecords:
      /national\s*record|record|ranking|score|shoot(er|ing)?|rifle|champion|winner|result/.test(q),
    wantsPressReleases:
      /press\s*release|release|news|announcement|press|media|bulletin|statement/.test(q),
    wantsPastResults:
      /past\s*result|competition|match|tournament|event\s*result/.test(q),
    wantsEvents:
      /event|upcoming|schedule|when|date|register/.test(q),
  };
}

/**
 * Builds the AI context string from the database.
 * - Always includes basic PLRA info and stats.
 * - Based on the user's query, fetches and extracts PDF text
 *   from National Records, Press Releases, and/or Past Results.
 */
export async function getApplicationContext(userQuery: string = ''): Promise<string> {
  try {
    await dbConnect();

    const intent = detectQueryIntent(userQuery);

    // If query is empty/generic, show everything with PDF extraction
    const fetchAll = !userQuery.trim();

    const settings = await SiteSettings.findOne().lean() as any;

    let context = `Association Name: Pakistan Long Range Rifle Association (PLRA)
About PLRA: ${settings?.plraIntro || 'The national governing body for Full-bore rifle shooting in Pakistan.'}

Current Statistics:
- National Records: ${settings?.stats?.nationalRecords || 'N/A'}
- International Medals: ${settings?.stats?.internationalMedals || 'N/A'}
- Elite Shooters: ${settings?.stats?.eliteShooters || 'N/A'}
`;

    // ── Upcoming Events ──────────────────────────────────────────────
    if (fetchAll || intent.wantsEvents) {
      const events = await Event.find({}).limit(5).lean() as any[];
      if (events.length > 0) {
        context += `\nUpcoming Events:\n`;
        for (const e of events) {
          context += `- ${e.title}: ${new Date(e.date).toDateString()} at ${e.location}\n`;
        }
      }
    }

    // ── National Records (with PDF extraction) ───────────────────────
    if (fetchAll || intent.wantsNationalRecords) {
      const records = await NationalRecord.find({}).sort({ year: -1 }).limit(10).lean() as any[];
      if (records.length > 0) {
        context += `\n=== NATIONAL RECORDS ===\n`;
        for (const record of records) {
          context += `\n[Record] ${record.title} (Year: ${record.year})\n`;
          if (record.pdfBase64) {
            const docText = await extractTextFromBase64(record.pdfBase64);
            if (docText && docText.trim().length > 50) {
              context += `Document Content:\n${docText.substring(0, 3000)}\n`;
            } else {
              context += `(No readable text in PDF)\n`;
              console.warn(`[ai-context] Could not extract text from record: ${record.title}`);
            }
          }
        }
      }
    }

    // ── Press Releases (with PDF extraction) ─────────────────────────
    if (fetchAll || intent.wantsPressReleases) {
      const pressReleases = await PressRelease.find({}).sort({ date: -1 }).limit(10).lean() as any[];
      if (pressReleases.length > 0) {
        context += `\n=== PRESS RELEASES ===\n`;
        for (const pr of pressReleases) {
          context += `\n[Press Release] ${pr.title} (Date: ${new Date(pr.date).toDateString()})\n`;
          if (pr.pdfBase64) {
            const docText = await extractTextFromBase64(pr.pdfBase64);
            if (docText && docText.trim().length > 50) {
              context += `Document Content:\n${docText.substring(0, 3000)}\n`;
            } else {
              context += `(No readable text in PDF)\n`;
              console.warn(`[ai-context] Could not extract text from press release: ${pr.title}`);
            }
          }
        }
      }
    }

    // ── Past Competition Results (with PDF extraction) ────────────────
    if (fetchAll || intent.wantsPastResults) {
      const pastResults = await PastResultRecord.find({}).sort({ date: -1 }).limit(5).lean() as any[];
      if (pastResults.length > 0) {
        context += `\n=== PAST COMPETITION RESULTS ===\n`;
        for (const result of pastResults) {
          context += `\n[Competition] ${result.title} — ${new Date(result.date).toDateString()}, ${result.location}\n`;
          for (const match of result.matches || []) {
            context += `  Match: ${match.name}\n`;
            if (match.pdfBase64) {
              const docText = await extractTextFromBase64(match.pdfBase64);
              if (docText && docText.trim().length > 50) {
                context += `  Results:\n${docText.substring(0, 2000)}\n`;
              }
            }
          }
        }
      }
    }

    return context;
  } catch (error) {
    console.error('Context gathering error:', error);
    return 'Basic PLRA information: National governing body for long range shooting in Pakistan.';
  }
}
