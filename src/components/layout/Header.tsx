"use client";

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { NAV_LINKS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Menu, ChevronDown, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { toggleMobileMenu, setMobileMenuOpen } from '@/store/features/navigationSlice';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export const Header = () => {
  const dispatch = useDispatch();
  const isMobileMenuOpen = useSelector((state: RootState) => state.navigation.isMobileMenuOpen);
  const isMobile = useIsMobile();
  const [dynamicLinks, setDynamicLinks] = useState<{ records: any[], pressReleases: any[] }>({ records: [], pressReleases: [] });
  const [isScrolled, setIsScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let wasScrolled = false;
    const handleScroll = () => {
      const nowScrolled = window.scrollY > 40;
      if (nowScrolled && !wasScrolled && headerRef.current) {
        // Re-trigger slide-down animation each time header becomes sticky
        headerRef.current.classList.remove('animate-nav-slide-down');
        void headerRef.current.offsetWidth; // force reflow
        headerRef.current.classList.add('animate-nav-slide-down');
      }
      wasScrolled = nowScrolled;
      setIsScrolled(nowScrolled);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchNavData = async () => {
      try {
        const res = await fetch('/api/nav-links');
        const data = await res.json();
        if (data.success) {
          setDynamicLinks({ records: data.records, pressReleases: data.pressReleases });
        }
      } catch (e) {
        console.error("Failed to fetch dynamic nav links");
      }
    };
    fetchNavData();
  }, []);

  React.useEffect(() => {
    if (!isMobile && isMobileMenuOpen) {
      dispatch(setMobileMenuOpen(false));
    }
  }, [isMobile, isMobileMenuOpen, dispatch]);

  const downloadFile = (base64: string, fileName: string) => {
    try {
      const base64Parts = base64.split(',');
      const mimeType = base64Parts[0].match(/:(.*?);/)?.[1] || 'application/pdf';
      const base64Data = base64Parts[1] || base64;
      
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });
      
      let extension = '.pdf';
      if (mimeType.includes('word') || mimeType.includes('officedocument') || mimeType.includes('msword')) {
        extension = '.docx';
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      // Use the title as the filename, replacing invalid characters with spaces
      link.download = `${fileName.replace(/[\\/:*?"<>|]/g, ' ')}${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Could not download file.");
    }
  };

  const renderLinks = (links: any[]) => {
    return links.map((link) => {
      let submenus = link.submenus;
      const isDynamic = link.name === "Records" || link.name === "Press Release";
      
      if (link.name === "Records" && dynamicLinks.records.length > 0) {
        submenus = dynamicLinks.records;
      } else if (link.name === "Press Release" && dynamicLinks.pressReleases.length > 0) {
        submenus = dynamicLinks.pressReleases;
      }

      return submenus ? (
        <DropdownMenu key={link.name}>
          <DropdownMenuTrigger className="flex items-center px-4 py-2 text-[11px] font-black uppercase tracking-[0.15em] text-gray-400 hover:text-white transition-all group outline-none rounded-lg hover:bg-white/5">
            {link.name} <ChevronDown className="ml-1.5 h-3 w-3 transition-transform group-data-[state=open]:rotate-180 text-plra-gold" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-slate-950 border border-white/10 text-plra-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-2 min-w-[220px] backdrop-blur-2xl mt-2 max-h-[400px] overflow-y-auto custom-scrollbar">
            {submenus.map((submenu: any, idx: number) => (
              <DropdownMenuItem 
                key={idx} 
                onClick={() => isDynamic ? downloadFile(submenu.href, submenu.name) : null}
                asChild={!isDynamic}
              >
                {isDynamic ? (
                  <div className="flex items-center px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-plra-accent-purple/20 hover:to-transparent hover:text-plra-accent-purple transition-all font-bold text-xs tracking-wide cursor-pointer">
                    <div className="w-1.5 h-1.5 rounded-full bg-plra-gold mr-3"></div>
                    {submenu.name}
                  </div>
                ) : (
                  <Link 
                    href={submenu.href}
                    className="flex items-center px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-plra-accent-purple/20 hover:to-transparent hover:text-plra-accent-purple transition-all font-bold text-xs tracking-wide cursor-pointer"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-plra-gold mr-3"></div>
                    {submenu.name}
                  </Link>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link key={link.name} href={link.href} className="px-4 py-2 text-[11px] font-black uppercase tracking-[0.15em] text-gray-400 hover:text-white transition-all rounded-lg hover:bg-white/5">
          {link.name}
        </Link>
      );
    });
  };

  return (
    <header
      ref={headerRef}
      className={cn(
        "text-plra-white sticky top-0 z-50 border-b transition-colors duration-500",
        isScrolled
          ? "bg-gray-900/70 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border-white/15"
          : "bg-slate-950/95 backdrop-blur-xl shadow-2xl border-white/10"
      )}
    >
      <div className="container mx-auto flex items-center justify-between py-3 px-4 md:px-8">
        <Link href="/" className="flex items-center group">
          <div className="relative w-[50px] h-[50px] transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
            <Image src="/plra_logo.png" alt="PLRA Logo" fill className="object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]" />
          </div>
          <div className="ml-3 hidden lg:block">
            <p className="text-[10px] font-black tracking-[0.3em] text-plra-gold leading-none mb-1">PAKISTAN</p>
            <p className="text-sm font-black tracking-tight text-white leading-none">LONG RANGE RIFLE</p>
          </div>
        </Link>

        {isMobile ? (
          <Button variant="ghost" size="icon" onClick={() => dispatch(toggleMobileMenu())} className="text-plra-white hover:bg-white/10 rounded-full">
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        ) : (
          <nav className="hidden md:flex items-center space-x-1">
            {renderLinks(NAV_LINKS)}
            <div className="pl-4 ml-2 border-l border-white/10">
              <Link href="/join-now" passHref>
                <Button className="bg-gradient-to-br from-plra-accent-purple to-plra-accent-pink hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:scale-105 transition-all text-white font-black text-[11px] uppercase tracking-widest px-6 py-5 rounded-xl border-none">
                  Join Now
                </Button>
              </Link>
            </div>
          </nav>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && isMobile && (
        <div className="md:hidden bg-slate-950 border-t border-white/10 animate-in fade-in slide-in-from-top-4 duration-300">
          <nav className="flex flex-col items-center space-y-2 py-10 px-6">
            {NAV_LINKS.map((link) => {
              let submenus = link.submenus;
              const isDynamic = link.name === "Records" || link.name === "Press Release";
              
              if (link.name === "Records" && dynamicLinks.records.length > 0) submenus = dynamicLinks.records;
              if (link.name === "Press Release" && dynamicLinks.pressReleases.length > 0) submenus = dynamicLinks.pressReleases;

              return submenus ? (
                <div key={link.name} className="w-full text-center py-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-plra-gold mb-4">{link.name}</p>
                  <div className="flex flex-col space-y-1">
                    {submenus.map((submenu: any, idx: number) => (
                      <button 
                        key={idx} 
                        onClick={() => {
                          if (isDynamic) {
                            downloadFile(submenu.href, submenu.name);
                          } else {
                            window.location.href = submenu.href;
                          }
                          dispatch(setMobileMenuOpen(false));
                        }}
                        className="text-lg font-black text-white hover:text-plra-accent-purple py-2 transition-colors w-full"
                      >
                        {submenu.name}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  className="text-xl font-black uppercase tracking-widest text-white hover:text-plra-accent-purple py-3 transition-colors" 
                  onClick={() => dispatch(setMobileMenuOpen(false))}
                >
                  {link.name}
                </Link>
              );
            })}
            <Link href="/join-now" passHref className="w-full pt-8">
              <Button 
                className="w-full bg-gradient-to-r from-plra-accent-purple to-plra-accent-pink py-7 text-sm font-black uppercase tracking-widest rounded-2xl shadow-2xl" 
                onClick={() => dispatch(setMobileMenuOpen(false))}
              >
                Join Association
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};