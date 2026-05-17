"use client";

import React, { useEffect, useState } from 'react';
import { CalendarDays, MapPin, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/animations/Reveal';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

interface Event {
  _id: string;
  title: string;
  fromDate?: string;
  toDate?: string;
  date?: string;
  location: string;
  mainImageBase64: string;
  description?: string;
}

function formatEventDate(event: Event): string {
  const from = event.fromDate || event.date;
  const to = event.toDate || event.date;
  if (!from) return '';
  const fromStr = new Date(from).toLocaleDateString();
  if (!to || to === from) return fromStr;
  return `${fromStr} – ${new Date(to).toLocaleDateString()}`;
}

export const UpcomingEventsContentSection = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/admin/events');
        const data = await res.json();
        if (data.success) setEvents(data.data);
      } catch (e) {
        console.error("Failed to load events");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <section className="bg-white py-24 px-4 md:px-8">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2].map((i) => (
            <Card key={i} className="bg-plra-bg-soft border-none rounded-[2.5rem] overflow-hidden h-[400px]">
              <div className="p-10 space-y-6">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-10 w-3/4" />
                <div className="space-y-4 pt-8">
                  <Skeleton className="h-12 w-full rounded-2xl" />
                  <Skeleton className="h-12 w-full rounded-2xl" />
                </div>
                <Skeleton className="h-16 w-full rounded-2xl mt-8" />
              </div>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-24 px-4 md:px-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {events.map((event, index) => (
            <Reveal key={event._id} delay={index * 0.1} direction="up">
              <Card className="bg-plra-bg-soft border-none shadow-sm hover:shadow-2xl transition-all duration-500 rounded-[2.5rem] overflow-hidden group h-full flex flex-col">
                <CardHeader className="p-10 pb-6">
                  <div className="inline-block px-4 py-1 rounded-full text-white text-[10px] font-black uppercase tracking-widest mb-6 bg-plra-gold">
                    Upcoming
                  </div>
                  <CardTitle className="text-3xl font-black text-plra-black group-hover:text-plra-accent-purple transition-colors leading-tight">
                    {event.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-10 pt-0 flex-grow flex flex-col justify-between">
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center text-gray-600 font-bold">
                      <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mr-4 text-plra-accent-purple">
                        <CalendarDays size={24} />
                      </div>
                      <span className="text-lg">{formatEventDate(event)}</span>
                    </div>
                    <div className="flex items-center text-gray-600 font-bold">
                      <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mr-4 text-plra-accent-pink">
                        <MapPin size={24} />
                      </div>
                      <span className="text-lg">{event.location}</span>
                    </div>
                  </div>
                  <Link href={`/events/upcoming/${event._id}`} passHref>
                    <Button className="w-full bg-white hover:bg-plra-black hover:text-white text-plra-black font-black py-8 rounded-2xl transition-all border-none shadow-sm group/btn">
                      Register Now <ArrowRight className="ml-2 group-hover/btn:translate-x-1 transition-transform" size={20} />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};