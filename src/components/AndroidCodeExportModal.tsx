import React, { useState } from 'react';
import { X, Download, Copy, Check, FileCode, Terminal, BookOpen } from 'lucide-react';
import JSZip from 'jszip';
import { ANDROID_PROJECT_FILES, AndroidSourceFile } from '../data/androidProjectSource';

interface AndroidCodeExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: (key: string) => string;
}

export const AndroidCodeExportModal: React.FC<AndroidCodeExportModalProps> = ({
  isOpen,
  onClose,
  t,
}) => {
  if (!isOpen) return null;

  const [selectedFile, setSelectedFile] = useState<AndroidSourceFile>(ANDROID_PROJECT_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();
      ANDROID_PROJECT_FILES.forEach((file) => {
        zip.file(file.path, file.content);
      });

      const blob = await zip.generateAsync({ type: 'blob' });
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'MNS_TUBE_PRO_Android_Jetpack_Compose_Source.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error('Failed to create zip:', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl h-[90vh] bg-[#0c0d11] rounded-3xl border border-zinc-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Top Bar */}
        <div className="px-5 py-4 bg-[#12141a] border-b border-zinc-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-zinc-900 border border-[#00F078]/40 text-[#00F078]">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
                <span>MNS TUBE PRO Android Source Bundle</span>
                <span className="text-[10px] bg-[#00F078] text-black font-extrabold px-1.5 py-0.2 rounded">
                  KOTLIN & COMPOSE
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                Media3 · WorkManager · Material3 · Scoped Storage · Room DB
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="px-3.5 py-2 rounded-xl bg-[#00F078] hover:bg-[#00d66c] text-black font-extrabold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,240,120,0.35)] active:scale-95 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>{isZipping ? 'Generating ZIP...' : 'Download Project .ZIP'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body Split */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left File Explorer */}
          <div className="w-full md:w-72 bg-[#090a0d] border-b md:border-b-0 md:border-r border-zinc-800 p-3 overflow-y-auto shrink-0 space-y-1">
            <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider px-2 py-1">
              Project Structure
            </p>
            {ANDROID_PROJECT_FILES.map((file) => (
              <button
                key={file.path}
                onClick={() => setSelectedFile(file)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2 ${
                  selectedFile.path === file.path
                    ? 'bg-[#00F078]/15 text-[#00F078] border border-[#00F078]/40 font-bold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent'
                }`}
              >
                <FileCode className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{file.path}</span>
              </button>
            ))}

            {/* Quick Build Instructions Card */}
            <div className="mt-4 p-3 bg-zinc-900/60 rounded-xl border border-zinc-800 space-y-1.5 text-[11px] text-zinc-400">
              <span className="font-bold text-white flex items-center gap-1">
                <Terminal className="w-3.5 h-3.5 text-[#00F078]" />
                Compile APK
              </span>
              <p className="text-[10px] font-mono bg-black p-1.5 rounded border border-zinc-800 text-zinc-300">
                ./gradlew assembleDebug
              </p>
              <p className="text-[10px] text-zinc-400">Target APK built in app/build/outputs/apk/</p>
            </div>
          </div>

          {/* Right Code Viewer */}
          <div className="flex-1 flex flex-col bg-[#060709] overflow-hidden">
            {/* Code Header */}
            <div className="px-4 py-2.5 bg-[#0e1015] border-b border-zinc-800 flex items-center justify-between shrink-0">
              <div>
                <p className="text-xs font-mono font-bold text-[#00F078]">
                  {selectedFile.path}
                </p>
                <p className="text-[10px] text-zinc-400">
                  {selectedFile.description}
                </p>
              </div>

              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-200 flex items-center gap-1.5 transition-all"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#00F078]" />
                    <span className="text-[#00F078]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Copy File</span>
                  </>
                )}
              </button>
            </div>

            {/* Syntax/Code Box */}
            <div className="flex-1 overflow-auto p-4 font-mono text-xs text-zinc-300 leading-relaxed bg-[#050505]">
              <pre className="whitespace-pre">{selectedFile.content}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
