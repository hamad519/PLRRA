import React from 'react';
import { EditNationalGalleryEventForm } from '@/components/forms/EditNationalGalleryEventForm';

interface EditNationalGalleryPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditNationalGalleryPage({ params }: EditNationalGalleryPageProps) {
  const { id } = await params;

  return (
    <>
      <h1 className="text-4xl md:text-5xl font-extrabold text-admin-text-primary text-center mb-12">
        Edit Gallery Event
      </h1>
      <p className="text-lg text-center text-admin-text-secondary mb-8">
        Modify the details of this gallery event.
      </p>
      <EditNationalGalleryEventForm eventId={id} />
    </>
  );
}
