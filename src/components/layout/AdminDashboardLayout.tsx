"use client";

import React, { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
// Charts are now embedded directly in the dashboard page

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
}

export const AdminDashboardLayout = ({ children }: AdminDashboardLayoutProps) => {
  const pathname = usePathname();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  // Only hide the sidebar on the login page. 
  // Registration is now part of the internal dashboard.
  const isLoginPage = pathname === '/admin/login';

  // Login page gets full-screen — no sidebar, no padding, no admin background
  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-admin-bg overflow-hidden">
      <div className="hidden md:block">
        <AdminSidebar />
      </div>

      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <div className="md:hidden fixed top-4 left-4 z-40">
          <SheetTrigger asChild>
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-admin-sidebar-bg/95 text-white shadow-lg shadow-black/10 transition hover:bg-admin-sidebar-bg"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open sidebar</span>
            </button>
          </SheetTrigger>
        </div>

        <SheetContent side="left" className="p-0 bg-transparent shadow-none sm:max-w-sm">
          <AdminSidebar />
        </SheetContent>
      </Sheet>

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