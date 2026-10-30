import React from 'react';
import { ArrowDownCircle, PlayCircle, Settings2 } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavProps {
  currentTab: TabType;
  onChangeTab: (tab: TabType) => void;
  t: (key: string) => string;
  activeDownloadsCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onChangeTab,
  t,
  activeDownloadsCount,
}) => {
  return (
    <nav className="h-16 bg-[#08090b]/95 backdrop-blur-md border-t border-zinc-800/80 px-6 flex items-center justify-around z-30 select-none shrink-0">
      {/* Tab 1: Download */}
      <button
        onClick={() => onChangeTab('download')}
        className={`flex-1 flex flex-col items-center justify-center py-1 transition-all relative ${
          currentTab === 'download'
            ? 'text-[#00F078]'
            : 'text-zinc-400 hover:text-zinc-200'
        }`}
      >
        <div className="relative">
          <ArrowDownCircle
            className={`w-5 h-5 transition-transform ${
              currentTab === 'download' ? 'scale-110' : ''
            }`}
          />
          {activeDownloadsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#00F078] shadow-[0_0_6px_#00F078]"></span>
          )}
        </div>
        <span
          className={`text-[11px] mt-1 font-medium transition-all ${
            currentTab === 'download' ? 'font-bold text-[#00F078]' : ''
          }`}
        >
          {t('navDownload')}
        </span>
        {currentTab === 'download' && (
          <span className="absolute bottom-0 w-8 h-0.5 bg-[#00F078] rounded-full shadow-[0_0_8px_#00F078]"></span>
        )}
      </button>

      {/* Tab 2: Play */}
      <button
        onClick={() => onChangeTab('play')}
        className={`flex-1 flex flex-col items-center justify-center py-1 transition-all relative ${
          currentTab === 'play'
            ? 'text-[#00F078]'
            : 'text-zinc-400 hover:text-zinc-200'
        }`}
      >
        <PlayCircle
          className={`w-5 h-5 transition-transform ${
            currentTab === 'play' ? 'scale-110' : ''
          }`}
        />
        <span
          className={`text-[11px] mt-1 font-medium transition-all ${
            currentTab === 'play' ? 'font-bold text-[#00F078]' : ''
          }`}
        >
          {t('navPlay')}
        </span>
        {currentTab === 'play' && (
          <span className="absolute bottom-0 w-8 h-0.5 bg-[#00F078] rounded-full shadow-[0_0_8px_#00F078]"></span>
        )}
      </button>

      {/* Tab 3: Settings */}
      <button
        onClick={() => onChangeTab('settings')}
        className={`flex-1 flex flex-col items-center justify-center py-1 transition-all relative ${
          currentTab === 'settings'
            ? 'text-[#00F078]'
            : 'text-zinc-400 hover:text-zinc-200'
        }`}
      >
        <Settings2
          className={`w-5 h-5 transition-transform ${
            currentTab === 'settings' ? 'scale-110' : ''
          }`}
        />
        <span
          className={`text-[11px] mt-1 font-medium transition-all ${
            currentTab === 'settings' ? 'font-bold text-[#00F078]' : ''
          }`}
        >
          {t('navSettings')}
        </span>
        {currentTab === 'settings' && (
          <span className="absolute bottom-0 w-8 h-0.5 bg-[#00F078] rounded-full shadow-[0_0_8px_#00F078]"></span>
        )}
      </button>
    </nav>
  );
};
