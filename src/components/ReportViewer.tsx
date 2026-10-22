import React, { useState } from 'react';
import { COLLEGE_REPORT } from '../data/reportData';
import { Printer, Copy, Check, BookOpen, Award, FileText, CheckCircle2 } from 'lucide-react';

export const ReportViewer: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [studentName, setStudentName] = useState('Shubham Bhokre');
  const [rollNumber, setRollNumber] = useState('2025CS101');
  const [collegeName, setCollegeName] = useState('Department of Computer Engineering, College of Engineering');

  const handleCopyReport = async () => {
    let fullText = `${COLLEGE_REPORT.projectTitle.toUpperCase()}\n`;
    fullText += `Course: ${COLLEGE_REPORT.courseName}\n`;
    fullText += `Student Name: ${studentName} | Roll No: ${rollNumber}\n`;
    fullText += `College: ${collegeName}\n\n`;
    fullText += `ABSTRACT:\n${COLLEGE_REPORT.abstract}\n\n`;

    COLLEGE_REPORT.sections.forEach((sec) => {
      fullText += `CHAPTER ${sec.number}: ${sec.title.toUpperCase()}\n`;
      fullText += `${sec.content}\n\n`;
    });

    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Action Bar (Print, Copy, Personalize) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 no-print text-slate-200">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-sky-400" />
            Complete College Project Report (Ready for Submission)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Formatted in academic standard English. Customize student details below and click Print to export to PDF.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopyReport}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700 font-medium"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy for Word/Docs</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="bg-sky-600 hover:bg-sky-500 text-white text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer font-semibold shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Personalization Inputs for Report Cover Page */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 no-print text-xs text-slate-300">
        <span className="block font-bold text-slate-200 mb-2">
          Personalize Project Report Cover Page:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-slate-400 text-[11px] mb-1">Your Full Name:</label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white focus:outline-none focus:border-sky-500 text-xs"
            />
          </div>
          <div>
            <label className="block text-slate-400 text-[11px] mb-1">Your College Roll No:</label>
            <input
              type="text"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white focus:outline-none focus:border-sky-500 text-xs font-mono"
            />
          </div>
          <div>
            <label className="block text-slate-400 text-[11px] mb-1">College / Department Name:</label>
            <input
              type="text"
              value={collegeName}
              onChange={(e) => setCollegeName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white focus:outline-none focus:border-sky-500 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Formal Academic Paper Container (Print-Ready) */}
      <div className="bg-white text-slate-900 p-8 sm:p-12 rounded-xl shadow-xl border border-slate-300 max-w-4xl mx-auto space-y-10 font-sans print:shadow-none print:border-none print:p-0">
        
        {/* Cover / Title Page */}
        <div className="text-center border-b-4 border-slate-900 pb-12 pt-6">
          <span className="text-xs font-black tracking-widest text-slate-500 uppercase block mb-3">
            A Project Report On
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight uppercase mb-4">
            {COLLEGE_REPORT.projectTitle}
          </h1>
          <p className="text-sm font-medium text-slate-700 max-w-xl mx-auto mb-8">
            A Desktop GUI Application Developed in Java Swing with In-Memory Data Storage
          </p>

          <div className="my-8 py-6 border-y border-slate-200">
            <p className="text-xs text-slate-600 uppercase tracking-wider mb-2">Submitted in partial fulfillment of the requirements for the degree of</p>
            <h3 className="text-base font-bold text-slate-900">{COLLEGE_REPORT.courseName}</h3>
            <p className="text-xs text-slate-600 mt-1">{COLLEGE_REPORT.subjectName} ({COLLEGE_REPORT.academicYear})</p>
          </div>

          <div className="grid grid-cols-2 gap-6 text-left max-w-lg mx-auto pt-4 text-xs">
            <div>
              <span className="block text-slate-500 uppercase text-[10px] font-bold">Submitted By:</span>
              <span className="font-bold text-sm text-slate-900 block mt-0.5">{studentName}</span>
              <span className="font-mono text-slate-700">Roll No: {rollNumber}</span>
            </div>
            <div>
              <span className="block text-slate-500 uppercase text-[10px] font-bold">Institution:</span>
              <span className="font-semibold text-slate-900 block mt-0.5">{collegeName}</span>
            </div>
          </div>
        </div>

        {/* Certificate of Authenticity */}
        <div className="p-6 bg-slate-50 rounded-lg border border-slate-200 text-xs leading-relaxed space-y-3">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-900 border-b border-slate-200 pb-2">
            <Award className="w-4 h-4 text-amber-600" />
            <span>CERTIFICATE OF ORIGINALITY & COMPLETION</span>
          </div>
          <p>
            This is to certify that the project entitled <strong>&ldquo;Student Management System&rdquo;</strong> submitted by <strong>{studentName}</strong> (Roll No: <strong>{rollNumber}</strong>) is a bona fide record of work carried out under guidance and fulfills the curriculum requirements for <strong>{COLLEGE_REPORT.courseName}</strong>.
          </p>
          <div className="pt-6 flex items-center justify-between text-slate-600 text-[11px]">
            <div>
              <span>Date: October 2026</span><br />
              <span>Place: Campus Laboratory</span>
            </div>
            <div className="text-right">
              <span className="border-t border-slate-400 pt-1 inline-block w-36 text-center font-medium">
                Internal Examiner / Guide
              </span>
            </div>
          </div>
        </div>

        {/* Abstract */}
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b-2 border-sky-600 pb-1">
            Abstract
          </h3>
          <p className="text-xs text-slate-700 leading-relaxed text-justify">
            {COLLEGE_REPORT.abstract}
          </p>
        </div>

        {/* Table of Contents */}
        <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
            Table of Contents
          </h3>
          <div className="space-y-1.5 text-xs text-slate-700">
            {COLLEGE_REPORT.sections.map((sec) => (
              <div key={sec.id} className="flex items-center justify-between border-b border-slate-200/80 pb-1">
                <span>Chapter {sec.number}: {sec.title}</span>
                <span className="font-mono text-slate-400 text-[11px]">&hellip; Sec {sec.number}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Report Chapters 1 - 9 */}
        <div className="space-y-8 pt-4 divide-y divide-slate-200">
          {COLLEGE_REPORT.sections.map((sec) => (
            <div key={sec.id} className="pt-6 space-y-3">
              <div className="flex items-center gap-2">
                <span className="bg-slate-900 text-white font-mono text-[11px] font-bold px-2 py-0.5 rounded">
                  Chapter {sec.number}
                </span>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  {sec.title}
                </h2>
              </div>
              <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-line text-justify font-sans">
                {sec.content}
              </div>
            </div>
          ))}
        </div>

        {/* References Section */}
        <div className="pt-6 border-t-2 border-slate-900 text-xs space-y-2">
          <h3 className="font-bold text-slate-900 uppercase">References & Bibliography</h3>
          <ul className="list-disc pl-5 space-y-1 text-slate-600 text-[11px]">
            <li>Oracle Java Documentation: The Java™ Tutorials - Creating a GUI With Swing.</li>
            <li>Herbert Schildt: <em>Java: The Complete Reference</em>, Twelfth Edition, McGraw-Hill.</li>
            <li>Kathy Sierra & Bert Bates: <em>Head First Java</em>, O&apos;Reilly Media.</li>
            <li>Java Collections Framework API Specification: <code>java.util.ArrayList</code>.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
