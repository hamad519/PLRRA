import React from 'react';
import { SiteContentForm } from '@/components/forms/SiteContentForm';
import { Reveal } from '@/components/animations/Reveal';

export default function AdminContentPage() {
  return (
    <div className="space-y-10">
      <header>
        <Reveal direction="down">
          <h1 className="text-4xl font-black text-admin-text-primary tracking-tight">
            Site <span className="text-admin-accent">Content</span>
          </h1>
          <p className="text-admin-text-secondary font-medium mt-1">
            Manage homepage text, statistics, hero slides, and champion moments.
          </p>
        </Reveal>
      </header>

      <SiteContentForm />
    </div>
  );
}