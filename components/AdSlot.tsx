
import React, { useEffect, useState } from 'react';
import { AdPlacement, SiteSettings } from '../types';
import { INITIAL_SITE_SETTINGS } from '../constants';
import { supabaseService } from '../services/supabaseService';

interface AdSlotProps {
  placement: 'header' | 'footer' | 'blogContent' | 'toolDirectory';
  className?: string;
}

const AdSlot: React.FC<AdSlotProps> = ({ placement, className = "" }) => {
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SITE_SETTINGS);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await supabaseService.getSettings();
        if (data) setSettings(data);
      } catch (err) {
        console.error('Failed to load ad settings:', err);
      }
    };
    loadSettings();
  }, []);

  const config = settings.ads.placements[placement];

  if (!config.isEnabled) return null;

  return (
    <div 
      className={`ad-slot-container flex justify-center w-full overflow-hidden transition-all ${className}`}
      dangerouslySetInnerHTML={{ __html: config.code }}
    />
  );
};

export default AdSlot;
