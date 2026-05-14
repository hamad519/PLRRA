"use client";

import React, { useEffect, useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { History, TrendingUp, Rocket, Landmark, Globe, Calendar, Flag, Trophy, Target, type LucideIcon } from 'lucide-react';
import { Reveal } from '@/components/animations/Reveal';
import { Skeleton } from '@/components/ui/skeleton';

const ICON_MAP: Record<string, LucideIcon> = {
  History,
  TrendingUp,
  Rocket,
  Landmark,
  Globe,
  Calendar,
  Flag,
  Trophy,
  Target,
};

interface Bullet { text: string; children?: string[] }

interface HistoryItem {
  id: number;
  year: string;
  title: string;
  intro: string;
  iconName: string;
  bullets: Bullet[];
}

export const HistorySection = () => {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/admin/history');
        const data = await res.json();
        if (data.success) setItems(data.data);
      } catch {
        /* silent */
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="bg-slate-950 py-24 px-4 md:px-8">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <Skeleton className="h-4 w-32 mx-auto bg-white/10" />
            <Skeleton className="h-14 w-[60%] mx-auto bg-white/10" />
            <Skeleton className="h-4 w-[80%] mx-auto bg-white/10" />
          </div>
          <div className="max-w-4xl mx-auto space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20 bg-white/5 rounded-3xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) return null;

  return (
    <section className="bg-slate-950 py-24 px-4 md:px-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_50%)]"></div>

      <div className="container mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <Reveal direction="down">
            <span className="text-plra-gold font-black uppercase tracking-widest text-sm mb-4 block">Our Journey</span>
          </Reveal>
          <Reveal>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8">
              A Legacy of <span className="text-transparent bg-clip-text bg-gradient-to-r from-plra-gold to-orange-500">Precision</span>
            </h2>
          </Reveal>
          <Reveal delay={0.3}>
            <p className="text-gray-400 text-lg leading-relaxed">
              The development of long-range shooting in Pakistan is rooted in deliberate foresight, relentless passion, and institutional support.
            </p>
          </Reveal>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {items.map((item, index) => {
              const Icon = ICON_MAP[item.iconName] || History;
              const headlineLeft = item.year || item.title;
              const headlineRight = item.year && item.title ? item.title : '';
              return (
                <Reveal key={item.id} delay={index * 0.1} direction="up">
                  <AccordionItem value={`item-${item.id}`} className="border-none bg-white/5 rounded-3xl overflow-hidden px-6 transition-all hover:bg-white/10">
                    <AccordionTrigger className="hover:no-underline py-6 group">
                      <div className="flex items-center text-left gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-plra-gold/10 flex items-center justify-center text-plra-gold group-hover:scale-110 transition-transform">
                          <Icon size={28} />
                        </div>
                        <div>
                          {item.year && (
                            <p className="text-plra-gold font-black text-sm tracking-widest mb-1">{item.year}</p>
                          )}
                          {headlineRight ? (
                            <h3 className="text-xl font-bold text-white">{headlineRight}</h3>
                          ) : (
                            <h3 className="text-xl font-bold text-white">{headlineLeft}</h3>
                          )}
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-8 pl-20 text-gray-400 text-base leading-relaxed">
                      {item.intro && <p className="mb-4 italic text-gray-300">{item.intro}</p>}
                      {item.bullets?.length > 0 && (
                        <ul className="list-disc list-outside space-y-3 marker:text-plra-gold pl-5">
                          {item.bullets.map((bullet, bIdx) => (
                            <li key={bIdx}>
                              <span>{bullet.text}</span>
                              {Array.isArray(bullet.children) && bullet.children.length > 0 && (
                                <ul className="mt-2 list-[circle] list-outside space-y-1 marker:text-plra-gold/60 pl-6 text-sm text-gray-400">
                                  {bullet.children.map((child, cIdx) => (
                                    <li key={cIdx}>{child}</li>
                                  ))}
                                </ul>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Reveal>
              );
            })}
          </Accordion>
        </div>
      </div>
    </section>
  );
};
