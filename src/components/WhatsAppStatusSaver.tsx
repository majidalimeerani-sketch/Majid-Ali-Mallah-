import React, { useState } from 'react';
import { ArrowDown, Check, ShieldCheck, Play, Image, Video, UploadCloud } from 'lucide-react';
import { WhatsAppStatus } from '../types';

interface WhatsAppStatusSaverProps {
  statuses: WhatsAppStatus[];
  onSaveStatus: (id: string) => void;
  onSaveAll: () => void;
  onAddCustomStatus: (status: WhatsAppStatus) => void;
  t: (key: string) => string;
}

export const WhatsAppStatusSaver: React.FC<WhatsAppStatusSaverProps> = ({
  statuses,
  onSaveStatus,
  onSaveAll,
  onAddCustomStatus,
  t,
}) => {
  const [filter, setFilter] = useState<'all' | 'video' | 'image'>('all');
  const [hasPermission, setHasPermission] = useState(true);
  const [activePreview, setActivePreview] = useState<WhatsAppStatus | null>(null);

  const filteredStatuses = statuses.filter((item) => {
    if (filter === 'video') return item.type === 'video';
    if (filter === 'image') return item.type === 'image';
    return true;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const isVideo = file.type.startsWith('video');

    const newStatus: WhatsAppStatus = {
      id: `wa-custom-${Date.now()}`,
      senderName: file.name.slice(0, 15),
      timeAgo: 'Just now',
      type: isVideo ? 'video' : 'image',
      mediaUrl: url,
      thumbnail: isVideo
        ? 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80'
        : url,
      duration: isVideo ? '0:30' : undefined,
      isSaved: false,
    };

    onAddCustomStatus(newStatus);
  };

  return (
    <div className="space-y-4">
      {/* Banner / Header */}
      <div className="p-4 bg-gradient-to-r from-emerald-950/60 to-zinc-900/90 rounded-2xl border border-[#00F078]/30 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00F078] shadow-[0_0_10px_#00F078]"></span>
            <h3 className="text-sm font-bold text-white">{t('statusSaver')}</h3>
          </div>
          <span className="text-[10px] text-[#00F078] font-bold px-2 py-0.5 rounded-md bg-[#00F078]/10 border border-[#00F078]/30 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Scoped Storage
          </span>
        </div>
        <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
          {t('statusSaverDesc')}
        </p>

        {/* Action bar */}
        <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-zinc-800">
          <div className="flex items-center gap-1 text-[11px] text-zinc-300">
            <span className="font-semibold text-white">Status Media:</span>
            <span>{statuses.length} available</span>
          </div>

          <div className="flex items-center gap-2">
            <label className="cursor-pointer px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 flex items-center gap-1 transition-all">
              <UploadCloud className="w-3.5 h-3.5 text-[#00F078]" />
              <span>Import Status</span>
              <input
                type="file"
                accept="video/*,image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <button
              onClick={onSaveAll}
              className="px-3 py-1 rounded-lg bg-[#00F078] text-black text-xs font-bold hover:bg-[#00d66c] shadow-[0_0_12px_rgba(0,240,120,0.3)] transition-all flex items-center gap-1"
            >
              <ArrowDown className="w-3.5 h-3.5" />
              {t('saveAll')}
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            filter === 'all'
              ? 'bg-[#00F078] text-black shadow-[0_0_10px_rgba(0,240,120,0.3)]'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          All ({statuses.length})
        </button>
        <button
          onClick={() => setFilter('video')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
            filter === 'video'
              ? 'bg-[#00F078] text-black shadow-[0_0_10px_rgba(0,240,120,0.3)]'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <Video className="w-3 h-3" /> Videos
        </button>
        <button
          onClick={() => setFilter('image')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
            filter === 'image'
              ? 'bg-[#00F078] text-black shadow-[0_0_10px_rgba(0,240,120,0.3)]'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <Image className="w-3 h-3" /> Photos
        </button>
      </div>

      {/* Grid of Status Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {filteredStatuses.map((item) => (
          <div
            key={item.id}
            className="group relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 aspect-[9/13] shadow-md hover:border-zinc-700 transition-all"
          >
            <img
              src={item.thumbnail}
              alt={item.senderName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {/* Top Badge: Type & Sender */}
            <div className="absolute top-2 inset-x-2 flex items-center justify-between text-[10px]">
              <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-zinc-200 font-semibold truncate max-w-[100px]">
                {item.senderName}
              </span>
              <span className="px-1.5 py-0.5 rounded-md bg-black/70 text-[#00F078] font-mono">
                {item.type === 'video' ? item.duration || '0:30' : 'HD'}
              </span>
            </div>

            {/* Bottom Overlay Actions */}
            <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-center justify-between gap-1">
              <span className="text-[9px] text-zinc-400 truncate">
                {item.timeAgo}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActivePreview(item)}
                  title="Preview"
                  className="p-1.5 rounded-lg bg-black/70 text-white hover:text-[#00F078] hover:bg-black transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                </button>

                <button
                  onClick={() => onSaveStatus(item.id)}
                  title={item.isSaved ? 'Already saved' : 'Save to Gallery'}
                  className={`p-1.5 rounded-lg transition-all ${
                    item.isSaved
                      ? 'bg-zinc-800 text-[#00F078]'
                      : 'bg-[#00F078] text-black hover:bg-[#00d66c] shadow-[0_0_10px_rgba(0,240,120,0.4)]'
                  }`}
                >
                  {item.isSaved ? (
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  ) : (
                    <ArrowDown className="w-3.5 h-3.5 stroke-[2.5]" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox / Preview Modal */}
      {activePreview && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-sm bg-zinc-950 rounded-3xl border border-zinc-800 overflow-hidden flex flex-col shadow-2xl">
            <div className="p-3 border-b border-zinc-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">{activePreview.senderName}</p>
                <p className="text-[10px] text-zinc-400">{activePreview.timeAgo}</p>
              </div>
              <button
                onClick={() => setActivePreview(null)}
                className="p-1 text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="aspect-[9/14] bg-black flex items-center justify-center relative overflow-hidden">
              {activePreview.type === 'video' ? (
                <video
                  src={activePreview.mediaUrl}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
              ) : (
                <img
                  src={activePreview.mediaUrl}
                  alt={activePreview.senderName}
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            <div className="p-3 bg-zinc-900 flex items-center justify-between">
              <span className="text-xs text-zinc-300">
                {activePreview.isSaved ? 'Saved in /MnsTubePro/WhatsApp/' : 'Ready to save'}
              </span>
              <button
                onClick={() => {
                  onSaveStatus(activePreview.id);
                  setActivePreview(null);
                }}
                className="px-3 py-1.5 rounded-lg bg-[#00F078] text-black font-bold text-xs hover:bg-[#00d66c] flex items-center gap-1.5"
              >
                <ArrowDown className="w-3.5 h-3.5" />
                {activePreview.isSaved ? 'Save Again' : 'Save to Device'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
