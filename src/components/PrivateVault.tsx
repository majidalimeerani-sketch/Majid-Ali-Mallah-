import React, { useState } from 'react';
import { Lock, Unlock, ShieldAlert, KeyRound, Eye, EyeOff, Play, ShieldCheck, ArrowLeft } from 'lucide-react';
import { MediaItem } from '../types';

interface PrivateVaultProps {
  vaultMedia: MediaItem[];
  savedPin: string;
  onUpdatePin: (newPin: string) => void;
  onRestoreFromVault: (item: MediaItem) => void;
  onPlayMedia: (item: MediaItem) => void;
  t: (key: string) => string;
}

export const PrivateVault: React.FC<PrivateVaultProps> = ({
  vaultMedia,
  savedPin,
  onUpdatePin,
  onRestoreFromVault,
  onPlayMedia,
  t,
}) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [newPinInput, setNewPinInput] = useState('');

  const handleDigit = (digit: string) => {
    setErrorMessage('');
    if (isChangingPin) {
      if (newPinInput.length < 4) {
        const next = newPinInput + digit;
        setNewPinInput(next);
        if (next.length === 4) {
          onUpdatePin(next);
          setIsChangingPin(false);
          setNewPinInput('');
          setErrorMessage('PIN successfully updated!');
        }
      }
      return;
    }

    if (pinInput.length < 4) {
      const next = pinInput + digit;
      setPinInput(next);
      if (next.length === 4) {
        if (next === savedPin) {
          setIsUnlocked(true);
          setPinInput('');
          setErrorMessage('');
        } else {
          setErrorMessage(t('wrongPin'));
          setPinInput('');
        }
      }
    }
  };

  const handleBackspace = () => {
    setErrorMessage('');
    if (isChangingPin) {
      setNewPinInput((prev) => prev.slice(0, -1));
    } else {
      setPinInput((prev) => prev.slice(0, -1));
    }
  };

  // Lock View (PIN Required)
  if (!isUnlocked) {
    return (
      <div className="flex flex-col items-center justify-center p-4 max-w-sm mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-3xl bg-zinc-900 border border-[#00F078]/40 shadow-[0_0_20px_rgba(0,240,120,0.2)] flex items-center justify-center mx-auto text-[#00F078]">
            <Lock className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-extrabold text-white font-display">
            {t('privateVault')}
          </h3>
          <p className="text-xs text-zinc-400">
            {t('vaultDesc')}
          </p>
          <p className="text-[11px] text-[#00F078]/80 font-mono">
            Default Demo PIN: 1234
          </p>
        </div>

        {/* 4 PIN Dots */}
        <div className="flex items-center justify-center gap-4 py-2">
          {[0, 1, 2, 3].map((idx) => {
            const isFilled = pinInput.length > idx;
            return (
              <div
                key={idx}
                className={`w-4 h-4 rounded-full border transition-all duration-150 ${
                  isFilled
                    ? 'bg-[#00F078] border-[#00F078] shadow-[0_0_12px_#00F078] scale-110'
                    : 'bg-zinc-900 border-zinc-700'
                }`}
              ></div>
            );
          })}
        </div>

        {errorMessage && (
          <p className="text-xs text-rose-400 font-semibold animate-shake text-center">
            {errorMessage}
          </p>
        )}

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-[260px] pt-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              onClick={() => handleDigit(digit)}
              className="h-14 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-lg font-bold text-white shadow-sm active:scale-90 active:border-[#00F078] transition-all flex items-center justify-center"
            >
              {digit}
            </button>
          ))}
          <button
            onClick={() => {
              setPinInput('');
              setErrorMessage('');
            }}
            className="h-14 rounded-2xl bg-zinc-950 text-xs font-semibold text-zinc-400 hover:text-white transition-all flex items-center justify-center"
          >
            Clear
          </button>
          <button
            onClick={() => handleDigit('0')}
            className="h-14 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-lg font-bold text-white shadow-sm active:scale-90 active:border-[#00F078] transition-all flex items-center justify-center"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            className="h-14 rounded-2xl bg-zinc-950 text-xs font-semibold text-rose-400 hover:text-rose-300 transition-all flex items-center justify-center"
          >
            Del
          </button>
        </div>
      </div>
    );
  }

  // Unlocked Vault View
  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="p-3.5 bg-[#0f1117] rounded-2xl border border-[#00F078]/40 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-emerald-950/60 text-[#00F078] border border-[#00F078]/30">
            <Unlock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white">{t('privateVault')} Unlocked</h3>
            <p className="text-[10px] text-[#00F078]">AES-256 Scoped Protection</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsChangingPin(!isChangingPin)}
            className="px-2.5 py-1 text-xs rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 flex items-center gap-1"
          >
            <KeyRound className="w-3 h-3 text-[#00F078]" />
            <span>Change PIN</span>
          </button>

          <button
            onClick={() => setIsUnlocked(false)}
            className="px-2.5 py-1 text-xs rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 text-rose-300 font-bold flex items-center gap-1"
          >
            <Lock className="w-3 h-3" />
            <span>Lock</span>
          </button>
        </div>
      </div>

      {/* Change PIN Box if active */}
      {isChangingPin && (
        <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 space-y-2">
          <p className="text-xs text-white font-semibold">Enter 4-Digit New PIN:</p>
          <div className="flex gap-2">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="w-3 h-3 rounded-full bg-zinc-800 inline-block border border-zinc-700"
                style={{
                  backgroundColor: newPinInput.length > i ? '#00F078' : undefined,
                }}
              ></span>
            ))}
          </div>
        </div>
      )}

      {/* Vault Media List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
          <span>Protected Media ({vaultMedia.length})</span>
          <span className="text-[11px] text-zinc-400">Hidden from System Gallery</span>
        </div>

        {vaultMedia.length === 0 ? (
          <div className="text-center py-12 bg-zinc-950/60 rounded-2xl border border-dashed border-zinc-800 p-6 space-y-2">
            <ShieldAlert className="w-8 h-8 text-zinc-600 mx-auto" />
            <p className="text-xs text-zinc-300 font-semibold">{t('emptyVault')}</p>
            <p className="text-[11px] text-zinc-400 max-w-xs mx-auto">
              {t('lockedMsg')}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {vaultMedia.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-zinc-900/80 rounded-2xl border border-zinc-800/90 flex items-center justify-between gap-3 hover:border-zinc-700 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-black border border-zinc-800 shrink-0 relative">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-0.5 right-0.5 bg-black/80 text-[8px] px-1 rounded text-white font-mono">
                      {item.duration}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">
                      {item.title}
                    </p>
                    <p className="text-[10px] text-zinc-400 flex items-center gap-1.5 mt-0.5">
                      <span className="text-[#00F078]">{item.quality}</span>
                      <span>·</span>
                      <span>{item.size}</span>
                      <span>·</span>
                      <span>{item.source}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => onPlayMedia(item)}
                    title="Play"
                    className="p-2 rounded-lg bg-[#00F078] text-black hover:bg-[#00d66c] shadow-[0_0_8px_rgba(0,240,120,0.3)] transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-black" />
                  </button>

                  <button
                    onClick={() => onRestoreFromVault(item)}
                    title={t('removeFromVault')}
                    className="px-2 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 font-medium transition-all"
                  >
                    {t('removeFromVault')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
