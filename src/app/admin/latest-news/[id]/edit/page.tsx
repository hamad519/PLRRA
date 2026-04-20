import React from 'react';
import { EditLatestNewsForm } from '@/components/forms/EditLatestNewsForm';
import { Reveal } from '@/components/animations/Reveal';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditLatestNewsPage({ params }: Props) {
  const { id } = await params;
  return (
    <div className="space-y-10">
      <header>
        <Reveal direction="down">
          <h1 className="text-4xl font-black text-admin-text-primary tracking-tight">
            Edit <span className="text-admin-accent">News Item</span>
          </h1>
          <p className="text-admin-text-secondary font-medium mt-1">Update the news text or toggle its visibility in the ticker.</p>
        </Reveal>
      </header>
      <EditLatestNewsForm id={id} />
    </div>
  );
}
