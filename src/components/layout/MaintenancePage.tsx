import React from 'react';
import Image from 'next/image';
import { Hammer, Clock, Mail } from 'lucide-react';

export const MaintenancePage = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 overflow-hidden relative">
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-plra-gold/10 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-plra-accent-purple/10 rounded-full blur-[120px] -z-10"></div>

      <div className="max-w-3xl w-full text-center space-y-12">
        <div className="relative w-32 h-32 mx-auto animate-float">
          <Image src="/plra_logo.png" alt="PLRA Logo" fill className="object-contain drop-shadow-[0_0_20px_rgba(245,158,11,0.3)]" />
        </div>

        <div className="space-y-6">
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">
            UNDER <span className="text-transparent bg-clip-text bg-gradient-to-r from-plra-gold to-orange-500">MAINTENANCE</span>
          </h1>
          <p className="text-xl text-gray-400 font-medium max-w-2xl mx-auto leading-relaxed">
            We are currently upgrading our systems to provide you with a better experience. We'll be back online shortly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-plra-gold/20 flex items-center justify-center text-plra-gold">
              <Hammer size={24} />
            </div>
            <p className="text-sm font-bold text-white uppercase tracking-widest">Upgrading</p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-plra-accent-purple/20 flex items-center justify-center text-plra-accent-purple">
              <Clock size={24} />
            </div>
            <p className="text-sm font-bold text-white uppercase tracking-widest">Back Soon</p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-plra-accent-pink/20 flex items-center justify-center text-plra-accent-pink">
              <Mail size={24} />
            </div>
            <p className="text-sm font-bold text-white uppercase tracking-widest">Support</p>
          </div>
        </div>

        <div className="pt-12 border-t border-white/10">
          <p className="text-gray-500 font-black uppercase tracking-[0.3em] text-xs">
            Pakistan Long Range Rifle Association
          </p>
        </div>
      </div>
    </div>
  );
};