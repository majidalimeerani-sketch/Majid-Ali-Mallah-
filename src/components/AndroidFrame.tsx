import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, Wifi, BatteryCharging, Signal } from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
  activeDownloadsCount: number;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({ children, activeDownloadsCount }) => {
  const [isPhoneMode, setIsPhoneMode] = useState<boolean>(() => {
    // Default to true on larger screens so they experience the Android phone mockup, but easily toggleable
    return window.innerWidth > 768;
  });
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#020202] text-white flex flex-col items-center justify-start p-0 md:py-6 selection:bg-[#00F078]/30 selection:text-[#00F078]">
      {/* Top Mode Bar for Desktop Viewers */}
      <div className="w-full max-w-5xl px-4 py-2 hidden md:flex items-center justify-between text-xs text-zinc-400 mb-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00F078] shadow-[0_0_8px_#00F078]"></span>
          <span className="font-semibold text-zinc-200">MNS TUBE PRO</span>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-400">Android 15 Experience · v4.8.2</span>
        </div>

        <div className="flex items-center gap-1 bg-[#121418] p-1 rounded-xl border border-zinc-800">
          <button
            onClick={() => setIsPhoneMode(true)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              isPhoneMode
                ? 'bg-[#00F078] text-black font-semibold shadow-[0_0_12px_rgba(0,240,120,0.4)]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            Android Device
          </button>
          <button
            onClick={() => setIsPhoneMode(false)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              !isPhoneMode
                ? 'bg-[#00F078] text-black font-semibold shadow-[0_0_12px_rgba(0,240,120,0.4)]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            Expanded Screen
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div
        className={`w-full transition-all duration-300 ${
          isPhoneMode
            ? 'max-w-[420px] h-[920px] max-h-[96vh] rounded-[48px] border-[10px] border-[#181a1f] shadow-[0_20px_70px_rgba(0,0,0,0.9),0_0_40px_rgba(0,240,120,0.08)] flex flex-col relative overflow-hidden bg-[#050505]'
            : 'max-w-4xl min-h-[90vh] md:rounded-3xl border md:border-zinc-800 shadow-2xl flex flex-col relative overflow-hidden bg-[#050505]'
        }`}
      >
        {/* Android Hardware Status Bar (Visible in Phone Mode) */}
        {isPhoneMode && (
          <div className="h-9 px-6 bg-[#050505] flex items-center justify-between text-[11px] text-zinc-300 font-mono select-none z-50 shrink-0 border-b border-white/[0.04]">
            <div className="flex items-center gap-1.5 font-semibold text-white">
              <span>{currentTime}</span>
              {activeDownloadsCount > 0 && (
                <span className="flex items-center gap-1 text-[10px] text-[#00F078] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00F078] animate-ping"></span>
                  {activeDownloadsCount} DL
                </span>
              )}
            </div>

            {/* Camera Punchhole */}
            <div className="w-4 h-4 rounded-full bg-[#000000] border border-zinc-800 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-900"></div>
            </div>

            <div className="flex items-center gap-2">
              <Signal className="w-3 h-3 text-zinc-400" />
              <Wifi className="w-3 h-3 text-zinc-400" />
              <div className="flex items-center gap-0.5 text-zinc-300">
                <span>94%</span>
                <BatteryCharging className="w-3.5 h-3.5 text-[#00F078]" />
              </div>
            </div>
          </div>
        )}

        {/* Dynamic App Content */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {children}
        </div>

        {/* Android Navigation Bar Pill (Phone Mode) */}
        {isPhoneMode && (
          <div className="h-4 bg-[#050505] flex items-center justify-center select-none z-50 shrink-0">
            <div className="w-28 h-1 bg-zinc-600 rounded-full"></div>
          </div>
        )}
      </div>
    </div>
  );
};
