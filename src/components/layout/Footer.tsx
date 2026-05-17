"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FOOTER_LINKS } from '@/lib/constants';
import { Instagram, Facebook, Youtube, Twitter, MapPin, Phone, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-950 text-plra-white pt-20 pb-10 border-t border-white/5">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Column 1: Logo & Description */}
          <div className="flex flex-col items-center md:items-start">
            <Link href="/" className="flex items-center mb-8 group">
              <div className="relative w-16 h-16 transition-transform duration-500 group-hover:scale-110">
                <Image src="/plra_logo.png" alt="PLRA Logo" fill className="object-contain" />
              </div>
              <div className="ml-4">
                <p className="text-[10px] font-black tracking-[0.3em] text-plra-gold leading-none mb-1">PAKISTAN</p>
                <p className="text-lg font-black tracking-tight text-white leading-none">LONG RANGE RIFLE</p>
                <p className="text-[10px] font-black tracking-[0.3em] text-plra-gold leading-none mt-1">ASSOCIATION</p>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-8 text-center md:text-left">
              The national governing body for Full-bore rifle shooting in Pakistan, dedicated to excellence and international representation.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: Facebook, href: "https://facebook.com", color: "hover:bg-blue-600" },
                { icon: Instagram, href: "https://instagram.com", color: "hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-red-500 hover:to-purple-500" },
                { icon: Twitter, href: "https://twitter.com", color: "hover:bg-sky-500" },
                { icon: Youtube, href: "https://youtube.com", color: "hover:bg-red-600" }
              ].map((social, i) => (
                <a 
                  key={i}
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center transition-all duration-300 ${social.color} hover:scale-110 hover:shadow-lg`}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Columns 2 & 3: Links from Constants */}
          {FOOTER_LINKS.map((section) => (
            <div key={section.title}>
              <h3 className="text-white font-black uppercase tracking-widest text-xs mb-8 border-l-2 border-plra-gold pl-4">{section.title}</h3>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-gray-400 hover:text-plra-gold transition-colors text-sm font-medium flex items-center group">
                      <span className="w-0 group-hover:w-4 h-[1px] bg-plra-gold transition-all duration-300 mr-0 group-hover:mr-2"></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Column 4: Contact Info (Fixing the empty space) */}
          <div>
            <h3 className="text-white font-black uppercase tracking-widest text-xs mb-8 border-l-2 border-plra-gold pl-4">Contact Info</h3>
            <ul className="space-y-6">
              <li className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-plra-gold flex-shrink-0 group-hover:bg-plra-gold group-hover:text-slate-950 transition-all">
                  <MapPin size={18} />
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  C/O Army Marksmanship Unit, Jhelum Cantonment, Pakistan
                </p>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-plra-gold flex-shrink-0 group-hover:bg-plra-gold group-hover:text-slate-950 transition-all">
                  <Phone size={18} />
                </div>
                <p className="text-gray-400 text-sm font-medium">0092-544-620081</p>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-plra-gold flex-shrink-0 group-hover:bg-plra-gold group-hover:text-slate-950 transition-all">
                  <Mail size={18} />
                </div>
                <p className="text-gray-400 text-sm font-medium truncate">plra.pakistan2022@gmail.com</p>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs font-medium">
            © {new Date().getFullYear()} Pakistan Long Range Rifle Association. All rights reserved.
          </p>
          <div className="flex gap-8">
            <Link href="/privacy" className="text-gray-500 hover:text-white text-xs transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-gray-500 hover:text-white text-xs transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};