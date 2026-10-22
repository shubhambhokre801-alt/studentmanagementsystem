import React, { useState } from 'react';
import { Student } from '../types/studentApp';
import { X, Download, Upload, RotateCcw, FileText, CheckCircle2 } from 'lucide-react';

interface ExportImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  onImport: (importedStudents: Student[]) => void;
  onReset: () => void;
}

export const ExportImportModal: React.FC<ExportImportModalProps> = ({
  isOpen,
  onClose,
  students,
  onImport,
  onReset,
}) => {
  if (!isOpen) return null;

  const [jsonText, setJsonText] = useState('');
  const [statusMsg, setStatusMsg] = useState<{ text: string; isError?: boolean } | null>(null);

  const handleExportCSV = () => {
    const headers = [
      'Roll Number',
      'Name',
      'Email',
      'Phone',
      'Department',
      'Semester',
      'Academic Year',
      'Gender',
      'DOB',
      'Status',
      'CGPA',
      'Attendance %',
      'Fee Status',
      'Guardian Name',
      'City',
    ];

    const rows = students.map((s) => [
      s.rollNo,
      `"${s.name.replace(/"/g, '""')}"`,
      s.email,
      s.phone,
      `"${s.department}"`,
      s.semester,
      s.academicYear,
      s.gender,
      s.dateOfBirth,
      s.status,
      s.cgpa,
      s.attendance.percentage,
      s.fee.status,
      `"${s.guardianName.replace(/"/g, '""')}"`,
      `"${s.city.replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `students_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setStatusMsg({ text: 'CSV export downloaded successfully.' });
  };

  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(students, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `students_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setStatusMsg({ text: 'JSON backup file exported successfully.' });
  };

  const handleImportSubmit = () => {
    try {
      if (!jsonText.trim()) {
        setStatusMsg({ text: 'Please paste valid JSON text first.', isError: true });
        return;
      }
      const parsed = JSON.parse(jsonText);
      if (!Array.isArray(parsed)) {
        setStatusMsg({ text: 'JSON data must be an array of students.', isError: true });
        return;
      }
      onImport(parsed as Student[]);
      setStatusMsg({ text: `Successfully imported ${parsed.length} students!` });
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      setStatusMsg({ text: `JSON Parse Error: ${err.message}`, isError: true });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-fade-in text-slate-800 dark:text-slate-200">
        <div className="bg-slate-50 dark:bg-slate-800 px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Download className="w-5 h-5 text-indigo-600 dark:text-sky-400" />
            Data Management & Export
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-xs">
          {statusMsg && (
            <div
              className={`p-3 rounded-lg border flex items-center gap-2 ${
                statusMsg.isError
                  ? 'bg-rose-50 dark:bg-rose-950/80 border-rose-200 dark:border-rose-500/40 text-rose-700 dark:text-rose-300'
                  : 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-300'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{statusMsg.text}</span>
            </div>
          )}

          <div className="space-y-3">
            <span className="block font-bold text-slate-700 dark:text-slate-300">Export Student Records:</span>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleExportCSV}
                className="p-3 bg-slate-50 dark:bg-slate-950 hover:bg-indigo-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center gap-2 text-center transition cursor-pointer"
              >
                <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span className="font-semibold text-slate-900 dark:text-white">Export to CSV</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Spreadsheet format</span>
              </button>

              <button
                type="button"
                onClick={handleExportJSON}
                className="p-3 bg-slate-50 dark:bg-slate-950 hover:bg-indigo-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center gap-2 text-center transition cursor-pointer"
              >
                <Download className="w-5 h-5 text-indigo-600 dark:text-sky-400" />
                <span className="font-semibold text-slate-900 dark:text-white">Export to JSON</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Complete raw backup</span>
              </button>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <label className="block font-bold text-slate-700 dark:text-slate-300">
              Import from JSON (Paste Array):
            </label>
            <textarea
              rows={4}
              placeholder='[ { "rollNo": "CS2024-001", "name": "...", ... } ]'
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-slate-100 font-mono text-xs focus:outline-none focus:border-indigo-600 dark:focus:border-sky-500 resize-none"
            />
            <button
              type="button"
              onClick={handleImportSubmit}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-sky-600 dark:hover:bg-sky-500 text-white rounded-lg font-semibold transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Import Records
            </button>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="block font-bold text-slate-700 dark:text-slate-300">Reset to Demo Dataset:</span>
              <span className="text-[11px] text-slate-500">Reverts to original 10 sample students</span>
            </div>
            <button
              type="button"
              onClick={() => {
                onReset();
                setStatusMsg({ text: 'Reset database to 10 sample students.' });
              }}
              className="px-3 py-1.5 text-xs text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-500/30 rounded-lg flex items-center gap-1.5 transition cursor-pointer font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Demo Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
