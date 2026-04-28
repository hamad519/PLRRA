"use client";

import React, { useEffect, useState } from 'react';
import { User, Award, Lightbulb, BookOpen, Crown, Star } from 'lucide-react';
import { Reveal } from '@/components/animations/Reveal';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

const ICON_MAP: Record<number, any> = { 0: User, 1: Award, 2: Lightbulb, 3: BookOpen, 4: Crown, 5: Star };
const COLOR_MAP: Record<number, string> = {
  0: 'from-blue-500 to-cyan-400',
  1: 'from-purple-500 to-pink-500',
  2: 'from-emerald-500 to-teal-400',
  3: 'from-plra-gold to-orange-500',
  4: 'from-red-500 to-rose-400',
  5: 'from-indigo-500 to-blue-500',
};

interface Contributor {
  id: number;
  name: string;
  role: string;
  contributions: string[];
}

export const MajorContributorsSection = () => {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/admin/contributors');
        const data = await res.json();
        if (data.success) setContributors(data.data);
      } catch { /* silently fall through */ }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="bg-plra-bg-soft py-24 px-4 md:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-20 space-y-4">
            <Skeleton className="h-4 w-32 mx-auto" />
            <Skeleton className="h-14 w-[40%] mx-auto" />
            <Skeleton className="h-4 w-[50%] mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white rounded-[2.5rem] p-8 space-y-6">
                <div className="flex items-center gap-5">
                  <Skeleton className="w-14 h-14 rounded-2xl" />
                  <div className="space-y-2"><Skeleton className="h-5 w-32" /><Skeleton className="h-3 w-24" /></div>
                </div>
                {[1, 2, 3].map((j) => <Skeleton key={j} className="h-4 w-full" />)}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (contributors.length === 0) return null;

  return (
    <section className="bg-plra-bg-soft py-24 px-4 md:px-8 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-plra-accent-purple/5 rounded-full blur-[150px] -z-10"></div>

      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <Reveal direction="down">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-[1px] w-12 bg-plra-accent-pink/30"></div>
              <span className="text-plra-accent-pink font-black uppercase tracking-[0.4em] text-xs">Our Pillars</span>
              <div className="h-[1px] w-12 bg-plra-accent-pink/30"></div>
            </div>
          </Reveal>
          <Reveal>
            <h2 className="text-4xl md:text-6xl font-black text-plra-black mb-8 leading-tight">
              Major <span className="text-transparent bg-clip-text bg-gradient-to-r from-plra-accent-purple to-plra-accent-pink">Contributors</span>
            </h2>
          </Reveal>
          <Reveal delay={0.3}>
            <p className="text-gray-600 text-lg leading-relaxed">
              The success of this remarkable journey is the result of a collective effort — a team of dedicated individuals working together toward a shared vision.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {contributors.map((person, index) => {
            const IconComp = ICON_MAP[index % 6] || User;
            const color = COLOR_MAP[index % 6];
            const contribs = (person.contributions ?? []) as string[];

            return (
              <Reveal key={person.id} delay={index * 0.1} direction="up">
                <div className="group relative h-full">
                  <div className={cn("absolute -inset-0.5 rounded-[2.5rem] opacity-5 group-hover:opacity-20 blur-xl transition duration-500 bg-gradient-to-r", color)}></div>
                  <div className="relative h-full bg-white border border-gray-100 rounded-[2.5rem] p-8 flex flex-col hover:shadow-2xl transition-all duration-500">
                    <div className="flex items-center gap-5 mb-8">
                      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg bg-gradient-to-br", color)}>
                        <IconComp size={28} />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-plra-black group-hover:text-plra-accent-purple transition-colors">{person.name}</h3>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{person.role}</p>
                      </div>
                    </div>
                    <ul className="space-y-4 flex-grow">
                      {contribs.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-gray-600 group-hover:text-gray-700 transition-colors">
                          <div className={cn("mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-gradient-to-r", color)}></div>
                          <span className="text-sm leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-end">
                      <Star size={16} className="text-plra-gold/20 group-hover:text-plra-gold transition-colors" />
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};
