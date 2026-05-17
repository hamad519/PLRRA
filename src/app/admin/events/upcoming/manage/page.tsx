"use client";

import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CalendarDays, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

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

function eventDateLabel(e: Event): string {
  const from = e.fromDate || e.date;
  const to = e.toDate || e.date;
  if (!from) return '—';
  const fromStr = format(new Date(from), 'PPP');
  if (!to || +new Date(to) === +new Date(from)) return fromStr;
  return `${fromStr} – ${format(new Date(to), 'PPP')}`;
}

export default function ManageUpcomingEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/events');
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      if (data.success) {
        setEvents(data.data);
      } else {
        setError(data.message || 'Failed to fetch events');
        toast.error(data.message || 'Failed to fetch events');
      }
    } catch (err: any) {
      setError(err.message);
      toast.error(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (eventId: string) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/events/${eventId}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Event deleted successfully!");
        fetchEvents(); // Re-fetch events to update the list
      } else {
        toast.error(data.message || 'Failed to delete event.');
      }
    } catch (error: any) {
      console.error('Delete event error:', error);
      toast.error('Network error or server unreachable.');
    }
  };

  if (loading) {
    return (
      <div className="text-center text-admin-text-primary text-xl">Loading events...</div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 text-xl">Error: {error}</div>
    );
  }

  return (
    <>
      <h1 className="text-4xl md:text-5xl font-extrabold text-admin-text-primary text-center mb-4">
        Manage Upcoming Events
      </h1>
      <p className="text-lg text-center text-admin-text-secondary mb-8">
        View and manage all upcoming event entries.
      </p>
      <div className="flex justify-end mb-6">
        <Link href="/admin/events/upcoming/add">
          <Button className="bg-admin-accent text-white font-bold rounded-xl px-6">+ Add Event</Button>
        </Link>
      </div>

      <div className="bg-admin-card-bg border border-admin-border rounded-xl shadow-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-admin-sidebar-bg hover:bg-admin-sidebar-bg">
              <TableHead className="text-admin-text-primary">Title</TableHead>
              <TableHead className="text-admin-text-primary">Date</TableHead>
              <TableHead className="text-admin-text-primary">Location</TableHead>
              <TableHead className="text-admin-text-primary text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-admin-text-secondary py-8">
                  No upcoming events found.
                </TableCell>
              </TableRow>
            ) : (
              events.map((event) => (
                <TableRow key={event._id} className="border-admin-border/50 hover:bg-admin-hover-bg">
                  <TableCell className="font-medium text-admin-text-primary">{event.title}</TableCell>
                  <TableCell className="text-admin-text-primary">{eventDateLabel(event)}</TableCell>
                  <TableCell className="text-admin-text-primary">{event.location}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/events/upcoming/${event._id}/edit`} passHref>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-admin-accent hover:bg-admin-hover-bg mr-2"
                      >
                        <Edit className="h-5 w-5" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(event._id)}
                      className="text-destructive hover:bg-destructive/20"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}