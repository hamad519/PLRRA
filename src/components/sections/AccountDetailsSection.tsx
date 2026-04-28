"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Banknote, Building, Landmark, Hash, Copy, CheckCircle2, CreditCard } from 'lucide-react';
import { Reveal } from '@/components/animations/Reveal';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

interface AccountDetails {
  bankName: string;
  accountTitle: string;
  accountNumber: string;
  iban: string;
  branchCode: string;
}

export const AccountDetailsSection = () => {
  const [account, setAccount] = useState<AccountDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data.success && data.data?.accountDetails) {
          setAccount(data.data.accountDetails);
        }
      } catch {
        // silently fall through
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const bankDetails = account ? [
    { label: 'Account Title', value: account.accountTitle, icon: Banknote, color: 'text-blue-500' },
    { label: 'Bank Name', value: account.bankName, icon: Building, color: 'text-purple-500' },
    { label: 'Branch Code', value: account.branchCode, icon: Landmark, color: 'text-pink-500' },
    { label: 'Account Number', value: account.accountNumber, icon: Hash, color: 'text-emerald-500' },
    { label: 'IBAN', value: account.iban, icon: CreditCard, color: 'text-amber-500' },
  ].filter(d => d.value) : [];

  return (
    <section className="bg-white py-24 px-4 md:px-8">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto">
          <Reveal direction="up">
            <div className="text-center mb-16">
              <span className="text-plra-accent-purple font-black uppercase tracking-widest text-sm mb-4 block">Payment Gateway</span>
              <h2 className="text-4xl md:text-5xl font-black text-plra-black leading-tight">
                Official <span className="text-transparent bg-clip-text bg-gradient-to-r from-plra-accent-purple to-plra-accent-pink">Bank Account</span>
              </h2>
              <p className="text-gray-500 font-medium mt-4">Please use the following details for all official transactions.</p>
            </div>
          </Reveal>

          {loading ? (
            <div className="grid grid-cols-1 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-plra-bg-soft p-8 rounded-[2rem] flex items-center gap-6">
                  <Skeleton className="w-14 h-14 rounded-2xl" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-7 w-[60%]" />
                  </div>
                </div>
              ))}
            </div>
          ) : bankDetails.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Landmark size={48} className="mx-auto mb-4 opacity-30" />
              <p className="font-semibold">Account details not available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {bankDetails.map((detail, index) => (
                <Reveal key={index} delay={index * 0.1} direction="up">
                  <div
                    className="bg-plra-bg-soft p-8 rounded-[2rem] border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:bg-white hover:shadow-2xl transition-all duration-500 cursor-pointer"
                    onClick={() => copyToClipboard(detail.value)}
                  >
                    <div className="flex items-center gap-6">
                      <div className={`w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center ${detail.color} group-hover:scale-110 transition-transform`}>
                        <detail.icon size={28} />
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">{detail.label}</p>
                        <p className="text-xl md:text-2xl font-black text-plra-black">{detail.value}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-plra-accent-purple opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-xs font-black uppercase tracking-widest">Click to Copy</span>
                      <Copy size={18} />
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}

          <Reveal delay={0.5} direction="up">
            <div className="mt-16 p-10 bg-slate-950 rounded-[2.5rem] text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-plra-accent-purple/20 rounded-full blur-3xl"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                <div className="w-20 h-20 rounded-3xl bg-white/10 flex items-center justify-center text-plra-gold flex-shrink-0">
                  <CheckCircle2 size={40} />
                </div>
                <div>
                  <h3 className="text-2xl font-black mb-2">Important Note</h3>
                  <p className="text-gray-400 leading-relaxed">
                    After making a transaction, please ensure you save the digital receipt or take a screenshot. You will need to upload this proof of payment during your membership application or event registration.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
