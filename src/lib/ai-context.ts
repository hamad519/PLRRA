import prisma from './prisma';
import { readFile } from 'fs/promises';
import path from 'path';

/**
 * Load a document into a Buffer.
 * Handles three cases:
 *   1) New format: "/uploads/folder/file.pdf"  -> reads from public/uploads
 *   2) Legacy base64 data URL: "data:application/pdf;base64,..."
 *   3) Legacy raw base64 string
 * Returns { buffer, isWord } or null on failure.
 */
async function loadDocument(value: string): Promise<{ buffer: Buffer; isWord: boolean } | null> {
  if (!value || typeof value !== 'string') return null;

  // Case 1: file path
  if (value.startsWith('/uploads/')) {
    try {
      const absPath = path.join(process.cwd(), 'public', value);
      const buffer = await readFile(absPath);
      const isWord = value.toLowerCase().endsWith('.doc') || value.toLowerCase().endsWith('.docx');
      return { buffer, isWord };
    } catch (e: any) {
      console.error('[ai-context] Failed to read file:', value, e.message);
      return null;
    }
  }

  // Case 2 & 3: base64 (legacy data in DB)
  try {
    const base64Data = value.includes(',') ? value.split(',')[1] : value;
    const buffer = Buffer.from(base64Data, 'base64');
    const isWord = value.includes('officedocument') || value.includes('msword');
    return { buffer, isWord };
  } catch (e: any) {
    console.error('[ai-context] Failed to decode base64:', e.message);
    return null;
  }
}

async function extractTextFromBase64(docValue: string): Promise<string> {
  const loaded = await loadDocument(docValue);
  if (!loaded) return '';

  const { buffer, isWord } = loaded;

  if (isWord) {
    try {
      const mammoth = require('mammoth');
      const result = await mammoth.extractRawText({ buffer });
      if (result?.value?.trim()) return result.value;
    } catch (e: any) {
      console.error('[ai-context] Word parsing failed:', e.message);
    }
  }

  // PDF extraction (works for anything treated as PDF; falls back silently)
  try {
    const { extractPdfText } = await import('./pdfExtractor');
    const text = await extractPdfText(buffer);
    if (text?.trim()) return text;
  } catch (e: any) {
    console.error('[ai-context] PDF extraction failed:', e.message);
  }

  return '';
}

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
    wantsCompetitions:
      /competition|championship|f[\-\s]?class|team|gallery|world|european|south\s*african|medal/.test(q),
    wantsWhoWeAre:
      /who\s*we\s*are|about|contributor|member|senior|testimonial|achievement|ascendancy|history|leadership|team|president|patron/.test(q),
    wantsContact:
      /contact|address|phone|email|reach|location|office|social|facebook|instagram|working\s*hours/.test(q),
    wantsAccount:
      /account|bank|payment|pay|fee|iban|challan|transfer|deposit|membership\s*fee/.test(q),
    wantsLatestNews:
      /latest\s*news|news|update|what.?s\s*new|recent|ticker|headline|happening/.test(q),
  };
}

