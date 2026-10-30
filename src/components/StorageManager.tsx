import React, { useState } from 'react';
import { HardDrive, Trash2, CheckCircle2, Film, Music, MessageCircle, Sparkles, FolderTree } from 'lucide-react';
import { AppSettings } from '../types';

interface StorageManagerProps {
  settings: AppSettings;
  videoCount: number;
  musicCount: number;
  whatsAppCount: number;
  t: (key: string) => string;
}

export const StorageManager: React.FC<StorageManagerProps> = ({
  settings,
  videoCount,
  musicCount,
  whatsAppCount,
  t,
}) => {
  const [cacheSizeMB, setCacheSizeMB] = useState(342.8);
  const [cleaned, setCleaned] = useState(false);

  const videoGB = 18.4 + videoCount * 0.15;
  const musicGB = 6.2 + musicCount * 0.01;
  const waGB = 2.4 + whatsAppCount * 0.03;
  const cacheGB = cacheSizeMB / 1024;
  const usedGB = (videoGB + musicGB + waGB + cacheGB).toFixed(1);
  const totalGB = 128;
  const freeGB = (totalGB - parseFloat(usedGB)).toFixed(1);
  const usedPercent = Math.min(100, Math.round((parseFloat(usedGB) / totalGB) * 100));

  const handleClean = () => {
    setCacheSizeMB(0);
    setCleaned(true);
    setTimeout(() => setCleaned(false), 4000);
  };

  return (
    <div className="space-y-4">
      {/* Storage Overview Card */}
      <div className="p-4 bg-[#0f1117] rounded-2xl border border-zinc-800 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-[#00F078]">
              <HardDrive className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">{t('storageManager')}</h3>
              <p className="text-[10px] text-zinc-400">Internal Device Storage (UFS 4.0)</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-[#00F078]">
            {usedGB} GB / {totalGB} GB ({usedPercent}%)
          </span>
        </div>

        {/* Stacked Progress Bar */}
        <div className="w-full h-3 bg-zinc-950 rounded-full overflow-hidden flex p-0.5 border border-zinc-800/80">
          <div
            className="h-full bg-emerald-500 rounded-l-full"
            style={{ width: `${(videoGB / totalGB) * 100}%` }}
            title="Videos"
          ></div>
          <div
            className="h-full bg-cyan-400"
            style={{ width: `${(musicGB / totalGB) * 100}%` }}
            title="Music"
          ></div>
          <div
            className="h-full bg-green-400"
            style={{ width: `${(waGB / totalGB) * 100}%` }}
            title="WhatsApp Status"
          ></div>
          <div
            className="h-full bg-amber-400"
            style={{ width: `${(cacheGB / totalGB) * 100}%` }}
            title="Cache"
          ></div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
          <div className="flex items-center gap-1.5 text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Videos: {videoGB.toFixed(1)} GB</span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span>Music: {musicGB.toFixed(1)} GB</span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-green-400"></span>
            <span>WhatsApp: {waGB.toFixed(1)} GB</span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>Cache: {cacheSizeMB.toFixed(0)} MB</span>
          </div>
        </div>
      </div>

      {/* 1-Tap Cache Cleaner */}
      <div className="p-4 bg-gradient-to-r from-emerald-950/30 to-zinc-900/80 rounded-2xl border border-zinc-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-amber-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">App Cache & Temp Chunks</h4>
            <p className="text-[10px] text-zinc-400">
              {cacheSizeMB > 0
                ? `${cacheSizeMB.toFixed(1)} MB junk files can be cleaned safely`
                : 'Cache is completely clean!'}
            </p>
          </div>
        </div>

        <button
          onClick={handleClean}
          disabled={cacheSizeMB === 0}
          className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            cacheSizeMB > 0
              ? 'bg-[#00F078] text-black hover:bg-[#00d66c] shadow-[0_0_15px_rgba(0,240,120,0.3)] active:scale-95'
              : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
          }`}
        >
          {cleaned ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-black" />
              <span>Cleaned!</span>
            </>
          ) : (
            <>
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t('cleanCache')}</span>
            </>
          )}
        </button>
      </div>

      {/* Directory Map */}
      <div className="p-4 bg-[#0c0e12] rounded-2xl border border-zinc-800/80 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-zinc-200">
          <FolderTree className="w-4 h-4 text-[#00F078]" />
          <span>MNS TUBE PRO File System</span>
        </div>

        <div className="space-y-1.5 text-[11px] font-mono text-zinc-400 pt-1">
          <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
            <span className="truncate text-zinc-300">📁 {settings.downloadLocation}Videos/</span>
            <span className="text-[#00F078] font-bold">{videoCount} files</span>
          </div>
          <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
            <span className="truncate text-zinc-300">📁 {settings.downloadLocation}Music/</span>
            <span className="text-[#00F078] font-bold">{musicCount} tracks</span>
          </div>
          <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
            <span className="truncate text-zinc-300">📁 {settings.downloadLocation}WhatsApp/</span>
            <span className="text-[#00F078] font-bold">{whatsAppCount} items</span>
          </div>
        </div>
      </div>
    </div>
  );
};
