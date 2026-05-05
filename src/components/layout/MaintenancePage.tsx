import React from 'react';
import Image from 'next/image';
import { Hammer, Clock, Mail, Sparkles, Zap, Heart } from 'lucide-react';

export const MaintenancePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-6 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-plra-gold/5 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-plra-accent-purple/5 rounded-full blur-lg animate-bounce" style={{ animationDuration: '3s' }}></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-plra-accent-pink/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-plra-gold/5 rounded-full blur-xl animate-bounce" style={{ animationDuration: '4s' }}></div>

        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-gradient-to-r from-plra-gold/10 to-plra-accent-purple/10 rounded-full blur-[100px] animate-float"></div>
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-gradient-to-r from-plra-accent-pink/10 to-plra-gold/10 rounded-full blur-[100px] animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Sparkle effects */}
      <div className="absolute top-32 left-20 animate-ping">
        <Sparkles className="w-6 h-6 text-plra-gold/30" />
      </div>
      <div className="absolute top-60 right-32 animate-ping" style={{ animationDelay: '1.5s' }}>
        <Sparkles className="w-4 h-4 text-plra-accent-purple/30" />
      </div>
      <div className="absolute bottom-40 left-32 animate-ping" style={{ animationDelay: '3s' }}>
        <Sparkles className="w-5 h-5 text-plra-accent-pink/30" />
      </div>

      <div className="max-w-4xl w-full text-center space-y-16 relative z-10">
        {/* Logo with enhanced effects */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-plra-gold/20 to-plra-accent-purple/20 rounded-full blur-3xl scale-150 animate-pulse"></div>
          <div className="relative w-40 h-40 mx-auto animate-float">
            <div className="absolute inset-0 bg-gradient-to-r from-plra-gold/20 to-plra-accent-purple/20 rounded-full blur-xl animate-pulse"></div>
            <Image
              src="/plra_logo.png"
              alt="PLRA Logo"
              fill
              className="object-contain drop-shadow-[0_0_30px_rgba(245,158,11,0.4)] relative z-10"
            />
          </div>
        </div>

        {/* Main heading with enhanced typography */}
        <div className="space-y-8">
          <div className="relative">
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none relative z-10">
              UNDER{' '}
              <span className="relative">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-plra-gold via-orange-400 to-plra-accent-purple animate-gradient-x">
                  MAINTENANCE
                </span>
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-plra-gold to-plra-accent-purple rounded-full animate-pulse"></div>
              </span>
            </h1>
            <div className="absolute -top-4 -right-4 animate-spin" style={{ animationDuration: '8s' }}>
              <Zap className="w-8 h-8 text-plra-gold/50" />
            </div>
          </div>

          <p className="text-xl md:text-2xl text-gray-300 font-medium max-w-3xl mx-auto leading-relaxed">
            We're crafting something extraordinary for you. Our team is working diligently to enhance your experience with cutting-edge improvements and exciting new features.
          </p>

          {/* Progress indicator */}
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-3 h-3 bg-plra-gold rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-plra-accent-purple rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="w-3 h-3 bg-plra-accent-pink rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
            <p className="text-sm text-gray-500 font-medium">System Enhancement in Progress</p>
          </div>
        </div>

        {/* Enhanced feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 p-8 rounded-[2rem] flex flex-col items-center gap-6 hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-plra-gold/10">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-plra-gold/30 to-plra-gold/20 flex items-center justify-center text-plra-gold group-hover:scale-110 transition-transform duration-300">
                <Hammer size={28} />
              </div>
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-plra-gold rounded-full animate-ping"></div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-lg font-black text-white uppercase tracking-widest">Upgrading</p>
              <p className="text-sm text-gray-400">Enhancing performance & features</p>
            </div>
          </div>

          <div className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 p-8 rounded-[2rem] flex flex-col items-center gap-6 hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-plra-accent-purple/10">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-plra-accent-purple/30 to-plra-accent-purple/20 flex items-center justify-center text-plra-accent-purple group-hover:scale-110 transition-transform duration-300">
                <Clock size={28} />
              </div>
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-plra-accent-purple rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-lg font-black text-white uppercase tracking-widest">Back Soon</p>
              <p className="text-sm text-gray-400">Expected completion: 2-4 hours</p>
            </div>
          </div>

          <div className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 p-8 rounded-[2rem] flex flex-col items-center gap-6 hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-plra-accent-pink/10">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-plra-accent-pink/30 to-plra-accent-pink/20 flex items-center justify-center text-plra-accent-pink group-hover:scale-110 transition-transform duration-300">
                <Heart size={28} />
              </div>
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-plra-accent-pink rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-lg font-black text-white uppercase tracking-widest">Stay Tuned</p>
              <p className="text-sm text-gray-400">Exciting updates coming your way</p>
            </div>
          </div>
        </div>

        {/* Contact section */}
        <div className="pt-16 border-t border-white/10">
          <div className="space-y-6">
            <p className="text-gray-400 font-medium">
              Need immediate assistance? Contact our support team
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:support@plra.pk"
                className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-plra-gold/20 to-plra-accent-purple/20 hover:from-plra-gold/30 hover:to-plra-accent-purple/30 border border-white/20 rounded-xl text-white font-bold transition-all duration-300 hover:scale-105"
              >
                <Mail size={18} />
                support@plra.pk
              </a>
              <a
                href="tel:+92-XXX-XXXXXXX"
                className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-plra-accent-pink/20 to-plra-gold/20 hover:from-plra-accent-pink/30 hover:to-plra-gold/30 border border-white/20 rounded-xl text-white font-bold transition-all duration-300 hover:scale-105"
              >
                <Heart size={18} />
                Emergency Support
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-2 h-2 bg-plra-gold rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-plra-accent-purple rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
            <div className="w-2 h-2 bg-plra-accent-pink rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
          </div>
          <p className="text-gray-500 font-black uppercase tracking-[0.3em] text-xs">
            Pakistan Long Range Rifle Association
          </p>
          <p className="text-gray-600 text-xs mt-2">© 2024 PLRA. All rights reserved.</p>
        </div>
      </div>

      {/* Custom CSS animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes gradient-x {
          0%, 100% { background-size: 200% 200%; background-position: left center; }
          50% { background-size: 200% 200%; background-position: right center; }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-gradient-x { animation: gradient-x 3s ease infinite; }
      `}</style>
    </div>
  );
};