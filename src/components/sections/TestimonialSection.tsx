"use client";

import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { cn } from '@/lib/utils';
import { Reveal } from '@/components/animations/Reveal';
import { Skeleton } from '@/components/ui/skeleton';

interface Testimonial {
  id: number;
  name: string;
  designation: string;
  message: string;
  imageUrl: string | null;
  rating: number;
}

export const TestimonialSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'center', containScroll: false },
    [Autoplay({ delay: 6000, stopOnInteraction: true })]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch('/api/testimonials');
        const data = await res.json();
        if (data.success) setTestimonials(data.data);
      } catch {
        // silently fall through
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (emblaApi && testimonials.length > 0) emblaApi.reInit();
  }, [emblaApi, testimonials]);

  if (loading) {
    return (
      <section className="py-24 px-4 md:px-8 bg-slate-950">
        <div className="container mx-auto max-w-4xl text-center space-y-8">
          <Skeleton className="h-4 w-40 mx-auto bg-white/10" />
          <Skeleton className="h-12 w-[50%] mx-auto bg-white/10" />
          <Skeleton className="h-32 w-full bg-white/10 rounded-3xl" />
          <Skeleton className="h-14 w-14 rounded-full mx-auto bg-white/10" />
          <Skeleton className="h-5 w-40 mx-auto bg-white/10" />
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) return null;

  return (
    <section className="py-24 px-4 md:px-8 bg-slate-950 overflow-hidden relative">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-plra-accent-purple/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <Reveal direction="down">
            <span className="text-plra-gold font-black uppercase tracking-widest text-sm mb-4 block">Our Leadership</span>
          </Reveal>
          <Reveal>
            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
              Words From Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-plra-accent-purple to-plra-accent-pink">Senior Members</span>
            </h2>
          </Reveal>
        </div>

        <div className="max-w-4xl mx-auto relative">
          {/* Nav arrows */}
          {testimonials.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={scrollPrev}
                className="absolute -left-4 md:-left-16 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10"
              >
                <ChevronLeft size={22} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={scrollNext}
                className="absolute -right-4 md:-right-16 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10"
              >
                <ChevronRight size={22} />
              </Button>
            </>
          )}

          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {testimonials.map((t, index) => (
                <div key={t.id} className="flex-none w-full px-4">
                  <div className={cn(
                    "text-center transition-all duration-500",
                    index === selectedIndex ? "opacity-100 scale-100" : "opacity-40 scale-95"
                  )}>
                    {/* Quote icon */}
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-plra-accent-purple to-plra-accent-pink flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(139,92,246,0.3)]">
                      <Quote size={28} className="text-white" />
                    </div>

                    {/* Message */}
                    <p className="text-white/90 text-lg md:text-xl leading-relaxed font-medium max-w-2xl mx-auto mb-8 italic">
                      &ldquo;{t.message}&rdquo;
                    </p>

                    {/* Stars */}
                    <div className="flex gap-1 justify-center mb-6">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={18} className={s <= t.rating ? "fill-plra-gold text-plra-gold" : "text-white/20"} />
                      ))}
                    </div>

                    {/* Avatar + name */}
                    <div className="flex flex-col items-center gap-3">
                      {t.imageUrl ? (
                        <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-plra-gold ring-offset-4 ring-offset-slate-950">
                          <Image src={t.imageUrl} alt={t.name} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-plra-accent-purple to-plra-accent-pink flex items-center justify-center text-white font-black text-xl ring-2 ring-plra-gold ring-offset-4 ring-offset-slate-950">
                          {t.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="text-white font-black text-lg">{t.name}</p>
                        {t.designation && (
                          <p className="text-plra-gold text-sm font-semibold">{t.designation}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots */}
          {testimonials.length > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => emblaApi?.scrollTo(index)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    index === selectedIndex ? "w-8 bg-plra-gold" : "w-2 bg-white/20"
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
