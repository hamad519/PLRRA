"use client";

import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, CalendarDays, MapPin, Images, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type MediaItem = { type: 'image' | 'video'; url: string };

interface Competition {
  _id: string;
  title: string;
  fromDate: string;
  toDate: string;
  date?: string;
  location: string;
  mainImageBase64: string;
  galleryImagesBase64?: string[];
  galleryMedia?: MediaItem[];
  description?: string;
}

interface Props {
  competition: Competition | null;
  dateLabel: string;
  onClose: () => void;
}

export const CompetitionGalleryModal = ({ competition, dateLabel, onClose }: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // All media: main image first, then legacy gallery images, then mixed media
  const media: MediaItem[] = competition
    ? [
        { type: 'image' as const, url: competition.mainImageBase64 },
        ...((competition.galleryImagesBase64 ?? [])
          .filter((u): u is string => typeof u === 'string' && u.length > 0)
          .map((u) => ({ type: 'image' as const, url: u }))),
        ...((competition.galleryMedia ?? []).filter(
          (m): m is MediaItem =>
            !!m && (m.type === 'image' || m.type === 'video') && typeof m.url === 'string'
        )),
      ].filter((m) => m.url)
    : [];

  const prev = useCallback(() => {
    setActiveIndex((i) => (i === 0 ? media.length - 1 : i - 1));
  }, [media.length]);

  const next = useCallback(() => {
    setActiveIndex((i) => (i === media.length - 1 ? 0 : i + 1));
  }, [media.length]);

  // Keyboard navigation + close on Escape
  useEffect(() => {
    if (!competition) return;
    setActiveIndex(0);

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [competition, onClose, prev, next]);

  if (!competition) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-5xl max-h-[92vh] bg-slate-950 rounded-3xl overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.7)] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-white/10 shrink-0">
          <div className="pr-8">
            <h2 className="text-xl md:text-2xl font-black text-white leading-tight">{competition.title}</h2>
            <div className="flex flex-wrap gap-4 mt-2">
              <span className="flex items-center text-sm text-gray-400 font-semibold">
                <CalendarDays size={14} className="mr-1.5 text-plra-gold" />
                {dateLabel}
              </span>
              <span className="flex items-center text-sm text-gray-400 font-semibold">
                <MapPin size={14} className="mr-1.5 text-plra-accent-pink" />
                {competition.location}
              </span>
              <span className="flex items-center text-sm text-plra-gold font-bold">
                <Images size={14} className="mr-1.5" />
                {media.length} item{media.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="shrink-0 rounded-xl text-gray-400 hover:text-white hover:bg-white/10"
          >
            <X size={22} />
          </Button>
        </div>

        {/* Main media viewer */}
        <div className="relative flex-1 min-h-0 bg-black/40 flex items-center justify-center" style={{ minHeight: '340px' }}>
          {media[activeIndex] && media[activeIndex].type === 'image' && (
            <Image
              key={activeIndex}
              src={media[activeIndex].url}
              alt={`${competition.title} — item ${activeIndex + 1}`}
              fill
              style={{ objectFit: 'contain' }}
              quality={90}
              className="select-none"
              unoptimized
            />
          )}
          {media[activeIndex] && media[activeIndex].type === 'video' && (
            <video
              key={activeIndex}
              src={media[activeIndex].url}
              className="max-w-full max-h-full"
              controls
              autoPlay
            />
          )}

          {/* Prev / Next */}
          {media.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all backdrop-blur-sm"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all backdrop-blur-sm"
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}

          {/* Counter */}
          {media.length > 1 && (
            <div className="absolute bottom-3 right-4 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full">
              {activeIndex + 1} / {media.length}
            </div>
          )}
        </div>

        {/* Thumbnail strip */}
        {media.length > 1 && (
          <div className="flex gap-2 p-4 overflow-x-auto shrink-0 border-t border-white/10 custom-scrollbar">
            {media.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={cn(
                  "relative shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all bg-black",
                  idx === activeIndex
                    ? "border-plra-gold scale-105 shadow-[0_0_12px_rgba(245,158,11,0.5)]"
                    : "border-transparent opacity-60 hover:opacity-100"
                )}
              >
                {item.type === 'image' ? (
                  <Image src={item.url} alt={`thumb ${idx + 1}`} fill style={{ objectFit: 'cover' }} unoptimized />
                ) : (
                  <>
                    <video src={item.url} className="absolute inset-0 w-full h-full object-cover" muted />
                    <span className="absolute inset-0 flex items-center justify-center text-white">
                      <PlayCircle size={18} />
                    </span>
                  </>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
