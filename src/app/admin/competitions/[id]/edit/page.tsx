import React from 'react';
import { EditCompetitionForm } from '@/components/forms/EditCompetitionForm';

interface EditCompetitionPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditCompetitionPage({ params }: EditCompetitionPageProps) {
  const { id } = await params;

  return (
    <>
      <h1 className="text-4xl md:text-5xl font-extrabold text-admin-text-primary text-center mb-12">
        Edit Competition
      </h1>
      <p className="text-lg text-center text-admin-text-secondary mb-8">
        Modify the details of this competition.
      </p>
      <EditCompetitionForm competitionId={id} />
    </>
  );
}