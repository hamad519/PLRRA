"use client";

import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Pencil, Trash2 } from 'lucide-react';
import { TableSkeleton } from '@/components/ui/TableSkeleton';
import Link from 'next/link';

interface Bullet { text: string; children?: string[] }
interface HistoryItem {
  _id: number;
  year: string;
  title: string;
  intro: string;
  iconName: string;
  bullets: Bullet[];
  sortOrder: number;
}

export default function ManageHistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/history');
      const data = await res.json();
      if (data.success) setItems(data.data);
    } catch {
      toast.error('Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this history section?')) return;
    try {
      const res = await fetch(`/api/admin/history/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Deleted');
        fetchData();
      }
    } catch {
      toast.error('Failed to delete');
    }
  };

  const summarize = (bullets: Bullet[] | undefined) => {
    if (!Array.isArray(bullets) || bullets.length === 0) return '0 bullets';
    const subTotal = bullets.reduce((acc, b) => acc + (Array.isArray(b.children) ? b.children.length : 0), 0);
    return subTotal > 0 ? `${bullets.length} bullets · ${subTotal} sub` : `${bullets.length} bullets`;
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-black text-admin-text-primary">
          Manage <span className="text-admin-accent">History</span>
        </h1>
        <Link href="/admin/history/add">
          <Button className="bg-admin-accent text-white font-bold rounded-xl px-6">+ Add Section</Button>
        </Link>
      </div>
      <div className="bg-admin-card-bg border border-admin-border rounded-xl shadow-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-admin-sidebar-bg hover:bg-admin-sidebar-bg">
              <TableHead className="text-white font-bold">Year</TableHead>
              <TableHead className="text-white font-bold">Title</TableHead>
              <TableHead className="text-white font-bold">Bullets</TableHead>
              <TableHead className="text-white font-bold">Order</TableHead>
              <TableHead className="text-white font-bold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableSkeleton columns={5} />
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-admin-text-secondary">
                  No history sections yet.
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item._id} className="hover:bg-admin-hover-bg">
                  <TableCell className="font-black text-admin-accent">{item.year || '—'}</TableCell>
                  <TableCell className="font-bold text-admin-text-primary">{item.title || '—'}</TableCell>
                  <TableCell className="text-admin-text-secondary text-sm">{summarize(item.bullets)}</TableCell>
                  <TableCell className="text-admin-text-secondary text-sm">{item.sortOrder}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Link href={`/admin/history/${item._id}/edit`}>
                        <Button variant="ghost" size="icon" className="text-admin-accent">
                          <Pencil size={18} />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(item._id)} className="text-destructive">
                        <Trash2 size={18} />
                      </Button>
                    </div>
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
