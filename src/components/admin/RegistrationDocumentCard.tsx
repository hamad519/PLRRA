"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, LucideIcon } from 'lucide-react';

interface RegistrationDocumentCardProps {
  label: string;
  base64: string;
  icon: LucideIcon;
  onView: (label: string, base64: string) => void;
}

export const RegistrationDocumentCard = ({ label, base64, icon: Icon, onView }: RegistrationDocumentCardProps) => {
  return (
    <div className="group relative bg-white border border-admin-border rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-xl transition-all duration-300">
      <div className="w-16 h-16 rounded-2xl bg-admin-bg flex items-center justify-center text-admin-text-secondary mb-4 group-hover:scale-110 transition-transform">
        <Icon size={32} />
      </div>
      <p className="text-sm font-bold text-admin-text-primary mb-4">{label}</p>
      <Button 
        onClick={() => onView(label, base64)}
        className="w-full bg-admin-accent text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-2 hover:opacity-90"
      >
        <Eye size={14} /> View Document
      </Button>
    </div>
  );
};