import React, { useState } from 'react';
import { JAVA_PROJECT_FILES, JavaSourceFile } from '../data/javaProjectFiles';
import { Copy, Check, Download, FileCode2, Package, Sparkles, FolderArchive } from 'lucide-react';

export const CodeViewer: React.FC = () => {
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const currentFile: JavaSourceFile = JAVA_PROJECT_FILES[selectedFileIndex];

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(currentFile.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = currentFile.code;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadFile = (file: JavaSourceFile) => {
    const blob = new Blob([file.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAllFiles = () => {
    JAVA_PROJECT_FILES.forEach((file, index) => {
      setTimeout(() => {
        handleDownloadFile(file);
      }, index * 300);
    });
  };

  return (
    <div className="space-y-6">
      {/* Overview & Quick Info Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Package className="w-5 h-5 text-sky-400" />
              <h3 className="text-base font-bold text-white">Java Source Code Structure</h3>
            </div>
            <p className="text-xs text-slate-400">
              Clean Object-Oriented Architecture with standard Java Swing & in-memory ArrayList. Compiles with JDK 8, 11, 17, and 21+.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadAllFiles}
              className="bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              title="Download all 4 Java files to your computer"
            >
              <FolderArchive className="w-4 h-4" />
              Download All .java Files
            </button>
          </div>
        </div>

        {/* 3 Modular Files vs Single File explanation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 text-xs">
          <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
            <span className="font-mono text-sky-300 font-bold block mb-1">Student.java</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Model class with private fields, parameterized constructor, getters/setters, total marks sum, percentage calculation, and pass/fail logic.
            </p>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
            <span className="font-mono text-emerald-300 font-bold block mb-1">StudentManager.java</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Business controller holding <code className="text-amber-300">ArrayList&lt;Student&gt;</code>. Enforces duplicate roll number checks and CRUD operations.
            </p>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
            <span className="font-mono text-indigo-300 font-bold block mb-1">StudentManagementApp.java</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Desktop GUI extending JFrame. Hosts registration inputs, JTable with custom renderers, action buttons, summary cards, and JOptionPane dialogs.
            </p>
          </div>
        </div>
      </div>

      {/* Code Editor Box */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        {/* File Tabs Header */}
        <div className="bg-slate-900 border-b border-slate-800 px-3 py-2 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {JAVA_PROJECT_FILES.map((file, idx) => (
              <button
                key={file.filename}
                onClick={() => setSelectedFileIndex(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                  selectedFileIndex === idx
                    ? 'bg-slate-800 text-sky-300 border border-slate-700 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                }`}
              >
                <FileCode2 className="w-3.5 h-3.5 text-sky-400" />
                {file.filename}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCode}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>

            <button
              onClick={() => handleDownloadFile(currentFile)}
              className="bg-sky-600/90 hover:bg-sky-600 text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer font-medium"
              title={`Download ${currentFile.filename}`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download {currentFile.filename}</span>
            </button>
          </div>
        </div>

        {/* File Meta bar */}
        <div className="bg-slate-900/50 px-4 py-2 text-[11px] text-slate-400 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-slate-300 font-bold">{currentFile.filename}</span>
            <span>&bull;</span>
            <span>{currentFile.description}</span>
          </div>
          <span className="text-slate-400 font-mono text-[10px]">
            {currentFile.code.split('\n').length} lines
          </span>
        </div>

        {/* Code Content Container */}
        <div className="p-4 overflow-x-auto max-h-[620px] font-mono text-xs leading-relaxed text-slate-200 bg-slate-950">
          <pre className="table w-full">
            <code>
              {currentFile.code.split('\n').map((line, idx) => (
                <div key={idx} className="table-row hover:bg-slate-900/50">
                  <span className="table-cell select-none text-right pr-4 text-slate-600 text-[11px] font-mono w-10">
                    {idx + 1}
                  </span>
                  <span className="table-cell whitespace-pre font-mono">
                    {/* Syntax highlight basic comments and keywords */}
                    {line.startsWith(' *') || line.startsWith('/*') || line.startsWith('/**') || line.trim().startsWith('//') ? (
                      <span className="text-slate-500 italic">{line}</span>
                    ) : line.includes('import ') ? (
                      <span className="text-indigo-400">{line}</span>
                    ) : line.includes('public class ') || line.includes('class ') || line.includes('interface ') ? (
                      <span className="text-amber-300 font-semibold">{line}</span>
                    ) : line.includes('public ') || line.includes('private ') || line.includes('protected ') ? (
                      <span className="text-sky-300">{line}</span>
                    ) : (
                      <span>{line}</span>
                    )}
                  </span>
                </div>
              ))}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
};
