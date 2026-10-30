/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TabType, HomeTabType, DownloadItem, MediaItem, Playlist, WhatsAppStatus, AppSettings } from './types';
import {
  INITIAL_DOWNLOADS,
  INITIAL_MEDIA_LIBRARY,
  INITIAL_WHATSAPP_STATUSES,
  DEFAULT_SETTINGS,
} from './data/mockData';
import { translations } from './translations';
import { AndroidFrame } from './components/AndroidFrame';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { NotificationDrawer } from './components/NotificationDrawer';
import { MiniPlayer } from './components/MiniPlayer';
import { FloatingShortcut } from './components/FloatingShortcut';
import { DownloadModal, DownloadTarget } from './components/DownloadModal';
import { MediaPlayerModal } from './components/MediaPlayerModal';
import { DownloadView } from './views/DownloadView';
import { PlayView } from './views/PlayView';
import { SettingsView } from './views/SettingsView';

export default function App() {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<TabType>('download');
  const [currentHomeTab, setCurrentHomeTab] = useState<HomeTabType>('search');
  const [settingsSubTool, setSettingsSubTool] = useState<string | null>(null);

  // App Data State (hydrated with localStorage where appropriate)
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('mns_tube_settings');
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [downloads, setDownloads] = useState<DownloadItem[]>(() => {
    try {
      const saved = localStorage.getItem('mns_tube_downloads');
      return saved ? JSON.parse(saved) : INITIAL_DOWNLOADS;
    } catch {
      return INITIAL_DOWNLOADS;
    }
  });

  const [mediaLibrary, setMediaLibrary] = useState<MediaItem[]>(() => {
    try {
      const saved = localStorage.getItem('mns_tube_library');
      return saved ? JSON.parse(saved) : INITIAL_MEDIA_LIBRARY;
    } catch {
      return INITIAL_MEDIA_LIBRARY;
    }
  });

  const [playlists, setPlaylists] = useState<Playlist[]>([
    {
      id: 'pl-1',
      title: 'Top Hits & Soundtracks',
      coverImage:
        'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80',
      items: INITIAL_MEDIA_LIBRARY,
      createdAt: Date.now() - 86400000,
    },
  ]);

  const [whatsAppStatuses, setWhatsAppStatuses] = useState<WhatsAppStatus[]>(
    INITIAL_WHATSAPP_STATUSES
  );

  // Media Player State
  const [activeMedia, setActiveMedia] = useState<MediaItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mediaProgress, setMediaProgress] = useState(0);
  const [isMediaPlayerModalOpen, setIsMediaPlayerModalOpen] = useState(false);

  // Modals & Drawers
  const [downloadModalTarget, setDownloadModalTarget] = useState<DownloadTarget | null>(null);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('mns_tube_settings', JSON.stringify(settings));
    } catch {}
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem('mns_tube_downloads', JSON.stringify(downloads));
    } catch {}
  }, [downloads]);

  useEffect(() => {
    try {
      localStorage.setItem('mns_tube_library', JSON.stringify(mediaLibrary));
    } catch {}
  }, [mediaLibrary]);

  // RTL Direction Support for Urdu
  useEffect(() => {
    if (settings.language === 'ur') {
      document.documentElement.setAttribute('dir', 'rtl');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
    }
  }, [settings.language]);

  // Translation helper
  const t = (key: string): string => {
    const langDict = translations[settings.language] || translations.en;
    return (langDict as Record<string, string>)[key] || key;
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 3500);
  };

  // Live multi-threaded download engine simulation with WorkManager logic
  useEffect(() => {
    const timer = setInterval(() => {
      setDownloads((prevDownloads) => {
        let hasChanges = false;
        const updated = prevDownloads.map((item) => {
          if (item.status === 'downloading') {
            hasChanges = true;
            // random increment between 2% and 5%
            const increment = Math.random() * 3 + 2;
            const newProgress = Math.min(100, item.progress + increment);
            const downloadedBytes = (item.fileSize * newProgress) / 100;
            const currentSpeed = `${(Math.random() * 4 + 7).toFixed(1)} MB/s`;

            if (newProgress >= 100) {
              // Completed!
              showToast(`✓ Download Completed: ${item.title.slice(0, 24)}...`);

              // Add to media library automatically if not already present
              setMediaLibrary((prevLib) => {
                if (prevLib.some((m) => m.id === item.id)) return prevLib;
                const newMedia: MediaItem = {
                  id: item.id,
                  title: item.title,
                  source: item.source,
                  format: item.format,
                  quality: item.quality,
                  duration: item.duration || '04:15',
                  size: `${item.fileSize} MB`,
                  thumbnail: item.thumbnail,
                  streamUrl:
                    item.downloadUrl ||
                    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                  dateAdded: Date.now(),
                  playCount: 0,
                };
                return [newMedia, ...prevLib];
              });

              return {
                ...item,
                progress: 100,
                downloadedBytes: item.fileSize,
                speed: 'Completed',
                status: 'completed' as const,
              };
            }

            return {
              ...item,
              progress: newProgress,
              downloadedBytes,
              speed: currentSpeed,
            };
          }
          return item;
        });

        return hasChanges ? updated : prevDownloads;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Update Settings
  const handleUpdateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // Start Download from Modal
  const handleConfirmDownload = (params: {
    format: 'video' | 'audio';
    quality: string;
    fileSize: number;
    triggerBrowserSave: boolean;
  }) => {
    if (!downloadModalTarget) return;

    const newDownload: DownloadItem = {
      id: `dl-${Date.now()}`,
      title: downloadModalTarget.title,
      source: downloadModalTarget.source,
      url: downloadModalTarget.url,
      thumbnail: downloadModalTarget.thumbnail,
      format: params.format,
      quality: params.quality,
      fileSize: params.fileSize,
      downloadedBytes: 0,
      progress: 0,
      speed: 'Connecting...',
      status: 'downloading',
      createdAt: Date.now(),
      downloadUrl:
        downloadModalTarget.streamUrl ||
        (params.format === 'video'
          ? 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
          : 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'),
      duration: downloadModalTarget.duration || '04:00',
      folderPath: `${settings.downloadLocation}${params.format === 'video' ? 'Videos/' : 'Music/'}`,
    };

    setDownloads((prev) => [newDownload, ...prev]);
    showToast(`Downloading: ${downloadModalTarget.title.slice(0, 22)}...`);

    // Trigger browser client download if requested
    if (params.triggerBrowserSave && downloadModalTarget.streamUrl) {
      try {
        const link = document.createElement('a');
        link.href = downloadModalTarget.streamUrl;
        link.download = `${downloadModalTarget.title.replace(/[^a-zA-Z0-9]/g, '_')}.${
          params.format === 'video' ? 'mp4' : 'mp3'
        }`;
        link.target = '_blank';
        link.rel = 'noreferrer';
        // Note: Cross-origin direct mp4 might open in tab or trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (e) {
        console.warn('Browser direct save fallback', e);
      }
    }
  };

  // Pause / Resume
  const handlePauseResume = (id: string) => {
    setDownloads((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          if (item.status === 'downloading') {
            return { ...item, status: 'paused', speed: 'Paused' };
          } else if (item.status === 'paused') {
            return { ...item, status: 'downloading', speed: 'Resuming...' };
          }
        }
        return item;
      })
    );
  };

  // Cancel Download
  const handleCancelDownload = (id: string) => {
    setDownloads((prev) => prev.filter((item) => item.id !== id));
    showToast('Download cancelled');
  };

  // Retry Failed
  const handleRetryDownload = (id: string) => {
    setDownloads((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'downloading', progress: 5, speed: 'Retrying...' } : item
      )
    );
  };

  // Media Player Actions
  const handlePlayMedia = (item: MediaItem) => {
    setActiveMedia(item);
    setIsPlaying(true);
    setIsMediaPlayerModalOpen(true);
  };

  const handleDeleteMedia = (id: string) => {
    setMediaLibrary((prev) => prev.filter((m) => m.id !== id));
    showToast('Media deleted from library');
  };

  const handleMoveToVault = (item: MediaItem) => {
    setMediaLibrary((prev) =>
      prev.map((m) => (m.id === item.id ? { ...m, isVault: true } : m))
    );
    showToast('Moved to Private Vault');
  };

  const handleRestoreFromVault = (item: MediaItem) => {
    setMediaLibrary((prev) =>
      prev.map((m) => (m.id === item.id ? { ...m, isVault: false } : m))
    );
    showToast('Restored to public gallery');
  };

  const handleCreatePlaylist = (name: string) => {
    const newPl: Playlist = {
      id: `pl-${Date.now()}`,
      title: name,
      coverImage:
        mediaLibrary[0]?.thumbnail ||
        'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80',
      items: mediaLibrary.slice(0, 3),
      createdAt: Date.now(),
    };
    setPlaylists((prev) => [newPl, ...prev]);
    showToast(`Playlist "${name}" created!`);
  };

  // WhatsApp Status Actions
  const handleSaveWhatsAppStatus = (id: string) => {
    setWhatsAppStatuses((prev) =>
      prev.map((st) => (st.id === id ? { ...st, isSaved: true } : st))
    );
    showToast(t('statusSavedSuccess'));
  };

  const handleSaveAllWhatsAppStatuses = () => {
    setWhatsAppStatuses((prev) => prev.map((st) => ({ ...st, isSaved: true })));
    showToast('All WhatsApp statuses saved to device gallery!');
  };

  const handleAddCustomStatus = (status: WhatsAppStatus) => {
    setWhatsAppStatuses((prev) => [status, ...prev]);
    showToast('Custom status imported successfully!');
  };

  // Quick navigation from More tools
  const handleNavigateToMoreTool = (toolId: string) => {
    setCurrentTab('settings');
    setSettingsSubTool(toolId);
  };

  const activeDownloadsCount = downloads.filter((d) => d.status === 'downloading').length;
  const vaultMedia = mediaLibrary.filter((m) => m.isVault);

  return (
    <AndroidFrame activeDownloadsCount={activeDownloadsCount}>
      {/* Top Header */}
      <Header
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        activeDownloadsCount={activeDownloadsCount}
        onToggleNotificationDrawer={() =>
          setIsNotificationDrawerOpen(!isNotificationDrawerOpen)
        }
        onOpenDownloadManager={() => {
          setCurrentTab('download');
          setCurrentHomeTab('search');
        }}
      />

      {/* Main Viewport Content based on Current Bottom Tab */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {currentTab === 'download' && (
          <DownloadView
            currentHomeTab={currentHomeTab}
            onChangeHomeTab={setCurrentHomeTab}
            downloads={downloads}
            onOpenDownloadModal={(target) => setDownloadModalTarget(target)}
            onPauseResume={handlePauseResume}
            onCancelDownload={handleCancelDownload}
            onRetryDownload={handleRetryDownload}
            onPlayMedia={handlePlayMedia}
            onNavigateToMoreTool={handleNavigateToMoreTool}
            t={t}
          />
        )}

        {currentTab === 'play' && (
          <PlayView
            mediaLibrary={mediaLibrary}
            playlists={playlists}
            onPlayMedia={handlePlayMedia}
            onDeleteMedia={handleDeleteMedia}
            onMoveToVault={handleMoveToVault}
            onCreatePlaylist={handleCreatePlaylist}
            t={t}
          />
        )}

        {currentTab === 'settings' && (
          <SettingsView
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            vaultMedia={vaultMedia}
            whatsAppStatuses={whatsAppStatuses}
            onSaveWhatsAppStatus={handleSaveWhatsAppStatus}
            onSaveAllWhatsAppStatuses={handleSaveAllWhatsAppStatuses}
            onAddCustomStatus={handleAddCustomStatus}
            onRestoreFromVault={handleRestoreFromVault}
            onPlayMedia={handlePlayMedia}
            videoCount={mediaLibrary.filter((m) => m.format === 'video').length}
            musicCount={mediaLibrary.filter((m) => m.format === 'audio').length}
            initialSubTool={settingsSubTool}
            t={t}
          />
        )}
      </main>

      {/* Floating Bottom MiniPlayer when media is loaded */}
      {activeMedia && (
        <MiniPlayer
          currentMedia={activeMedia}
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying(!isPlaying)}
          onNext={() => {
            const idx = mediaLibrary.findIndex((m) => m.id === activeMedia.id);
            const nextIdx = (idx + 1) % mediaLibrary.length;
            setActiveMedia(mediaLibrary[nextIdx]);
          }}
          onExpand={() => setIsMediaPlayerModalOpen(true)}
          onClose={() => {
            setActiveMedia(null);
            setIsPlaying(false);
          }}
          progress={mediaProgress}
        />
      )}

      {/* Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        onChangeTab={(tab) => {
          setCurrentTab(tab);
          setSettingsSubTool(null);
        }}
        t={t}
        activeDownloadsCount={activeDownloadsCount}
      />

      {/* Floating Quick Download Shortcut */}
      {settings.showFloatingShortcut && (
        <FloatingShortcut
          visible={true}
          onTriggerQuickDownload={() => {
            setDownloadModalTarget({
              id: `quick-${Date.now()}`,
              title: 'Fast Clipboard Download – MP4 Stream',
              source: 'Clipboard',
              url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
              thumbnail:
                'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=600&q=80',
              duration: '04:15',
              streamUrl:
                'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
              defaultFormat: 'video',
            });
          }}
          onDismiss={() => handleUpdateSettings({ showFloatingShortcut: false })}
        />
      )}

      {/* Download Format / Quality Bottom Sheet Modal */}
      <DownloadModal
        target={downloadModalTarget}
        isOpen={downloadModalTarget !== null}
        onClose={() => setDownloadModalTarget(null)}
        onConfirmDownload={handleConfirmDownload}
        storageLocation={settings.downloadLocation}
        t={t}
      />

      {/* Full Screen Media Player Modal */}
      <MediaPlayerModal
        isOpen={isMediaPlayerModalOpen}
        onClose={() => setIsMediaPlayerModalOpen(false)}
        media={activeMedia}
        playlist={mediaLibrary}
        onSelectTrack={(track) => setActiveMedia(track)}
        onToggleVault={(item) => {
          if (item.isVault) handleRestoreFromVault(item);
          else handleMoveToVault(item);
        }}
        t={t}
      />

      {/* Android Notification Shade Drawer */}
      <NotificationDrawer
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
        downloads={downloads}
        onPauseResume={handlePauseResume}
        onCancel={handleCancelDownload}
        onPlayMedia={(dlItem) => {
          handlePlayMedia({
            id: dlItem.id,
            title: dlItem.title,
            source: dlItem.source,
            format: dlItem.format,
            quality: dlItem.quality,
            duration: dlItem.duration || '04:15',
            size: `${dlItem.fileSize} MB`,
            thumbnail: dlItem.thumbnail,
            streamUrl:
              dlItem.downloadUrl ||
              'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            dateAdded: dlItem.createdAt,
            playCount: 1,
          });
        }}
      />

      {/* Live Android Toast Alert */}
      {toastMessage && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-50 bg-[#16181f]/95 text-white border border-[#00F078]/50 shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(0,240,120,0.25)] px-4 py-2 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top duration-200 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#00F078] shadow-[0_0_8px_#00F078]"></span>
          <span className="truncate max-w-[280px]">{toastMessage}</span>
        </div>
      )}
    </AndroidFrame>
  );
}
