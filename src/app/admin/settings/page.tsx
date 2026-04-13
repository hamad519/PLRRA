import React from 'react';
import { SiteSettingsForm } from '@/components/forms/SiteSettingsForm';
import { Reveal } from '@/components/animations/Reveal';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-10">
      <header>
        <Reveal direction="down">
          <h1 className="text-4xl font-black text-admin-text-primary tracking-tight">
            Site <span className="text-admin-accent">Settings</span>
          </h1>
          <p className="text-admin-text-secondary font-medium mt-1">
            Manage your contact details, social links, and system status.
          </p>
        </Reveal>
      </header>

      <SiteSettingsForm />
    </div>
  );
}