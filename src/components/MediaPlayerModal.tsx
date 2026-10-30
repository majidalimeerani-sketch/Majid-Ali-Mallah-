import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize,
  Repeat,
  Shuffle,
  ShieldAlert,
  ListMusic,
  ExternalLink,
} from 'lucide-react';
import { MediaItem } from '../types';

interface MediaPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  media: MediaItem | null;
  playlist: MediaItem[];
  onSelectTrack: (item: MediaItem) => void;
  onToggleVault?: (item: MediaItem) => void;
  t: (key: string) => string;
}

export const MediaPlayerModal: React.FC<MediaPlayerModalProps> = ({
  isOpen,
  onClose,
  media,
  playlist,
  onSelectTrack,
  onToggleVault,
  t,
}) => {
  if (!isOpen || !media) return null;

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);

  const isVideo = media.format === 'video';

  // Audio Visualizer Animation Loop for Music
  useEffect(() => {
    if (isVideo) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const bars = 28;
      const barWidth = canvas.width / bars - 3;

      for (let i = 0; i < bars; i++) {
        // synthesize frequency bar heights based on time & isPlaying
        const baseHeight = isPlaying
          ? Math.sin(phase + i * 0.35) * 20 + Math.cos(phase * 1.5 + i * 0.2) * 15 + 25
          : 8;

        const h = Math.max(4, Math.min(canvas.height - 4, baseHeight));
        const x = i * (barWidth + 3);
        const y = canvas.height - h;

        // Neon green gradient
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
        gradient.addColorStop(0, '#00F078');
        gradient.addColorStop(1, '#00b355');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, h, [3, 3, 0, 0]);
        ctx.fill();
      }

      if (isPlaying) phase += 0.08;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, isVideo]);

  // Sync state with HTML media
  const handleTimeUpdate = () => {
    const el = isVideo ? videoRef.current : audioRef.current;
    if (el) {
      setCurrentTime(el.currentTime);
      setDuration(el.duration || 1);
    }
  };

  const handleTogglePlay = () => {
    const el = isVideo ? videoRef.current : audioRef.current;
    if (!el) return;
    if (isPlaying) {
      el.pause();
      setIsPlaying(false);
    } else {
      el.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = parseFloat(e.target.value);
    const el = isVideo ? videoRef.current : audioRef.current;
    if (el) {
      el.currentTime = targetTime;
      setCurrentTime(targetTime);
    }
  };

  const handleSkip = (seconds: number) => {
    const el = isVideo ? videoRef.current : audioRef.current;
    if (el) {
      el.currentTime = Math.max(0, Math.min(el.duration, el.currentTime + seconds));
    }
  };

  const handleRateChange = (rate: number) => {
    setPlaybackRate(rate);
    const el = isVideo ? videoRef.current : audioRef.current;
    if (el) el.playbackRate = rate;
  };

  const handleToggleMute = () => {
    const el = isVideo ? videoRef.current : audioRef.current;
    if (el) {
      el.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (v: number) => {
    setVolume(v);
    const el = isVideo ? videoRef.current : audioRef.current;
    if (el) {
      el.volume = v;
      if (v === 0) setIsMuted(true);
      else setIsMuted(false);
    }
  };

  const handleFullScreen = () => {
    if (isVideo && videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen().catch(() => {});
      }
    }
  };

  const formatSeconds = (sec: number) => {
    if (isNaN(sec)) return '00:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="absolute inset-0 bg-[#050505] z-50 flex flex-col justify-between overflow-hidden animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="px-4 py-3 bg-[#0c0d10] border-b border-zinc-800 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00F078] shadow-[0_0_8px_#00F078]"></span>
          <span className="text-xs font-bold text-white tracking-wide">
            {t('mediaPlayer')}
          </span>
          <span className="text-[10px] text-zinc-400 font-mono">
            · {media.quality}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onToggleVault && (
            <button
              onClick={() => onToggleVault(media)}
              title={media.isVault ? 'Remove from vault' : 'Move to private vault'}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-amber-400 transition-colors"
            >
              <ShieldAlert className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => setShowPlaylist(!showPlaylist)}
            title="Playlist drawer"
            className={`p-1.5 rounded-lg transition-colors ${
              showPlaylist ? 'bg-[#00F078]/20 text-[#00F078]' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <ListMusic className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Viewport */}
      <div className="flex-1 flex flex-col items-center justify-center relative bg-black p-4 overflow-hidden">
        {isVideo ? (
          <div className="w-full h-full max-h-[380px] rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 flex items-center justify-center relative shadow-2xl">
            <video
              ref={videoRef}
              src={media.streamUrl}
              autoPlay
              playsInline
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => {
                if (isLooping && videoRef.current) {
                  videoRef.current.currentTime = 0;
                  videoRef.current.play();
                } else {
                  setIsPlaying(false);
                }
              }}
              className="w-full h-full object-contain"
            />
          </div>
        ) : (
          /* Music Artwork + Visualizer */
          <div className="flex flex-col items-center justify-center w-full max-w-sm space-y-4">
            <audio
              ref={audioRef}
              src={media.streamUrl}
              autoPlay
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => {
                if (isLooping && audioRef.current) {
                  audioRef.current.currentTime = 0;
                  audioRef.current.play();
                } else {
                  setIsPlaying(false);
                }
              }}
            />

            <div className="w-48 h-48 rounded-3xl overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.8),0_0_30px_rgba(0,240,120,0.15)] border-2 border-zinc-800 relative group">
              <img
                src={media.thumbnail}
                alt={media.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                <span className="text-[10px] text-[#00F078] font-mono font-bold tracking-widest uppercase">
                  MNS Hi-Fi Sound
                </span>
              </div>
            </div>

            {/* Audio Visualizer Canvas */}
            <div className="w-full h-16 bg-[#0a0c10] rounded-xl border border-zinc-800/80 p-1 flex items-center justify-center">
              <canvas
                ref={canvasRef}
                width={300}
                height={56}
                className="w-full h-full"
              ></canvas>
            </div>
          </div>
        )}

        {/* Media Details */}
        <div className="w-full max-w-md mt-4 text-center px-4">
          <h3 className="text-sm font-bold text-white truncate">{media.title}</h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            {media.artist || media.source} · {media.duration} · {media.size}
          </p>
        </div>

        {/* Playlist Drawer Overlay */}
        {showPlaylist && (
          <div className="absolute inset-x-2 bottom-2 top-2 bg-[#0e1015]/95 backdrop-blur-md border border-zinc-800 rounded-2xl p-4 flex flex-col z-20 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <ListMusic className="w-4 h-4 text-[#00F078]" />
                Upcoming Queue ({playlist.length})
              </span>
              <button
                onClick={() => setShowPlaylist(false)}
                className="p-1 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 py-3">
              {playlist.map((track) => (
                <div
                  key={track.id}
                  onClick={() => {
                    onSelectTrack(track);
                    setShowPlaylist(false);
                  }}
                  className={`p-2 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                    track.id === media.id
                      ? 'bg-[#00F078]/10 border-[#00F078]'
                      : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <img
                    src={track.thumbnail}
                    alt={track.title}
                    className="w-10 h-10 rounded-lg object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-xs font-semibold truncate ${
                        track.id === media.id ? 'text-[#00F078]' : 'text-white'
                      }`}
                    >
                      {track.title}
                    </p>
                    <p className="text-[10px] text-zinc-400 truncate">
                      {track.artist || track.source} · {track.duration}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Media Scrubber and Controls */}
      <div className="p-4 bg-[#0a0c10] border-t border-zinc-800 shrink-0 space-y-3">
        {/* Scrubber */}
        <div className="space-y-1">
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            className="w-full accent-[#00F078] cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
          />
          <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono-nums">
            <span>{formatSeconds(currentTime)}</span>
            <span>{formatSeconds(duration)}</span>
          </div>
        </div>

        {/* Buttons Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsLooping(!isLooping)}
              title="Repeat track"
              className={`p-2 rounded-lg transition-colors ${
                isLooping ? 'text-[#00F078] bg-[#00F078]/15' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Repeat className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsShuffle(!isShuffle)}
              title="Shuffle queue"
              className={`p-2 rounded-lg transition-colors ${
                isShuffle ? 'text-[#00F078] bg-[#00F078]/15' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Shuffle className="w-4 h-4" />
            </button>
          </div>

          {/* Main playback control cluster */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSkip(-10)}
              title="Rewind 10s"
              className="p-2 text-zinc-300 hover:text-white active:scale-95 transition-all"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={handleTogglePlay}
              className="w-12 h-12 rounded-full bg-[#00F078] text-black flex items-center justify-center hover:bg-[#00d66c] shadow-[0_0_20px_rgba(0,240,120,0.5)] active:scale-95 transition-all"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-black" />
              ) : (
                <Play className="w-5 h-5 fill-black ml-0.5" />
              )}
            </button>

            <button
              onClick={() => handleSkip(10)}
              title="Forward 10s"
              className="p-2 text-zinc-300 hover:text-white active:scale-95 transition-all"
            >
              <RotateCw className="w-5 h-5" />
            </button>
          </div>

          {/* Speed & Fullscreen */}
          <div className="flex items-center gap-2">
            <select
              value={playbackRate}
              onChange={(e) => handleRateChange(parseFloat(e.target.value))}
              className="bg-zinc-900 border border-zinc-800 text-[11px] font-bold text-zinc-200 px-2 py-1 rounded-lg focus:outline-none focus:border-[#00F078]"
            >
              <option value="0.75">0.75x</option>
              <option value="1">1.0x</option>
              <option value="1.25">1.25x</option>
              <option value="1.5">1.5x</option>
              <option value="2">2.0x</option>
            </select>

            {isVideo && (
              <button
                onClick={handleFullScreen}
                title="Full screen"
                className="p-2 text-zinc-400 hover:text-[#00F078] active:scale-95 transition-all"
              >
                <Maximize className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
