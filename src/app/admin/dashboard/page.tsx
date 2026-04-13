"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, CalendarDays, Trophy, Mail, ClipboardList, ArrowUpRight, TrendingUp } from 'lucide-react';
import { Reveal } from '@/components/animations/Reveal';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial load
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { title: "Total Users", value: "1,248", icon: Users, change: "+12%", color: "from-blue-500 to-indigo-600" },
    { title: "Upcoming Events", value: "08", icon: CalendarDays, change: "Next: 15 Dec", color: "from-purple-500 to-pink-600" },
    { title: "Past Competitions", value: "32", icon: Trophy, change: "Total Records", color: "from-amber-400 to-orange-600" },
    { title: "Contact Forms", value: "14", icon: Mail, change: "4 Unread", color: "from-emerald-400 to-teal-600" },
    { title: "Applications", value: "09", icon: ClipboardList, change: "Pending Review", color: "from-rose-400 to-red-600" },
    { title: "Champions", value: "18", icon: TrendingUp, change: "National Color", color: "from-cyan-400 to-blue-600" },
  ];

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Reveal direction="down">
            <h1 className="text-3xl md:text-4xl font-black text-admin-text-primary tracking-tight">
              Dashboard <span className="text-admin-accent">Overview</span>
            </h1>
            <p className="text-admin-text-secondary font-medium mt-1">Welcome back, here's what's happening today.</p>
          </Reveal>
        </div>
        <Reveal direction="left" delay={0.3}>
          <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-admin-border">
            <div className="px-4 py-2 bg-admin-bg rounded-xl text-xs font-bold text-admin-text-secondary">
              Last updated: 5 mins ago
            </div>
          </div>
        </Reveal>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {stats.map((stat, index) => (
          <Reveal key={index} delay={index * 0.1} direction="up">
            <Card className="group bg-white border-none shadow-sm hover:shadow-xl transition-all duration-500 rounded-[2rem] overflow-hidden h-full flex flex-col">
              <CardHeader className="p-6 pb-2 flex flex-row items-center justify-between space-y-0">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg bg-gradient-to-br", stat.color)}>
                  <stat.icon size={22} />
                </div>
                {loading ? (
                  <Skeleton className="h-4 w-10 rounded-lg" />
                ) : (
                  <div className="flex items-center text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">
                    <ArrowUpRight size={12} className="mr-1" />
                    {stat.change.includes('+') ? stat.change : 'INFO'}
                  </div>
                )}
              </CardHeader>
              <CardContent className="p-6 pt-4">
                {loading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                ) : (
                  <>
                    <div className="text-3xl font-black text-admin-text-primary mb-1">{stat.value}</div>
                    <p className="text-xs font-bold text-admin-text-secondary uppercase tracking-widest">{stat.title}</p>
                  </>
                )}
                <div className="mt-4 pt-4 border-t border-gray-50">
                  {loading ? <Skeleton className="h-2 w-12" /> : <p className="text-[10px] font-medium text-gray-400">{stat.change}</p>}
                </div>
              </CardContent>
            </Card>
          </Reveal>
        ))}
      </div>
    </div>
  );
}