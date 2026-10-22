import React from 'react';
import { Student } from '../types/studentApp';
import { Eye, Edit2, Trash2, Mail, Phone } from 'lucide-react';

interface StudentGridViewProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
}

export const StudentGridView: React.FC<StudentGridViewProps> = ({
  students,
  onSelectStudent,
  onEditStudent,
  onDeleteStudent,
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  if (students.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center text-slate-500 shadow-xs">
        <p className="text-sm font-medium text-slate-800 dark:text-slate-300">No student records found</p>
        <p className="text-xs text-slate-400 mt-1">Try resetting filters or adding a new student.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {students.map((student) => {
        return (
          <div
            key={student.id}
            onClick={() => onSelectStudent(student)}
            className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-slate-700 rounded-2xl p-5 space-y-4 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            {/* Top row with Avatar & Status */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-400 font-bold text-sm flex items-center justify-center font-mono shrink-0 shadow-xs">
                  {getInitials(student.name)}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                    {student.name}
                  </h4>
                  <span className="text-xs font-mono font-semibold text-indigo-600 dark:text-indigo-400 block mt-0.5">
                    {student.rollNo}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate max-w-[180px]">
                    {student.department}
                  </span>
                </div>
              </div>

              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded border shrink-0 ${
                  student.status === 'Active'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30'
                    : student.status === 'On Leave'
                    ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30'
                    : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/30'
                }`}
              >
                {student.status}
              </span>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-2 text-center bg-slate-50 dark:bg-slate-950/80 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 text-xs font-mono">
              <div>
                <span className="block text-[10px] text-slate-500 uppercase font-sans">CGPA</span>
                <span className="font-bold text-amber-600 dark:text-amber-300 tabular-nums">
                  {student.cgpa}
                </span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-500 uppercase font-sans">Att %</span>
                <span
                  className={`font-bold tabular-nums ${
                    student.attendance.percentage >= 75
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {student.attendance.percentage}%
                </span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-500 uppercase font-sans">Fee</span>
                <span
                  className={`font-bold uppercase ${
                    student.fee.status === 'Paid'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : student.fee.status === 'Partial'
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {student.fee.status}
                </span>
              </div>
            </div>

            {/* Contact details */}
            <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 truncate">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-mono text-[11px] truncate">{student.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-mono text-[11px]">{student.phone}</span>
                <span className="text-slate-300 dark:text-slate-700">&bull;</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">{student.city}</span>
              </div>
            </div>

            {/* Card Bottom Actions */}
            <div
              className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                {student.semester}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onSelectStudent(student)}
                  className="px-2.5 py-1 text-xs text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition cursor-pointer flex items-center gap-1 font-medium"
                >
                  <Eye className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                  <span>Dossier</span>
                </button>
                <button
                  type="button"
                  onClick={() => onEditStudent(student)}
                  className="p-1.5 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer"
                  title="Edit"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteStudent(student.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
