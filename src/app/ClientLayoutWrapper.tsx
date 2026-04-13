"use client";

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LatestNewsTicker } from '@/components/layout/LatestNewsTicker';
import { Toaster } from '@/components/ui/sonner';
import { MaintenancePage } from '@/components/layout/MaintenancePage';
import { ChatWidget } from '@/components/chatbot/ChatWidget';

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkMaintenance = async () => {
      if (isAdminRoute) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data.success && data.data?.isMaintenanceMode) {
          setIsMaintenance(true);
        }
      } catch (error) {
        console.error("Failed to check maintenance status");
      } finally {
        setLoading(false);
      }
    };
    checkMaintenance();
  }, [isAdminRoute, pathname]);

  if (loading) return null;

  if (isMaintenance && !isAdminRoute) {
    return (
      <>
        <MaintenancePage />
        <Toaster />
      </>
    );
  }

  if (isAdminRoute) {
    return (
      <>
        {children}
        <Toaster />
      </>
    );
  }

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