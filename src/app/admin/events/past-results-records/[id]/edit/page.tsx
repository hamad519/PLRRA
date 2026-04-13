"use client";

import React from 'react';
import { EditPastResultRecordForm } from '@/components/forms/EditPastResultRecordForm';

interface EditPastResultRecordPageProps {
  params: {
    id: string;
  };
}

export default function EditPastResultRecordPage({ params }: EditPastResultRecordPageProps) {
  const { id } = params;

  return (
    <>
      <h1 className="text-4xl md:text-5xl font-extrabold text-admin-text-primary text-center mb-12">
        Edit Past Result / Record
      </h1>
      <p className="text-lg text-center text-admin-text-secondary mb-8">
        Modify the details of this past competition result or national record.
      </p>
      <EditPastResultRecordForm recordId={id} />
    </>
  );
}