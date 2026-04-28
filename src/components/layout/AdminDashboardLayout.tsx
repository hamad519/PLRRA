"use client";

import React from 'react';
import { AdminSidebar } from './AdminSidebar';
import { usePathname } from 'next/navigation';
// Charts are now embedded directly in the dashboard page

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
}

export const AdminDashboardLayout = ({ children }: AdminDashboardLayoutProps) => {
  const pathname = usePathname();
  
  // Only hide the sidebar on the login page. 
  // Registration is now part of the internal dashboard.
  const isLoginPage = pathname === '/admin/login';

  // Login page gets full-screen — no sidebar, no padding, no admin background
  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-admin-bg overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-10 overflow-y-auto custom-scrollbar relative">
        {/* Decorative background blur */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-admin-accent/5 rounded-full blur-[120px] -z-10"></div>

        <div className="container mx-auto max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
};