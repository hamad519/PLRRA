"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LatestNewsTicker } from '@/components/layout/LatestNewsTicker';
import { Toaster } from '@/components/ui/sonner';
import { MaintenancePage } from '@/components/layout/MaintenancePage';
import { ChatWidget } from '@/components/chatbot/ChatWidget';
import { SiteSettingsProvider, useSiteSettings } from '@/context/SiteSettingsContext';

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');
  const { settings, loading } = useSiteSettings();

  if (isAdminRoute) {
    return (
      <>
        {children}
        <Toaster />
      </>
    );
  }

  // Show maintenance page only after settings confirm it's on
  if (!loading && settings?.isMaintenanceMode) {
    return (
      <>
        <MaintenancePage />
        <Toaster />
      </>
    );
  }

  // Render layout immediately — don't block on settings loading
  return (
    <>
      <LatestNewsTicker />
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <ChatWidget />
      <Toaster />
    </>
  );
}

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SiteSettingsProvider>
      <LayoutContent>{children}</LayoutContent>
    </SiteSettingsProvider>
  );
}
