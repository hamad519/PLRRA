import React from 'react';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { CalendarDays, MapPin, Info } from 'lucide-react';
import { Reveal } from '@/components/animations/Reveal';
import { EventRegistrationForm } from '@/components/forms/EventRegistrationForm';

interface EventPageProps {
  params: Promise<{ id: string }>;
}

export default async function EventDetailPage({ params }: EventPageProps) {
  const { id } = await params;

  let event;
  try {
    event = await prisma.event.findUnique({ where: { id } });
  } catch (e) {
    return notFound();
  }

  if (!event) return notFound();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[50vh] md:h-[60vh] w-full bg-slate-950 overflow-hidden flex items-center">
        <Image
          src={event.mainImageBase64}
          alt={event.title}
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
                <span className="text-plra-gold text-xs font-black tracking-[0.4em] uppercase">Event Registration</span>
              </div>
            </Reveal>
            <Reveal delay={0.3}>
              <h1 className="text-white text-4xl md:text-7xl font-black tracking-tighter leading-tight mb-6 uppercase">
                {event.title}
              </h1>
            </Reveal>
            <Reveal delay={0.5}>
              <div className="flex flex-wrap gap-8 text-gray-300">
                <div className="flex items-center gap-3">
                  <CalendarDays className="text-plra-gold" size={24} />
                  <span className="text-lg font-bold">{new Date(event.date).toLocaleDateString('en-US', { dateStyle: 'long' })}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="text-plra-accent-pink" size={24} />
                  <span className="text-lg font-bold">{event.location}</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Content & Form */}
      <div className="container mx-auto py-24 px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-4">
            <Reveal direction="right">
              <div className="bg-plra-bg-soft p-10 rounded-[2.5rem] border border-gray-100 sticky top-32">
                <div className="w-14 h-14 rounded-2xl bg-plra-accent-purple/10 flex items-center justify-center text-plra-accent-purple mb-8">
                  <Info size={28} />
                </div>
                <h2 className="text-2xl font-black text-plra-black mb-6">Event Details</h2>
                <p className="text-gray-600 leading-relaxed mb-8">
                  {event.description || "Join us for this prestigious long-range shooting event. Please fill out the registration form to confirm your participation."}
                </p>
                <div className="pt-8 border-t border-gray-200">
                  <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Registration Status</p>
                  <div className="flex items-center gap-2 text-emerald-500 font-bold">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    Open Now
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
          <div className="lg:col-span-8">
            <EventRegistrationForm eventId={event.id} eventTitle={event.title} />
          </div>
        </div>
      </div>
    </div>
  );
}