"use client";

import React from 'react';
import { AdminSidebar } from './AdminSidebar';
import { usePathname } from 'next/navigation';
import { UsersGrowthChart } from '@/components/admin/charts/UsersGrowthChart';
import { EventsOverviewChart } from '@/components/admin/charts/EventsOverviewChart';
import { Reveal } from '@/components/animations/Reveal';

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
}

export const AdminDashboardLayout = ({ children }: AdminDashboardLayoutProps) => {
  const pathname = usePathname();
  
  // Only hide the sidebar on the login page. 
  // Registration is now part of the internal dashboard.
  const hideSidebar = pathname === '/admin/login';
  const showChartsOnDashboard = pathname === '/admin/dashboard';

  return (
    <div className="flex h-screen bg-admin-bg overflow-hidden">
      {!hideSidebar && <AdminSidebar />}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto custom-scrollbar relative">
        {/* Decorative background blur */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-admin-accent/5 rounded-full blur-[120px] -z-10"></div>
        
        <div className="container mx-auto max-w-7xl">
          {children}
          
          {showChartsOnDashboard && (
            <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Reveal direction="up" delay={0.5}>
                <UsersGrowthChart />
              </Reveal>
              <Reveal direction="up" delay={0.6}>
                <EventsOverviewChart />
              </Reveal>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};