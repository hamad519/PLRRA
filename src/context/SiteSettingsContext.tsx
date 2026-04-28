"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

interface SiteSettings {
  address?: string;
  contactNo?: string;
  email?: string;
  workingHours?: string;
  facebookLink?: string;
  instagramLink?: string;
  isMaintenanceMode?: boolean;
  plraIntro?: string;
  stats?: {
    nationalRecords?: string;
    internationalMedals?: string;
    eliteShooters?: string;
    growthRate?: string;
  };
  championMoments?: Array<{ title: string; imageBase64: string }>;
  heroSlides?: Array<{ title: string; subtitle: string; description: string; imageBase64: string }>;
}

interface SiteSettingsContextType {
  settings: SiteSettings | null;
  loading: boolean;
}

const SiteSettingsContext = createContext<SiteSettingsContextType>({
  settings: null,
  loading: true,
});

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data.success) {
          setSettings(data.data);
        }
      } catch (e) {
        console.error('Failed to fetch site settings');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  return (
    <SiteSettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export const useSiteSettings = () => useContext(SiteSettingsContext);
