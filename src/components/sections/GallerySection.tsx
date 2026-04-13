"use client";

import React from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Reveal } from '@/components/animations/Reveal';
import { Maximize2 } from 'lucide-react';

const galleryItems = [
  { id: '1', title: '3rd MAJOSC 2021', imageUrl: '/1.jpeg', category: 'Competition' },
  { id: '2', title: '4th MAJOSC 2022', imageUrl: '/2.jpeg', category: 'Competition' },
  { id: '3', title: '38th PARA Cen Meet 2018', imageUrl: '/3.jpeg', category: 'National' },
  { id: '4', title: '39th PARA Cen Meet 2019', imageUrl: '/4.jpeg', category: 'National' },
  { id: '5', title: '40th PARA Cen Meet 2020', imageUrl: '/5.jpeg', category: 'National' },
  { id: '6', title: '41st PARA Cen Meet 2021', imageUrl: '/6.jpeg', category: 'National' },
  { id: '7', title: '42nd PARA Cen Meet 2022', imageUrl: '/7.jpeg', category: 'National' },
  { id: '8', title: 'Training Session', imageUrl: '/8.jpeg', category: 'Training' },
  { id: '9', title: 'Competition Day', imageUrl: '/9.jpeg', category: 'Action' },
  { id: '10', title: 'Team Briefing', imageUrl: '/10.jpeg', category: 'Team' },
  { id: '11', title: 'Award Ceremony', imageUrl: '/11.jpeg', category: 'Awards' },
  { id: '12', title: 'Precision Shooting', imageUrl: '/12.jpeg', category: 'Action' },
];

export const GallerySection = () => {
  return (
    <section className="bg-white py-24 px-4 md:px-8">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <Reveal direction="down">
            <span className="text-plra-accent-purple font-black uppercase tracking-widest text-sm mb-4 block">Moments Captured</span>
          </Reveal>
          <Reveal>
            <h2 className="text-4xl md:text-6xl font-black text-plra-black mb-8 leading-tight">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-plra-accent-purple to-plra-accent-pink">Visual Legacy</span>
            </h2>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleryItems.map((item, index) => (
            <Reveal key={item.id} delay={index * 0.05} direction="up">
              <Card className="group relative aspect-[4/3] overflow-hidden rounded-[2rem] border-none shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-plra-black/90 via-plra-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                  <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="inline-block px-3 py-1 rounded-full bg-plra-gold text-plra-black text-[10px] font-black uppercase tracking-widest mb-3">
                      {item.category}
                    </span>
                    <h3 className="text-white text-2xl font-black leading-tight mb-2">
                      {item.title}
                    </h3>
                    <div className="flex items-center text-gray-400 text-sm font-bold">
                      <Maximize2 size={16} className="mr-2 text-plra-accent-purple" />
                      <span>View Full Image</span>
                    </div>
                  </div>
                </div>

                {/* Corner Accent */}
                <div className="absolute top-6 right-6 w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <Maximize2 size={18} />
                </div>
              </Card>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.5} direction="up">
          <div className="mt-20 text-center">
            <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-xs">
              More moments being added regularly
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
};