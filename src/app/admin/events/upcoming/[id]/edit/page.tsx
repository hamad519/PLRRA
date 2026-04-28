"use client";

import React, { use } from 'react';
import { EditUpcomingEventForm } from '@/components/forms/EditUpcomingEventForm';

interface EditUpcomingEventPageProps {
  params: Promise<{ id: string }>;
}

export default function EditUpcomingEventPage({ params }: EditUpcomingEventPageProps) {
  const { id } = use(params);

  return (
    <>
      <h1 className="text-4xl md:text-5xl font-extrabold text-admin-text-primary text-center mb-12">
        Edit Upcoming Event
      </h1>
      <p className="text-lg text-center text-admin-text-secondary mb-8">
        Modify the details of this upcoming event.
      </p>
      <EditUpcomingEventForm eventId={id} />
    </>
  );
}
