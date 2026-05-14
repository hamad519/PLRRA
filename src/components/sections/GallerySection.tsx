"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Reveal } from '@/components/animations/Reveal';
import { Maximize2, PlayCircle, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { format, isValid } from 'date-fns';
import { cn } from '@/lib/utils';

type MediaItem = { type: 'image' | 'video'; url: string };

interface GalleryEvent {
  _id: string;
  id: number;
  title: string;
  date: string;
  mainImageBase64: string;
  galleryMedia?: MediaItem[];
}

function safeFormatDate(value?: string | null): string {
  if (!value) return '';
  const d = new Date(value);
  return isValid(d) ? format(d, 'PPP') : '';
}

export const GallerySection = () => {
  const [events, setEvents] = useState<GalleryEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<GalleryEvent | null>(null);
  const [mediaIndex, setMediaIndex] = useState(0);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/national-gallery');
        const data = await res.json();
        if (data.success) setEvents(data.data);
      } catch (err) {
        console.error('Failed to fetch gallery events', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const openEvent = (event: GalleryEvent) => {
    setSelected(event);
    setMediaIndex(0);
  };

  const closeEvent = () => {
    setSelected(null);
    setMediaIndex(0);
  };

  const allMedia: MediaItem[] = selected
    ? [
        { type: 'image' as const, url: selected.mainImageBase64 },
        ...(Array.isArray(selected.galleryMedia) ? selected.galleryMedia : []),
      ]
    : [];

  const nextMedia = () => setMediaIndex((i) => (allMedia.length ? (i + 1) % allMedia.length : 0));
  const prevMedia = () =>
    setMediaIndex((i) => (allMedia.length ? (i - 1 + allMedia.length) % allMedia.length : 0));

  return (
    <section className="bg-white py-24 px-4 md:px-8">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <Reveal direction="down">
            <span className="text-plra-accent-purple font-black uppercase tracking-widest text-sm mb-4 block">
              Moments Captured
            </span>
          </Reveal>
          <Reveal>
            <h2 className="text-4xl md:text-6xl font-black text-plra-black mb-8 leading-tight">
              Our{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-plra-accent-purple to-plra-accent-pink">
                Visual Legacy
              </span>
            </h2>
          </Reveal>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] rounded-[2rem] bg-gray-200 animate-pulse" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <p className="text-center text-gray-500 font-medium">
            No gallery events yet — check back soon.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, index) => {
              const mediaCount = Array.isArray(event.galleryMedia) ? event.galleryMedia.length : 0;
              const dateLabel = safeFormatDate(event.date);
              return (
                <Reveal key={event._id} delay={index * 0.05} direction="up">
                  <Card
                    onClick={() => openEvent(event)}
                    className="group relative aspect-[4/3] overflow-hidden rounded-[2rem] border-none shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
                  >
                    <Image
                      src={event.mainImageBase64}
                      alt={event.title}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-700 group-hover:scale-110"
                      unoptimized
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-plra-black/90 via-plra-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                      <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        {dateLabel && (
                          <span className="inline-block px-3 py-1 rounded-full bg-plra-gold text-plra-black text-[10px] font-black uppercase tracking-widest mb-3">
                            {dateLabel}
                          </span>
                        )}
                        <h3 className="text-white text-2xl font-black leading-tight mb-2">
                          {event.title}
                        </h3>
                        <div className="flex items-center text-gray-400 text-sm font-bold">
                          <Maximize2 size={16} className="mr-2 text-plra-accent-purple" />
                          <span>
                            View {1 + mediaCount} item{mediaCount === 0 ? '' : 's'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="absolute top-6 right-6 w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <Maximize2 size={18} />
                    </div>
                  </Card>
                </Reveal>
              );
            })}
          </div>
        )}

        <Reveal delay={0.5} direction="up">
          <div className="mt-20 text-center">
            <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-xs">
              More moments being added regularly
            </p>
          </div>
        </Reveal>
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => !open && closeEvent()}>
        <DialogContent className="max-w-5xl w-[95vw] bg-plra-black border-white/10 p-0 overflow-hidden">
          <DialogTitle className="sr-only">{selected?.title || 'Gallery event'}</DialogTitle>
          {selected && allMedia.length > 0 && (
            <div className="flex flex-col">
              <div className="relative aspect-video bg-black flex items-center justify-center">
                {allMedia[mediaIndex].type === 'image' ? (
                  <Image
                    src={allMedia[mediaIndex].url}
                    alt={selected.title}
                    layout="fill"
                    objectFit="contain"
                    unoptimized
                  />
                ) : (
                  <video
                    src={allMedia[mediaIndex].url}
                    className="w-full h-full"
                    controls
                    autoPlay
                  />
                )}

                {allMedia.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={prevMedia}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 flex items-center justify-center text-white transition"
                      aria-label="Previous"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      type="button"
                      onClick={nextMedia}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 flex items-center justify-center text-white transition"
                      aria-label="Next"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={closeEvent}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 flex items-center justify-center text-white transition"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 bg-plra-black text-white">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-2xl font-black">{selected.title}</h3>
                  <span className="text-plra-gold text-xs font-black uppercase tracking-widest">
                    {safeFormatDate(selected.date)}
                  </span>
                </div>
                <p className="text-gray-400 text-sm font-semibold mb-4">
                  {mediaIndex + 1} of {allMedia.length}
                </p>

                {allMedia.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {allMedia.map((item, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setMediaIndex(i)}
                        className={cn(
                          'relative shrink-0 w-20 h-14 rounded-md overflow-hidden border-2 transition',
                          i === mediaIndex
                            ? 'border-plra-gold'
                            : 'border-transparent opacity-60 hover:opacity-100'
                        )}
                      >
                        {item.type === 'image' ? (
                          <Image
                            src={item.url}
                            alt={`thumb ${i + 1}`}
                            layout="fill"
                            objectFit="cover"
                            unoptimized
                          />
                        ) : (
                          <div className="absolute inset-0 bg-black flex items-center justify-center">
                            <video src={item.url} className="absolute inset-0 w-full h-full object-cover" muted />
                            <PlayCircle className="relative h-6 w-6 text-white drop-shadow-lg" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};
