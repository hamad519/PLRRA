"use client";

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileText, Download, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  base64: string | null;
}

export const DocumentViewerModal = ({ isOpen, onClose, title, base64 }: DocumentViewerModalProps) => {
  if (!base64) return null;

  // Check file type from base64 string
  const isPdf = base64.includes('application/pdf');
  const isWord = base64.includes('officedocument') || base64.includes('msword');
  const isImage = base64.includes('image/');

  const downloadFile = () => {
    try {
      const link = document.createElement('a');
      link.href = base64;
      const extension = isPdf ? '.pdf' : isWord ? '.docx' : '.png';
      link.download = `${title.replace(/[^a-z0-9]/gi, '_')}${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast.error("Download failed.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl w-[95vw] h-[90vh] p-0 overflow-hidden bg-white border-admin-border flex flex-col">
        <DialogHeader className="p-6 border-b border-admin-border bg-white flex flex-row items-center justify-between shrink-0">
          <DialogTitle className="text-xl font-black text-admin-text-primary flex items-center gap-3">
            <FileText className="text-admin-accent" /> {title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-grow w-full bg-slate-100 flex items-center justify-center overflow-hidden p-4 relative">
          {isPdf ? (
            <iframe
              src={`${base64}#toolbar=0`}
              className="w-full h-full rounded-lg shadow-2xl bg-white"
              title={title}
            />
          ) : isImage ? (
            <div className="w-full h-full flex items-center justify-center overflow-auto">
              <img
                src={base64}
                alt={title}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              />
            </div>
          ) : isWord ? (
            <div className="text-center space-y-6 p-12 bg-white rounded-[2rem] shadow-xl max-w-md">
              <div className="w-20 h-20 rounded-3xl bg-blue-50 flex items-center justify-center text-blue-500 mx-auto">
                <FileText size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-900">Word Document</h3>
                <p className="text-slate-500 font-medium">
                  Browsers cannot preview Word files directly. Please download the file to view its contents.
                </p>
              </div>
              <Button 
                onClick={downloadFile}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 rounded-xl flex items-center justify-center gap-2"
              >
                <Download size={20} /> Download to View
              </Button>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <AlertCircle className="mx-auto text-amber-500" size={48} />
              <p className="text-slate-600 font-bold">Preview not available for this file type.</p>
              <Button onClick={downloadFile} variant="outline">Download Instead</Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};