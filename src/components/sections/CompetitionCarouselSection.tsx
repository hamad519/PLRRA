"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, CalendarDays, MapPin, Trophy, Images } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { DotButton, useDotButton } from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import { Reveal } from '@/components/animations/Reveal';
import { format } from 'date-fns';
import { CompetitionGalleryModal } from './CompetitionGalleryModal';
import { CompetitionCarouselSkeleton } from '@/components/ui/PageSkeletons';

interface Competition {
  _id: string;
  title: string;
  fromDate: string;
  toDate: string;
  date?: string;
  location: string;
  mainImageBase64: string;
  galleryImagesBase64?: string[];
  galleryMedia?: { type: 'image' | 'video'; url: string }[];
  description?: string;
}

const formatDateRange = (fromDate: string, toDate?: string, fallback?: string) => {
  try {
    if (fromDate && toDate) {
      const from = new Date(fromDate);
      const to = new Date(toDate);
      if (from.getMonth() === to.getMonth() && from.getFullYear() === to.getFullYear()) {
        return `${format(from, 'd')} - ${format(to, 'd MMM yyyy')}`;
      }
      return `${format(from, 'd MMM')} - ${format(to, 'd MMM yyyy')}`;
    }
    if (fallback) return format(new Date(fallback), 'PPP');
  } catch {
    return fromDate || '';
  }
  return '';
};

export const CompetitionCarouselSection = () => {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Competition | null>(null);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    containScroll: 'trimSnaps',
  });

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi);

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const res = await fetch('/api/competitions');
        const data = await res.json();
        if (data.success) setCompetitions(data.data);
      } catch {
        // silently fall through
      } finally {
        setLoading(false);
      }
    };
    fetchCompetitions();
  }, []);

  useEffect(() => {
    if (emblaApi && competitions.length > 0) emblaApi.reInit();
  }, [emblaApi, competitions]);

  if (loading) {
    return <CompetitionCarouselSkeleton />;
  }

  if (competitions.length === 0) {
    return (
      <section className="bg-white py-24 px-4 md:px-8">
        <div className="container mx-auto text-center">
          <Reveal direction="down">
            <span className="text-plra-accent-purple font-black uppercase tracking-widest text-sm mb-4 block">Our Achievements</span>
          </Reveal>
          <Reveal>
            <h2 className="text-4xl md:text-6xl font-black text-plra-black leading-tight mb-8">
              Past <span className="text-transparent bg-clip-text bg-gradient-to-r from-plra-accent-purple to-plra-accent-pink">Competitions</span>
            </h2>
          </Reveal>
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Trophy size={64} className="mb-4 opacity-30" />
            <p className="text-lg font-semibold">No competitions added yet.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
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
            <div className="overflow-hidden py-8 -my-8" ref={emblaRef}>
              <div className="flex -ml-6">
                {competitions.map((comp) => {
                  const totalImages =
                    1 +
                    (comp.galleryImagesBase64?.length ?? 0) +
                    (comp.galleryMedia?.length ?? 0);
                  const dateLabel = formatDateRange(comp.fromDate, comp.toDate, comp.date);

                  return (
                    <div key={comp._id} className="flex-none w-full sm:w-1/2 lg:w-1/3 pl-6">
                      <Card
                        className="bg-white border-none shadow-sm hover:shadow-2xl transition-all duration-500 rounded-[2.5rem] h-full flex flex-col group cursor-pointer"
                        onClick={() => setSelected(comp)}
                      >
                        <div className="relative w-full h-72 overflow-hidden rounded-t-[2.5rem]">
                          <Image
                            src={comp.mainImageBase64}
                            alt={comp.title}
                            fill
                            style={{ objectFit: 'cover' }}
                            quality={80}
                            className="transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-plra-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                          {/* Gallery badge */}
                          {totalImages > 1 && (
                            <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <Images size={13} />
                              {totalImages} items
                            </div>
                          )}

                          {/* Click to view hint */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span className="bg-white/20 backdrop-blur-sm text-white text-sm font-black uppercase tracking-widest px-5 py-2.5 rounded-full border border-white/30">
                              View Gallery
                            </span>
                          </div>
                        </div>

                        <CardHeader className="p-8 pb-4 flex-grow">
                          <CardTitle className="text-2xl font-black text-plra-black leading-tight group-hover:text-plra-accent-purple transition-colors">
                            {comp.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 space-y-4">
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center text-gray-500 font-bold text-sm">
                              <CalendarDays size={16} className="mr-2 text-plra-accent-purple shrink-0" />
                              <span>{dateLabel}</span>
                            </div>
                            <div className="flex items-center text-gray-500 font-bold text-sm">
                              <MapPin size={16} className="mr-2 text-plra-accent-pink shrink-0" />
                              <span>{comp.location}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  );
                })}
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

      {/* Gallery modal */}
      <CompetitionGalleryModal
        competition={selected}
        dateLabel={selected ? formatDateRange(selected.fromDate, selected.toDate, selected.date) : ''}
        onClose={() => setSelected(null)}
      />
    </>
  );
};
