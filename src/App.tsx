import React, { useState } from 'react';
import { SwingSimulator } from './components/SwingSimulator';
import { CodeViewer } from './components/CodeViewer';
import { RunGuide } from './components/RunGuide';
import { ReportViewer } from './components/ReportViewer';
import { VivaPrep } from './components/VivaPrep';
import { JAVA_PROJECT_FILES } from './data/javaProjectFiles';
import {
  Monitor,
  Code2,
  Terminal,
  FileText,
  HelpCircle,
  Download,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'code' | 'guide' | 'report' | 'viva'>('simulator');

  const downloadAllSource = () => {
    JAVA_PROJECT_FILES.forEach((file, index) => {
      setTimeout(() => {
        const blob = new Blob([file.code], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = file.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, index * 250);
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500/30 selection:text-sky-200">
      {/* Top Bar following the 3-Zone Top Bar Contract */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark (Single text element) */}
          <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
            <GraduationCap className="w-5 h-5 text-sky-400" />
            <span className="text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0">
              Student Management System
            </span>
          </div>

          {/* Zone 2: Navigation Links (Single-line text with clean active indicator) */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-300">
            <button
              onClick={() => setActiveTab('simulator')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'simulator' ? 'text-sky-400 font-semibold' : ''
              }`}
            >
              Desktop GUI Simulator
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'code' ? 'text-sky-400 font-semibold' : ''
              }`}
            >
              Java Source Code
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'guide' ? 'text-sky-400 font-semibold' : ''
              }`}
            >
              Run Instructions
            </button>
            <button
              onClick={() => setActiveTab('report')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'report' ? 'text-sky-400 font-semibold' : ''
              }`}
            >
              College Project Report
            </button>
            <button
              onClick={() => setActiveTab('viva')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'viva' ? 'text-sky-400 font-semibold' : ''
              }`}
            >
              Viva Questions & Answers
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={downloadAllSource}
              className="bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0 shadow-sm"
              title="Download Student.java, StudentManager.java, StudentManagementApp.java, and StudentManagementSystem.java"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Java Files</span>
            </button>
          </div>
        </div>

        {/* Mobile Nav Scroller */}
        <div className="md:hidden flex items-center gap-1 overflow-x-auto px-4 py-2 border-t border-slate-800/80 bg-slate-900/60 text-xs">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
              activeTab === 'simulator' ? 'bg-sky-600 text-white font-semibold' : 'text-slate-400'
            }`}
          >
            GUI Simulator
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
              activeTab === 'code' ? 'bg-sky-600 text-white font-semibold' : 'text-slate-400'
            }`}
          >
            Java Code
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
              activeTab === 'guide' ? 'bg-sky-600 text-white font-semibold' : 'text-slate-400'
            }`}
          >
            Run Guide
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
              activeTab === 'report' ? 'bg-sky-600 text-white font-semibold' : 'text-slate-400'
            }`}
          >
            Project Report
          </button>
          <button
            onClick={() => setActiveTab('viva')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
              activeTab === 'viva' ? 'bg-sky-600 text-white font-semibold' : 'text-slate-400'
            }`}
          >
            Viva Q&A
          </button>
        </div>
      </header>

      {/* Hero Header Section */}
      <div className="border-b border-slate-800 bg-linear-to-b from-slate-900 to-slate-950 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                <span>Java Swing Desktop Application</span>
                <span aria-hidden="true">&bull;</span>
                <span className="text-amber-400">Without Database (In-Memory ArrayList)</span>
                <span aria-hidden="true">&bull;</span>
                <span className="text-emerald-400">College Submission Ready</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white text-balance">
                Student Management System
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
                A complete desktop GUI application project designed for academic evaluation. Includes an authentic interactive Swing simulator, complete working Java code files, compiler run commands, a formal college report, and 12 viva questions.
              </p>
            </div>

            {/* Quick Segmented View Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl self-start md:self-auto overflow-x-auto">
              <button
                onClick={() => setActiveTab('simulator')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'simulator'
                    ? 'bg-sky-600 text-white shadow-xs font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>GUI Simulator</span>
              </button>

              <button
                onClick={() => setActiveTab('code')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'code'
                    ? 'bg-sky-600 text-white shadow-xs font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Java Code</span>
              </button>

              <button
                onClick={() => setActiveTab('guide')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'guide'
                    ? 'bg-sky-600 text-white shadow-xs font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>How to Run</span>
              </button>

              <button
                onClick={() => setActiveTab('report')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'report'
                    ? 'bg-sky-600 text-white shadow-xs font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Project Report</span>
              </button>

              <button
                onClick={() => setActiveTab('viva')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'viva'
                    ? 'bg-sky-600 text-white shadow-xs font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Viva Q&A</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'simulator' && <SwingSimulator />}
        {activeTab === 'code' && <CodeViewer />}
        {activeTab === 'guide' && <RunGuide />}
        {activeTab === 'report' && <ReportViewer />}
        {activeTab === 'viva' && <VivaPrep />}
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/60 py-6 px-4 text-xs text-slate-500 text-center no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400">
          <p>
            Student Management System &bull; Java Swing Desktop Application &bull; Academic In-Memory Edition
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <button onClick={() => setActiveTab('code')} className="hover:text-slate-200 cursor-pointer">
              Source Code
            </button>
            <button onClick={() => setActiveTab('guide')} className="hover:text-slate-200 cursor-pointer">
              Compilation Steps
            </button>
            <button onClick={() => setActiveTab('report')} className="hover:text-slate-200 cursor-pointer">
              College Report
            </button>
            <button onClick={() => setActiveTab('viva')} className="hover:text-slate-200 cursor-pointer">
              Viva Preparation
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
