"use client";

import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Users, Trash2 } from 'lucide-react';
import { TableSkeleton } from '@/components/ui/TableSkeleton';
import Link from 'next/link';

interface Contributor { _id: number; name: string; role: string; contributions: string[]; sortOrder: number; }

export default function ManageContributorsPage() {
  const [items, setItems] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/contributors');
      const data = await res.json();
      if (data.success) setItems(data.data);
    } catch { toast.error("Failed to load"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this contributor?")) return;
    try {
      const res = await fetch(`/api/admin/contributors/${id}`, { method: 'DELETE' });
      if (res.ok) { toast.success("Deleted"); fetchData(); }
    } catch { toast.error("Failed to delete"); }
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-black text-admin-text-primary">Manage <span className="text-admin-accent">Contributors</span></h1>
        <Link href="/admin/contributors/add">
          <Button className="bg-admin-accent text-white font-bold rounded-xl px-6">+ Add Contributor</Button>
        </Link>
      </div>
      <div className="bg-admin-card-bg border border-admin-border rounded-xl shadow-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-admin-sidebar-bg hover:bg-admin-sidebar-bg">
              <TableHead className="text-white font-bold">Name</TableHead>
              <TableHead className="text-white font-bold">Role</TableHead>
              <TableHead className="text-white font-bold">Contributions</TableHead>
              <TableHead className="text-white font-bold">Order</TableHead>
              <TableHead className="text-white font-bold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? <TableSkeleton columns={5} /> : items.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-10 text-admin-text-secondary">No contributors yet.</TableCell></TableRow>
            ) : items.map((item) => (
              <TableRow key={item._id} className="hover:bg-admin-hover-bg">
                <TableCell className="font-bold text-admin-text-primary flex items-center gap-2">
                  <Users size={16} className="text-admin-accent shrink-0" /> {item.name}
                </TableCell>
                <TableCell className="text-admin-text-secondary text-sm">{item.role}</TableCell>
                <TableCell className="text-admin-text-secondary text-sm">{(item.contributions as string[]).length} points</TableCell>
                <TableCell className="text-admin-text-secondary">{item.sortOrder}</TableCell>
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
