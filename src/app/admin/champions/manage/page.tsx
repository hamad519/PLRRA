import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ManageChampionsPage() {
  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-admin-text-primary">
          Manage Champions
        </h1>
        <Link href="/admin/champions/add">
          <Button className="bg-admin-accent text-white font-bold rounded-xl px-6">+ Add Champion</Button>
        </Link>
      </div>
      <p className="text-lg text-center text-admin-text-secondary">
        This page will allow you to view, edit, and delete existing champions. (Coming Soon)
      </p>
    </>
  );
}
