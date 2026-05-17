"use client";

import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Rss, Trash2, Pencil, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { TableSkeleton } from '@/components/ui/TableSkeleton';
import Link from 'next/link';
import Image from 'next/image';

interface BlogItem {
  _id: string;
  title: string;
  slug: string;
  date: string;
  imageBase64: string;
  shortDescription: string;
  isActive: boolean;
}

export default function ManageBlogsPage() {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/blogs');
      const data = await res.json();
      if (data.success) setBlogs(data.data);
    } catch {
      toast.error("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this blog article? This action cannot be undone.")) return;
    try {
      const res = await fetch(`/api/admin/blogs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success("Deleted successfully");
        fetchBlogs();
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
          Manage <span className="text-admin-accent">Blogs &amp; News</span>
        </h1>
        <Link href="/admin/blogs/add">
          <Button className="bg-admin-accent text-white font-bold rounded-xl px-6">
            + Add Blog
          </Button>
        </Link>
      </div>

      <div className="bg-admin-card-bg border border-admin-border rounded-xl shadow-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-admin-sidebar-bg hover:bg-admin-sidebar-bg">
              <TableHead className="text-white font-bold">Image</TableHead>
              <TableHead className="text-white font-bold">Title</TableHead>
              <TableHead className="text-white font-bold">Date</TableHead>
              <TableHead className="text-white font-bold">Status</TableHead>
              <TableHead className="text-white font-bold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableSkeleton columns={5} />
            ) : blogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-admin-text-secondary">
                  No blog articles yet. Click <span className="font-bold text-admin-accent">+ Add Blog</span> to publish your first article.
                </TableCell>
              </TableRow>
            ) : (
              blogs.map((blog) => (
                <TableRow key={blog._id} className="hover:bg-admin-hover-bg">
                  <TableCell>
                    <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-admin-bg">
                      {blog.imageBase64 ? (
                        <Image src={blog.imageBase64} alt={blog.title} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-admin-text-secondary">
                          <Rss size={16} />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-bold text-admin-text-primary max-w-md">
                    <div className="flex items-center gap-2">
                      <Rss size={14} className="text-admin-accent shrink-0" />
                      <span className="truncate">{blog.title}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-admin-text-secondary">
                    {format(new Date(blog.date), 'PPP')}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={blog.isActive ? "default" : "secondary"}
                      className={blog.isActive
                        ? "bg-emerald-500/20 text-emerald-600 border-0 font-bold"
                        : "bg-gray-200 text-gray-500 border-0 font-bold"}
                    >
                      {blog.isActive ? "Published" : "Hidden"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Link href={`/blogs-news/${blog.slug}`} target="_blank">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-blue-500 hover:bg-blue-500/10"
                        title="View on site"
                      >
                        <ExternalLink size={18} />
                      </Button>
                    </Link>
                    <Link href={`/admin/blogs/${blog._id}/edit`}>
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
                      onClick={() => handleDelete(blog._id)}
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
