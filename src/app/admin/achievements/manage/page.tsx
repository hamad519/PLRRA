"use client";

import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Trophy, Trash2 } from 'lucide-react';
import { TableSkeleton } from '@/components/ui/TableSkeleton';
import Link from 'next/link';

interface Achievement { _id: number; year: string; title: string; subtitle: string; details: string[]; sortOrder: number; }

export default function ManageAchievementsPage() {
  const [items, setItems] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/achievements');
      const data = await res.json();
      if (data.success) setItems(data.data);
    } catch { toast.error("Failed to load"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this achievement?")) return;
    try {
      const res = await fetch(`/api/admin/achievements/${id}`, { method: 'DELETE' });
      if (res.ok) { toast.success("Deleted"); fetchData(); }
    } catch { toast.error("Failed to delete"); }
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-black text-admin-text-primary">Manage <span className="text-admin-accent">Achievements</span></h1>
        <Link href="/admin/achievements/add">
          <Button className="bg-admin-accent text-white font-bold rounded-xl px-6">+ Add Achievement</Button>
        </Link>
      </div>
      <div className="bg-admin-card-bg border border-admin-border rounded-xl shadow-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-admin-sidebar-bg hover:bg-admin-sidebar-bg">
              <TableHead className="text-white font-bold">Year</TableHead>
              <TableHead className="text-white font-bold">Title</TableHead>
              <TableHead className="text-white font-bold">Subtitle</TableHead>
              <TableHead className="text-white font-bold">Details</TableHead>
              <TableHead className="text-white font-bold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? <TableSkeleton columns={5} /> : items.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-10 text-admin-text-secondary">No achievements yet.</TableCell></TableRow>
            ) : items.map((item) => (
              <TableRow key={item._id} className="hover:bg-admin-hover-bg">
                <TableCell className="font-black text-admin-accent">{item.year}</TableCell>
                <TableCell className="font-bold text-admin-text-primary">{item.title}</TableCell>
                <TableCell className="text-admin-text-secondary text-sm">{item.subtitle}</TableCell>
                <TableCell className="text-admin-text-secondary text-sm">{(item.details as string[]).length} points</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(item._id)} className="text-destructive"><Trash2 size={18} /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
