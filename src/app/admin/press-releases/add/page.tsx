import React from 'react';
import { AddPressReleaseForm } from '@/components/forms/AddPressReleaseForm';
import { Reveal } from '@/components/animations/Reveal';

export default function AddPressReleasePage() {
  return (
    <div className="space-y-10">
      <header>
        <Reveal direction="down">
          <h1 className="text-4xl font-black text-admin-text-primary tracking-tight">
            Add <span className="text-admin-accent">Press Release</span>
          </h1>
          <p className="text-admin-text-secondary font-medium mt-1">Upload official PDF documents for the public website.</p>
        </Reveal>
      </header>
      <AddPressReleaseForm />
    </div>
  );
}