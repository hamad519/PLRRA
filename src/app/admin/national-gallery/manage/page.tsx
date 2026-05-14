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
import { Edit, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { format, isValid } from 'date-fns';
import Link from 'next/link';
import { TableSkeleton } from '@/components/ui/TableSkeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface GalleryEvent {
  _id: string;
  title: string;
  date: string;
  mainImageBase64: string;
  galleryMedia?: { type: 'image' | 'video'; url: string }[];
}

function safeFormatDate(value?: string | null): string {
  if (!value) return '—';
  const d = new Date(value);
  return isValid(d) ? format(d, 'PPP') : '—';
}

export default function ManageNationalGalleryPage() {
  const [events, setEvents] = useState<GalleryEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/admin/national-gallery');
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        if (data.success) {
          setEvents(data.data);
        } else {
          setError(data.message || 'Failed to fetch gallery events');
          toast.error(data.message || 'Failed to fetch gallery events');
        }
      } catch (err: any) {
        setError(err.message);
        toast.error(`Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleDelete = async (eventId: string) => {
    try {
      const res = await fetch(`/api/admin/national-gallery/${eventId}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Failed to delete');
      toast.success('Gallery event deleted');
      setEvents((prev) => prev.filter((e) => e._id !== eventId));
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete event');
    }
  };

  return (
    <>
      <h1 className="text-4xl md:text-5xl font-extrabold text-admin-text-primary text-center mb-12">
        Manage National Gallery
      </h1>
      <p className="text-lg text-center text-admin-text-secondary mb-8">
        View and manage all national gallery events.
      </p>

      <div className="bg-admin-card-bg border border-admin-border rounded-xl shadow-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-admin-sidebar-bg hover:bg-admin-sidebar-bg">
              <TableHead className="text-white font-bold">Image</TableHead>
              <TableHead className="text-white font-bold">Title</TableHead>
              <TableHead className="text-white font-bold">Date</TableHead>
              <TableHead className="text-white font-bold">Media</TableHead>
              <TableHead className="text-white font-bold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableSkeleton columns={5} />
            ) : error ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-red-500 py-8">
                  Error: {error}
                </TableCell>
              </TableRow>
            ) : events.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-admin-text-secondary py-8">
                  No gallery events found.
                </TableCell>
              </TableRow>
            ) : (
              events.map((event) => {
                const media = Array.isArray(event.galleryMedia) ? event.galleryMedia : [];
                const imageCount = media.filter((m) => m.type === 'image').length;
                const videoCount = media.filter((m) => m.type === 'video').length;
                return (
                  <TableRow key={event._id} className="border-admin-border/50 hover:bg-admin-hover-bg">
                    <TableCell>
                      <Image
                        src={event.mainImageBase64}
                        alt={event.title}
                        width={64}
                        height={40}
                        className="rounded-md object-cover"
                        unoptimized
                      />
                    </TableCell>
                    <TableCell className="font-medium text-admin-text-primary">{event.title}</TableCell>
                    <TableCell className="text-admin-text-primary">{safeFormatDate(event.date)}</TableCell>
                    <TableCell className="text-admin-text-primary text-sm">
                      {imageCount} image{imageCount === 1 ? '' : 's'}, {videoCount} video{videoCount === 1 ? '' : 's'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/national-gallery/${event._id}/edit`} passHref>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-admin-accent hover:bg-admin-hover-bg mr-2"
                        >
                          <Edit className="h-5 w-5" />
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:bg-destructive/20"
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete gallery event?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete <strong>{event.title}</strong> along with its main image and all media files.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(event._id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
