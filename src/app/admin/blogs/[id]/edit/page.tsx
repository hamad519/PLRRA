"use client";

import React, { useEffect, useState, use } from 'react';
import { BlogForm } from '@/components/forms/BlogForm';
import { Reveal } from '@/components/animations/Reveal';
import { toast } from 'sonner';

interface EditBlogPageProps {
  params: Promise<{ id: string }>;
}

export default function EditBlogPage({ params }: EditBlogPageProps) {
  const { id } = use(params);
  const [initialData, setInitialData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/admin/blogs/${id}`);
        const data = await res.json();
        if (res.ok && data.success) {
          setInitialData({ ...data.data, id: data.data.id });
        } else {
          toast.error(data.message || "Failed to load blog");
        }
      } catch {
        toast.error("Failed to load blog");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  return (
    <div className="space-y-10">
      <header>
        <Reveal direction="down">
          <h1 className="text-4xl font-black text-admin-text-primary tracking-tight">
            Edit <span className="text-admin-accent">Blog Article</span>
          </h1>
          <p className="text-admin-text-secondary font-medium mt-1">
            Update the article content, image, and visibility.
          </p>
        </Reveal>
      </header>
      {loading ? (
        <div className="max-w-4xl mx-auto bg-white border border-admin-border rounded-[2rem] p-8 animate-pulse">
          <div className="h-8 bg-admin-bg rounded w-1/3 mb-6" />
          <div className="space-y-4">
            <div className="h-12 bg-admin-bg rounded-xl" />
            <div className="h-12 bg-admin-bg rounded-xl" />
            <div className="h-40 bg-admin-bg rounded-xl" />
            <div className="h-24 bg-admin-bg rounded-xl" />
            <div className="h-80 bg-admin-bg rounded-xl" />
          </div>
        </div>
      ) : initialData ? (
        <BlogForm mode="edit" initialData={initialData} />
      ) : (
        <p className="text-center text-admin-text-secondary py-20">Blog not found.</p>
      )}
    </div>
  );
}
