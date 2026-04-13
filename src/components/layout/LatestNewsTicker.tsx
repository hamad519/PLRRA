"use client";

import React from 'react';
import { LATEST_NEWS_ITEMS } from '@/lib/constants';
import { Dot } from 'lucide-react';

export const LatestNewsTicker = () => {
  return (
    <div className="bg-slate-950 text-plra-white text-xs py-2.5 overflow-hidden relative border-b border-white/5">
      <div className="flex items-center h-full">
        <div className="bg-plra-gold text-slate-950 font-black px-4 py-1 skew-x-[-12deg] ml-4 z-10 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
          <span className="inline-block skew-x-[12deg] text-[10px] uppercase tracking-tighter">Latest News</span>
        </div>
        <div className="relative flex-grow overflow-hidden h-full flex items-center">
          <div className="whitespace-nowrap absolute left-0 animate-news-scroll flex items-center">
            {LATEST_NEWS_ITEMS.map((news, index) => (
              <React.Fragment key={index}>
                <span className="px-6 font-medium text-gray-300 hover:text-plra-gold transition-colors cursor-default">{news}</span>
                <Dot className="inline-block h-4 w-4 text-plra-accent-purple" />
              </React.Fragment>
            ))}
            {/* Duplicate items to ensure continuous scroll */}
            {LATEST_NEWS_ITEMS.map((news, index) => (
              <React.Fragment key={`duplicate-${index}`}>
                <span className="px-6 font-medium text-gray-300 hover:text-plra-gold transition-colors cursor-default">{news}</span>
                {index < LATEST_NEWS_ITEMS.length - 1 && <Dot className="inline-block h-4 w-4 text-plra-accent-purple" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};