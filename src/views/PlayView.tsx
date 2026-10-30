import React, { useState } from 'react';
import {
  Play,
  Film,
  Music,
  ListPlus,
  Search,
  MoreVertical,
  ShieldAlert,
  Trash2,
  FolderOpen,
  Sparkles,
  Plus,
} from 'lucide-react';
import { MediaItem, Playlist } from '../types';

interface PlayViewProps {
  mediaLibrary: MediaItem[];
  playlists: Playlist[];
  onPlayMedia: (item: MediaItem) => void;
  onDeleteMedia: (id: string) => void;
  onMoveToVault: (item: MediaItem) => void;
  onCreatePlaylist: (name: string) => void;
  t: (key: string) => string;
}

export const PlayView: React.FC<PlayViewProps> = ({
  mediaLibrary,
  playlists,
  onPlayMedia,
  onDeleteMedia,
  onMoveToVault,
  onCreatePlaylist,
  t,
}) => {
  const [filter, setFilter] = useState<'all' | 'video' | 'audio' | 'playlists'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Filter out vault items from public library
  const publicMedia = mediaLibrary.filter((m) => !m.isVault);

  const filteredMedia = publicMedia.filter((m) => {
    if (filter === 'video' && m.format !== 'video') return false;
    if (filter === 'audio' && m.format !== 'audio') return false;
    if (searchQuery.trim()) {
      const matchTitle = m.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchArtist = m.artist?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchTitle || matchArtist;
    }
    return true;
  });

  const handleCreatePlaylistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;
    onCreatePlaylist(newPlaylistName.trim());
    setNewPlaylistName('');
    setShowCreateModal(false);
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-3 sm:p-4 space-y-4">
      {/* Top Media Header */}
      <div className="p-4 bg-gradient-to-r from-emerald-950/40 via-[#0e1015] to-[#12141c] rounded-2xl border border-zinc-800 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00F078] shadow-[0_0_8px_#00F078]"></span>
              {t('library')}
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              {publicMedia.length} files stored locally · Hi-Fi Android Media Engine
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 hover:text-white border border-zinc-700/80 flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-3.5 h-3.5 text-[#00F078]" />
            <span>{t('createPlaylist')}</span>
          </button>
        </div>

        {/* Search within library */}
        <div className="mt-3 relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search saved videos, music, artists..."
            className="w-full pl-9 pr-3 py-2 bg-black/60 rounded-xl border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#00F078]"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            filter === 'all'
              ? 'bg-[#00F078] text-black shadow-[0_0_12px_rgba(0,240,120,0.3)]'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          All ({publicMedia.length})
        </button>

        <button
          onClick={() => setFilter('video')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            filter === 'video'
              ? 'bg-[#00F078] text-black shadow-[0_0_12px_rgba(0,240,120,0.3)]'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <Film className="w-3.5 h-3.5" />
          <span>Videos ({publicMedia.filter((m) => m.format === 'video').length})</span>
        </button>

        <button
          onClick={() => setFilter('audio')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            filter === 'audio'
              ? 'bg-[#00F078] text-black shadow-[0_0_12px_rgba(0,240,120,0.3)]'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <Music className="w-3.5 h-3.5" />
          <span>Music ({publicMedia.filter((m) => m.format === 'audio').length})</span>
        </button>

        <button
          onClick={() => setFilter('playlists')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            filter === 'playlists'
              ? 'bg-[#00F078] text-black shadow-[0_0_12px_rgba(0,240,120,0.3)]'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <ListPlus className="w-3.5 h-3.5" />
          <span>Playlists ({playlists.length})</span>
        </button>
      </div>

      {/* Playlists view */}
      {filter === 'playlists' ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {playlists.map((pl) => (
              <div
                key={pl.id}
                className="p-3 bg-[#0e1015] rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-all space-y-2 cursor-pointer group"
                onClick={() => {
                  if (pl.items.length > 0) onPlayMedia(pl.items[0]);
                }}
              >
                <div className="aspect-video rounded-xl overflow-hidden bg-black border border-zinc-800 relative">
                  <img
                    src={pl.coverImage}
                    alt={pl.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-9 h-9 rounded-full bg-[#00F078] text-black flex items-center justify-center shadow-[0_0_12px_#00F078]">
                      <Play className="w-4 h-4 fill-black ml-0.5" />
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white truncate">{pl.title}</h4>
                  <p className="text-[10px] text-zinc-400">{pl.items.length} tracks</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Media Items List */
        <div className="space-y-2">
          {filteredMedia.length === 0 ? (
            <div className="py-12 text-center bg-zinc-950/60 rounded-2xl border border-zinc-800 p-6 space-y-2">
              <FolderOpen className="w-8 h-8 text-zinc-600 mx-auto" />
              <p className="text-xs text-zinc-300 font-semibold">{t('noMediaFound')}</p>
              <p className="text-[11px] text-zinc-500">
                Download videos or music from the Download tab to populate your library.
              </p>
            </div>
          ) : (
            filteredMedia.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-[#0e1015] rounded-2xl border border-zinc-800 hover:border-zinc-700 flex items-center justify-between gap-3 transition-all group"
              >
                <div
                  className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                  onClick={() => onPlayMedia(item)}
                >
                  <div className="w-14 h-12 rounded-xl overflow-hidden bg-black border border-zinc-800 shrink-0 relative">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1 right-1 bg-black/85 text-[8px] px-1 rounded text-white font-mono">
                      {item.duration}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate group-hover:text-[#00F078] transition-colors">
                      {item.title}
                    </p>
                    <p className="text-[10px] text-zinc-400 flex items-center gap-1.5 mt-0.5 font-mono-nums">
                      <span className="text-[#00F078]">{item.quality}</span>
                      <span>·</span>
                      <span>{item.size}</span>
                      <span>·</span>
                      <span>{item.artist || item.source}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => onPlayMedia(item)}
                    className="p-2 rounded-xl bg-[#00F078] text-black hover:bg-[#00d66c] shadow-[0_0_10px_rgba(0,240,120,0.3)] transition-all"
                    title="Play"
                  >
                    <Play className="w-3.5 h-3.5 fill-black" />
                  </button>

                  <button
                    onClick={() => onMoveToVault(item)}
                    className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-amber-400 transition-all"
                    title="Move to Private Vault"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteMedia(item.id)}
                    className="p-2 rounded-xl bg-zinc-900 hover:bg-rose-950/60 text-zinc-500 hover:text-rose-400 transition-all"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal: Create Playlist */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreatePlaylistSubmit}
            className="w-full max-w-sm bg-[#0e1015] rounded-3xl border border-zinc-800 p-5 shadow-2xl space-y-4"
          >
            <h3 className="text-sm font-bold text-white">Create New Playlist</h3>
            <input
              type="text"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              placeholder="e.g. Favorite Hits, Gym Workout, Late Night"
              className="w-full p-3 bg-black rounded-xl border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#00F078]"
              autoFocus
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-3 py-1.5 rounded-xl bg-zinc-800 text-xs text-zinc-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newPlaylistName.trim()}
                className="px-4 py-1.5 rounded-xl bg-[#00F078] text-black font-bold text-xs hover:bg-[#00d66c]"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
