export type TabType = 'download' | 'play' | 'settings';

export type HomeTabType = 'search' | 'youtube' | 'music' | 'more';

export type DownloadStatus = 'downloading' | 'paused' | 'completed' | 'failed' | 'queued';

export type MediaFormat = 'video' | 'audio';

export interface DownloadItem {
  id: string;
  title: string;
  source: string; // 'YouTube' | 'TikTok' | 'Instagram' | 'Facebook' | 'SoundCloud' | etc.
  url: string;
  thumbnail: string;
  format: MediaFormat;
  quality: string; // '1080p Full HD' | '720p HD' | '480p' | '320kbps MP3' | '128kbps M4A'
  fileSize: number; // in MB
  downloadedBytes: number; // in MB
  progress: number; // 0 - 100
  speed: string; // e.g. "8.4 MB/s"
  status: DownloadStatus;
  createdAt: number;
  downloadUrl?: string; // direct playable/downloadable stream
  duration?: string;
  folderPath?: string;
}

export interface MediaItem {
  id: string;
  title: string;
  artist?: string;
  source: string;
  format: MediaFormat;
  quality: string;
  duration: string;
  size: string;
  thumbnail: string;
  streamUrl: string;
  isVault?: boolean;
  dateAdded: number;
  playCount: number;
}

export interface Playlist {
  id: string;
  title: string;
  coverImage: string;
  items: MediaItem[];
  createdAt: number;
}

export interface WhatsAppStatus {
  id: string;
  senderName: string;
  timeAgo: string;
  type: 'image' | 'video';
  mediaUrl: string;
  thumbnail: string;
  duration?: string;
  isSaved: boolean;
}

export interface SupportedPlatform {
  id: string;
  name: string;
  icon: string;
  color: string;
  bgGradient: string;
  placeholderUrl: string;
  allowedNote: string;
}

export interface AppSettings {
  language: 'en' | 'ur';
  theme: 'neon-black' | 'cyber-dark' | 'midnight';
  downloadLocation: string;
  maxConcurrentDownloads: number;
  wifiOnly: boolean;
  defaultVideoQuality: string;
  defaultAudioQuality: string;
  showFloatingShortcut: boolean;
  enableNotifications: boolean;
  enableVibration: boolean;
  vaultPin: string | null;
  securityAnswer: string | null;
}
