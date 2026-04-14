"use client";

import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Newspaper, Trash2, Pencil } from 'lucide-react';
import { format } from 'date-fns';
import { TableSkeleton } from '@/components/ui/TableSkeleton';
import Link from 'next/link';

interface LatestNewsItem {
  _id: string;
  title: string;
  date: string;
  isActive: boolean;
}

export default function ManageLatestNewsPage() {
  const [newsItems, setNewsItems] = useState<LatestNewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/latest-news');
      const data = await res.json();
      if (data.success) setNewsItems(data.data);
    } catch {
      toast.error("Failed to load news items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNews(); }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this news item?")) return;
    try {
      const res = await fetch(`/api/admin/latest-news/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success("Deleted successfully");
        fetchNews();
      } else {
        toast.error("Failed to delete");
      }
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-black text-admin-text-primary">
          Manage <span className="text-admin-accent">Latest News</span>
        </h1>
        <Link href="/admin/latest-news/add">
          <Button className="bg-admin-accent text-white font-bold rounded-xl px-6">
            + Add News
          </Button>
        </Link>
      </div>

      <div className="bg-admin-card-bg border border-admin-border rounded-xl shadow-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-admin-sidebar-bg hover:bg-admin-sidebar-bg">
              <TableHead className="text-white font-bold">News Text</TableHead>
              <TableHead className="text-white font-bold">Date</TableHead>
              <TableHead className="text-white font-bold">Status</TableHead>
              <TableHead className="text-white font-bold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableSkeleton columns={4} />
            ) : newsItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-admin-text-secondary">
                  No news items found. Add one to get started.
                </TableCell>
              </TableRow>
            ) : (
              newsItems.map((item) => (
                <TableRow key={item._id} className="hover:bg-admin-hover-bg">
                  <TableCell className="font-bold text-admin-text-primary flex items-center gap-2 max-w-md">
                    <Newspaper size={16} className="text-admin-accent shrink-0" />
                    <span className="truncate">{item.title}</span>
                  </TableCell>
                  <TableCell className="text-admin-text-secondary">
                    {format(new Date(item.date), 'PPP')}
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.isActive ? "default" : "secondary"} className={item.isActive ? "bg-emerald-500/20 text-emerald-600 border-0 font-bold" : "bg-gray-200 text-gray-500 border-0 font-bold"}>
                      {item.isActive ? "Active" : "Hidden"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Link href={`/admin/latest-news/${item._id}/edit`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-admin-accent hover:bg-admin-accent/10"
                        title="Edit"
                      >
                        <Pencil size={18} />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(item._id)}
                      className="text-destructive"
                      title="Delete"
                    >
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
