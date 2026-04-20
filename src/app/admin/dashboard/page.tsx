"use client";

import React, { useEffect, useState } from 'react';
import {
  Users, CalendarDays, Trophy, Newspaper, Award, FileText,
  ClipboardList, MessageSquareQuote, Globe, Crown, Rss,
  ArrowRight, Clock, CheckCircle2, XCircle, Zap,
  TrendingUp, Activity,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import Link from 'next/link';

interface DashboardData {
  counts: {
    totalUsers: number;
    upcomingEvents: number;
    competitions: number;
    pressReleases: number;
    nationalRecords: number;
    pastResults: number;
    latestNews: number;
    testimonials: number;
    achievements: number;
    contributors: number;
    registrations: { pending: number; approved: number; rejected: number; total: number };
    applications: { pending: number; approved: number; total: number };
  };
  recentRegistrations: Array<{
    id: number; firstName: string; lastName: string; status: string; submittedAt: string;
    event: { title: string };
  }>;
  recentApplications: Array<{
    id: number; firstName: string; lastName: string; membershipPlan: string; status: string; submittedAt: string;
  }>;
}

const StatusDot = ({ status }: { status: string }) => (
  <span className={cn("w-2 h-2 rounded-full inline-block",
    status === 'approved' && "bg-emerald-400",
    status === 'rejected' && "bg-red-400",
    status === 'pending' && "bg-amber-400 animate-pulse",
  )} />
);

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/dashboard/stats')
      .then(res => res.json())
      .then(json => { if (json.success) setData(json.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const c = data?.counts;

  return (
    <div className="space-y-8">
      {/* ── Hero Header ──────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] p-8 md:p-10">
        <div className="absolute top-0 right-0 w-80 h-80 bg-plra-accent-purple/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-plra-gold/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/3" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Activity size={16} className="text-plra-gold" />
              <span className="text-plra-gold text-[10px] font-black uppercase tracking-[0.3em]">Live Dashboard</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
              Welcome Back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-plra-gold to-amber-300">Admin</span>
            </h1>
            <p className="text-slate-400 text-sm mt-2 max-w-md">Here&apos;s a real-time snapshot of your entire platform. Every number below is live from the database.</p>
          </div>
          <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-2.5 shrink-0">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white/60 text-xs font-semibold">System Online</span>
          </div>
        </div>

        {/* Mini stat pills inside header */}
        {!loading && c && (
          <div className="relative z-10 grid grid-cols-3 md:grid-cols-6 gap-3 mt-8">
            {[
              { label: "Users", value: c.totalUsers, icon: Users },
              { label: "Events", value: c.upcomingEvents, icon: CalendarDays },
              { label: "Competitions", value: c.competitions, icon: Trophy },
              { label: "Releases", value: c.pressReleases, icon: Newspaper },
              { label: "Records", value: c.nationalRecords, icon: Award },
              { label: "Results", value: c.pastResults, icon: FileText },
            ].map((s, i) => (
              <div key={i} className="bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-center backdrop-blur-sm">
                <div className="text-2xl font-black text-white">{s.value}</div>
                <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        )}
        {loading && (
          <div className="relative z-10 grid grid-cols-3 md:grid-cols-6 gap-3 mt-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 space-y-2">
                <Skeleton className="h-7 w-10 mx-auto bg-white/10" />
                <Skeleton className="h-2 w-14 mx-auto bg-white/10" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Content Area ─────────────────────────────────────── */}
      <div className="grid grid-cols-12 gap-6">

        {/* Left Column (8/12) */}
        <div className="col-span-12 lg:col-span-8 space-y-6">

          {/* Stat Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 shadow-sm space-y-3">
                  <Skeleton className="w-10 h-10 rounded-xl" />
                  <Skeleton className="h-7 w-8" />
                  <Skeleton className="h-3 w-20" />
                </div>
              ))
            ) : c ? [
              { title: "Latest News", value: c.latestNews, icon: Rss, color: "from-amber-400 to-orange-500", bg: "bg-amber-50", href: "/admin/latest-news/manage" },
              { title: "Senior Members", value: c.testimonials, icon: MessageSquareQuote, color: "from-violet-500 to-purple-600", bg: "bg-violet-50", href: "/admin/testimonials/manage" },
              { title: "Achievements", value: c.achievements, icon: Globe, color: "from-sky-400 to-blue-500", bg: "bg-sky-50", href: "/admin/achievements/manage" },
              { title: "Contributors", value: c.contributors, icon: Crown, color: "from-pink-400 to-rose-500", bg: "bg-pink-50", href: "/admin/contributors/manage" },
            ].map((stat, i) => (
              <Link key={i} href={stat.href}>
                <div className="group bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-transparent hover:border-gray-100">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md bg-gradient-to-br mb-4 group-hover:scale-110 transition-transform", stat.color)}>
                    <stat.icon size={18} />
                  </div>
                  <div className="text-3xl font-black text-slate-900">{stat.value}</div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{stat.title}</p>
                </div>
              </Link>
            )) : null}
          </div>

          {/* Event Registrations Card */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 flex items-center justify-between border-b border-gray-50">
              <h3 className="font-black text-slate-900 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                  <ClipboardList size={16} />
                </div>
                Event Registrations
              </h3>
              <Link href="/admin/events/registrations" className="text-xs font-bold text-plra-accent-purple hover:underline flex items-center gap-1">
                View All <ArrowRight size={12} />
              </Link>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full rounded-xl" />)}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {[
                      { label: "Pending", value: c?.registrations.pending ?? 0, color: "bg-amber-500", bg: "bg-amber-50 border-amber-100" },
                      { label: "Approved", value: c?.registrations.approved ?? 0, color: "bg-emerald-500", bg: "bg-emerald-50 border-emerald-100" },
                      { label: "Rejected", value: c?.registrations.rejected ?? 0, color: "bg-red-500", bg: "bg-red-50 border-red-100" },
                    ].map((s, i) => (
                      <div key={i} className={cn("rounded-xl p-4 border text-center", s.bg)}>
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <div className={cn("w-2 h-2 rounded-full", s.color)} />
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{s.label}</span>
                        </div>
                        <div className="text-2xl font-black text-slate-800">{s.value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-1">
                    {data?.recentRegistrations?.map((reg) => (
                      <div key={reg.id} className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center text-purple-600 font-black text-sm">
                            {reg.firstName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">{reg.firstName} {reg.lastName}</p>
                            <p className="text-[11px] text-slate-400">{reg.event?.title}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5">
                            <StatusDot status={reg.status} />
                            <span className={cn("text-[11px] font-bold capitalize",
                              reg.status === 'approved' && "text-emerald-600",
                              reg.status === 'rejected' && "text-red-600",
                              reg.status === 'pending' && "text-amber-600",
                            )}>{reg.status}</span>
                          </div>
                          <span className="text-[10px] text-slate-300">{format(new Date(reg.submittedAt), 'dd MMM')}</span>
                        </div>
                      </div>
                    ))}
                    {(!data?.recentRegistrations || data.recentRegistrations.length === 0) && (
                      <p className="text-sm text-slate-400 text-center py-6">No registrations yet</p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (4/12) */}
        <div className="col-span-12 lg:col-span-4 space-y-6">

          {/* Membership Applications */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 flex items-center justify-between border-b border-gray-50">
              <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white">
                  <Users size={14} />
                </div>
                Applications
              </h3>
              <Link href="/admin/membership-applications" className="text-[10px] font-bold text-plra-accent-purple hover:underline">View All</Link>
            </div>
            <div className="p-5">
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-16 w-full rounded-xl" />
                  <Skeleton className="h-16 w-full rounded-xl" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-center">
                      <div className="text-xl font-black text-amber-600">{c?.applications.pending ?? 0}</div>
                      <p className="text-[9px] font-bold text-amber-500 uppercase tracking-wider">Pending</p>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-center">
                      <div className="text-xl font-black text-emerald-600">{c?.applications.approved ?? 0}</div>
                      <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-wider">Approved</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {data?.recentApplications?.map((app) => (
                      <div key={app.id} className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-slate-50 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 font-black text-xs shrink-0">
                          {app.firstName.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-800 truncate">{app.firstName} {app.lastName}</p>
                          <p className="text-[10px] text-slate-400 truncate">{app.membershipPlan}</p>
                        </div>
                        <StatusDot status={app.status} />
                      </div>
                    ))}
                    {(!data?.recentApplications || data.recentApplications.length === 0) && (
                      <p className="text-xs text-slate-400 text-center py-4">No applications yet</p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Platform Overview */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp size={16} className="text-plra-gold" />
              <h3 className="text-sm font-black text-white">Platform Overview</h3>
            </div>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-4 w-full bg-white/10" />)}
              </div>
            ) : c && (
              <div className="space-y-3">
                {[
                  { label: "Total Content Items", value: (c.competitions + c.upcomingEvents + c.pastResults + c.pressReleases + c.nationalRecords) },
                  { label: "Total Registrations", value: c.registrations.total },
                  { label: "Total Applications", value: c.applications.total },
                  { label: "Active News Ticker", value: c.latestNews },
                  { label: "Who We Are Sections", value: c.achievements + c.contributors + c.testimonials },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                    <span className="text-xs text-white/50 font-medium">{item.label}</span>
                    <span className="text-sm font-black text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Zap size={16} className="text-admin-accent" />
              <h3 className="text-sm font-black text-slate-900">Quick Actions</h3>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Event", href: "/admin/events/upcoming/add", icon: CalendarDays, color: "bg-purple-50 text-purple-600 hover:bg-purple-100" },
                { label: "Competition", href: "/admin/competitions/add", icon: Trophy, color: "bg-amber-50 text-amber-600 hover:bg-amber-100" },
                { label: "News", href: "/admin/latest-news/add", icon: Rss, color: "bg-blue-50 text-blue-600 hover:bg-blue-100" },
                { label: "Record", href: "/admin/records/add", icon: Award, color: "bg-rose-50 text-rose-600 hover:bg-rose-100" },
                { label: "Release", href: "/admin/press-releases/add", icon: Newspaper, color: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" },
                { label: "Content", href: "/admin/content", icon: FileText, color: "bg-slate-50 text-slate-600 hover:bg-slate-100" },
              ].map((action, i) => (
                <Link key={i} href={action.href}>
                  <div className={cn("rounded-xl p-3 text-center transition-all duration-200 cursor-pointer", action.color)}>
                    <action.icon size={18} className="mx-auto mb-1.5" />
                    <p className="text-[9px] font-bold uppercase tracking-wider">{action.label}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
