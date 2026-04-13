import React from 'react';
import { AddCompetitionForm } from '@/components/forms/AddCompetitionForm'; // Import the new form

export default function AddCompetitionPage() {
  return (
    <>
      <h1 className="text-4xl md:text-5xl font-extrabold text-plra-gold text-center mb-12">
        Add New Competition
      </h1>
      <p className="text-lg text-center text-gray-200 mb-8">
        Fill out the form below to add a new competition to your website.
      </p>
      <AddCompetitionForm />
    </>
  );
}