"use client";

import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { FileText, Trash2, Download, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { TableSkeleton } from '@/components/ui/TableSkeleton';
import { DocumentViewerModal } from '@/components/admin/DocumentViewerModal';
import { downloadFile } from '@/lib/downloadFile';

interface PressRelease {
  _id: string;
  title: string;
  date: string;
  pdfBase64: string;
}

export default function ManagePressReleasesPage() {
  const [releases, setReleases] = useState<PressRelease[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [activeDoc, setActiveDoc] = useState<{ title: string; base64: string } | null>(null);

  const fetchReleases = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/press-releases');
      const data = await res.json();
      if (data.success) setReleases(data.data);
    } catch (err) {
      toast.error("Failed to load releases");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReleases(); }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this release?")) return;
    try {
      const res = await fetch(`/api/admin/press-releases/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success("Deleted successfully");
        fetchReleases();
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
      <h1 className="text-4xl font-black text-admin-text-primary">Manage <span className="text-admin-accent">Press Releases</span></h1>
      <div className="bg-admin-card-bg border border-admin-border rounded-xl shadow-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-admin-sidebar-bg hover:bg-admin-sidebar-bg">
              <TableHead className="text-white font-bold">Title</TableHead>
              <TableHead className="text-white font-bold">Date</TableHead>
              <TableHead className="text-white font-bold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? <TableSkeleton columns={3} /> : releases.map((release) => (
              <TableRow key={release._id} className="hover:bg-admin-hover-bg">
                <TableCell className="font-bold text-admin-text-primary flex items-center gap-2">
                  <FileText size={16} className="text-admin-accent" /> {release.title}
                </TableCell>
                <TableCell className="text-admin-text-secondary">{format(new Date(release.date), 'PPP')}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleView(release.title, release.pdfBase64)}
                    className="text-admin-accent hover:bg-admin-accent/10"
                    title="View Document"
                  >
                    <Eye size={18} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDownload(release.pdfBase64, release.title)}
                    className="text-blue-500"
                    title="Download File"
                  >
                    <Download size={18} />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(release._id)} className="text-destructive" title="Delete Release">
                    <Trash2 size={18} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
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