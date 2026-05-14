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
import { Trophy, Edit, Trash2 } from 'lucide-react';
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

interface Competition {
  _id: string;
  title: string;
  fromDate: string;
  toDate: string;
  date?: string | null;
  location: string;
  mainImageBase64: string;
  galleryImagesBase64?: string[];
  description?: string;
}

function formatRange(from?: string | null, to?: string | null): string {
  const f = from ? new Date(from) : null;
  const t = to ? new Date(to) : null;
  const fOk = f && isValid(f);
  const tOk = t && isValid(t);
  if (fOk && tOk) {
    const sameDay = f!.toDateString() === t!.toDateString();
    return sameDay ? format(f!, 'PPP') : `${format(f!, 'PPP')} – ${format(t!, 'PPP')}`;
  }
  if (fOk) return format(f!, 'PPP');
  if (tOk) return format(t!, 'PPP');
  return '—';
}

export default function ManageCompetitionsPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const res = await fetch('/api/admin/competitions');
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        if (data.success) {
          setCompetitions(data.data);
        } else {
          setError(data.message || 'Failed to fetch competitions');
          toast.error(data.message || 'Failed to fetch competitions');
        }
      } catch (err: any) {
        setError(err.message);
        toast.error(`Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCompetitions();
  }, []);

  const handleDelete = async (competitionId: string) => {
    try {
      const res = await fetch(`/api/admin/competitions/${competitionId}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to delete');
      }
      toast.success('Competition deleted');
      setCompetitions((prev) => prev.filter((c) => c._id !== competitionId));
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete competition');
    }
  };

  return (
    <>
      <h1 className="text-4xl md:text-5xl font-extrabold text-admin-text-primary text-center mb-12">
        Manage Competitions
      </h1>
      <p className="text-lg text-center text-admin-text-secondary mb-8">
        View and manage all competition entries.
      </p>

      <div className="bg-admin-card-bg border border-admin-border rounded-xl shadow-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-admin-sidebar-bg hover:bg-admin-sidebar-bg">
              <TableHead className="text-white font-bold">Image</TableHead>
              <TableHead className="text-white font-bold">Title</TableHead>
              <TableHead className="text-white font-bold">Date</TableHead>
              <TableHead className="text-white font-bold">Location</TableHead>
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
            ) : competitions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-admin-text-secondary py-8">
                  No competitions found.
                </TableCell>
              </TableRow>
            ) : (
              competitions.map((competition) => (
                <TableRow key={competition._id} className="border-admin-border/50 hover:bg-admin-hover-bg">
                  <TableCell>
                    <Image
                      src={competition.mainImageBase64}
                      alt={competition.title}
                      width={64}
                      height={40}
                      className="rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium text-admin-text-primary">{competition.title}</TableCell>
                  <TableCell className="text-admin-text-primary">{formatRange(competition.fromDate, competition.toDate)}</TableCell>
                  <TableCell className="text-admin-text-primary">{competition.location}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/competitions/${competition._id}/edit`} passHref>
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
                          <AlertDialogTitle>Delete competition?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete <strong>{competition.title}</strong> along with its main image and gallery files.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(competition._id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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