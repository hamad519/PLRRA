"use client";

import React, { useEffect, useCallback } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Reveal } from '@/components/animations/Reveal';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { HeroSkeleton } from '@/components/ui/PageSkeletons';

const FALLBACK_SLIDES = [
  {
    imageBase64: "/hero_sec_img.png",
    title: "PAKISTAN LONG <span class='text-transparent bg-clip-text bg-gradient-to-r from-plra-accent-purple to-plra-accent-pink'>RANGE RIFLE ASSOCIATION</span>",
    subtitle: "Precision. Discipline. Excellence.",
    description: "The national governing body for Full-bore rifle shooting in Pakistan, dedicated to fostering world-class marksmanship and international representation.",
  },
  {
    imageBase64: "/1.jpeg",
    title: "WORLD CLASS <span class='text-transparent bg-clip-text bg-gradient-to-r from-plra-accent-purple to-plra-accent-pink'>MARKSMANSHIP</span>",
    subtitle: "Representing Pakistan Globally",
    description: "Join our elite teams as we compete on the international stage, showcasing the skill and precision of Pakistani shooters to the world.",
  }
];

export const HeroCarouselSection = () => {
  const { settings, loading } = useSiteSettings();
  const slides = settings?.heroSlides?.length ? settings.heroSlides : FALLBACK_SLIDES;

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    duration: 30,
    skipSnaps: false
  }, [Autoplay({ delay: 7000, stopOnInteraction: false })]);

  useEffect(() => {
    if (emblaApi) emblaApi.reInit();
  }, [emblaApi, slides]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  if (loading) return <HeroSkeleton />;
  if (slides.length === 0) return <div className="h-[85vh] bg-slate-950" />;

  return (
    <section className="relative h-[85vh] md:h-[90vh] w-full bg-slate-950 overflow-hidden">
      <div className="h-full w-full overflow-hidden" ref={emblaRef}>
        <div className="flex h-full">
          {slides.map((slide, index) => (
            <div key={index} className="relative flex-[0_0_100%] min-w-0 h-full">
              <Image
                src={slide.imageBase64}
                alt="Hero Slide"
                fill
                className="object-cover z-0 opacity-50"
                priority={index === 0}
                quality={100}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent z-10">
                <div className="container h-full flex flex-col justify-center px-8 md:px-16 mx-auto">
                  <div className="max-w-4xl">
                    <Reveal direction="down">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="h-[2px] w-16 bg-plra-gold"></div>
                        <span className="text-plra-gold text-xs md:text-sm font-black tracking-[0.5em] uppercase">
                          {slide.subtitle}
                        </span>
                      </div>
                    </Reveal>
                    <Reveal delay={0.3}>
                      <h1 
                        className="text-white text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8 drop-shadow-2xl uppercase"
                        dangerouslySetInnerHTML={{ __html: slide.title }}
                      />
                    </Reveal>
                    <Reveal delay={0.5}>
                      <p className="text-gray-300 text-lg md:text-xl mb-12 leading-relaxed max-w-2xl font-medium">
                        {slide.description}
                      </p>
                    </Reveal>
                    <Reveal delay={0.7}>
                      <div className="flex flex-wrap gap-6">
                        <Link href="/join-now" passHref>
                          <Button className="bg-white text-slate-950 hover:bg-plra-gold hover:text-slate-950 transition-all duration-500 font-black px-10 py-8 rounded-2xl text-sm uppercase tracking-widest shadow-2xl">
                            Get Started
                          </Button>
                        </Link>
                        <Link href="/who-we-are" passHref>
                          <Button variant="outline" className="border-white/20 text-black hover:bg-white/10 px-10 py-8 rounded-2xl text-sm font-black uppercase tracking-widest backdrop-blur-md transition-all">
                            Our Story
                          </Button>
                        </Link>
                      </div>
                    </Reveal>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {slides.length > 1 && (
        <div className="absolute bottom-12 right-12 z-30 flex gap-4">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={scrollPrev} 
            className="w-14 h-14 rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white hover:text-slate-950 backdrop-blur-xl transition-all"
          >
            <ChevronLeft size={24} />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={scrollNext} 
            className="w-14 h-14 rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white hover:text-slate-950 backdrop-blur-xl transition-all"
          >
            <ChevronRight size={24} />
          </Button>
        </div>
      )}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-950 to-transparent z-20"></div>
    </section>
  );
};