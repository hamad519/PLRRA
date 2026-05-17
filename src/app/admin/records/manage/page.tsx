"use client";

import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Trophy, Trash2, Download, Calendar, Eye } from 'lucide-react';
import { TableSkeleton } from '@/components/ui/TableSkeleton';
import { DocumentViewerModal } from '@/components/admin/DocumentViewerModal';
import { downloadFile } from '@/lib/downloadFile';
import Link from 'next/link';

interface NationalRecord {
  _id: string;
  year: number;
  title: string;
  pdfBase64: string;
}

export default function ManageNationalRecordsPage() {
  const [records, setRecords] = useState<NationalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [activeDoc, setActiveDoc] = useState<{ title: string; base64: string } | null>(null);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/national-records');
      const data = await res.json();
      if (data.success) setRecords(data.data);
    } catch (err) {
      toast.error("Failed to load records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRecords(); }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this record?")) return;
    try {
      const res = await fetch(`/api/admin/national-records/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success("Deleted successfully");
        fetchRecords();
      }
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  const handleView = (title: string, base64: string) => {
    setActiveDoc({ title, base64 });
    setViewerOpen(true);
  };

  const handleDownload = (source: string, fileName: string) => {
    try {
      downloadFile(source, fileName);
    } catch {
      toast.error("Could not download file.");
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-black text-admin-text-primary">Manage <span className="text-admin-accent">National Records</span></h1>
        <Link href="/admin/records/add">
          <Button className="bg-admin-accent text-white font-bold rounded-xl px-6">+ Add Record</Button>
        </Link>
      </div>
      <div className="bg-admin-card-bg border border-admin-border rounded-xl shadow-xl overflow-hidden">
        <Table className="w-full border-collapse">
          <TableHeader>
            <TableRow className="bg-admin-sidebar-bg hover:bg-admin-sidebar-bg border-none">
              <TableHead className="text-white font-bold py-4 px-6">Title</TableHead>
              <TableHead className="text-white font-bold py-4 px-6">Year</TableHead>
              <TableHead className="text-white font-bold py-4 px-6 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableSkeleton columns={3} />
            ) : records.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-10 text-gray-500">No records found.</TableCell>
              </TableRow>
            ) : (
              records.map((record) => (
                <TableRow key={record._id} className="hover:bg-admin-hover-bg border-b border-admin-border/50">
                  <TableCell className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-admin-accent/10 flex items-center justify-center text-admin-accent">
                        <Trophy size={16} />
                      </div>
                      <span className="font-bold text-admin-text-primary">{record.title}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <div className="flex items-center gap-2 text-admin-text-secondary font-medium">
                      <Calendar size={14} className="text-admin-accent" />
                      {record.year}
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleView(record.title, record.pdfBase64)}
                        className="text-admin-accent hover:bg-admin-accent/10"
                        title="View Document"
                      >
                        <Eye size={18} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDownload(record.pdfBase64, record.title)}
                        className="text-blue-500 hover:bg-blue-50"
                        title="Download File"
                      >
                        <Download size={18} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDelete(record._id)} 
                        className="text-destructive hover:bg-red-50"
                        title="Delete Record"
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <DocumentViewerModal 
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        title={activeDoc?.title || ''}
        base64={activeDoc?.base64 || null}
      />
    </div>
  );
}