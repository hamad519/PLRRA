import React from 'react';
import { AddNationalRecordForm } from '@/components/forms/AddNationalRecordForm';
import { Reveal } from '@/components/animations/Reveal';

export default function AddNationalRecordPage() {
  return (
    <div className="space-y-10">
      <header>
        <Reveal direction="down">
          <h1 className="text-4xl font-black text-admin-text-primary tracking-tight">
            Add <span className="text-admin-accent">National Record</span>
          </h1>
          <p className="text-admin-text-secondary font-medium mt-1">Upload rankings and award documents.</p>
        </Reveal>
      </header>
      <AddNationalRecordForm />
    </div>
  );
}