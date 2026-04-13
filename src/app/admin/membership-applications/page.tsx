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
import { User, Eye, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { TableSkeleton } from '@/components/ui/TableSkeleton';
import { cn } from '@/lib/utils';

interface MembershipApplication {
  _id: string;
  membershipPlan: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNo: string;
  cnicNo: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

export default function MembershipApplicationsPage() {
  const [applications, setApplications] = useState<MembershipApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/membership-applications');
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      if (data.success) {
        setApplications(data.data);
      } else {
        setError(data.message || 'Failed to fetch applications');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchApplications(); }, []);

  const handleDelete = async (applicationId: string) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      const res = await fetch(`/api/admin/membership-applications/${applicationId}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success("Deleted successfully!");
        fetchApplications();
      }
    } catch (err) {
      toast.error("Failed to delete.");
    }
  };

  return (
    <>
      <h1 className="text-4xl md:text-5xl font-extrabold text-admin-text-primary text-center mb-12">
        Membership Applications
      </h1>
      <div className="bg-admin-card-bg border border-admin-border rounded-xl shadow-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-admin-sidebar-bg hover:bg-admin-sidebar-bg">
              <TableHead className="text-white font-bold">Name</TableHead>
              <TableHead className="text-white font-bold">Email</TableHead>
              <TableHead className="text-white font-bold">Plan</TableHead>
              <TableHead className="text-white font-bold">Status</TableHead>
              <TableHead className="text-white font-bold">Date</TableHead>
              <TableHead className="text-white font-bold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableSkeleton columns={6} />
            ) : error ? (
              <TableRow><TableCell colSpan={6} className="text-center text-red-500 py-8">Error: {error}</TableCell></TableRow>
            ) : applications.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8">No applications found.</TableCell></TableRow>
            ) : (
              applications.map((app) => (
                <TableRow key={app._id} className="border-admin-border/50 hover:bg-admin-hover-bg">
                  <TableCell className="font-bold text-admin-text-primary flex items-center">
                    <User className="h-4 w-4 mr-2 text-admin-accent" /> {app.firstName} {app.lastName}
                  </TableCell>
                  <TableCell className="text-admin-text-primary">{app.email}</TableCell>
                  <TableCell className="text-admin-text-primary capitalize">{app.membershipPlan}</TableCell>
                  <TableCell>
                    <div className={cn(
                      "inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                      app.status === 'approved' ? "bg-emerald-500/10 text-emerald-500" :
                      app.status === 'rejected' ? "bg-red-500/10 text-red-500" :
                      "bg-amber-500/10 text-amber-500"
                    )}>
                      {app.status}
                    </div>
                  </TableCell>
                  <TableCell className="text-admin-text-secondary text-xs">{format(new Date(app.submittedAt), 'PPP')}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="text-admin-accent mr-2"><Eye className="h-5 w-5" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(app._id)} className="text-destructive"><Trash2 className="h-5 w-5" /></Button>
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