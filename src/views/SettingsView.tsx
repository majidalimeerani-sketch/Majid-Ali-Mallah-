import React, { useState } from 'react';
import {
  Settings,
  HardDrive,
  Download,
  Bell,
  Globe,
  Palette,
  ShieldCheck,
  Info,
  Lock,
  Sparkles,
  FileCode,
  Folder,
  Layers,
  ChevronRight,
  Wifi,
  ExternalLink,
} from 'lucide-react';
import { AppSettings, MediaItem, WhatsAppStatus } from '../types';
import { WhatsAppStatusSaver } from '../components/WhatsAppStatusSaver';
import { PrivateVault } from '../components/PrivateVault';
import { StorageManager } from '../components/StorageManager';
import { AndroidCodeExportModal } from '../components/AndroidCodeExportModal';

interface SettingsViewProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  vaultMedia: MediaItem[];
  whatsAppStatuses: WhatsAppStatus[];
  onSaveWhatsAppStatus: (id: string) => void;
  onSaveAllWhatsAppStatuses: () => void;
  onAddCustomStatus: (status: WhatsAppStatus) => void;
  onRestoreFromVault: (item: MediaItem) => void;
  onPlayMedia: (item: MediaItem) => void;
  videoCount: number;
  musicCount: number;
  initialSubTool?: string | null;
  t: (key: string) => string;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  vaultMedia,
  whatsAppStatuses,
  onSaveWhatsAppStatus,
  onSaveAllWhatsAppStatuses,
  onAddCustomStatus,
  onRestoreFromVault,
  onPlayMedia,
  videoCount,
  musicCount,
  initialSubTool,
  t,
}) => {
  const [activeSubView, setActiveSubView] = useState<string | null>(initialSubTool || null);
  const [showCodeExport, setShowCodeExport] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  // If a subview (WhatsApp Status, Vault, Storage) is opened:
  if (activeSubView === 'whatsapp') {
    return (
      <div className="flex-1 flex flex-col p-4 overflow-y-auto space-y-4">
        <button
          onClick={() => setActiveSubView(null)}
          className="text-xs font-semibold text-zinc-400 hover:text-white flex items-center gap-1.5"
        >
          ← Back to Settings
        </button>
        <WhatsAppStatusSaver
          statuses={whatsAppStatuses}
          onSaveStatus={onSaveWhatsAppStatus}
          onSaveAll={onSaveAllWhatsAppStatuses}
          onAddCustomStatus={onAddCustomStatus}
          t={t}
        />
      </div>
    );
  }

  if (activeSubView === 'vault') {
    return (
      <div className="flex-1 flex flex-col p-4 overflow-y-auto space-y-4">
        <button
          onClick={() => setActiveSubView(null)}
          className="text-xs font-semibold text-zinc-400 hover:text-white flex items-center gap-1.5"
        >
          ← Back to Settings
        </button>
        <PrivateVault
          vaultMedia={vaultMedia}
          savedPin={settings.vaultPin || '1234'}
          onUpdatePin={(newPin) => onUpdateSettings({ vaultPin: newPin })}
          onRestoreFromVault={onRestoreFromVault}
          onPlayMedia={onPlayMedia}
          t={t}
        />
      </div>
    );
  }

  if (activeSubView === 'storage') {
    return (
      <div className="flex-1 flex flex-col p-4 overflow-y-auto space-y-4">
        <button
          onClick={() => setActiveSubView(null)}
          className="text-xs font-semibold text-zinc-400 hover:text-white flex items-center gap-1.5"
        >
          ← Back to Settings
        </button>
        <StorageManager
          settings={settings}
          videoCount={videoCount}
          musicCount={musicCount}
          whatsAppCount={whatsAppStatuses.length}
          t={t}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-4 space-y-4">
      {/* Settings Header Card */}
      <div className="p-4 bg-gradient-to-r from-emerald-950/40 via-[#0e1015] to-[#12141c] rounded-2xl border border-zinc-800 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl overflow-hidden border border-[#00F078]/40 shadow-[0_0_12px_rgba(0,240,120,0.3)] bg-black shrink-0">
            <img
              src="/src/assets/images/mns_tube_logo_1793395248385.jpg"
              alt="MNS TUBE PRO"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-white flex items-center gap-1.5 font-display">
              <span>MNS TUBE PRO</span>
              <span className="text-[10px] bg-[#00F078] text-black font-extrabold px-1.5 py-0.2 rounded">
                PRO
              </span>
            </h2>
            <p className="text-xs text-zinc-400">Android Build 4.8.2 · SnapTube Optimized</p>
          </div>
        </div>

        <button
          onClick={() => setShowCodeExport(true)}
          className="px-3 py-1.5 rounded-xl bg-[#00F078]/15 border border-[#00F078]/40 text-[#00F078] font-bold text-xs flex items-center gap-1.5 hover:bg-[#00F078]/25 transition-all"
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>APK Source</span>
        </button>
      </div>

      {/* Pro Utilities Quick Links */}
      <div className="space-y-2">
        <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider px-1">
          Pro Utilities
        </p>

        <div className="bg-[#0e1015] rounded-2xl border border-zinc-800 divide-y divide-zinc-800/80 overflow-hidden">
          {/* WhatsApp Status Saver */}
          <button
            onClick={() => setActiveSubView('whatsapp')}
            className="w-full p-3.5 flex items-center justify-between hover:bg-zinc-900/60 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-950/60 text-[#00F078] border border-[#00F078]/30">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">{t('statusSaver')}</p>
                <p className="text-[10px] text-zinc-400">
                  {whatsAppStatuses.length} statuses ready to save
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </button>

          {/* Private Vault */}
          <button
            onClick={() => setActiveSubView('vault')}
            className="w-full p-3.5 flex items-center justify-between hover:bg-zinc-900/60 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-950/40 text-amber-400 border border-amber-400/30">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">{t('privateVault')}</p>
                <p className="text-[10px] text-zinc-400">
                  {vaultMedia.length} private items protected by PIN
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </button>

          {/* Storage Manager */}
          <button
            onClick={() => setActiveSubView('storage')}
            className="w-full p-3.5 flex items-center justify-between hover:bg-zinc-900/60 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-950/40 text-cyan-400 border border-cyan-400/30">
                <HardDrive className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">{t('storageManager')}</p>
                <p className="text-[10px] text-zinc-400">
                  Clean cache & view directory allocation
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </button>
        </div>
      </div>

      {/* Download Preferences (Requirement 8) */}
      <div className="space-y-2">
        <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider px-1">
          {t('downloadSettings')}
        </p>

        <div className="bg-[#0e1015] rounded-2xl border border-zinc-800 p-4 space-y-4">
          {/* Storage Directory Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
              <Folder className="w-3.5 h-3.5 text-[#00F078]" />
              {t('storageLocation')}
            </label>
            <select
              value={settings.downloadLocation}
              onChange={(e) => onUpdateSettings({ downloadLocation: e.target.value })}
              className="w-full p-2.5 bg-black rounded-xl border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#00F078]"
            >
              <option value="/storage/emulated/0/Download/MnsTubePro/">
                Internal Storage (/Download/MnsTubePro/)
              </option>
              <option value="/storage/emulated/0/Movies/MnsTubePro/">
                Movies Folder (/Movies/MnsTubePro/)
              </option>
              <option value="/SDCard/MnsTubePro/">MicroSD Card (/SDCard/MnsTubePro/)</option>
            </select>
          </div>

          {/* Max Simultaneous Downloads */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-white">{t('maxConcurrent')}</p>
              <p className="text-[10px] text-zinc-400">WorkManager concurrent workers</p>
            </div>
            <select
              value={settings.maxConcurrentDownloads}
              onChange={(e) =>
                onUpdateSettings({ maxConcurrentDownloads: parseInt(e.target.value) })
              }
              className="p-1.5 bg-black rounded-xl border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#00F078]"
            >
              <option value={1}>1 Task</option>
              <option value={2}>2 Tasks</option>
              <option value={3}>3 Tasks (Recommended)</option>
              <option value={5}>5 Tasks (Turbo)</option>
            </select>
          </div>

          {/* Wi-Fi Only Toggle */}
          <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-zinc-800/60">
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-zinc-400" />
              <div>
                <p className="text-xs font-bold text-white">{t('wifiOnly')}</p>
                <p className="text-[10px] text-zinc-400">Avoid mobile cellular data usage</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.wifiOnly}
              onChange={(e) => onUpdateSettings({ wifiOnly: e.target.checked })}
              className="w-4 h-4 accent-[#00F078] cursor-pointer"
            />
          </label>

          {/* Default Resolution */}
          <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60">
            <div>
              <p className="text-xs font-bold text-white">{t('defaultVideoQuality')}</p>
              <p className="text-[10px] text-zinc-400">Auto-selected resolution for new links</p>
            </div>
            <select
              value={settings.defaultVideoQuality}
              onChange={(e) => onUpdateSettings({ defaultVideoQuality: e.target.value })}
              className="p-1.5 bg-black rounded-xl border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#00F078]"
            >
              <option value="1080p Full HD">1080p FHD</option>
              <option value="720p HD">720p HD</option>
              <option value="480p">480p Standard</option>
            </select>
          </div>

          {/* Floating Download Bubble Toggle */}
          <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-zinc-800/60">
            <div>
              <p className="text-xs font-bold text-white">{t('floatingShortcut')}</p>
              <p className="text-[10px] text-zinc-400">
                SnapTube-style fast screen button
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.showFloatingShortcut}
              onChange={(e) => onUpdateSettings({ showFloatingShortcut: e.target.checked })}
              className="w-4 h-4 accent-[#00F078] cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* Language & Theme (Requirement 1 & 8) */}
      <div className="space-y-2">
        <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider px-1">
          Language & Appearance
        </p>

        <div className="bg-[#0e1015] rounded-2xl border border-zinc-800 p-4 space-y-3">
          {/* Language Selection */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#00F078]" />
              <div>
                <p className="text-xs font-bold text-white">{t('languageSelection')}</p>
                <p className="text-[10px] text-zinc-400">English / اردو</p>
              </div>
            </div>

            <div className="flex gap-1 bg-black p-1 rounded-xl border border-zinc-800">
              <button
                onClick={() => onUpdateSettings({ language: 'en' })}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  settings.language === 'en'
                    ? 'bg-[#00F078] text-black shadow-[0_0_10px_rgba(0,240,120,0.3)]'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                English
              </button>
              <button
                onClick={() => onUpdateSettings({ language: 'ur' })}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  settings.language === 'ur'
                    ? 'bg-[#00F078] text-black shadow-[0_0_10px_rgba(0,240,120,0.3)]'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                اردو
              </button>
            </div>
          </div>

          {/* Theme */}
          <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-[#00F078]" />
              <div>
                <p className="text-xs font-bold text-white">{t('themeSelection')}</p>
                <p className="text-[10px] text-zinc-400">Pure Black (#050505) + Neon Green (#00F078)</p>
              </div>
            </div>

            <span className="text-xs font-mono font-bold text-[#00F078] px-2.5 py-1 rounded-lg bg-[#00F078]/10 border border-[#00F078]/30">
              OLED Neon
            </span>
          </div>
        </div>
      </div>

      {/* About & Privacy Policy */}
      <div className="space-y-2">
        <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider px-1">
          Legal & About
        </p>

        <div className="bg-[#0e1015] rounded-2xl border border-zinc-800 divide-y divide-zinc-800/80 overflow-hidden">
          <button
            onClick={() => setShowPrivacyModal(true)}
            className="w-full p-3.5 flex items-center justify-between hover:bg-zinc-900/60 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold text-white">{t('privacyPolicy')}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </button>

          <button
            onClick={() => setShowAboutModal(true)}
            className="w-full p-3.5 flex items-center justify-between hover:bg-zinc-900/60 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <Info className="w-4 h-4 text-[#00F078]" />
              <span className="text-xs font-semibold text-white">{t('aboutApp')}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </button>
        </div>
      </div>

      {/* Android Code Export Modal */}
      <AndroidCodeExportModal
        isOpen={showCodeExport}
        onClose={() => setShowCodeExport(false)}
        t={t}
      />

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0e1015] rounded-3xl border border-zinc-800 p-5 shadow-2xl space-y-3 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#00F078]" />
                Privacy & Copyright Policy
              </h3>
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="text-xs text-zinc-300 space-y-2 leading-relaxed">
              <p>
                <strong>1. Compliance & Authorized Downloads:</strong> MNS TUBE PRO operates
                strictly in adherence to applicable platform terms and copyright regulations. The
                app only downloads media that are publicly available, Creative Commons licensed, or
                expressly authorized by content creators.
              </p>
              <p>
                <strong>2. DRM & Access Restriction Protection:</strong> MNS TUBE PRO does not
                bypass Digital Rights Management (DRM), decryption, or unauthorized paywalls.
              </p>
              <p>
                <strong>3. Scoped Storage & Local Privacy:</strong> Downloads, WhatsApp status
                media, and private vault records are stored 100% locally on your device. No user
                browsing data or files are transmitted to external surveillance servers.
              </p>
            </div>
            <button
              onClick={() => setShowPrivacyModal(false)}
              className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* About Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0e1015] rounded-3xl border border-zinc-800 p-5 shadow-2xl space-y-4 text-center">
            <div className="w-16 h-16 rounded-2xl overflow-hidden mx-auto border border-[#00F078]/40 shadow-[0_0_15px_rgba(0,240,120,0.3)] bg-black">
              <img
                src="/src/assets/images/mns_tube_logo_1793395248385.jpg"
                alt="MNS TUBE PRO"
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h3 className="text-base font-extrabold text-white font-display">
                MNS TUBE PRO
              </h3>
              <p className="text-xs text-[#00F078] font-bold mt-0.5">
                Android Video Downloader & Media Studio
              </p>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Engineered for speed, high-fidelity media playback, status saving, and private vault
                protection. Built with Kotlin, Jetpack Compose, and modern Android architecture.
              </p>
            </div>

            <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-[11px] font-mono text-zinc-400 space-y-1">
              <p>Version: 4.8.2-PRO (Release 2026)</p>
              <p>Package: com.mnstube.pro</p>
              <p>Target SDK: Android 15 (API 35)</p>
            </div>

            <button
              onClick={() => setShowAboutModal(false)}
              className="w-full py-2 bg-[#00F078] text-black font-bold text-xs rounded-xl hover:bg-[#00d66c]"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
