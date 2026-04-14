import React from 'react';
import { AddLatestNewsForm } from '@/components/forms/AddLatestNewsForm';
import { Reveal } from '@/components/animations/Reveal';

export default function AddLatestNewsPage() {
  return (
    <div className="space-y-10">
      <header>
        <Reveal direction="down">
          <h1 className="text-4xl font-black text-admin-text-primary tracking-tight">
            Add <span className="text-admin-accent">Latest News</span>
          </h1>
          <p className="text-admin-text-secondary font-medium mt-1">Add a news item to display in the scrolling ticker on the website.</p>
        </Reveal>
      </header>
      <AddLatestNewsForm />
    </div>
  );
}
