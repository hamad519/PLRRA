"use client";

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Reveal } from '@/components/animations/Reveal';
import { Trophy, Medal, Star, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { Skeleton } from '@/components/ui/skeleton';

export const RecordsSection = () => {
  const { settings: data, loading } = useSiteSettings();

  if (loading) {
    return (
      <section className="py-24 px-4 md:px-8 bg-white">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <Skeleton className="h-4 w-40 mx-auto" />
            <Skeleton className="h-12 w-[60%] mx-auto" />
            <Skeleton className="h-4 w-[50%] mx-auto" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-plra-bg-soft rounded-3xl p-8 text-center space-y-3">
                <Skeleton className="h-12 w-12 rounded-2xl mx-auto" />
                <Skeleton className="h-10 w-20 mx-auto" />
                <Skeleton className="h-4 w-28 mx-auto" />
              </div>
            ))}
          </div>
          <div className="space-y-4 mb-8">
            <Skeleton className="h-4 w-40 mx-auto" />
            <Skeleton className="h-10 w-[35%] mx-auto" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="aspect-square rounded-3xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const stats = [
    { icon: Trophy, label: "National Records", value: data?.stats?.nationalRecords || "45+", color: "text-yellow-500" },
    { icon: Medal, label: "International Medals", value: data?.stats?.internationalMedals || "12", color: "text-blue-500" },
    { icon: Star, label: "Elite Shooters", value: data?.stats?.eliteShooters || "150+", color: "text-purple-500" },
    { icon: TrendingUp, label: "Growth Rate", value: data?.stats?.growthRate || "25%", color: "text-emerald-500" },
  ];

  const moments = data?.championMoments && data.championMoments.length > 0 
    ? data.championMoments 
    : [
        { title: "Championship Moment", imageBase64: "/16.jpeg" },
        { title: "Championship Moment", imageBase64: "/14.jpeg" },
        { title: "Championship Moment", imageBase64: "/19.jpeg" },
        { title: "Championship Moment", imageBase64: "/20.jpeg" },
      ];

  return (
    <section className="py-24 px-4 md:px-8 bg-white">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <Reveal direction="down">
            <span className="text-plra-accent-pink font-black uppercase tracking-widest text-sm mb-4 block">Our Legacy</span>
          </Reveal>
          <Reveal>
            <h2 className="text-4xl md:text-6xl font-black text-plra-black mb-6">
              Remarkable <span className="text-transparent bg-clip-text bg-gradient-to-r from-plra-accent-pink to-plra-gold">Shooting Records</span>
            </h2>
          </Reveal>
          <Reveal delay={0.3}>
            <p className="text-lg text-gray-600 leading-relaxed">
              Showcasing the exceptional skill of Pakistani marksmen across distances from 300 meters to over 1500 meters in various international formats.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <Reveal key={index} delay={index * 0.1} direction="right">
                <div className="bg-plra-bg-soft p-8 rounded-3xl border border-gray-100 flex items-center gap-6 group hover:bg-white hover:shadow-xl transition-all duration-300">
                  <div className={cn("w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center group-hover:scale-110 transition-transform", stat.color)}>
                    <stat.icon size={32} />
                  </div>
                  <div>
                    <p className="text-3xl font-black text-plra-black">{stat.value}</p>
                    <p className="text-gray-500 font-medium">{stat.label}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          
          <Reveal direction="left">
            <div className="bg-plra-black rounded-3xl p-10 text-white relative overflow-hidden h-full flex flex-col justify-center">
              <div className="absolute top-0 right-0 w-32 h-32 bg-plra-accent-purple/20 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <h3 className="text-3xl font-black mb-6">Ready to set your own record?</h3>
                <p className="text-gray-400 mb-8 leading-relaxed">
                  Join our training programs and get access to world-class facilities and coaching.
                </p>
                <Link href="/membership" passHref>
                  <Button className="w-full bg-white text-plra-black hover:bg-gray-100 font-bold py-6 rounded-xl">
                    View Membership Plans
                  </Button>
                </Link>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {moments.slice(0, 4).map((moment: any, index: number) => (
            <Reveal key={index} delay={index * 0.15} direction="up">
              <div className="relative h-64 rounded-2xl overflow-hidden group shadow-lg">
                <Image
                  src={moment.imageBase64}
                  alt={moment.title}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-plra-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <p className="text-white font-bold">{moment.title}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};