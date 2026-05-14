"use client";

import React, { useEffect, useState } from 'react';
import { Trophy, Flag, Medal, Globe, Star, Award } from 'lucide-react';
import { Reveal } from '@/components/animations/Reveal';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

const ICON_MAP: Record<number, any> = { 0: Trophy, 1: Flag, 2: Medal, 3: Globe, 4: Award, 5: Star };
const COLOR_MAP: Record<number, string> = {
  0: 'from-blue-500 to-cyan-400',
  1: 'from-purple-500 to-pink-500',
  2: 'from-plra-gold to-orange-500',
  3: 'from-emerald-500 to-teal-400',
  4: 'from-red-500 to-rose-400',
  5: 'from-indigo-500 to-blue-500',
};

interface Bullet {
  text: string;
  children?: string[];
}

interface Achievement {
  id: number;
  year: string;
  title: string;
  bullets: Bullet[];
}

export const InternationalAscendancySection = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/admin/achievements');
        const data = await res.json();
        if (data.success) setAchievements(data.data);
      } catch {
        /* silently fall through */
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="bg-white py-24 px-4 md:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-20 space-y-4">
            <Skeleton className="h-4 w-40 mx-auto" />
            <Skeleton className="h-14 w-[50%] mx-auto" />
            <Skeleton className="h-4 w-[40%] mx-auto" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-plra-bg-soft rounded-[2.5rem] p-10 space-y-6">
                <div className="flex justify-between">
                  <Skeleton className="w-16 h-16 rounded-2xl" />
                  <Skeleton className="w-16 h-10" />
                </div>
                <Skeleton className="h-7 w-[70%]" />
                {[1, 2, 3, 4].map((j) => (
                  <Skeleton key={j} className="h-4 w-full" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (achievements.length === 0) return null;

  return (
    <section className="bg-white py-24 px-4 md:px-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-plra-accent-purple/5 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-plra-accent-pink/5 rounded-full blur-[120px] -z-10"></div>

      <div className="container mx-auto">
        <div className="text-center max-w-4xl mx-auto mb-20">
          <Reveal direction="down">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-[1px] w-12 bg-plra-accent-purple/30"></div>
              <span className="text-plra-accent-purple font-black uppercase tracking-[0.4em] text-xs">Global Recognition</span>
              <div className="h-[1px] w-12 bg-plra-accent-purple/30"></div>
            </div>
          </Reveal>
          <Reveal delay={0.3}>
            <h2 className="text-4xl md:text-6xl font-black text-plra-black mb-8 leading-tight">
              Pakistan FTR Team&apos;s <span className="text-transparent bg-clip-text bg-gradient-to-r from-plra-accent-purple via-plra-accent-pink to-plra-gold">International Ascendancy</span>
            </h2>
          </Reveal>
          <Reveal delay={0.5}>
            <p className="text-gray-600 text-lg md:text-xl leading-relaxed">
              From a stunning debut to absolute dominance, witness the journey of Pakistan&apos;s elite marksmen as they conquer the world&apos;s most prestigious ranges.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {achievements.map((item, index) => {
            const IconComp = ICON_MAP[index % 6] || Trophy;
            const color = COLOR_MAP[index % 6];
            const bullets = (item.bullets ?? []) as Bullet[];

            return (
              <Reveal key={item.id} delay={index * 0.2} direction="up">
                <div className="group relative h-full">
                  <div className={cn('absolute -inset-0.5 rounded-[2.5rem] opacity-10 group-hover:opacity-30 blur-xl transition duration-500 bg-gradient-to-r', color)}></div>
                  <div className="relative h-full bg-plra-bg-soft border border-gray-100 rounded-[2.5rem] p-10 flex flex-col hover:bg-white hover:shadow-2xl transition-all duration-500">
                    <div className="flex justify-between items-start mb-8">
                      <div className={cn('w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg bg-gradient-to-br', color)}>
                        <IconComp size={32} />
                      </div>
                      {item.year && <span className="text-4xl font-black text-gray-200 group-hover:text-gray-300 transition-colors">{item.year}</span>}
                    </div>
                    <h3 className="text-2xl font-black text-plra-black mb-6 group-hover:text-plra-accent-purple transition-colors">{item.title}</h3>
                    <ul className="space-y-4 flex-grow">
                      {bullets.map((bullet, bIndex) => (
                        <li key={bIndex} className="text-gray-700">
                          <div className="flex items-start gap-3">
                            <div className="mt-2 w-1.5 h-1.5 rounded-full bg-plra-gold flex-shrink-0"></div>
                            <span className="text-sm leading-relaxed">{bullet.text}</span>
                          </div>
                          {Array.isArray(bullet.children) && bullet.children.length > 0 && (
                            <ul className="mt-2 ml-6 space-y-2">
                              {bullet.children.map((child, cIndex) => (
                                <li key={cIndex} className="flex items-start gap-3 text-gray-500">
                                  <div className="mt-2 w-1 h-1 rounded-full bg-plra-accent-purple/50 flex-shrink-0"></div>
                                  <span className="text-xs leading-relaxed">{child}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-10 pt-8 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center">
                            <Star size={12} className="text-plra-gold" />
                          </div>
                        ))}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Elite Performance</span>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.8} direction="up">
          <div className="mt-20 p-1 bg-gradient-to-r from-transparent via-gray-100 to-transparent"></div>
          <div className="mt-12 flex flex-wrap justify-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-3">
              <Globe className="text-plra-black" size={24} />
              <span className="text-plra-black font-bold tracking-widest text-xs uppercase">ICFRA Affiliated</span>
            </div>
            <div className="flex items-center gap-3">
              <Award className="text-plra-black" size={24} />
              <span className="text-plra-black font-bold tracking-widest text-xs uppercase">World Class Standards</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
