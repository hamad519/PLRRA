"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { FileText, Trophy, Download } from 'lucide-react';
import { toast } from 'sonner';
import { Reveal } from '@/components/animations/Reveal';
import { downloadFile } from '@/lib/downloadFile';

interface MatchResult {
  name: string;
  pdfBase64: string;
  details?: string;
}

interface PastResultRecord {
  _id: string;
  title: string;
  matches: MatchResult[];
}

export const PastResultsRecordsContentSection = () => {
  const [pastCompetitions, setPastCompetitions] = useState<PastResultRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPastResults = async () => {
      try {
        const res = await fetch('/api/admin/past-results-records');
        const data = await res.json();
        if (data.success) {
          setPastCompetitions(data.data);
        }
      } catch (err: any) {
        toast.error("Failed to load competition archives.");
      } finally {
        setLoading(false);
      }
    };
    fetchPastResults();
  }, []);

  const handleDownload = (source: string, fileName: string) => {
    try {
      downloadFile(source, fileName);
    } catch {
      toast.error("Could not download file.");
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="inline-block w-8 h-8 border-4 border-plra-gold border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Loading Archives...</p>
      </div>
    );
  }

  return (
    <section className="bg-white py-24 px-4 md:px-8">
      <div className="container mx-auto">
        <div className="space-y-12">
          {pastCompetitions.length === 0 ? (
            <div className="text-center py-20 bg-plra-bg-soft rounded-[3rem]">
              <Trophy className="mx-auto text-gray-300 mb-6" size={64} />
              <p className="text-xl font-bold text-gray-400">No records found in the archives.</p>
            </div>
          ) : (
            pastCompetitions.map((competition, index) => (
              <Reveal key={competition._id} delay={index * 0.1} direction="up">
                <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 rounded-[2.5rem] overflow-hidden">
                  <CardHeader className="p-10 bg-plra-bg-soft/50 border-b border-gray-100">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <CardTitle className="text-3xl font-black text-plra-black">{competition.title}</CardTitle>
                      <div className="hidden md:block">
                        <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-plra-gold">
                          <Trophy size={32} />
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-10">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Match Results & Scorecards</h3>
                    <Accordion type="single" collapsible className="space-y-4">
                      {competition.matches.map((match, mIndex) => (
                        <AccordionItem key={mIndex} value={`match-${competition._id}-${mIndex}`} className="border-none bg-plra-bg-soft rounded-2xl px-6 overflow-hidden">
                          <AccordionTrigger className="hover:no-underline py-6 group">
                            <div className="flex items-center text-left gap-4">
                              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-plra-accent-purple group-hover:scale-110 transition-transform">
                                <FileText size={20} />
                              </div>
                              <span className="text-lg font-bold text-plra-black group-hover:text-plra-accent-purple transition-colors">{match.name}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pb-8 pl-14">
                            <div className="flex flex-col gap-4">
                              {match.details && <p className="text-gray-600 leading-relaxed">{match.details}</p>}
                              <Button 
                                onClick={() => handleDownload(match.pdfBase64, match.name)}
                                className="bg-plra-black hover:bg-plra-accent-purple text-white font-bold px-6 py-4 rounded-xl flex items-center gap-2 transition-all w-fit"
                              >
                                <Download size={18} /> Download Results PDF
                              </Button>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </Reveal>
            ))
          )}
        </div>
      </div>
    </section>
  );
};