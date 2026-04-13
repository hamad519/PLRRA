import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Reveal } from '@/components/animations/Reveal';

export const WhoWeAreHeroSection = () => {
  return (
    <section className="relative h-[50vh] md:h-[60vh] w-full bg-slate-950 overflow-hidden flex items-center">
      <Image
        src="/hero_sec_img.png"
        alt="PLRA Who We Are Hero"
        layout="fill"
        objectFit="cover"
        quality={90}
        className="z-0 opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/40 to-slate-950 z-10"></div>
      
      <div className="container mx-auto px-4 md:px-8 relative z-20">
        <div className="max-w-4xl">
          <Reveal direction="down">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-[2px] w-12 bg-plra-gold"></div>
              <span className="text-plra-gold text-xs font-black tracking-[0.4em] uppercase">Our Identity</span>
            </div>
          </Reveal>
          <Reveal delay={0.3}>
            <h1 className="text-white text-5xl md:text-7xl font-black tracking-tighter leading-none mb-6">
              WHO <span className="text-transparent bg-clip-text bg-gradient-to-r from-plra-accent-purple to-plra-accent-pink">WE ARE</span>
            </h1>
          </Reveal>
          <Reveal delay={0.5}>
            <p className="text-gray-300 text-lg md:text-xl max-w-2xl leading-relaxed font-medium">
              The Pakistan Long Range Rifle Association (PLRA) is the heartbeat of precision shooting in the nation.
            </p>
          </Reveal>
          <Reveal delay={0.7}>
            <div className="flex items-center text-xs font-black uppercase tracking-widest text-gray-400 mt-8">
              <Link href="/" className="hover:text-plra-gold transition-colors">Home</Link>
              <span className="mx-3 text-plra-gold">/</span>
              <span className="text-white">Who We Are</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};