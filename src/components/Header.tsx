import React from 'react';
import { ArrowDownToLine, Bell, Globe } from 'lucide-react';
import { AppSettings } from '../types';

interface HeaderProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  activeDownloadsCount: number;
  onToggleNotificationDrawer: () => void;
  onOpenDownloadManager: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  onUpdateSettings,
  activeDownloadsCount,
  onToggleNotificationDrawer,
  onOpenDownloadManager,
}) => {
  const isUrdu = settings.language === 'ur';

  const toggleLanguage = () => {
    onUpdateSettings({ language: isUrdu ? 'en' : 'ur' });
  };

  return (
    <header className="px-4 py-2.5 bg-[#08090b]/95 backdrop-blur-md border-b border-zinc-800/80 sticky top-0 z-30 flex items-center justify-between select-none">
      {/* Brand Zone */}
      <div className="flex items-center gap-2.5">
        <div className="relative w-8 h-8 rounded-xl overflow-hidden border border-[#00F078]/40 shadow-[0_0_12px_rgba(0,240,120,0.3)] bg-black shrink-0">
          <img
            src="/src/assets/images/mns_tube_logo_1793395248385.jpg"
            alt="MNS TUBE PRO"
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback SVG if image is loading
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold tracking-tight text-white font-display text-base">
              MNS TUBE
            </span>
            <span className="px-1.5 py-0.2 bg-[#00F078] text-black font-extrabold text-[10px] rounded-md tracking-wider shadow-[0_0_8px_#00F078]">
              PRO
            </span>
          </div>
          <span className="text-[10px] text-zinc-400 font-medium">
            {isUrdu ? 'اینڈرائڈ ڈاؤنلوڈر' : 'Fast Media Downloader'}
          </span>
        </div>
      </div>

      {/* Action Zone */}
      <div className="flex items-center gap-2">
        {/* Language Quick Switch */}
        <button
          onClick={toggleLanguage}
          title="Toggle English / اردو"
          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-[#00F078] hover:border-[#00F078]/40 transition-all active:scale-95"
        >
          <Globe className="w-3.5 h-3.5 text-[#00F078]" />
          <span>{isUrdu ? 'EN' : 'اردو'}</span>
        </button>

        {/* Active Downloads Quick Trigger */}
        <button
          onClick={onOpenDownloadManager}
          title="Download Manager"
          className={`relative p-2 rounded-xl transition-all active:scale-95 ${
            activeDownloadsCount > 0
              ? 'bg-[#00F078]/15 border border-[#00F078]/50 text-[#00F078] shadow-[0_0_15px_rgba(0,240,120,0.25)]'
              : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
          }`}
        >
          <ArrowDownToLine className="w-4 h-4" />
          {activeDownloadsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#00F078] text-black text-[9px] font-bold flex items-center justify-center animate-pulse">
              {activeDownloadsCount}
            </span>
          )}
        </button>

        {/* Android Notification Shade Trigger */}
        <button
          onClick={onToggleNotificationDrawer}
          title="Android Notification Drawer"
          className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-all active:scale-95 relative"
        >
          <Bell className="w-4 h-4" />
          {activeDownloadsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#00F078]"></span>
          )}
        </button>
      </div>
    </header>
  );
};
