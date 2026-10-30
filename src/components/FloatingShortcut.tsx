import React, { useState } from 'react';
import { ArrowDown, X, Link2 } from 'lucide-react';

interface FloatingShortcutProps {
  visible: boolean;
  onTriggerQuickDownload: () => void;
  onDismiss: () => void;
}

export const FloatingShortcut: React.FC<FloatingShortcutProps> = ({
  visible,
  onTriggerQuickDownload,
  onDismiss,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  if (!visible) return null;

  return (
    <div
      className="absolute bottom-24 right-4 z-40 flex items-center gap-1 select-none transition-all duration-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Dismiss cross when hovered */}
      {isHovered && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDismiss();
          }}
          title="Hide floating shortcut"
          className="p-1 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white"
        >
          <X className="w-3 h-3" />
        </button>
      )}

      {/* Floating neon button */}
      <button
        onClick={onTriggerQuickDownload}
        title="Quick Download Assistant"
        className="relative group p-3 rounded-full bg-[#00F078] text-black shadow-[0_0_20px_rgba(0,240,120,0.6)] hover:bg-[#00d66c] active:scale-95 transition-all flex items-center justify-center"
      >
        <ArrowDown className="w-5 h-5 stroke-[2.5] animate-bounce" />

        {/* Badge */}
        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-black border-2 border-[#00F078] flex items-center justify-center">
          <Link2 className="w-2 h-2 text-[#00F078]" />
        </span>
      </button>
    </div>
  );
};
