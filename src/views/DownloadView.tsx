import React, { useState } from 'react';
import {
  Search,
  ClipboardPaste,
  ArrowDown,
  X,
  Play,
  Pause,
  RotateCcw,
  Trash2,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  Music2,
  Video as VideoIcon,
  HardDrive,
  Link,
} from 'lucide-react';
import { HomeTabType, DownloadItem, SupportedPlatform, MediaItem } from '../types';
import { SUPPORTED_PLATFORMS, INITIAL_FEATURED_VIDEOS, INITIAL_MUSIC_TRACKS } from '../data/mockData';
import { DownloadTarget } from '../components/DownloadModal';

interface DownloadViewProps {
  currentHomeTab: HomeTabType;
  onChangeHomeTab: (tab: HomeTabType) => void;
  downloads: DownloadItem[];
  onOpenDownloadModal: (target: DownloadTarget) => void;
  onPauseResume: (id: string) => void;
  onCancelDownload: (id: string) => void;
  onRetryDownload: (id: string) => void;
  onPlayMedia: (item: MediaItem) => void;
  onNavigateToMoreTool: (toolId: string) => void;
  t: (key: string) => string;
}

export const DownloadView: React.FC<DownloadViewProps> = ({
  currentHomeTab,
  onChangeHomeTab,
  downloads,
  onOpenDownloadModal,
  onPauseResume,
  onCancelDownload,
  onRetryDownload,
  onPlayMedia,
  onNavigateToMoreTool,
  t,
}) => {
  const [searchUrl, setSearchUrl] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<SupportedPlatform | null>(null);
  const [showManagerTab, setShowManagerTab] = useState<'discover' | 'active' | 'history'>('discover');

  const activeDownloads = downloads.filter(
    (d) => d.status === 'downloading' || d.status === 'paused' || d.status === 'queued'
  );
  const completedDownloads = downloads.filter((d) => d.status === 'completed');

  // Handle Clipboard Paste
  const handlePaste = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setSearchUrl(text.trim());
          return;
        }
      }
    } catch {
      // fallback prompt if clipboard read permission is blocked in browser
    }
    const sample = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
    setSearchUrl(sample);
  };

  // Handle Search / Download Submit
  const handleDownloadSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchUrl.trim()) return;

    // Detect platform or use default Direct MP4
    let source = 'Direct MP4';
    const lower = searchUrl.toLowerCase();
    if (lower.includes('youtube') || lower.includes('youtu.be')) source = 'YouTube';
    else if (lower.includes('tiktok')) source = 'TikTok';
    else if (lower.includes('facebook') || lower.includes('fb.watch')) source = 'Facebook';
    else if (lower.includes('instagram')) source = 'Instagram';
    else if (lower.includes('soundcloud')) source = 'SoundCloud';
    else if (lower.includes('pinterest')) source = 'Pinterest';
    else if (lower.includes('twitter') || lower.includes('x.com')) source = 'X (Twitter)';
    else if (lower.includes('drive.google')) source = 'Google Drive';

    const target: DownloadTarget = {
      id: `custom-dl-${Date.now()}`,
      title: `Parsed Media: ${source} Stream [${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}]`,
      source,
      url: searchUrl,
      thumbnail:
        source === 'SoundCloud'
          ? 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80'
          : 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=600&q=80',
      duration: '04:20',
      streamUrl: searchUrl.startsWith('http')
        ? searchUrl
        : 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      defaultFormat: source === 'SoundCloud' ? 'audio' : 'video',
    };

    onOpenDownloadModal(target);
  };

  const handleSelectPlatformShortcut = (platform: SupportedPlatform) => {
    setSelectedPlatform(platform);
    setSearchUrl(platform.placeholderUrl);
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      {/* Top 4 Tabs: Search, YouTube, Music, More */}
      <div className="px-3 pt-2 bg-[#090a0d] border-b border-zinc-800/80 sticky top-0 z-20 shrink-0">
        <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => onChangeHomeTab('search')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              currentHomeTab === 'search'
                ? 'bg-[#00F078] text-black shadow-[0_0_12px_rgba(0,240,120,0.35)]'
                : 'text-zinc-400 hover:text-white bg-zinc-900/80 border border-zinc-800/60'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>{t('tabSearch')}</span>
          </button>

          <button
            onClick={() => onChangeHomeTab('youtube')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              currentHomeTab === 'youtube'
                ? 'bg-[#00F078] text-black shadow-[0_0_12px_rgba(0,240,120,0.35)]'
                : 'text-zinc-400 hover:text-white bg-zinc-900/80 border border-zinc-800/60'
            }`}
          >
            <VideoIcon className="w-3.5 h-3.5 text-red-500" />
            <span>{t('tabYoutube')}</span>
          </button>

          <button
            onClick={() => onChangeHomeTab('music')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              currentHomeTab === 'music'
                ? 'bg-[#00F078] text-black shadow-[0_0_12px_rgba(0,240,120,0.35)]'
                : 'text-zinc-400 hover:text-white bg-zinc-900/80 border border-zinc-800/60'
            }`}
          >
            <Music2 className="w-3.5 h-3.5 text-amber-400" />
            <span>{t('tabMusic')}</span>
          </button>

          <button
            onClick={() => onChangeHomeTab('more')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              currentHomeTab === 'more'
                ? 'bg-[#00F078] text-black shadow-[0_0_12px_rgba(0,240,120,0.35)]'
                : 'text-zinc-400 hover:text-white bg-zinc-900/80 border border-zinc-800/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t('tabMore')}</span>
          </button>
        </div>

        {/* Sub-view toggle for Download Manager vs Discover */}
        <div className="flex items-center justify-between py-1.5 border-t border-zinc-800/50 text-[11px]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowManagerTab('discover')}
              className={`font-semibold pb-1 border-b-2 transition-all ${
                showManagerTab === 'discover'
                  ? 'border-[#00F078] text-[#00F078]'
                  : 'border-transparent text-zinc-400 hover:text-white'
              }`}
            >
              Explore Feed
            </button>
            <button
              onClick={() => setShowManagerTab('active')}
              className={`font-semibold pb-1 border-b-2 transition-all flex items-center gap-1 ${
                showManagerTab === 'active'
                  ? 'border-[#00F078] text-[#00F078]'
                  : 'border-transparent text-zinc-400 hover:text-white'
              }`}
            >
              <span>{t('activeDownloads')}</span>
              {activeDownloads.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#00F078] text-black text-[9px] font-bold flex items-center justify-center">
                  {activeDownloads.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setShowManagerTab('history')}
              className={`font-semibold pb-1 border-b-2 transition-all ${
                showManagerTab === 'history'
                  ? 'border-[#00F078] text-[#00F078]'
                  : 'border-transparent text-zinc-400 hover:text-white'
              }`}
            >
              {t('downloadHistory')} ({completedDownloads.length})
            </button>
          </div>

          <span className="text-[10px] text-zinc-500 font-mono hidden sm:inline">
            Fast WorkManager Engine
          </span>
        </div>
      </div>

      {/* Main Download Manager Drawer Tab if active */}
      {showManagerTab === 'active' && (
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00F078] shadow-[0_0_8px_#00F078]"></span>
              Active Downloads ({activeDownloads.length})
            </h3>
            <span className="text-[11px] text-[#00F078] font-mono">
              Simultaneous: 3 threads
            </span>
          </div>

          {activeDownloads.length === 0 ? (
            <div className="py-12 text-center bg-zinc-950/60 rounded-2xl border border-zinc-800 p-6 space-y-2">
              <ArrowDown className="w-8 h-8 text-zinc-600 mx-auto" />
              <p className="text-xs text-zinc-300 font-semibold">{t('noActiveDownloads')}</p>
              <p className="text-[11px] text-zinc-500">
                Paste any video link above to start high-speed downloading.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeDownloads.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 bg-[#0e1015] rounded-2xl border border-zinc-800 shadow-md space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-12 h-10 rounded-lg overflow-hidden bg-black border border-zinc-800 shrink-0 relative">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">
                          {item.title}
                        </p>
                        <p className="text-[10px] text-zinc-400 flex items-center gap-1.5 mt-0.5 font-mono-nums">
                          <span className="text-[#00F078] font-semibold">{item.source}</span>
                          <span>·</span>
                          <span>{item.quality}</span>
                          <span>·</span>
                          <span>{item.downloadedBytes.toFixed(1)} / {item.fileSize.toFixed(1)} MB</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold font-mono text-[#00F078]">
                        {Math.round(item.progress)}%
                      </span>
                      <p className="text-[10px] text-zinc-400 font-mono mt-0.5">
                        {item.speed}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#00F078] h-full rounded-full transition-all duration-300 shadow-[0_0_8px_#00F078]"
                      style={{ width: `${item.progress}%` }}
                    ></div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-[10px] text-zinc-400 font-mono truncate max-w-[160px]">
                      {item.folderPath || '/Download/MnsTubePro/'}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onPauseResume(item.id)}
                        className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-white font-medium flex items-center gap-1 transition-all"
                      >
                        {item.status === 'paused' ? (
                          <>
                            <Play className="w-3 h-3 text-[#00F078]" /> {t('resume')}
                          </>
                        ) : (
                          <>
                            <Pause className="w-3 h-3 text-amber-400" /> {t('pause')}
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => onCancelDownload(item.id)}
                        className="p-1 rounded-lg bg-rose-950/30 hover:bg-rose-900/50 text-rose-400 transition-colors"
                        title="Cancel"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* History Drawer Tab */}
      {showManagerTab === 'history' && (
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00F078]" />
              Completed Downloads ({completedDownloads.length})
            </h3>
          </div>

          {completedDownloads.length === 0 ? (
            <div className="py-12 text-center bg-zinc-950/60 rounded-2xl border border-zinc-800 p-6 space-y-2">
              <HardDrive className="w-8 h-8 text-zinc-600 mx-auto" />
              <p className="text-xs text-zinc-300 font-semibold">{t('noHistory')}</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {completedDownloads.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-[#0e1015] rounded-2xl border border-zinc-800 flex items-center justify-between gap-3 hover:border-zinc-700 transition-all"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-12 h-10 rounded-lg object-cover shrink-0 bg-black border border-zinc-800"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">
                        {item.title}
                      </p>
                      <p className="text-[10px] text-zinc-400 flex items-center gap-1.5 mt-0.5">
                        <span className="text-[#00F078]">{item.quality}</span>
                        <span>·</span>
                        <span>{item.fileSize} MB</span>
                        <span>·</span>
                        <span>{item.source}</span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      onPlayMedia({
                        id: item.id,
                        title: item.title,
                        source: item.source,
                        format: item.format,
                        quality: item.quality,
                        duration: item.duration || '04:00',
                        size: `${item.fileSize} MB`,
                        thumbnail: item.thumbnail,
                        streamUrl:
                          item.downloadUrl ||
                          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                        dateAdded: item.createdAt,
                        playCount: 1,
                      })
                    }
                    className="px-3 py-1.5 rounded-xl bg-[#00F078] text-black font-extrabold text-xs hover:bg-[#00d66c] shadow-[0_0_10px_rgba(0,240,120,0.3)] flex items-center gap-1 shrink-0"
                  >
                    <Play className="w-3.5 h-3.5 fill-black" />
                    <span>Play</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main Discover Feed */}
      {showManagerTab === 'discover' && (
        <div className="p-3 sm:p-4 space-y-4">
          {/* Big Search Bar & URL Paste */}
          <form
            onSubmit={handleDownloadSubmit}
            className="p-1.5 bg-[#0e1014] rounded-2xl border border-zinc-800/90 shadow-lg flex items-center gap-2 focus-within:border-[#00F078]/80 focus-within:shadow-[0_0_20px_rgba(0,240,120,0.2)] transition-all"
          >
            <div className="pl-2 text-zinc-400">
              <Search className="w-4 h-4" />
            </div>

            <input
              type="text"
              value={searchUrl}
              onChange={(e) => setSearchUrl(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="flex-1 bg-transparent text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none min-w-0"
            />

            {searchUrl && (
              <button
                type="button"
                onClick={() => setSearchUrl('')}
                className="p-1 text-zinc-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Paste Button */}
            <button
              type="button"
              onClick={handlePaste}
              className="px-2.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1 transition-all active:scale-95 shrink-0"
            >
              <ClipboardPaste className="w-3.5 h-3.5 text-[#00F078]" />
              <span className="hidden sm:inline">{t('pasteBtn')}</span>
            </button>

            {/* Download Action */}
            <button
              type="submit"
              disabled={!searchUrl.trim()}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all shrink-0 ${
                searchUrl.trim()
                  ? 'bg-[#00F078] text-black hover:bg-[#00d66c] shadow-[0_0_15px_rgba(0,240,120,0.4)] active:scale-95'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              }`}
            >
              <ArrowDown className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{t('downloadBtn')}</span>
            </button>
          </form>

          {/* Compliance Safe Notice */}
          <div className="px-3 py-1.5 bg-zinc-950/80 rounded-xl border border-zinc-800/60 flex items-center justify-between text-[10px] text-zinc-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00F078]" />
              {t('complianceNotice')}
            </span>
            <span className="text-zinc-500">Fast Resumable</span>
          </div>

          {/* Supported Sources Grid (Requirement 4) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                {t('supportedPlatforms')}
              </span>
              <span className="text-[11px] text-zinc-400">9 Channels</span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {SUPPORTED_PLATFORMS.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => handleSelectPlatformShortcut(platform)}
                  className={`p-2.5 rounded-2xl border transition-all flex flex-col items-center justify-center text-center gap-1.5 relative overflow-hidden group ${
                    selectedPlatform?.id === platform.id
                      ? 'bg-[#00F078]/15 border-[#00F078] shadow-[0_0_12px_rgba(0,240,120,0.3)]'
                      : 'bg-[#0f1116] border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-inner font-bold text-xs"
                    style={{ backgroundColor: platform.color }}
                  >
                    {platform.name.slice(0, 2)}
                  </div>

                  <span className="text-[11px] font-semibold text-zinc-200 truncate w-full">
                    {platform.name}
                  </span>

                  <span className="text-[9px] text-[#00F078] opacity-0 group-hover:opacity-100 transition-opacity">
                    Load Test URL
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Trending Media Feeds depending on Top Tab */}
          {currentHomeTab === 'more' ? (
            /* More Tools Screen */
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Built-in Android Utilities
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Tool 1: WhatsApp Status Saver */}
                <div
                  onClick={() => onNavigateToMoreTool('whatsapp')}
                  className="p-4 bg-gradient-to-br from-emerald-950/40 to-zinc-900 border border-zinc-800 hover:border-[#00F078]/50 rounded-2xl cursor-pointer transition-all shadow-md group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-emerald-900/40 text-[#00F078] border border-[#00F078]/30 group-hover:scale-105 transition-transform">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-[#00F078]">
                        WhatsApp Status Saver
                      </h4>
                      <p className="text-[10px] text-zinc-400 mt-0.5">
                        Scan, preview and save status videos and images
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tool 2: Private Vault */}
                <div
                  onClick={() => onNavigateToMoreTool('vault')}
                  className="p-4 bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 hover:border-[#00F078]/50 rounded-2xl cursor-pointer transition-all shadow-md group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-zinc-800 text-amber-400 border border-amber-400/30 group-hover:scale-105 transition-transform">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-[#00F078]">
                        Private Vault
                      </h4>
                      <p className="text-[10px] text-zinc-400 mt-0.5">
                        PIN-encrypted safe folder for personal downloads
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tool 3: Storage Manager */}
                <div
                  onClick={() => onNavigateToMoreTool('storage')}
                  className="p-4 bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 hover:border-[#00F078]/50 rounded-2xl cursor-pointer transition-all shadow-md group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-zinc-800 text-cyan-400 border border-cyan-400/30 group-hover:scale-105 transition-transform">
                      <HardDrive className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-[#00F078]">
                        Storage Manager
                      </h4>
                      <p className="text-[10px] text-zinc-400 mt-0.5">
                        Breakdown disk usage and clean temporary junk cache
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tool 4: Android Kotlin APK Project */}
                <div
                  onClick={() => onNavigateToMoreTool('android-code')}
                  className="p-4 bg-gradient-to-br from-[#00F078]/10 to-zinc-900 border border-[#00F078]/40 hover:border-[#00F078] rounded-2xl cursor-pointer transition-all shadow-md group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-zinc-900 text-[#00F078] border border-[#00F078]/40 group-hover:scale-105 transition-transform">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-[#00F078]">
                        Android Project & APK Source
                      </h4>
                      <p className="text-[10px] text-zinc-400 mt-0.5">
                        Inspect Kotlin Compose files and export full project ZIP
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : currentHomeTab === 'music' ? (
            /* Music Tab */
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  {t('trendingMusic')}
                </span>
                <span className="text-[11px] text-[#00F078] font-mono">
                  Lossless 320kbps MP3
                </span>
              </div>

              <div className="space-y-2">
                {INITIAL_MUSIC_TRACKS.map((track) => (
                  <div
                    key={track.id}
                    className="p-3 bg-[#0e1015] rounded-2xl border border-zinc-800 hover:border-zinc-700 flex items-center justify-between gap-3 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-black border border-zinc-800 shrink-0 relative">
                        <img
                          src={track.thumbnail}
                          alt={track.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">
                          {track.title}
                        </p>
                        <p className="text-[10px] text-zinc-400 flex items-center gap-1.5 mt-0.5">
                          <span>{track.artist}</span>
                          <span>·</span>
                          <span className="text-[#00F078]">{track.bitrate}</span>
                          <span>·</span>
                          <span>{track.duration}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() =>
                          onPlayMedia({
                            id: track.id,
                            title: track.title,
                            artist: track.artist,
                            source: 'SoundCloud',
                            format: 'audio',
                            quality: track.bitrate,
                            duration: track.duration,
                            size: track.size,
                            thumbnail: track.thumbnail,
                            streamUrl: track.streamUrl,
                            dateAdded: Date.now(),
                            playCount: 1,
                          })
                        }
                        title="Listen preview"
                        className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white transition-all"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                      </button>

                      <button
                        onClick={() =>
                          onOpenDownloadModal({
                            id: track.id,
                            title: track.title,
                            source: 'SoundCloud',
                            url: track.streamUrl,
                            thumbnail: track.thumbnail,
                            duration: track.duration,
                            streamUrl: track.streamUrl,
                            defaultFormat: 'audio',
                          })
                        }
                        className="px-3 py-1.5 rounded-xl bg-[#00F078] text-black font-extrabold text-xs hover:bg-[#00d66c] shadow-[0_0_10px_rgba(0,240,120,0.3)] flex items-center gap-1 transition-all"
                      >
                        <ArrowDown className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>DL</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Search & YouTube Video Feeds */
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  {currentHomeTab === 'youtube' ? 'YouTube Trending Hub' : t('trendingNow')}
                </span>
                <span className="text-[11px] text-[#00F078] font-mono">
                  1080p 60fps & MP3
                </span>
              </div>

              {/* Video Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {INITIAL_FEATURED_VIDEOS.map((video) => (
                  <div
                    key={video.id}
                    className="bg-[#0e1015] rounded-2xl border border-zinc-800/90 overflow-hidden shadow-md hover:border-zinc-700 transition-all group flex flex-col justify-between"
                  >
                    {/* Thumbnail with overlay duration & source */}
                    <div className="relative aspect-video bg-black overflow-hidden">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute bottom-2 right-2 bg-black/85 text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
                        {video.duration}
                      </span>
                      <span className="absolute top-2 left-2 bg-black/80 backdrop-blur-sm text-[#00F078] text-[9px] font-bold px-2 py-0.5 rounded border border-[#00F078]/30">
                        {video.source}
                      </span>
                    </div>

                    {/* Meta info */}
                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug">
                          {video.title}
                        </h4>
                        <p className="text-[10px] text-zinc-400 mt-1 flex items-center gap-1.5">
                          <span>{video.author}</span>
                          <span>·</span>
                          <span>{video.views}</span>
                        </p>
                      </div>

                      {/* Download and Play Buttons */}
                      <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-zinc-800/60">
                        <span className="text-[10px] text-zinc-400 font-mono">
                          {video.resolution} · {video.size}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() =>
                              onPlayMedia({
                                id: video.id,
                                title: video.title,
                                artist: video.author,
                                source: video.source,
                                format: 'video',
                                quality: video.resolution,
                                duration: video.duration,
                                size: video.size,
                                thumbnail: video.thumbnail,
                                streamUrl: video.streamUrl,
                                dateAdded: Date.now(),
                                playCount: 1,
                              })
                            }
                            title="Watch video"
                            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white transition-all"
                          >
                            <Play className="w-3.5 h-3.5 fill-white" />
                          </button>

                          <button
                            onClick={() =>
                              onOpenDownloadModal({
                                id: video.id,
                                title: video.title,
                                source: video.source,
                                url: video.streamUrl,
                                thumbnail: video.thumbnail,
                                duration: video.duration,
                                streamUrl: video.streamUrl,
                                defaultFormat: 'video',
                              })
                            }
                            className="px-2.5 py-1.5 rounded-xl bg-[#00F078] text-black font-extrabold text-xs hover:bg-[#00d66c] shadow-[0_0_10px_rgba(0,240,120,0.3)] flex items-center gap-1 transition-all"
                          >
                            <ArrowDown className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Download</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
