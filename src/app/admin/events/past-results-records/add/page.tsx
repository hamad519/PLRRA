import React from 'react';
import { AddPastResultRecordForm } from '@/components/forms/AddPastResultRecordForm';

export default function AddPastResultRecordPage() {
  return (
    <>
      <h1 className="text-4xl md:text-5xl font-extrabold text-admin-text-primary text-center mb-12">
        Add New Past Result / Record
      </h1>
      <p className="text-lg text-center text-admin-text-secondary mb-8">
        Fill out the form below to add a new past competition result or national record.
      </p>
      <AddPastResultRecordForm />
    </>
  );
}