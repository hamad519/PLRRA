"use client";

import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Trash2, Mail, Clock } from 'lucide-react';
import { TableSkeleton } from '@/components/ui/TableSkeleton';

interface ContactSubmission {
  _id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export default function ContactSubmissionsPage() {
  const [items, setItems] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/contact-submissions');
      const data = await res.json();
      if (data.success) setItems(data.data);
    } catch {
      toast.error("Failed to load contact submissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this submission?")) return;
    try {
      const res = await fetch(`/api/admin/contact-submissions/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success("Deleted");
        fetchData();
      }
    } catch {
      toast.error("Failed to delete");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-black text-admin-text-primary">
          Contact <span className="text-admin-accent">Submissions</span>
        </h1>
        <div className="bg-admin-accent/20 px-4 py-2 rounded-lg">
          <p className="text-admin-accent font-bold">{items.length} Total</p>
        </div>
      </div>

      <div className="bg-admin-card-bg border border-admin-border rounded-xl shadow-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-admin-sidebar-bg hover:bg-admin-sidebar-bg">
              <TableHead className="text-white font-bold">Name</TableHead>
              <TableHead className="text-white font-bold">Email</TableHead>
              <TableHead className="text-white font-bold">Subject</TableHead>
              <TableHead className="text-white font-bold">Message</TableHead>
              <TableHead className="text-white font-bold">Date</TableHead>
              <TableHead className="text-white font-bold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableSkeleton columns={6} />
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-admin-text-secondary">
                  No contact submissions yet.
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item._id} className="hover:bg-admin-hover-bg">
                  <TableCell className="font-bold text-admin-text-primary">
                    {item.name}
                  </TableCell>
                  <TableCell className="text-admin-text-secondary flex items-center gap-2">
                    <Mail size={16} className="text-admin-accent shrink-0" />
                    <a href={`mailto:${item.email}`} className="hover:text-admin-accent transition-colors">
                      {item.email}
                    </a>
                  </TableCell>
                  <TableCell className="text-admin-text-secondary max-w-xs truncate">
                    {item.subject}
                  </TableCell>
                  <TableCell className="text-admin-text-secondary max-w-md truncate">
                    {item.message}
                  </TableCell>
                  <TableCell className="text-admin-text-secondary text-sm flex items-center gap-2">
                    <Clock size={14} className="text-admin-accent shrink-0" />
                    {formatDate(item.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(item._id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}