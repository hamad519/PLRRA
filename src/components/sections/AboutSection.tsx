"use client";

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Target, Users, Handshake, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Reveal } from '@/components/animations/Reveal';
import { cn } from '@/lib/utils';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { Skeleton } from '@/components/ui/skeleton';

export const AboutSection = () => {
  const { settings, loading } = useSiteSettings();
  const intro = settings?.plraIntro || "";

  if (loading) {
    return (
      <section className="bg-plra-bg-soft py-24 px-4 md:px-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
            <Skeleton className="aspect-[4/3] rounded-3xl" />
            <div className="space-y-6">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-12 w-[80%]" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[90%]" />
              <Skeleton className="h-4 w-[75%]" />
              <Skeleton className="h-12 w-40 rounded-xl mt-4" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-3xl p-8 space-y-4">
                <Skeleton className="h-14 w-14 rounded-2xl" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[80%]" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const aims = [
    { icon: Target, title: "Development", text: "Encouraging participation and growth in the sport of Long-Range Rifle Shooting across Pakistan.", color: "bg-blue-500" },
    { icon: Users, title: "Representation", text: "Organizing and facilitating Pakistan's presence at prestigious international shooting events.", color: "bg-purple-500" },
    { icon: Handshake, title: "Collaboration", text: "Liaising with national and international stakeholders to maintain high standards of conduct.", color: "bg-pink-500" },
    { icon: ShieldCheck, title: "Safety & Fair Play", text: "Promoting safe practices and ensuring fair competition at every event we organize.", color: "bg-emerald-500" },
  ];

  return (
    <section className="bg-plra-bg-soft py-24 px-4 md:px-8 overflow-hidden">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <Reveal direction="right">
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-plra-accent-purple/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-plra-accent-pink/10 rounded-full blur-3xl"></div>
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
                <Image src="/6.jpeg" alt="PLRA Training" width={800} height={600} className="object-cover" />
              </div>
              <div className="absolute -bottom-6 -left-6 z-20 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 hidden md:block animate-float">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-plra-green-light flex items-center justify-center text-white">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-plra-black">Certified Excellence</p>
                    <p className="text-xs text-gray-500">ICFRA Affiliated Body</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <div>
            <Reveal direction="down">
              <span className="text-plra-accent-purple font-black uppercase tracking-widest text-sm mb-4 block">About the Association</span>
            </Reveal>
            <Reveal>
              <h2 className="text-4xl md:text-6xl font-black text-plra-black mb-8 leading-tight">
                Elevating Pakistani <span className="text-transparent bg-clip-text bg-gradient-to-r from-plra-accent-purple to-plra-accent-pink">Marksmanship</span>
              </h2>
            </Reveal>
            <Reveal delay={0.3}>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                {intro || "The Pakistan Long Range Rifle Association (PLRA) is the national governing body for Full-bore rifle shooting. Affiliated with the International Confederation of Full-bore Rifle Association (ICFRA), we are dedicated to training and selecting the best shooters to represent Pakistan globally."}
              </p>
            </Reveal>
            <Reveal delay={0.5}>
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-plra-green-light/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 rounded-full bg-plra-green-light"></div>
                  </div>
                  <p className="text-gray-700 font-medium">Official representative to ICFRA World Championships.</p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-plra-accent-purple/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 rounded-full bg-plra-accent-purple"></div>
                  </div>
                  <p className="text-gray-700 font-medium">Expanding the sport of Long-Range Shooting nationwide.</p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.7}>
              <Link href="/who-we-are" passHref>
                <Button className="mt-10 bg-plra-black hover:bg-plra-black/90 text-white px-8 py-6 rounded-xl font-bold flex items-center gap-2 group">
                  Discover Our History <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </Reveal>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {aims.map((aim, index) => (
            <Reveal key={index} delay={index * 0.1} direction="up">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 h-full group">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg", aim.color)}>
                  <aim.icon size={28} />
                </div>
                <h3 className="text-xl font-black text-plra-black mb-4">{aim.title}</h3>
                <p className="text-gray-500 leading-relaxed">{aim.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};