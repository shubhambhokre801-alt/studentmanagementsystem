import React, { useState } from 'react';
import { HOW_TO_RUN_GUIDES, TROUBLESHOOTING_TIPS, RunStep } from '../data/howToRunGuide';
import { Terminal, Code2, Layers, Check, Copy, HelpCircle, AlertCircle, ArrowRight } from 'lucide-react';

export const RunGuide: React.FC = () => {
  const [activeGuideId, setActiveGuideId] = useState('cmd-notepad');
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const activeGuide = HOW_TO_RUN_GUIDES.find((g) => g.id === activeGuideId) || HOW_TO_RUN_GUIDES[0];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(text);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Overview Intro */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-slate-200">
        <h3 className="text-base font-bold text-white mb-1.5 flex items-center gap-2">
          <Terminal className="w-5 h-5 text-sky-400" />
          Step-by-Step Compilation & Execution Guide
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
          Follow the instructions below to run the project on your laptop or in the college computer lab. Since this project uses standard Java Swing with in-memory ArrayList, no external JAR files, Maven, or database setups are required. It compiles directly with standard <code className="text-amber-300 font-mono">javac</code>!
        </p>
      </div>

      {/* Guide Method Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {HOW_TO_RUN_GUIDES.map((guide) => {
          const isActive = activeGuideId === guide.id;
          return (
            <button
              key={guide.id}
              onClick={() => setActiveGuideId(guide.id)}
              className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
                isActive
                  ? 'bg-slate-800/90 border-sky-500 shadow-md ring-1 ring-sky-500/30'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5 mb-1.5">
                {guide.id === 'cmd-notepad' && <Terminal className="w-4 h-4 text-sky-400" />}
                {guide.id === 'vscode' && <Code2 className="w-4 h-4 text-emerald-400" />}
                {guide.id === 'intellij-eclipse' && <Layers className="w-4 h-4 text-indigo-400" />}
                <span className="font-bold text-sm text-white">{guide.name}</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">{guide.subtitle}</p>
            </button>
          );
        })}
      </div>

      {/* Selected Guide Steps */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="pb-4 mb-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h4 className="text-base font-bold text-white">{activeGuide.name} Setup Instructions</h4>
            <p className="text-xs text-slate-400 mt-0.5">{activeGuide.subtitle}</p>
          </div>
          <span className="text-xs font-mono text-sky-400 bg-sky-950/60 border border-sky-500/30 px-2.5 py-1 rounded">
            {activeGuide.steps.length} Simple Steps
          </span>
        </div>

        <div className="space-y-6">
          {activeGuide.steps.map((step: RunStep, idx: number) => (
            <div key={idx} className="relative pl-7 border-l-2 border-slate-700 pb-2">
              {/* Step indicator dot */}
              <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-slate-800 border-2 border-sky-500 flex items-center justify-center text-[10px] font-bold text-sky-400">
                {idx + 1}
              </div>

              <div>
                <h5 className="text-sm font-bold text-slate-100 mb-1">{step.title}</h5>
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line mb-3">
                  {step.description}
                </p>

                {/* Command block if applicable */}
                {step.command && (
                  <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 my-2.5 relative group">
                    <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800/80 text-[10px] text-slate-400 font-mono">
                      <span>Command Prompt / Terminal</span>
                      <button
                        onClick={() => handleCopy(step.command!)}
                        className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        {copiedCmd === step.command ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Command</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed">
                      {step.command}
                    </pre>
                  </div>
                )}

                {/* Helpful tips if available */}
                {step.tips && step.tips.length > 0 && (
                  <div className="space-y-1 mt-2">
                    {step.tips.map((tip, tipIdx) => (
                      <div key={tipIdx} className="flex items-start gap-2 text-[11px] text-slate-400">
                        <ArrowRight className="w-3 h-3 text-sky-400 shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Troubleshooting Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
          <HelpCircle className="w-5 h-5 text-amber-400" />
          <h4 className="text-base font-bold text-white">Troubleshooting Common Beginner Errors</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TROUBLESHOOTING_TIPS.map((item, idx) => (
            <div key={idx} className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-4 space-y-2">
              <div className="flex items-start gap-2 text-rose-400 font-mono text-xs font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{item.error}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Why it happens:
                </span>
                <p className="text-xs text-slate-300 leading-normal">{item.cause}</p>
              </div>
              <div className="pt-2 border-t border-slate-700/60">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                  How to fix:
                </span>
                <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed font-sans">
                  {item.solution}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
