import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Mail, FileText, Banknote, ListChecks, Download, ArrowRight, CheckCircle2, Landmark } from 'lucide-react';
import Link from 'next/link';
import { Reveal } from '@/components/animations/Reveal';

export const MembershipInstructionsSection = () => {
  const documentsRequired = [
    "Copy of CNIC (or 'B Form' for underage)",
    "1x Digital Photograph (soft copy)",
    "Copy of Passport",
    "Copy of Weapon License",
    "Proof of Membership Fee deposit",
  ];

  return (
    <section className="bg-white py-24 px-4 md:px-8">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <Reveal direction="down">
            <span className="text-plra-accent-purple font-black uppercase tracking-widest text-sm mb-4 block">Step-by-Step Guide</span>
          </Reveal>
          <Reveal>
            <h2 className="text-4xl md:text-6xl font-black text-plra-black mb-6">
              How to <span className="text-transparent bg-clip-text bg-gradient-to-r from-plra-accent-purple to-plra-accent-pink">Join PLRA</span>
            </h2>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Submission Methods */}
          <div className="lg:col-span-7 space-y-8">
            <Reveal direction="right">
              <Card className="bg-plra-bg-soft border-none shadow-sm rounded-[2.5rem] overflow-hidden">
                <CardHeader className="p-10 bg-white border-b border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-plra-accent-purple/10 flex items-center justify-center text-plra-accent-purple">
                      <FileText size={24} />
                    </div>
                    <CardTitle className="text-2xl font-black text-plra-black">Application Submission</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-10 space-y-10">
                  <div className="group">
                    <h3 className="text-xl font-black text-plra-black mb-4 flex items-center gap-3">
                      <div className="w-2 h-8 bg-plra-accent-purple rounded-full"></div>
                      Option 1: Submit Online
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      The fastest way to join. Fill out our secure online form and upload your documents directly.
                    </p>
                    <Link href="/join-now" passHref>
                      <Button className="bg-plra-black hover:bg-plra-accent-purple text-white font-black px-8 py-7 rounded-2xl transition-all flex items-center gap-2 group/btn">
                        Fill Online Form <ArrowRight className="group-hover/btn:translate-x-1 transition-transform" size={18} />
                      </Button>
                    </Link>
                  </div>

                  <div className="pt-10 border-t border-gray-200">
                    <h3 className="text-xl font-black text-plra-black mb-4 flex items-center gap-3">
                      <div className="w-2 h-8 bg-plra-accent-pink rounded-full"></div>
                      Option 2: Submit via Email
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      Download the PDF form, fill it manually, and email it along with scanned documents to:
                      <br />
                      <span className="font-bold text-plra-black">plra.pakistan2022@gmail.com</span>
                    </p>
                    <a href="/PLRA_Membership_Form.pdf" download="PLRA_Membership_Form.pdf">
                      <Button variant="outline" className="border-plra-black/10 bg-white hover:bg-gray-50 text-plra-black font-black px-8 py-7 rounded-2xl transition-all flex items-center gap-2">
                        <Download size={18} /> Download PDF Form
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </Reveal>

            <Reveal direction="right" delay={0.2}>
              <Card className="bg-slate-950 text-white border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
                <CardHeader className="p-10 border-b border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-plra-gold/10 flex items-center justify-center text-plra-gold">
                      <Banknote size={24} />
                    </div>
                    <CardTitle className="text-2xl font-black">Fee Payment Methods</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6 md:p-10">
                  <Accordion type="single" collapsible className="w-full space-y-4">
                    <AccordionItem value="online" className="border-none bg-white/5 rounded-2xl px-6 overflow-hidden">
                      <AccordionTrigger className="hover:no-underline py-6 group">
                        <span className="text-lg font-bold text-white group-hover:text-plra-gold transition-colors">Online Transaction</span>
                      </AccordionTrigger>
                      <AccordionContent className="pb-8 text-gray-400 space-y-2">
                        <p><span className="text-white font-bold">Bank:</span> Askari Bank Limited</p>
                        <p><span className="text-white font-bold">Account:</span> PK89ASCm0003681350000135</p>
                        <Link href="/account-details" className="inline-block mt-4 text-plra-gold font-black hover:underline">View Full Details →</Link>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="draft" className="border-none bg-white/5 rounded-2xl px-6 overflow-hidden">
                      <AccordionTrigger className="hover:no-underline py-6 group">
                        <span className="text-lg font-bold text-white group-hover:text-plra-gold transition-colors">Bank Draft / Cheque</span>
                      </AccordionTrigger>
                      <AccordionContent className="pb-8 text-gray-400">
                        <p className="mb-4">In favor of <span className="text-white font-bold">Pakistan Long Range Rifle Association</span>.</p>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-sm">
                          <p className="font-bold text-white mb-1">Mailing Address:</p>
                          C/O Army Marksmanship Unit, Jhelum Cantonment.
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </Reveal>
          </div>

          {/* Right Column: Documents Required */}
          <div className="lg:col-span-5">
            <Reveal direction="left">
              <Card className="bg-plra-accent-purple text-white border-none shadow-xl rounded-[2.5rem] overflow-hidden sticky top-32">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                <CardHeader className="p-10 pb-6">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white mb-6">
                    <ListChecks size={28} />
                  </div>
                  <CardTitle className="text-3xl font-black">Required Documents</CardTitle>
                  <p className="text-white/70 font-medium">Ensure you have these ready before applying.</p>
                </CardHeader>
                <CardContent className="p-10 pt-0">
                  <ul className="space-y-6">
                    {documentsRequired.map((doc, index) => (
                      <li key={index} className="flex items-start gap-4 group">
                        <div className="mt-1 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 group-hover:bg-plra-gold transition-colors">
                          <CheckCircle2 size={14} className="text-white" />
                        </div>
                        <span className="font-bold text-lg leading-tight">{doc}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-12 p-6 bg-black/20 rounded-[2rem] border border-white/10">
                    <p className="text-sm font-medium leading-relaxed italic">
                      "Please ensure no column is left blank in the membership form to avoid processing delays."
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};