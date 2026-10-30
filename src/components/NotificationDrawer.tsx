import React from 'react';
import { X, Play, Pause, Trash2, CheckCircle2, ArrowDownCircle, HardDrive } from 'lucide-react';
import { DownloadItem } from '../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  downloads: DownloadItem[];
  onPauseResume: (id: string) => void;
  onCancel: (id: string) => void;
  onPlayMedia: (item: DownloadItem) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  downloads,
  onPauseResume,
  onCancel,
  onPlayMedia,
}) => {
  if (!isOpen) return null;

  const activeDownloads = downloads.filter(
    (d) => d.status === 'downloading' || d.status === 'paused' || d.status === 'queued'
  );
  const completedDownloads = downloads.filter((d) => d.status === 'completed');

  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-50 flex flex-col justify-start animate-in fade-in duration-200">
      {/* Drawer Surface */}
      <div className="bg-[#0c0d10] border-b border-zinc-800 rounded-b-3xl p-4 shadow-2xl max-h-[85%] flex flex-col">
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#00F078] shadow-[0_0_8px_#00F078]"></div>
            <span className="text-xs font-bold text-white tracking-wide uppercase">
              Android Notification Center
            </span>
            <span className="text-[10px] text-zinc-400">· MNS TUBE PRO</span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content list */}
        <div className="overflow-y-auto space-y-3 py-3 pr-1 flex-1">
          {activeDownloads.length === 0 && completedDownloads.length === 0 && (
            <div className="text-center py-8 text-zinc-400 text-xs">
              No recent download notifications
            </div>
          )}

          {/* Active Downloading Items */}
          {activeDownloads.map((item) => (
            <div
              key={item.id}
              className="p-3 bg-[#13151b] rounded-2xl border border-zinc-800/90 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 text-[#00F078]">
                    <ArrowDownCircle className="w-4 h-4 animate-bounce" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white truncate">
                      {item.title}
                    </p>
                    <p className="text-[10px] text-zinc-400 flex items-center gap-1.5 mt-0.5 font-mono-nums">
                      <span>{item.quality}</span>
                      <span>·</span>
                      <span className="text-[#00F078] font-bold">{item.speed}</span>
                      <span>·</span>
                      <span>{item.downloadedBytes.toFixed(1)} / {item.fileSize.toFixed(1)} MB</span>
                    </p>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold text-[#00F078]">
                  {Math.round(item.progress)}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden mt-2.5">
                <div
                  className="bg-[#00F078] h-full rounded-full transition-all duration-300 shadow-[0_0_8px_#00F078]"
                  style={{ width: `${item.progress}%` }}
                ></div>
              </div>

              {/* Quick actions */}
              <div className="flex items-center justify-end gap-2 mt-2 pt-1 border-t border-zinc-800/60">
                <button
                  onClick={() => onPauseResume(item.id)}
                  className="text-[11px] font-medium text-zinc-300 hover:text-white px-2 py-0.5 rounded bg-zinc-800/80 hover:bg-zinc-700 flex items-center gap-1"
                >
                  {item.status === 'paused' ? (
                    <>
                      <Play className="w-3 h-3 text-[#00F078]" /> Resume
                    </>
                  ) : (
                    <>
                      <Pause className="w-3 h-3 text-amber-400" /> Pause
                    </>
                  )}
                </button>
                <button
                  onClick={() => onCancel(item.id)}
                  className="text-[11px] font-medium text-rose-400 hover:text-rose-300 px-2 py-0.5 rounded bg-rose-950/30 hover:bg-rose-900/40 flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> Cancel
                </button>
              </div>
            </div>
          ))}

          {/* Completed notifications */}
          {completedDownloads.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="p-3 bg-[#13151b] rounded-2xl border border-zinc-800/90 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-emerald-950/40 border border-[#00F078]/30 flex items-center justify-center shrink-0 text-[#00F078]">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white truncate">
                    {item.title}
                  </p>
                  <p className="text-[10px] text-zinc-400 flex items-center gap-1.5 mt-0.5">
                    <span className="text-[#00F078]">Download complete</span>
                    <span>·</span>
                    <span className="font-mono-nums">{item.fileSize} MB</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  onPlayMedia(item);
                  onClose();
                }}
                className="px-3 py-1 rounded-lg bg-[#00F078] text-black font-bold text-xs hover:bg-[#00d66c] transition-all flex items-center gap-1 shrink-0"
              >
                <Play className="w-3 h-3 fill-black" /> Play
              </button>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="pt-2 border-t border-zinc-800 text-[10px] text-zinc-400 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <HardDrive className="w-3 h-3 text-[#00F078]" />
            Saved to /MnsTubePro/Download/
          </span>
          <button
            onClick={onClose}
            className="text-zinc-300 hover:text-white font-medium"
          >
            Dismiss
          </button>
        </div>
      </div>

      {/* Backdrop click to close */}
      <div className="flex-1" onClick={onClose}></div>
    </div>
  );
};
