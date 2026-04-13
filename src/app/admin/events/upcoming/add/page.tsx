import React from 'react';
import { AddUpcomingEventForm } from '@/components/forms/AddUpcomingEventForm';

export default function AddUpcomingEventPage() {
  return (
    <>
      <h1 className="text-4xl md:text-5xl font-extrabold text-admin-text-primary text-center mb-12">
        Add New Upcoming Event
      </h1>
      <p className="text-lg text-center text-admin-text-secondary mb-8">
        Fill out the form below to add a new upcoming event to your website.
      </p>
      <AddUpcomingEventForm />
    </>
  );
}