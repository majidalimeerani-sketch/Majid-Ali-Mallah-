import React from 'react';
import { Play, Pause, SkipForward, X, Maximize2 } from 'lucide-react';
import { MediaItem } from '../types';

interface MiniPlayerProps {
  currentMedia: MediaItem | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onExpand: () => void;
  onClose: () => void;
  progress: number; // 0 - 100
}

export const MiniPlayer: React.FC<MiniPlayerProps> = ({
  currentMedia,
  isPlaying,
  onTogglePlay,
  onNext,
  onExpand,
  onClose,
  progress,
}) => {
  if (!currentMedia) return null;

  return (
    <div className="bg-[#0f1117] border-t border-zinc-800/90 shadow-2xl px-3 py-2 flex items-center justify-between gap-3 relative select-none shrink-0 z-20">
      {/* Top micro progress bar */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-zinc-800">
        <div
          className="h-full bg-[#00F078] shadow-[0_0_8px_#00F078] transition-all"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Media thumbnail and Info */}
      <div
        className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer"
        onClick={onExpand}
      >
        <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800 shrink-0 relative">
          <img
            src={currentMedia.thumbnail}
            alt={currentMedia.title}
            className="w-full h-full object-cover"
          />
          {isPlaying && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-0.5">
              <span className="w-0.5 h-3 bg-[#00F078] animate-pulse"></span>
              <span className="w-0.5 h-4 bg-[#00F078] animate-pulse delay-75"></span>
              <span className="w-0.5 h-2 bg-[#00F078] animate-pulse delay-150"></span>
            </div>
          )}
        </div>

        <div className="min-w-0">
          <p className="text-xs font-bold text-white truncate leading-tight">
            {currentMedia.title}
          </p>
          <p className="text-[10px] text-zinc-400 truncate mt-0.5 flex items-center gap-1.5">
            <span className="text-[#00F078]">{currentMedia.format.toUpperCase()}</span>
            <span>·</span>
            <span>{currentMedia.artist || currentMedia.source}</span>
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={onTogglePlay}
          className="w-8 h-8 rounded-full bg-[#00F078] text-black flex items-center justify-center hover:bg-[#00d66c] shadow-[0_0_10px_rgba(0,240,120,0.4)] active:scale-95 transition-all"
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 fill-black" />
          ) : (
            <Play className="w-4 h-4 fill-black ml-0.5" />
          )}
        </button>

        <button
          onClick={onNext}
          title="Next track"
          className="p-1.5 rounded-lg text-zinc-400 hover:text-white active:scale-95 transition-colors"
        >
          <SkipForward className="w-4 h-4" />
        </button>

        <button
          onClick={onExpand}
          title="Full player"
          className="p-1.5 rounded-lg text-zinc-400 hover:text-[#00F078] active:scale-95 transition-colors"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        <button
          onClick={onClose}
          title="Close player"
          className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 active:scale-95 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