export async function getApplicationContext(userQuery: string = ''): Promise<string> {
  try {
    const intent = detectQueryIntent(userQuery);
    const fetchAll = !userQuery.trim();

    const settings = (await prisma.siteSettings.findFirst()) as any;
    const stats = (settings?.stats ?? {}) as Record<string, string>;

    const account = (settings?.accountDetails ?? {}) as Record<string, string>;

    let context = `Association Name: Pakistan Long Range Rifle Association (PLRA)
About PLRA: ${settings?.plraIntro || 'The national governing body for Full-bore rifle shooting in Pakistan.'}

Contact Information:
- Address: ${settings?.address || 'N/A'}
- Phone: ${settings?.contactNo || 'N/A'}
- Email: ${settings?.email || 'N/A'}
- Working Hours: ${settings?.workingHours || 'N/A'}
- Facebook: ${settings?.facebookLink || 'N/A'}
- Instagram: ${settings?.instagramLink || 'N/A'}

Bank Account Details (for membership fees & event registration payments):
- Bank Name: ${account.bankName || 'N/A'}
- Account Title: ${account.accountTitle || 'N/A'}
- Account Number: ${account.accountNumber || 'N/A'}
- IBAN: ${account.iban || 'N/A'}
- Branch Code: ${account.branchCode || 'N/A'}

Current Statistics:
- National Records: ${stats.nationalRecords || 'N/A'}
- International Medals: ${stats.internationalMedals || 'N/A'}
- Elite Shooters: ${stats.eliteShooters || 'N/A'}
`;

    // ── Latest News ──────────────────────────────────────────────────
    if (fetchAll || intent.wantsLatestNews) {
      const news = await prisma.latestNews.findMany({
        where: { isActive: true },
        orderBy: { date: 'desc' },
        take: 10,
        select: { title: true, date: true },
      });
      if (news.length > 0) {
        context += `\n=== LATEST NEWS ===\n`;
        for (const n of news) {
          context += `- ${n.title} (${new Date(n.date).toDateString()})\n`;
        }
      }
    }

    // ── Upcoming Events ──────────────────────────────────────────────
    if (fetchAll || intent.wantsEvents) {
      const events = await prisma.event.findMany({ take: 5 });
      if (events.length > 0) {
        context += `\nUpcoming Events:\n`;
        for (const e of events) {
          const when = e.fromDate ?? e.date;
          const whenStr = when ? new Date(when).toDateString() : 'TBA';
          context += `- ${e.title}: ${whenStr} at ${e.location}\n`;
        }
      }
    }

    if (fetchAll || intent.wantsNationalRecords) {
      const records = await prisma.nationalRecord.findMany({ orderBy: { year: 'desc' }, take: 10 });
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
            }
          }
        }
      }
    }

    if (fetchAll || intent.wantsPressReleases) {
      const pressReleases = await prisma.pressRelease.findMany({ orderBy: { date: 'desc' }, take: 10 });
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
            }
          }
        }
      }
    }

    if (fetchAll || intent.wantsPastResults) {
      const pastResults = await prisma.pastResultRecord.findMany({ orderBy: { date: 'desc' }, take: 5 });
      if (pastResults.length > 0) {
        context += `\n=== PAST COMPETITION RESULTS ===\n`;
        for (const result of pastResults) {
          context += `\n[Competition] ${result.title} — ${new Date(result.date).toDateString()}, ${result.location}\n`;
          const matches = (result.matches ?? []) as any[];
          for (const match of matches) {
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

    // ── Past Competitions (with dates, locations, gallery info) ──────
    if (fetchAll || intent.wantsCompetitions) {
      const competitions = await prisma.competition.findMany({
        orderBy: { fromDate: 'desc' },
        take: 10,
        select: { title: true, fromDate: true, toDate: true, location: true, description: true },
      });
      if (competitions.length > 0) {
        context += `\n=== PAST COMPETITIONS ===\n`;
        for (const comp of competitions) {
          const from = new Date(comp.fromDate).toDateString();
          const to = new Date(comp.toDate).toDateString();
          context += `\n[Competition] ${comp.title}\n  Date: ${from} to ${to}\n  Location: ${comp.location}\n`;
          if (comp.description) {
            context += `  Description: ${comp.description}\n`;
          }
        }
      }
    }

    // ── Who We Are: Achievements (International Ascendancy) ─────────
    if (fetchAll || intent.wantsWhoWeAre) {
      const achievements = await prisma.achievement.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
      });
      if (achievements.length > 0) {
        context += `\n=== INTERNATIONAL ACHIEVEMENTS (FTR Team) ===\n`;
        for (const ach of achievements) {
          const bullets = (ach.bullets ?? []) as Array<{ text: string; children?: string[] }>;
          context += `\n[${ach.year}] ${ach.title}\n`;
          for (const b of bullets) {
            context += `  - ${b.text}\n`;
            if (Array.isArray(b.children)) {
              for (const c of b.children) {
                context += `    • ${c}\n`;
              }
            }
          }
        }
      }

      // ── Who We Are: Major Contributors ────────────────────────────
      const contributors = await prisma.contributor.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
      });
      if (contributors.length > 0) {
        context += `\n=== MAJOR CONTRIBUTORS ===\n`;
        for (const c of contributors) {
          const contribs = (c.contributions ?? []) as string[];
          context += `\n${c.name} (${c.role})\n`;
          for (const item of contribs) {
            context += `  - ${item}\n`;
          }
        }
      }

      // ── Who We Are: Senior Members / Testimonials ─────────────────
      const testimonials = await prisma.testimonial.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
        select: { name: true, designation: true, message: true },
      });
      if (testimonials.length > 0) {
        context += `\n=== SENIOR MEMBERS ===\n`;
        for (const t of testimonials) {
          context += `\n${t.name} (${t.designation})\n  "${t.message}"\n`;
        }
      }
    }

    return context;
  } catch (error) {
    console.error('Context gathering error:', error);
    return 'Basic PLRA information: National governing body for long range shooting in Pakistan.';
  }
}
