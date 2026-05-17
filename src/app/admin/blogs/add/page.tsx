import React from 'react';
import { BlogForm } from '@/components/forms/BlogForm';
import { Reveal } from '@/components/animations/Reveal';

export default function AddBlogPage() {
  return (
    <div className="space-y-10">
      <header>
        <Reveal direction="down">
          <h1 className="text-4xl font-black text-admin-text-primary tracking-tight">
            Add <span className="text-admin-accent">Blog Article</span>
          </h1>
          <p className="text-admin-text-secondary font-medium mt-1">
            Publish a new article to the public Blogs &amp; News page.
          </p>
        </Reveal>
      </header>
      <BlogForm mode="add" />
    </div>
  );
}
