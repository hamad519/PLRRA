"use client";

import React, { useEffect, useState } from 'react';
import { LATEST_NEWS_ITEMS } from '@/lib/constants';

export const LatestNewsTicker = () => {
  const [newsItems, setNewsItems] = useState<string[]>(LATEST_NEWS_ITEMS);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch('/api/latest-news');
        const data = await res.json();
        if (data.success && data.data.length > 0) {
          setNewsItems(data.data.map((item: { title: string }) => item.title));
        }
      } catch {
        // fallback to static items already set as default state
      }
    };
    fetchNews();
  }, []);

  return (
    <div className="bg-[#0a0a0a] border-b border-plra-gold/30 overflow-hidden flex items-center h-9">
      {/* Label */}
      <div className="shrink-0 flex items-center self-stretch bg-plra-gold px-4 z-10">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-950 whitespace-nowrap">
          Latest News
        </span>
      </div>

      {/* Divider arrow */}
      <div
        className="shrink-0 w-0 h-0 z-10"
        style={{
          borderTop: '18px solid transparent',
          borderBottom: '18px solid transparent',
          borderLeft: '12px solid #f59e0b',
        }}
      />

      {/* Scrolling track */}
      <div className="relative flex-1 overflow-hidden h-full flex items-center">
        <div className="inline-flex items-center animate-news-scroll whitespace-nowrap">
          {newsItems.map((news, index) => (
            <span key={index} className="inline-flex items-center px-6">
              <span className="text-plra-gold mr-2 text-xs select-none">◆</span>
              <span className="text-[11px] font-semibold text-gray-200 tracking-wide">
                {news}
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
