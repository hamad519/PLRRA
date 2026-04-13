"use client";

import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, CalendarDays, MapPin } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { DotButton, useDotButton } from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import { Reveal } from '@/components/animations/Reveal';

const competitions = [
  {
    id: 'comp-1',
    title: 'South African Open Long Range Championship 2025',
    date: '29 Mar - 5 Apr',
    location: 'Bloemfontein, SA',
    imageUrl: '/1.jpeg',
  },
  {
    id: 'comp-2',
    title: 'European F Class Championships, 2024',
    date: '3 - 8 Sep',
    location: 'Bisley, UK',
    imageUrl: '/2.jpeg',
  },
  {
    id: 'comp-3',
    title: 'European F Class Championship, 2023',
    date: '5 - 10 Sep',
    location: 'Bisley, UK',
    imageUrl: '/3.jpeg',
  },
  {
    id: 'comp-4',
    title: '6th F Class World Championship, 2023',
    date: '26 Mar - 1 Apr',
    location: 'Bloemfontein, SA',
    imageUrl: '/4.jpeg',
  },
];

export const CompetitionCarouselSection = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    align: 'start',
    containScroll: 'trimSnaps'
  });

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <section className="bg-white py-24 px-4 md:px-8 overflow-hidden">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <Reveal direction="down">
              <span className="text-plra-accent-purple font-black uppercase tracking-widest text-sm mb-4 block">Our Achievements</span>
            </Reveal>
            <Reveal>
              <h2 className="text-4xl md:text-6xl font-black text-plra-black leading-tight">
                Past <span className="text-transparent bg-clip-text bg-gradient-to-r from-plra-accent-purple to-plra-accent-pink">Competitions</span>
              </h2>
            </Reveal>
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={scrollPrev}
              className="w-14 h-14 rounded-2xl border-plra-black/10 hover:bg-plra-black hover:text-white transition-all"
            >
              <ChevronLeft size={24} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={scrollNext}
              className="w-14 h-14 rounded-2xl border-plra-black/10 hover:bg-plra-black hover:text-white transition-all"
            >
              <ChevronRight size={24} />
            </Button>
          </div>
        </div>

        <div className="relative">
          {/* Restored overflow-hidden for proper alignment, added py-8 to allow shadows to show */}
          <div className="overflow-hidden py-8 -my-8" ref={emblaRef}>
            <div className="flex -ml-6">
              {competitions.map((comp) => (
                <div key={comp.id} className="flex-none w-full sm:w-1/2 lg:w-1/3 pl-6">
                  <Card className="bg-white border-none shadow-sm hover:shadow-2xl transition-all duration-500 rounded-[2.5rem] h-full flex flex-col group">
                    <div className="relative w-full h-72 overflow-hidden rounded-t-[2.5rem]">
                      <Image
                        src={comp.imageUrl}
                        alt={comp.title}
                        layout="fill"
                        objectFit="cover"
                        quality={80}
                        className="transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-plra-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    <CardHeader className="p-8 pb-4 flex-grow">
                      <CardTitle className="text-2xl font-black text-plra-black leading-tight group-hover:text-plra-accent-purple transition-colors">
                        {comp.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 pt-0 space-y-4">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center text-gray-500 font-bold text-sm">
                          <CalendarDays size={16} className="mr-2 text-plra-accent-purple" />
                          <span>{comp.date}</span>
                        </div>
                        <div className="flex items-center text-gray-500 font-bold text-sm">
                          <MapPin size={16} className="mr-2 text-plra-accent-pink" />
                          <span>{comp.location}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-12 space-x-3">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300",
                index === selectedIndex ? "bg-plra-accent-purple w-8" : "bg-gray-300"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
};