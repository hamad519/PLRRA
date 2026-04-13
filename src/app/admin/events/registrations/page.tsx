"use client";

import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { User, Mail, Phone, Eye, Trophy } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { TableSkeleton } from '@/components/ui/TableSkeleton';

interface EventRegistration {
  _id: string;
  eventId: { _id: string; title: string };
  firstName: string;
  lastName: string;
  email: string;
  phoneNo: string;
  cnicNo: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

export default function EventRegistrationsAdminPage() {
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/event-registrations');
      const data = await res.json();
      if (data.success) setRegistrations(data.data);
    } catch (err) {
      toast.error("Failed to load registrations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRegistrations(); }, []);

  return (
    <>
      <h1 className="text-4xl font-extrabold text-admin-text-primary text-center mb-12">Event Registrations</h1>
      <div className="bg-admin-card-bg border border-admin-border rounded-xl shadow-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-admin-sidebar-bg hover:bg-admin-sidebar-bg">
              <TableHead className="text-white font-bold">Participant</TableHead>
              <TableHead className="text-white font-bold">Event</TableHead>
              <TableHead className="text-white font-bold">Contact</TableHead>
              <TableHead className="text-white font-bold">Status</TableHead>
              <TableHead className="text-white font-bold">Date</TableHead>
              <TableHead className="text-white font-bold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableSkeleton columns={6} />
            ) : registrations.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8">No registrations found.</TableCell></TableRow>
            ) : (
              registrations.map((reg) => (
                <TableRow key={reg._id} className="hover:bg-admin-hover-bg">
                  <TableCell className="font-bold text-admin-text-primary flex items-center gap-2">
                    <User size={16} className="text-admin-accent"/> {reg.firstName} {reg.lastName}
                  </TableCell>
                  <TableCell className="text-admin-text-primary font-medium">
                    <Trophy size={14} className="inline mr-2 text-plra-gold"/> {reg.eventId?.title}
                  </TableCell>
                  <TableCell className="text-admin-text-secondary text-xs">
                    <div className="flex items-center gap-1"><Mail size={12}/> {reg.email}</div>
                    <div className="flex items-center gap-1"><Phone size={12}/> {reg.phoneNo}</div>
                  </TableCell>
                  <TableCell>
                    <div className={cn(
                      "inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                      reg.status === 'approved' ? "bg-emerald-500/10 text-emerald-500" :
                      reg.status === 'rejected' ? "bg-red-500/10 text-red-500" :
                      "bg-amber-500/10 text-amber-500"
                    )}>
                      {reg.status}
                    </div>
                  </TableCell>
                  <TableCell className="text-admin-text-secondary text-xs">
                    {format(new Date(reg.submittedAt), 'PPP')}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/events/registrations/${reg._id}`}>
                      <Button variant="ghost" size="icon" className="text-admin-accent">
                        <Eye size={18}/>
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}