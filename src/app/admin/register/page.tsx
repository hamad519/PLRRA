import React from 'react';
import { AdminRegisterForm } from '@/components/forms/AdminRegisterForm';
import { Reveal } from '@/components/animations/Reveal';

export default function AdminRegisterPage() {
  return (
    <div className="min-h-full flex flex-col justify-center py-12">
      <div className="mb-12 text-center">
        <Reveal direction="down">
          <h1 className="text-4xl md:text-5xl font-black text-admin-text-primary tracking-tight">
            User <span className="text-admin-accent">Management</span>
          </h1>
          <p className="text-admin-text-secondary font-medium mt-2">
            Expand your team by adding new members to the platform.
          </p>
        </Reveal>
      </div>
      
      <AdminRegisterForm />
    </div>
  );
}