
import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { SiteSettings, AdPlacement } from '../../types';
import { INITIAL_SITE_SETTINGS } from '../../constants';
import { supabaseService } from '../../services/supabaseService';

const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SITE_SETTINGS);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<'seo' | 'ads'>('seo');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await supabaseService.getSettings();
        if (data) setSettings(data);
      } catch (err) {
        console.error('Failed to load settings:', err);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleSave = async () => {
    try {
      await supabaseService.updateSettings(settings);
      setIsSaved(true);
      // Dispatch custom event to notify App.tsx to reload head tags
      window.dispatchEvent(new Event('settingsUpdated'));
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      console.error('Failed to save settings:', err);
      alert('Failed to save settings.');
    }
  };

  const updateSEO = (field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      seo: { ...prev.seo, [field]: value }
    }));
  };

  const updateAdPlacement = (key: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      ads: {
        ...prev.ads,
        placements: {
          ...prev.ads.placements,
          [key]: { ...prev.ads.placements[key as keyof typeof prev.ads.placements], [field]: value }
        }
      }
    }));
  };

  return (
    <AdminLayout title="System Settings">
      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setActiveTab('seo')}
          className={`px-6 py-3 rounded-2xl font-black text-sm transition-all ${activeTab === 'seo' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-900 text-slate-500'}`}
        >
          SEO & Analytics
        </button>
        <button 
          onClick={() => setActiveTab('ads')}
          className={`px-6 py-3 rounded-2xl font-black text-sm transition-all ${activeTab === 'ads' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-900 text-slate-500'}`}
        >
          Ads & Monetization
        </button>
      </div>

      <div className="space-y-8 max-w-4xl pb-20">
        {activeTab === 'seo' ? (
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border dark:border-slate-800 p-10 shadow-sm space-y-8">
            <h2 className="text-2xl font-black dark:text-white">Technical SEO & Global Tracking</h2>
            
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Primary Site URL (Canonical)</label>
              <input 
                type="text" 
                value={settings.seo.siteUrl || ''}
                onChange={(e) => updateSEO('siteUrl', e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 rounded-2xl p-4 dark:text-white outline-none focus:ring-2 focus:ring-indigo-600"
                placeholder="https://aizonet.in"
              />
              <p className="mt-2 text-[10px] text-slate-400 font-medium italic">Update this when switching domains to maintain SEO authority and fix verification mismatches.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Google Analytics GA4 ID</label>
                <input 
                  type="text" 
                  value={settings.seo.googleAnalyticsId || ''}
                  onChange={(e) => updateSEO('googleAnalyticsId', e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 rounded-2xl p-4 dark:text-white outline-none focus:ring-2 focus:ring-indigo-600"
                  placeholder="G-XXXXXXXXXX"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Google Search Console Tag</label>
                <input 
                  type="text" 
                  value={settings.seo.googleSearchConsoleId || ''}
                  onChange={(e) => updateSEO('googleSearchConsoleId', e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 rounded-2xl p-4 dark:text-white outline-none focus:ring-2 focus:ring-indigo-600"
                  placeholder="Verification ID only"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Bing Webmaster Key</label>
                <input 
                  type="text" 
                  value={settings.seo.bingVerification || ''}
                  onChange={(e) => updateSEO('bingVerification', e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 rounded-2xl p-4 dark:text-white outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Yandex Verification</label>
                <input 
                  type="text" 
                  value={settings.seo.yandexVerification || ''}
                  onChange={(e) => updateSEO('yandexVerification', e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 rounded-2xl p-4 dark:text-white outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Baidu Verification</label>
                <input 
                  type="text" 
                  value={settings.seo.baiduVerification || ''}
                  onChange={(e) => updateSEO('baiduVerification', e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 rounded-2xl p-4 dark:text-white outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Pinterest Verification</label>
                <input 
                  type="text" 
                  value={settings.seo.pinterestVerification || ''}
                  onChange={(e) => updateSEO('pinterestVerification', e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 rounded-2xl p-4 dark:text-white outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Facebook Domain Verification</label>
              <input 
                type="text" 
                value={settings.seo.facebookDomainVerification || ''}
                onChange={(e) => updateSEO('facebookDomainVerification', e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 rounded-2xl p-4 dark:text-white outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Robots.txt Content</label>
              <textarea 
                rows={4}
                value={settings.seo.robotsTxt || ''}
                onChange={(e) => updateSEO('robotsTxt', e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 rounded-2xl p-4 dark:text-white font-mono text-sm outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border dark:border-slate-800 p-10 shadow-sm space-y-10">
            <h2 className="text-2xl font-black dark:text-white">Ads & Monetization (AdSense)</h2>
            
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">AdSense Publisher ID</label>
              <input 
                type="text" 
                value={settings.ads.adSenseClientId || ''}
                onChange={(e) => setSettings(prev => ({ ...prev, ads: { ...prev.ads, adSenseClientId: e.target.value } }))}
                className="w-full bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 rounded-2xl p-4 dark:text-white outline-none focus:ring-2 focus:ring-indigo-600"
                placeholder="pub-XXXXXXXXXXXXXXXX"
              />
            </div>

            <div className="space-y-10">
              {(Object.entries(settings.ads.placements) as [string, AdPlacement][]).map(([key, placement]) => (
                <div key={key} className="p-8 border dark:border-slate-800 rounded-3xl bg-slate-50/30 dark:bg-slate-950/30 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs">{placement.name}</h3>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={placement.isEnabled} 
                        onChange={(e) => updateAdPlacement(key, 'isEnabled', e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-slate-200 rounded-full peer dark:bg-slate-700 peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                    </label>
                  </div>
                  <textarea 
                    rows={4}
                    value={placement.code || ''}
                    onChange={(e) => updateAdPlacement(key, 'code', e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 rounded-2xl p-4 dark:text-white font-mono text-xs outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="sticky bottom-6">
          <button 
            onClick={handleSave}
            className={`px-10 py-5 rounded-2xl font-black transition-all shadow-xl active:scale-95 ${isSaved ? 'bg-green-600 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/30'}`}
          >
            {isSaved ? 'Settings Applied Successfully' : 'Save & Sync Settings'}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
