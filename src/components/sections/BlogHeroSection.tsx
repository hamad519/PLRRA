import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays } from 'lucide-react';
import { Reveal } from '@/components/animations/Reveal';

interface BlogHeroSectionProps {
  title: string;
  date: string;
}

export const BlogHeroSection = ({ title, date }: BlogHeroSectionProps) => {
  return (
    <section className="relative h-[60vh] md:h-[70vh] w-full bg-slate-950 overflow-hidden flex items-center">
      <Image
        src="/hero_sec_img.png"
        alt={title}
        layout="fill"
        objectFit="cover"
        quality={90}
        className="z-0 opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/40 to-slate-950 z-10"></div>
      
      <div className="container mx-auto px-4 md:px-8 relative z-20">
        <div className="max-w-5xl">
          <Reveal direction="down">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-[2px] w-12 bg-plra-gold"></div>
              <div className="flex items-center text-plra-gold text-xs font-black tracking-[0.4em] uppercase">
                <CalendarDays size={14} className="mr-2" />
                {date}
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.3}>
            <h1 className="text-white text-4xl md:text-7xl font-black tracking-tighter leading-tight mb-8">
              {title}
            </h1>
          </Reveal>
          <Reveal delay={0.5}>
            <div className="flex items-center text-xs font-black uppercase tracking-widest text-gray-400">
              <Link href="/" className="hover:text-plra-gold transition-colors">Home</Link>
              <span className="mx-3 text-plra-gold">/</span>
              <Link href="/blogs-news" className="hover:text-plra-gold transition-colors">Blogs & News</Link>
              <span className="mx-3 text-plra-gold">/</span>
              <span className="text-white truncate max-w-[200px] md:max-w-none">{title}</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};