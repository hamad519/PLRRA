import React from 'react';
import { AddNationalGalleryEventForm } from '@/components/forms/AddNationalGalleryEventForm';

export default function AddNationalGalleryEventPage() {
  return (
    <>
      <h1 className="text-4xl md:text-5xl font-extrabold text-plra-gold text-center mb-12">
        Add National Gallery Event
      </h1>
      <p className="text-lg text-center text-gray-200 mb-8">
        Fill out the form below to add a new event to the National Gallery.
      </p>
      <AddNationalGalleryEventForm />
    </>
  );
}
