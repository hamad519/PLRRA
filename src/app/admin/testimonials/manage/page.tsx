"use client";

import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { MessageSquareQuote, Trash2, Star } from 'lucide-react';
import { TableSkeleton } from '@/components/ui/TableSkeleton';
import Link from 'next/link';

interface Testimonial {
  _id: number;
  name: string;
  designation: string;
  message: string;
  rating: number;
  isActive: boolean;
}

export default function ManageTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/testimonials');
      const data = await res.json();
      if (data.success) setItems(data.data);
    } catch {
      toast.error("Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this testimonial?")) return;
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success("Deleted");
        fetchData();
      }
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-black text-admin-text-primary">
          Manage <span className="text-admin-accent">Senior Members</span>
        </h1>
        <Link href="/admin/testimonials/add">
          <Button className="bg-admin-accent text-white font-bold rounded-xl px-6">+ Add Member</Button>
        </Link>
      </div>

      <div className="bg-admin-card-bg border border-admin-border rounded-xl shadow-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-admin-sidebar-bg hover:bg-admin-sidebar-bg">
              <TableHead className="text-white font-bold">Name</TableHead>
              <TableHead className="text-white font-bold">Message</TableHead>
              <TableHead className="text-white font-bold">Rating</TableHead>
              <TableHead className="text-white font-bold">Status</TableHead>
              <TableHead className="text-white font-bold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableSkeleton columns={5} />
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-admin-text-secondary">
                  No testimonials yet. Add one to get started.
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item._id} className="hover:bg-admin-hover-bg">
                  <TableCell className="font-bold text-admin-text-primary flex items-center gap-2">
                    <MessageSquareQuote size={16} className="text-admin-accent shrink-0" />
                    <div>
                      <p>{item.name}</p>
                      {item.designation && <p className="text-xs text-admin-text-secondary">{item.designation}</p>}
                    </div>
                  </TableCell>
                  <TableCell className="text-admin-text-secondary max-w-xs truncate">{item.message}</TableCell>
                  <TableCell>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={14} className={s <= item.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={item.isActive ? "bg-emerald-500/20 text-emerald-600 border-0 font-bold" : "bg-gray-200 text-gray-500 border-0 font-bold"}>
                      {item.isActive ? "Active" : "Hidden"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(item._id)} className="text-destructive" title="Delete">
                      <Trash2 size={18} />
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
