import React, { useState } from 'react';
import { X, ArrowDown, Video, Music, Check, Folder, ShieldCheck } from 'lucide-react';
import { MediaFormat } from '../types';

export interface DownloadTarget {
  id: string;
  title: string;
  source: string;
  url: string;
  thumbnail: string;
  duration?: string;
  streamUrl?: string;
  defaultFormat?: MediaFormat;
}

interface DownloadModalProps {
  target: DownloadTarget | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmDownload: (params: {
    format: MediaFormat;
    quality: string;
    fileSize: number;
    triggerBrowserSave: boolean;
  }) => void;
  storageLocation: string;
  t: (key: string) => string;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({
  target,
  isOpen,
  onClose,
  onConfirmDownload,
  storageLocation,
  t,
}) => {
  if (!isOpen || !target) return null;

  const [selectedFormat, setSelectedFormat] = useState<MediaFormat>(
    target.defaultFormat || 'video'
  );
  const [selectedQuality, setSelectedQuality] = useState<string>(
    selectedFormat === 'video' ? '1080p Full HD' : '320kbps MP3'
  );
  const [saveToBrowser, setSaveToBrowser] = useState<boolean>(true);

  const videoOptions = [
    { label: '1080p Full HD', resolution: '1920x1080', size: 124.5, tag: 'Best Quality' },
    { label: '720p HD', resolution: '1280x720', size: 76.2, tag: 'Fast' },
    { label: '480p Standard', resolution: '854x480', size: 42.1, tag: 'Data Saver' },
    { label: '360p Mobile', resolution: '640x360', size: 24.8, tag: 'Low Storage' },
  ];

  const audioOptions = [
    { label: '320kbps MP3', codec: 'MP3 · 48kHz', size: 9.8, tag: 'Studio HD' },
    { label: '192kbps MP3', codec: 'MP3 · 44.1kHz', size: 6.2, tag: 'Balanced' },
    { label: '128kbps M4A', codec: 'AAC / M4A', size: 4.1, tag: 'Ultra Fast' },
  ];

  const currentOptions = selectedFormat === 'video' ? videoOptions : audioOptions;
  const currentSelectedOption =
    currentOptions.find((opt) => opt.label === selectedQuality) || currentOptions[0];

  const handleFormatChange = (fmt: MediaFormat) => {
    setSelectedFormat(fmt);
    setSelectedQuality(fmt === 'video' ? '1080p Full HD' : '320kbps MP3');
  };

  const handleStart = () => {
    onConfirmDownload({
      format: selectedFormat,
      quality: selectedQuality,
      fileSize: currentSelectedOption.size,
      triggerBrowserSave: saveToBrowser,
    });
    onClose();
  };

  return (
    <div className="absolute inset-0 bg-black/85 backdrop-blur-sm z-50 flex flex-col justify-end animate-in fade-in duration-200">
      <div className="bg-[#0e0f13] border-t border-zinc-800 rounded-t-3xl p-5 shadow-2xl max-h-[92%] overflow-y-auto">
        {/* Header with Close */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00F078] shadow-[0_0_8px_#00F078]"></span>
            <span className="text-sm font-bold text-white tracking-wide">
              {t('selectFormatQuality')}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Preview Lockup */}
        <div className="flex gap-3 py-3 items-center">
          <div className="w-20 h-14 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 shrink-0 relative">
            <img
              src={target.thumbnail}
              alt={target.title}
              className="w-full h-full object-cover"
            />
            {target.duration && (
              <span className="absolute bottom-1 right-1 bg-black/80 text-[9px] px-1 rounded text-white font-mono">
                {target.duration}
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-semibold text-white line-clamp-2 leading-snug">
              {target.title}
            </h4>
            <div className="flex items-center gap-2 mt-1 text-[11px] text-zinc-400">
              <span className="text-[#00F078] font-medium">{target.source}</span>
              <span>·</span>
              <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                <ShieldCheck className="w-3 h-3" /> DRM-Free & Verified
              </span>
            </div>
          </div>
        </div>

        {/* Format Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-950 rounded-xl border border-zinc-800/80 my-2">
          <button
            onClick={() => handleFormatChange('video')}
            className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
              selectedFormat === 'video'
                ? 'bg-[#00F078] text-black shadow-[0_0_12px_rgba(0,240,120,0.35)]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            {t('videoFormat')}
          </button>
          <button
            onClick={() => handleFormatChange('audio')}
            className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
              selectedFormat === 'audio'
                ? 'bg-[#00F078] text-black shadow-[0_0_12px_rgba(0,240,120,0.35)]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            {t('audioFormat')}
          </button>
        </div>

        {/* Quality list options */}
        <div className="space-y-2 my-3">
          {selectedFormat === 'video'
            ? videoOptions.map((opt) => (
                <div
                  key={opt.label}
                  onClick={() => setSelectedQuality(opt.label)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    selectedQuality === opt.label
                      ? 'bg-[#00F078]/10 border-[#00F078] shadow-[0_0_15px_rgba(0,240,120,0.2)]'
                      : 'bg-[#14161c] border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        selectedQuality === opt.label
                          ? 'border-[#00F078] bg-[#00F078]'
                          : 'border-zinc-600'
                      }`}
                    >
                      {selectedQuality === opt.label && (
                        <Check className="w-3 h-3 text-black stroke-[3]" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{opt.label}</p>
                      <p className="text-[10px] text-zinc-400">
                        {opt.resolution} · {opt.tag}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-semibold text-zinc-300">
                    ~{opt.size} MB
                  </span>
                </div>
              ))
            : audioOptions.map((opt) => (
                <div
                  key={opt.label}
                  onClick={() => setSelectedQuality(opt.label)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    selectedQuality === opt.label
                      ? 'bg-[#00F078]/10 border-[#00F078] shadow-[0_0_15px_rgba(0,240,120,0.2)]'
                      : 'bg-[#14161c] border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        selectedQuality === opt.label
                          ? 'border-[#00F078] bg-[#00F078]'
                          : 'border-zinc-600'
                      }`}
                    >
                      {selectedQuality === opt.label && (
                        <Check className="w-3 h-3 text-black stroke-[3]" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{opt.label}</p>
                      <p className="text-[10px] text-zinc-400">
                        {opt.codec} · {opt.tag}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-semibold text-[#00F078]">
                    ~{opt.size} MB
                  </span>
                </div>
              ))}
        </div>

        {/* Storage Location & Browser Download Toggle */}
        <div className="py-2.5 px-3 bg-[#0a0b0e] rounded-xl border border-zinc-800/80 mb-4 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-zinc-400">
            <span className="flex items-center gap-1.5 text-zinc-300">
              <Folder className="w-3.5 h-3.5 text-[#00F078]" />
              Destination
            </span>
            <span className="text-zinc-400 font-mono text-[10px] truncate max-w-[200px]">
              {storageLocation}
            </span>
          </div>

          <label className="flex items-center justify-between text-xs cursor-pointer pt-1 border-t border-zinc-800/60">
            <span className="text-zinc-300">Save actual file to browser storage / device</span>
            <input
              type="checkbox"
              checked={saveToBrowser}
              onChange={(e) => setSaveToBrowser(e.target.checked)}
              className="accent-[#00F078] w-4 h-4 rounded cursor-pointer"
            />
          </label>
        </div>

        {/* Start Download CTA */}
        <button
          onClick={handleStart}
          className="w-full py-3.5 rounded-xl bg-[#00F078] text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,240,120,0.45)] hover:bg-[#00d66c] active:scale-[0.98] transition-all"
        >
          <ArrowDown className="w-4 h-4 stroke-[2.5]" />
          <span>{t('startDownload')}</span>
          <span className="text-xs opacity-75">
            (~{currentSelectedOption.size} MB)
          </span>
        </button>
      </div>
    </div>
  );
};
