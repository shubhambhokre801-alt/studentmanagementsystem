import React, { useState, useMemo } from 'react';
import { VIVA_QUESTIONS, VivaItem } from '../data/vivaQuestions';
import { HelpCircle, Search, CheckCircle, ChevronDown, ChevronUp, Eye, EyeOff, Award, BookOpen } from 'lucide-react';

export const VivaPrep: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(1); // default expand 1st question
  const [flashcardMode, setFlashcardMode] = useState(false);
  const [revealedIds, setRevealedIds] = useState<Set<number>>(new Set());
  const [masteredIds, setMasteredIds] = useState<Set<number>>(new Set());

  const categories = ['ALL', 'Swing & GUI', 'Collections & Memory', 'Project Logic', 'Java Core'];

  const filteredQuestions = useMemo(() => {
    return VIVA_QUESTIONS.filter((q) => {
      const matchesCat = selectedCategory === 'ALL' || q.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        q.question.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase().trim());
      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const toggleExpand = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const toggleReveal = (id: number) => {
    setRevealedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleMastered = (id: number) => {
    setMasteredIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-400" />
              College Viva Examination & Lab Oral Questions (Q&A)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Top 12 frequently asked oral questions by university examiners for Java Swing & in-memory collections projects. Explained in simple beginner English!
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFlashcardMode(!flashcardMode)}
              className={`text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer border ${
                flashcardMode
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-semibold'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              {flashcardMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{flashcardMode ? 'Flashcard Mode: ON' : 'Flashcard Mode: OFF'}</span>
            </button>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="flex items-center justify-between text-xs pt-3 text-slate-400">
          <span>
            Mastered: <strong className="text-emerald-400 font-mono">{masteredIds.size}</strong> / {VIVA_QUESTIONS.length} Questions
          </span>
          <div className="w-48 bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
            <div
              className="bg-emerald-500 h-full transition-all duration-300"
              style={{ width: `${(masteredIds.size / VIVA_QUESTIONS.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-sky-600 text-white font-semibold'
                  : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search questions or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-sky-500 text-xs"
          />
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {filteredQuestions.map((q: VivaItem) => {
          const isExpanded = expandedId === q.id;
          const isMastered = masteredIds.has(q.id);
          const isAnswerVisible = !flashcardMode || revealedIds.has(q.id);

          return (
            <div
              key={q.id}
              className={`bg-slate-900 border rounded-xl transition-all overflow-hidden ${
                isMastered ? 'border-emerald-500/40 bg-slate-900/90' : 'border-slate-800'
              }`}
            >
              {/* Question Header Bar */}
              <div
                onClick={() => toggleExpand(q.id)}
                className="p-4 flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-850 transition-colors select-none"
              >
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-md bg-slate-800 text-sky-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-slate-700">
                    Q{q.id}
                  </span>
                  <div>
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-0.5">
                      {q.category}
                    </span>
                    <h4 className="text-sm font-bold text-slate-100 leading-snug">{q.question}</h4>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMastered(q.id);
                    }}
                    className={`p-1.5 rounded transition-colors ${
                      isMastered ? 'text-emerald-400 bg-emerald-950/60' : 'text-slate-500 hover:text-slate-300'
                    }`}
                    title={isMastered ? 'Mark as Not Mastered' : 'Mark as Mastered'}
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Answer Body */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-800/80 space-y-3 bg-slate-950/40 text-xs">
                  {flashcardMode && !isAnswerVisible ? (
                    <div className="text-center py-4">
                      <p className="text-slate-400 text-xs mb-2">
                        Try explaining this answer in your own words first!
                      </p>
                      <button
                        onClick={() => toggleReveal(q.id)}
                        className="bg-amber-600 hover:bg-amber-500 text-white font-medium px-4 py-1.5 rounded transition-colors cursor-pointer text-xs"
                      >
                        Reveal Answer
                      </button>
                    </div>
                  ) : (
                    <>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                          Beginner-Friendly Explanation:
                        </span>
                        <p className="text-slate-200 leading-relaxed font-sans">{q.answer}</p>
                      </div>

                      {/* Examiner Key Takeaway Points */}
                      <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 block mb-1.5">
                          Key Bullet Points to Speak to the Examiner:
                        </span>
                        <ul className="space-y-1 text-slate-300">
                          {q.keyPoints.map((pt, pIdx) => (
                            <li key={pIdx} className="flex items-start gap-2 text-[11px]">
                              <span className="text-sky-400 font-bold">&bull;</span>
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {flashcardMode && (
                        <div className="text-right pt-1">
                          <button
                            onClick={() => toggleReveal(q.id)}
                            className="text-[11px] text-slate-400 hover:text-slate-200 underline cursor-pointer"
                          >
                            Hide Answer
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
