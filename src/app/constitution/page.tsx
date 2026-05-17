import prisma from '@/lib/prisma';
import { FileText, Download, AlertCircle } from 'lucide-react';
import { Reveal } from '@/components/animations/Reveal';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function ConstitutionPage() {
  let pdfUrl: string | null = null;
  try {
    const settings = await prisma.siteSettings.findFirst();
    pdfUrl = settings?.constitutionPdfBase64 || null;
  } catch (e) {
    console.error('Failed to load constitution', e);
  }

  return (
    <div className="min-h-screen bg-plra-bg-soft">
      <section className="relative bg-slate-950 py-32 px-4 md:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-plra-accent-purple/20 via-transparent to-plra-accent-pink/20" />
        <div className="container mx-auto relative z-10 text-center">
          <Reveal direction="down">
            <span className="text-plra-gold font-black uppercase tracking-[0.4em] text-xs md:text-sm mb-4 block">
              PLRA Governing Document
            </span>
          </Reveal>
          <Reveal>
            <h1 className="text-4xl md:text-7xl font-black text-white tracking-tight">
              Our{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-plra-accent-purple to-plra-accent-pink">
                Constitution
              </span>
            </h1>
          </Reveal>
          <Reveal delay={0.3}>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto mt-6 leading-relaxed">
              The foundational document outlining the structure, mission, and bylaws of the Pakistan Long Range Rifle Association.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container mx-auto py-24 px-4 md:px-8">
        {pdfUrl ? (
          <Reveal direction="up">
            <div className="max-w-5xl mx-auto bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100">
              <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-plra-accent-purple/10 flex items-center justify-center text-plra-accent-purple">
                    <FileText size={28} />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-plra-accent-purple mb-1">
                      Official Document
                    </p>
                    <h2 className="text-2xl font-black text-plra-black">PLRA Constitution</h2>
                  </div>
                </div>
                <a href={pdfUrl} target="_blank" rel="noopener noreferrer" download>
                  <Button className="bg-plra-black hover:bg-plra-black/90 text-white px-6 py-6 rounded-xl font-bold flex items-center gap-2">
                    <Download size={18} />
                    Download PDF
                  </Button>
                </a>
              </div>
              <div className="bg-gray-50">
                <iframe
                  src={pdfUrl}
                  className="w-full h-[80vh] border-0"
                  title="PLRA Constitution"
                />
              </div>
            </div>
          </Reveal>
        ) : (
          <Reveal direction="up">
            <div className="max-w-2xl mx-auto bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 mx-auto mb-6">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-2xl font-black text-plra-black mb-4">Coming Soon</h3>
              <p className="text-gray-600 mb-8">
                The constitution document is being prepared. Please check back soon.
              </p>
              <Link href="/">
                <Button variant="outline" className="px-6 py-6 rounded-xl font-bold">
                  Back to Home
                </Button>
              </Link>
            </div>
          </Reveal>
        )}
      </section>
    </div>
  );
}
