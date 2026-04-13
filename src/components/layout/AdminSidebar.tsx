"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ADMIN_NAV_LINKS } from '@/lib/admin-constants';
import { cn } from '@/lib/utils';
import { ChevronDown, LogOut, User as UserIcon } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';

export const AdminSidebar = () => {
  const pathname = usePathname();
  const [openCollapsibles, setOpenCollapsibles] = useState<string[]>([]);

  const toggleCollapsible = (name: string) => {
    setOpenCollapsibles((prev) =>
      prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]
    );
  };

  React.useEffect(() => {
    const initialOpen: string[] = [];
    ADMIN_NAV_LINKS.forEach(link => {
      if (link.submenus && link.submenus.some(submenu => pathname.startsWith(submenu.href))) {
        initialOpen.push(link.name);
      }
    });
    setOpenCollapsibles(initialOpen);
  }, [pathname]);

  return (
    <aside className="w-72 bg-admin-sidebar-bg text-white h-screen flex flex-col shadow-2xl z-50">
      {/* Logo Section */}
      <div className="p-8 mb-4">
        <Link href="/admin/dashboard" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 transition-transform duration-500 group-hover:scale-110">
            <Image src="/plra_logo.png" alt="PLRA Logo" fill className="object-contain" />
          </div>
          <div>
            <p className="text-[10px] font-black tracking-[0.2em] text-admin-accent leading-none mb-1">ADMIN</p>
            <p className="text-lg font-black tracking-tight text-white leading-none">PANEL</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-grow px-4 space-y-1 overflow-y-auto custom-scrollbar">
        {ADMIN_NAV_LINKS.map((link) => {
          const isActiveParent = link.submenus && link.submenus.some(submenu => pathname.startsWith(submenu.href));
          const isOpen = openCollapsibles.includes(link.name);

          return link.submenus ? (
            <Collapsible
              key={link.name}
              open={isOpen}
              onOpenChange={() => toggleCollapsible(link.name)}
              className="space-y-1"
            >
              <CollapsibleTrigger
                className={cn(
                  "flex items-center justify-between w-full px-4 py-3 rounded-xl text-left text-sm font-bold transition-all duration-300",
                  isActiveParent 
                    ? "bg-white/10 text-admin-accent" 
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <div className="flex items-center gap-3">
                  <link.icon className={cn("h-5 w-5", isActiveParent ? "text-admin-accent" : "text-gray-500")} />
                  <span>{link.name}</span>
                </div>
                <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", isOpen && "rotate-180")} />
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-10 space-y-1 mt-1">
                {link.submenus.map((submenu) => (
                  <Link
                    key={submenu.name}
                    href={submenu.href}
                    className={cn(
                      "block px-4 py-2.5 rounded-lg text-xs font-bold transition-all duration-300",
                      pathname === submenu.href 
                        ? "text-admin-accent bg-admin-accent/10" 
                        : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                    )}
                  >
                    {submenu.name}
                  </Link>
                ))}
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300",
                pathname === link.href 
                  ? "bg-admin-accent text-admin-sidebar-bg shadow-[0_10px_20px_rgba(245,158,11,0.2)]" 
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <link.icon className={cn("h-5 w-5", pathname === link.href ? "text-admin-sidebar-bg" : "text-gray-500")} />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / User Profile */}
      <div className="p-4 mt-auto border-t border-white/5">
        <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-admin-accent/20 flex items-center justify-center text-admin-accent">
            <UserIcon size={20} />
          </div>
          <div className="flex-grow overflow-hidden">
            <p className="text-sm font-bold text-white truncate">Admin User</p>
            <p className="text-[10px] text-gray-500 truncate">Super Administrator</p>
          </div>
          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg">
            <LogOut size={18} />
          </Button>
        </div>
      </div>
    </aside>
  );
};