"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { 
  User, Mail, Phone, FileText, Calendar, MapPin, 
  Shield, Briefcase, CreditCard, ArrowLeft, CheckCircle, XCircle as XIcon
} from 'lucide-react';
import { format } from 'date-fns';
import { Reveal } from '@/components/animations/Reveal';
import { DocumentViewerModal } from '@/components/admin/DocumentViewerModal';
import { RegistrationDocumentCard } from '@/components/admin/RegistrationDocumentCard';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface IWeapon {
  nomenclature: string;
  caliber: string;
  bodyNumber: string;
  madeBy: string;
}

interface EventRegistration {
  _id: string;
  eventId: { _id: string; title: string };
  firstName: string;
  lastName: string;
  fatherName: string;
  religion: string;
  dateOfBirth: string;
  profession: string;
  addressLine1: string;
  city: string;
  state: string;
  phoneNo: string;
  email: string;
  cnicNo: string;
  cnicCopyBase64: string;
  passportNo?: string;
  passportCopyBase64?: string;
  weapons: IWeapon[];
  weaponLicenseCopyBase64: string;
  bankChallanCopyBase64: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

export default function RegistrationDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [registration, setRegistration] = useState<EventRegistration | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [activeDoc, setActiveDoc] = useState<{ title: string; base64: string } | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetch(`/api/admin/event-registrations/${id}`);
        const data = await res.json();
        if (data.success) {
          setRegistration(data.data);
        } else {
          toast.error(data.message || "Registration not found.");
          router.push('/admin/events/registrations');
        }
      } catch (err) {
        toast.error("Failed to load details.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetails();
  }, [id, router]);

  const handleStatusUpdate = async (newStatus: 'approved' | 'rejected') => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/event-registrations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setRegistration(data.data);
        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to update status.");
      }
    } catch (err) {
      toast.error("Network error. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleViewDoc = (title: string, base64: string) => {
    setActiveDoc({ title, base64 });
    setModalOpen(true);
  };

  if (loading) {
    return (
      <div className="space-y-8 pb-20">
        <Skeleton className="h-10 w-32 rounded-xl" />
        <div className="space-y-4">
          <Skeleton className="h-12 w-1/2 rounded-2xl" />
          <Skeleton className="h-6 w-1/3 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="rounded-[2rem] overflow-hidden border-none shadow-sm">
              <div className="p-8 space-y-6">
                <Skeleton className="h-8 w-48" />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-20 rounded-xl" />
                  <Skeleton className="h-20 rounded-xl" />
                  <Skeleton className="h-20 rounded-xl" />
                  <Skeleton className="h-20 rounded-xl" />
                </div>
              </div>
            </Card>
            <Card className="rounded-[2rem] overflow-hidden border-none shadow-sm">
              <div className="p-8 space-y-6">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-32 rounded-xl" />
              </div>
            </Card>
          </div>
          <div className="space-y-8">
            <Card className="rounded-[2rem] overflow-hidden border-none shadow-sm">
              <div className="p-8 space-y-4">
                <Skeleton className="h-40 rounded-2xl" />
                <Skeleton className="h-40 rounded-2xl" />
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!registration) return null;

  const DetailItem = ({ icon: Icon, label, value, color }: any) => (
    <div className="flex items-start gap-4 p-4 bg-admin-bg/50 rounded-xl border border-admin-border/50">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${color || 'bg-admin-accent/10 text-admin-accent'}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-admin-text-secondary mb-1">{label}</p>
        <p className="text-sm font-bold text-admin-text-primary">{value || 'N/A'}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/admin/events/registrations')}
          className="text-admin-text-secondary hover:text-admin-text-primary gap-2"
        >
          <ArrowLeft size={20} /> Back to List
        </Button>
        <div className="flex items-center gap-3">
          <span className="text-xs font-black uppercase tracking-widest text-admin-text-secondary">Status:</span>
          <div className={cn(
            "px-4 py-1 rounded-full text-xs font-black uppercase",
            registration.status === 'approved' ? "bg-emerald-500/10 text-emerald-500" :
            registration.status === 'rejected' ? "bg-red-500/10 text-red-500" :
            "bg-amber-500/10 text-amber-500"
          )}>
            {registration.status}
          </div>
        </div>
      </div>

      <Reveal direction="down">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-admin-text-primary tracking-tight">
            Registration <span className="text-admin-accent">Details</span>
          </h1>
          <p className="text-admin-text-secondary font-medium mt-1">
            Participant: {registration.firstName} {registration.lastName} • Event: {registration.eventId?.title}
          </p>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="bg-white border-none shadow-sm rounded-[2rem] overflow-hidden">
            <CardHeader className="p-8 bg-admin-bg/30 border-b border-admin-border/50">
              <CardTitle className="text-xl font-black flex items-center gap-3">
                <User className="text-admin-accent" /> Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailItem icon={User} label="Full Name" value={`${registration.firstName} ${registration.lastName}`} />
              <DetailItem icon={User} label="Father's Name" value={registration.fatherName} />
              <DetailItem icon={Shield} label="Religion" value={registration.religion} />
              <DetailItem icon={Calendar} label="Date of Birth" value={format(new Date(registration.dateOfBirth), 'PPP')} />
              <DetailItem icon={Briefcase} label="Profession" value={registration.profession} />
              <DetailItem icon={Briefcase} label="CNIC Number" value={registration.cnicNo} />
              {registration.passportNo && <DetailItem icon={Briefcase} label="Passport Number" value={registration.passportNo} />}
            </CardContent>
          </Card>

          <Card className="bg-white border-none shadow-sm rounded-[2rem] overflow-hidden">
            <CardHeader className="p-8 bg-admin-bg/30 border-b border-admin-border/50">
              <CardTitle className="text-xl font-black flex items-center gap-3">
                <MapPin className="text-admin-accent" /> Contact & Address
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailItem icon={Mail} label="Email Address" value={registration.email} />
                <DetailItem icon={Phone} label="Phone Number" value={registration.phoneNo} />
              </div>
              <DetailItem icon={MapPin} label="Full Address" value={`${registration.addressLine1}, ${registration.city}, ${registration.state}`} />
            </CardContent>
          </Card>

          <Card className="bg-white border-none shadow-sm rounded-[2rem] overflow-hidden">
            <CardHeader className="p-8 bg-admin-bg/30 border-b border-admin-border/50">
              <CardTitle className="text-xl font-black flex items-center gap-3">
                <Shield className="text-admin-accent" /> Weapon Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              {registration.weapons.map((weapon, idx) => (
                <div key={idx} className="p-6 bg-admin-bg/30 rounded-2xl border border-admin-border/50 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase text-admin-text-secondary">Nomenclature</p>
                    <p className="font-bold text-admin-text-primary">{weapon.nomenclature}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-admin-text-secondary">Caliber</p>
                    <p className="font-bold text-admin-text-primary">{weapon.caliber}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-admin-text-secondary">Body No.</p>
                    <p className="font-bold text-admin-text-primary">{weapon.bodyNumber}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-admin-text-secondary">Manufacturer</p>
                    <p className="font-bold text-admin-text-primary">{weapon.madeBy}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="bg-white border-none shadow-sm rounded-[2rem] overflow-hidden">
            <CardHeader className="p-8 bg-admin-bg/30 border-b border-admin-border/50">
              <CardTitle className="text-xl font-black flex items-center gap-3">
                <FileText className="text-admin-accent" /> Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 grid grid-cols-1 gap-6">
              <RegistrationDocumentCard 
                label="CNIC Copy" 
                base64={registration.cnicCopyBase64} 
                icon={User} 
                onView={handleViewDoc}
              />
              {registration.passportCopyBase64 && (
                <RegistrationDocumentCard 
                  label="Passport Copy" 
                  base64={registration.passportCopyBase64} 
                  icon={Briefcase} 
                  onView={handleViewDoc}
                />
              )}
              <RegistrationDocumentCard 
                label="Weapon License" 
                base64={registration.weaponLicenseCopyBase64} 
                icon={Shield} 
                onView={handleViewDoc}
              />
              <RegistrationDocumentCard 
                label="Payment Proof" 
                base64={registration.bankChallanCopyBase64} 
                icon={CreditCard} 
                onView={handleViewDoc}
              />
            </CardContent>
          </Card>

          <Card className="bg-slate-950 text-white border-none shadow-xl rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 text-center">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-admin-accent mb-2">Submission Date</p>
              <p className="text-lg font-bold mb-8">{format(new Date(registration.submittedAt), 'PPP p')}</p>
              
              <div className="space-y-4">
                {registration.status !== 'approved' && (
                  <Button 
                    onClick={() => handleStatusUpdate('approved')}
                    disabled={isUpdating}
                    className="w-full bg-white text-slate-950 hover:bg-emerald-500 hover:text-white font-black py-6 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={20} /> {isUpdating ? 'Processing...' : 'Approve Registration'}
                  </Button>
                )}
                
                {registration.status !== 'rejected' && (
                  <Button 
                    onClick={() => handleStatusUpdate('rejected')}
                    disabled={isUpdating}
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-red-500 hover:border-red-500 font-black py-6 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <XIcon size={20} /> {isUpdating ? 'Processing...' : 'Reject Registration'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <DocumentViewerModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={activeDoc?.title || ''}
        base64={activeDoc?.base64 || null}
      />
    </div>
  );
}