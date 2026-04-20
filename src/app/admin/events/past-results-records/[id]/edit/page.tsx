"use client";

import React, { use } from 'react';
import { EditPastResultRecordForm } from '@/components/forms/EditPastResultRecordForm';

interface EditPastResultRecordPageProps {
  params: Promise<{ id: string }>;
}

export default function EditPastResultRecordPage({ params }: EditPastResultRecordPageProps) {
  const { id } = use(params);

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
