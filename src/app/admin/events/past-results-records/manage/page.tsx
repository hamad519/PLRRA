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
import { Trophy, Edit, Trash2, FileText } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

interface MatchResult {
  name: string;
  pdfBase64: string;
  details?: string;
}

interface PastResultRecord {
  _id: string;
  title: string;
  date: string;
  location: string;
  matches: MatchResult[];
}

export default function ManagePastResultsRecordsPage() {
  const [records, setRecords] = useState<PastResultRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/past-results-records');
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      if (data.success) {
        setRecords(data.data);
      } else {
        setError(data.message || 'Failed to fetch past results/records');
        toast.error(data.message || 'Failed to fetch past results/records');
      }
    } catch (err: any) {
      setError(err.message);
      toast.error(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleDelete = async (recordId: string) => {
    if (!window.confirm('Are you sure you want to delete this past result/record?')) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/past-results-records/${recordId}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Past result/record deleted successfully!");
        fetchRecords(); // Re-fetch records to update the list
      } else {
        toast.error(data.message || 'Failed to delete past result/record.');
      }
    } catch (error: any) {
      console.error('Delete past result/record error:', error);
      toast.error('Network error or server unreachable.');
    }
  };

  if (loading) {
    return (
      <div className="text-center text-admin-text-primary text-xl">Loading past results & records...</div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 text-xl">Error: {error}</div>
    );
  }

  return (
    <>
      <h1 className="text-4xl md:text-5xl font-extrabold text-admin-text-primary text-center mb-12">
        Manage Past Results & Records
      </h1>
      <p className="text-lg text-center text-admin-text-secondary mb-8">
        View and manage all past competition results and national records.
      </p>

      <div className="bg-admin-card-bg border border-admin-border rounded-xl shadow-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-admin-sidebar-bg hover:bg-admin-sidebar-bg">
              <TableHead className="text-admin-text-primary">Title</TableHead>
              <TableHead className="text-admin-text-primary">Date</TableHead>
              <TableHead className="text-admin-text-primary">Location</TableHead>
              <TableHead className="text-admin-text-primary">Matches</TableHead>
              <TableHead className="text-admin-text-primary text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-admin-text-secondary py-8">
                  No past results or records found.
                </TableCell>
              </TableRow>
            ) : (
              records.map((record) => (
                <TableRow key={record._id} className="border-admin-border/50 hover:bg-admin-hover-bg">
                  <TableCell className="font-medium text-admin-text-primary">{record.title}</TableCell>
                  <TableCell className="text-admin-text-primary">{format(new Date(record.date), 'PPP')}</TableCell>
                  <TableCell className="text-admin-text-primary">{record.location}</TableCell>
                  <TableCell className="text-admin-text-primary">
                    <ul className="list-disc pl-4">
                      {record.matches.map((match, index) => (
                        <li key={index} className="text-sm">
                          {match.name}
                          {match.pdfBase64 && (
                            <a href={match.pdfBase64} target="_blank" rel="noopener noreferrer" className="ml-2 text-admin-accent hover:underline">
                              <FileText className="inline-block h-4 w-4" />
                            </a>
                          )}
                        </li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/events/past-results-records/${record._id}/edit`} passHref>
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
                      onClick={() => handleDelete(record._id)}
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