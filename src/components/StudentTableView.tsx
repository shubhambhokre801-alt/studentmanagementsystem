import React from 'react';
import { Student } from '../types/studentApp';
import {
  ArrowUpDown,
  Edit2,
  Trash2,
  Eye,
  CheckSquare,
  Square,
  AlertCircle,
} from 'lucide-react';

interface StudentTableViewProps {
  students: Student[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onSelectStudent: (student: Student) => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  sortField: 'rollNo' | 'name' | 'cgpa' | 'attendance';
  sortOrder: 'asc' | 'desc';
  onSortChange: (field: 'rollNo' | 'name' | 'cgpa' | 'attendance') => void;
}

export const StudentTableView: React.FC<StudentTableViewProps> = ({
  students,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onSelectStudent,
  onEditStudent,
  onDeleteStudent,
  sortField,
  sortOrder,
  onSortChange,
}) => {
  const allSelected = students.length > 0 && selectedIds.length === students.length;
  const isPartiallySelected =
    selectedIds.length > 0 && selectedIds.length < students.length;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          {/* Table Header */}
          <thead className="bg-slate-50 dark:bg-slate-950/70 text-slate-600 dark:text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800 select-none">
            <tr>
              <th className="py-3.5 px-4 w-10 text-center">
                <button
                  type="button"
                  onClick={onToggleSelectAll}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition cursor-pointer"
                >
                  {allSelected ? (
                    <CheckSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  ) : isPartiallySelected ? (
                    <Square className="w-4 h-4 text-indigo-600 dark:text-indigo-400 fill-indigo-500/20" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>
              </th>

              <th className="py-3.5 px-4 font-semibold">
                <button
                  type="button"
                  onClick={() => onSortChange('name')}
                  className="flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
                >
                  <span>Student Details</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </button>
              </th>

              <th className="py-3.5 px-4 font-semibold">
                <button
                  type="button"
                  onClick={() => onSortChange('rollNo')}
                  className="flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
                >
                  <span>Roll Number</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </button>
              </th>

              <th className="py-3.5 px-4 font-semibold">Department & Semester</th>

              <th className="py-3.5 px-4 text-right font-semibold">
                <button
                  type="button"
                  onClick={() => onSortChange('cgpa')}
                  className="flex items-center gap-1.5 justify-end ml-auto hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
                >
                  <span>CGPA</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </button>
              </th>

              <th className="py-3.5 px-4 text-center font-semibold">
                <button
                  type="button"
                  onClick={() => onSortChange('attendance')}
                  className="flex items-center gap-1.5 justify-center mx-auto hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
                >
                  <span>Attendance</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </button>
              </th>

              <th className="py-3.5 px-4 text-center font-semibold">Fee Status</th>

              <th className="py-3.5 px-4 text-center font-semibold">Status</th>

              <th className="py-3.5 px-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-sans">
            {students.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-400 dark:text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <AlertCircle className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      No student records found
                    </p>
                    <p className="text-xs text-slate-500">
                      Try adjusting your search criteria or resetting filters.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              students.map((student) => {
                const isSelected = selectedIds.includes(student.id);

                return (
                  <tr
                    key={student.id}
                    className={`transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50/70 dark:bg-indigo-950/40 text-slate-900 dark:text-white'
                        : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-200'
                    }`}
                    onClick={() => onSelectStudent(student)}
                  >
                    {/* Checkbox */}
                    <td
                      className="py-3.5 px-4 text-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSelect(student.id);
                      }}
                    >
                      <button
                        type="button"
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </td>

                    {/* Student Name & Email */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center justify-center font-mono shrink-0 shadow-xs">
                          {getInitials(student.name)}
                        </div>
                        <div className="min-w-0">
                          <span className="font-bold text-slate-900 dark:text-white block truncate">
                            {student.name}
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono block truncate">
                            {student.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Roll No */}
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400 text-xs">
                      {student.rollNo}
                    </td>

                    {/* Department & Semester */}
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-800 dark:text-slate-200 block truncate max-w-[190px]">
                        {student.department}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                        {student.semester} &bull; {student.academicYear}
                      </span>
                    </td>

                    {/* CGPA */}
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-xs tabular-nums">
                      <span
                        className={
                          student.cgpa >= 8.5
                            ? 'text-emerald-600 dark:text-emerald-400 font-extrabold'
                            : student.cgpa >= 7.0
                            ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                            : student.cgpa >= 5.0
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-rose-600 dark:text-rose-400'
                        }
                      >
                        {student.cgpa.toFixed(2)}
                      </span>
                    </td>

                    {/* Attendance */}
                    <td className="py-3.5 px-4 text-center font-mono tabular-nums">
                      <span
                        className={`text-xs font-bold ${
                          student.attendance.percentage >= 75
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : student.attendance.percentage >= 65
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {student.attendance.percentage}%
                      </span>
                      <span className="block text-[10px] text-slate-400 dark:text-slate-500">
                        {student.attendance.attendedClasses}/{student.attendance.totalClasses}
                      </span>
                    </td>

                    {/* Fee Status */}
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border ${
                          student.fee.status === 'Paid'
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30'
                            : student.fee.status === 'Partial'
                            ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30'
                            : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/30'
                        }`}
                      >
                        {student.fee.status}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          student.status === 'Active'
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                            : student.status === 'On Leave'
                            ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/50'
                            : student.status === 'Graduated'
                            ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50'
                            : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200/50'
                        }`}
                      >
                        {student.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div
                        className="flex items-center justify-end gap-1.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => onSelectStudent(student)}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer"
                          title="View Profile Dossier"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onEditStudent(student)}
                          className="p-1.5 text-slate-500 hover:text-amber-600 dark:text-slate-400 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer"
                          title="Edit Details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteStudent(student.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
