"use client";

import React, { useEffect, useState } from 'react';
import { CalendarDays, MapPin, ArrowRight, Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Reveal } from '@/components/animations/Reveal';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface Event {
  _id: string;
  title: string;
  date: string;
  location: string;
  mainImageBase64: string;
  description?: string;
}

export const UpcomingEventsSection = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/admin/events');
        const data = await res.json();
        if (data.success) {
          // Show only the 3 most recent upcoming events on the homepage
          setEvents(data.data.slice(0, 3));
        }
      } catch (e) {
        console.error("Failed to load events");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <section className="bg-plra-bg-soft py-24 px-4 md:px-8">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <Reveal direction="down">
              <span className="text-plra-accent-purple font-black uppercase tracking-widest text-sm mb-4 block">Don't Miss Out</span>
            </Reveal>
            <Reveal>
              <h2 className="text-4xl md:text-6xl font-black text-plra-black leading-tight">
                Upcoming <span className="text-transparent bg-clip-text bg-gradient-to-r from-plra-accent-purple to-plra-accent-pink">Events</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.3}>
            <Link href="/events/upcoming" passHref>
              <Button variant="outline" className="border-plra-black/10 bg-white hover:bg-plra-black hover:text-white px-8 py-6 rounded-xl font-bold flex items-center gap-2 group">
                View All Events <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            // Loading Skeletons
            [1, 2, 3].map((i) => (
              <div key={i} className="py-4">
                <Card className="bg-white border-none shadow-sm rounded-[2rem] h-[400px] p-8 space-y-6">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-10 w-3/4" />
                  <div className="space-y-4 pt-4">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                  <Skeleton className="h-14 w-full rounded-2xl mt-auto" />
                </Card>
              </div>
            ))
          ) : events.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-white rounded-[3rem] border border-dashed border-gray-200">
              <Trophy className="mx-auto text-gray-200 mb-4" size={48} />
              <p className="text-gray-400 font-bold">No upcoming events scheduled at the moment.</p>
            </div>
          ) : (
            events.map((event, index) => (
              <Reveal key={event._id} delay={index * 0.1} direction="up">
                <div className="py-4 h-full">
                  <Card className="bg-white border-none shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 rounded-[2rem] group h-full flex flex-col">
                    <CardHeader className="p-8 pb-0">
                      <div className="inline-block px-4 py-1 rounded-full text-white text-[10px] font-black uppercase tracking-widest mb-6 bg-plra-gold">
                        Upcoming
                      </div>
                      <CardTitle className="text-2xl font-black text-plra-black group-hover:text-plra-accent-purple transition-colors leading-tight">
                        {event.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 pt-6 space-y-6 flex-grow flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center text-gray-600 font-medium">
                          <div className="w-10 h-10 rounded-xl bg-plra-bg-soft flex items-center justify-center mr-4 text-plra-accent-purple">
                            <CalendarDays size={20} />
                          </div>
                          <span>{new Date(event.date).toLocaleDateString('en-US', { dateStyle: 'medium' })}</span>
                        </div>
                        <div className="flex items-center text-gray-600 font-medium">
                          <div className="w-10 h-10 rounded-xl bg-plra-bg-soft flex items-center justify-center mr-4 text-plra-accent-pink">
                            <MapPin size={20} />
                          </div>
                          <span className="truncate">{event.location}</span>
                        </div>
                      </div>
                      <Link href={`/events/upcoming/${event._id}`} passHref>
                        <Button className="w-full bg-plra-bg-soft hover:bg-plra-accent-purple hover:text-white text-plra-black font-bold py-6 rounded-2xl transition-all border-none mt-6">
                          Event Details
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              </Reveal>
            ))
          )}
        </div>
      </div>
    </section>
  );
};