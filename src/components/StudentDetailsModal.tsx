import React, { useState } from 'react';
import { Student } from '../types/studentApp';
import {
  X,
  Edit,
  Trash2,
  Printer,
  GraduationCap,
  Calendar,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  CreditCard,
  FileText,
  User,
} from 'lucide-react';

interface StudentDetailsModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (student: Student) => void;
  onDelete: (id: string) => void;
}

export const StudentDetailsModal: React.FC<StudentDetailsModalProps> = ({
  student,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}) => {
  if (!isOpen || !student) return null;

  const [viewMode, setViewMode] = useState<'profile' | 'idcard' | 'transcript'>('profile');

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl animate-fade-in my-6 text-slate-800 dark:text-slate-200">
        
        {/* Modal Top Header with Actions */}
        <div className="bg-slate-50 dark:bg-slate-800 px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between no-print">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-sky-500/40 text-indigo-700 dark:text-sky-400 font-bold text-sm flex items-center justify-center font-mono shadow-xs">
              {getInitials(student.name)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{student.name}</h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    student.status === 'Active'
                      ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30'
                      : student.status === 'On Leave'
                      ? 'bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30'
                      : 'bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30'
                  }`}
                >
                  {student.status}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                <span>{student.rollNo}</span>
                <span>&bull;</span>
                <span>{student.department}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(student)}
              className="p-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-200/80 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Edit Student"
            >
              <Edit className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-medium">Edit</span>
            </button>
            <button
              onClick={() => onDelete(student.id)}
              className="p-2 text-rose-600 dark:text-rose-400 hover:text-white hover:bg-rose-600 rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-rose-200 dark:border-rose-500/30"
              title="Delete Student"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-medium">Delete</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center justify-between px-6 py-2.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-xs no-print">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('profile')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer font-medium flex items-center gap-1.5 ${
                viewMode === 'profile'
                  ? 'bg-indigo-600 text-white dark:bg-sky-600'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Student Dossier
            </button>
            <button
              onClick={() => setViewMode('idcard')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer font-medium flex items-center gap-1.5 ${
                viewMode === 'idcard'
                  ? 'bg-indigo-600 text-white dark:bg-sky-600'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              Student ID Card
            </button>
            <button
              onClick={() => setViewMode('transcript')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer font-medium flex items-center gap-1.5 ${
                viewMode === 'transcript'
                  ? 'bg-indigo-600 text-white dark:bg-sky-600'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Official Marksheet
            </button>
          </div>

          {(viewMode === 'idcard' || viewMode === 'transcript') && (
            <button
              onClick={handlePrint}
              className="text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer font-medium"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Document
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* 1. PROFILE DOSSIER VIEW */}
          {viewMode === 'profile' && (
            <div className="space-y-6">
              {/* Quick Metrics Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                  <span className="block text-[11px] text-slate-500 dark:text-slate-400">Cumulative GPA</span>
                  <span className="text-xl font-black text-indigo-600 dark:text-sky-400 font-mono tabular-nums">
                    {student.cgpa}
                  </span>
                  <span className="block text-[10px] text-slate-400 mt-0.5">Scale of 10.0</span>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                  <span className="block text-[11px] text-slate-500 dark:text-slate-400">Attendance Rate</span>
                  <span
                    className={`text-xl font-black font-mono tabular-nums ${
                      student.attendance.percentage >= 75
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : student.attendance.percentage >= 65
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {student.attendance.percentage}%
                  </span>
                  <span className="block text-[10px] text-slate-400 mt-0.5">
                    {student.attendance.attendedClasses} / {student.attendance.totalClasses} Classes
                  </span>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                  <span className="block text-[11px] text-slate-500 dark:text-slate-400">Semester & Year</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-white mt-1 block">
                    {student.semester}
                  </span>
                  <span className="block text-[10px] text-slate-400 mt-0.5 font-mono">
                    {student.academicYear}
                  </span>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                  <span className="block text-[11px] text-slate-500 dark:text-slate-400">Fee Status</span>
                  <span
                    className={`text-sm font-bold mt-1 block ${
                      student.fee.status === 'Paid'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : student.fee.status === 'Partial'
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {student.fee.status.toUpperCase()}
                  </span>
                  <span className="block text-[10px] text-slate-400 mt-0.5 font-mono">
                    {student.fee.dueFee > 0 ? `$${student.fee.dueFee.toLocaleString()} due` : 'Settled'}
                  </span>
                </div>
              </div>

              {/* Academic Performance Table */}
              <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-sky-400" />
                    Semester Course Performance
                  </h4>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    Total Credits:{' '}
                    {student.subjects.reduce((acc, curr) => acc + curr.credits, 0)}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100/60 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="py-2.5 px-3 font-semibold">Code</th>
                        <th className="py-2.5 px-3 font-semibold">Subject Name</th>
                        <th className="py-2.5 px-3 text-center font-semibold">Credits</th>
                        <th className="py-2.5 px-3 text-right font-semibold">Marks (/100)</th>
                        <th className="py-2.5 px-3 text-center font-semibold">Grade</th>
                        <th className="py-2.5 px-3 text-right font-semibold">Points</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-sans">
                      {student.subjects.map((sub) => (
                        <tr key={sub.code} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                          <td className="py-2.5 px-3 font-mono text-indigo-600 dark:text-sky-400 font-bold">{sub.code}</td>
                          <td className="py-2.5 px-3 font-medium text-slate-800 dark:text-slate-200">{sub.name}</td>
                          <td className="py-2.5 px-3 text-center font-mono text-slate-500 dark:text-slate-400">
                            {sub.credits}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900 dark:text-slate-200">
                            {sub.marks}
                          </td>
                          <td className="py-2.5 px-3 text-center font-mono font-bold">
                            <span
                              className={
                                sub.grade === 'F' ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                              }
                            >
                              {sub.grade}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-slate-600 dark:text-slate-300">
                            {sub.gradePoint}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Personal Information & Contacts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                    <User className="w-4 h-4 text-indigo-600 dark:text-sky-400" />
                    Personal Information
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" /> Email:
                      </span>
                      <span className="font-mono text-slate-800 dark:text-slate-200 font-medium">{student.email}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" /> Phone:
                      </span>
                      <span className="font-mono text-slate-800 dark:text-slate-200 font-medium">{student.phone}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" /> Date of Birth:
                      </span>
                      <span className="font-mono text-slate-800 dark:text-slate-200">{student.dateOfBirth}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Gender:</span>
                      <span className="text-slate-800 dark:text-slate-200">{student.gender}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Enrolled Since:</span>
                      <span className="font-mono text-slate-800 dark:text-slate-200">{student.enrolledDate}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    Guardian & Residence
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Guardian Name:</span>
                      <span className="text-slate-800 dark:text-slate-200 font-medium">{student.guardianName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Guardian Phone:</span>
                      <span className="font-mono text-slate-800 dark:text-slate-200">{student.guardianPhone}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" /> City:
                      </span>
                      <span className="text-slate-800 dark:text-slate-200">{student.city}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500">
                      <span className="block mb-0.5">Address:</span>
                      <span className="text-slate-700 dark:text-slate-300">{student.address}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. PRINTABLE STUDENT ID CARD VIEW */}
          {viewMode === 'idcard' && (
            <div className="py-6 flex flex-col items-center">
              <div className="w-[380px] bg-linear-to-br from-indigo-900 via-indigo-950 to-slate-900 border-2 border-indigo-400/80 rounded-2xl p-6 shadow-2xl relative overflow-hidden text-slate-100">
                <div className="text-center border-b border-indigo-800/80 pb-3 mb-4">
                  <span className="text-[9px] font-bold tracking-widest text-indigo-300 uppercase block">
                    Institute of Technology & Science
                  </span>
                  <h4 className="text-sm font-extrabold tracking-tight text-white uppercase mt-0.5">
                    Student Identity Card
                  </h4>
                  <span className="text-[10px] text-indigo-200 font-mono">Academic Session 2025-2026</span>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="w-20 h-24 rounded-xl bg-indigo-950/90 border border-indigo-700/60 flex flex-col items-center justify-center shrink-0">
                    <User className="w-8 h-8 text-indigo-300 mb-1" />
                    <span className="text-[9px] font-mono text-indigo-300">Photo</span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <span className="text-[10px] text-indigo-300 uppercase">Student Name:</span>
                    <h5 className="font-bold text-white text-sm leading-tight">{student.name}</h5>
                    <span className="block text-indigo-300 font-mono font-bold text-xs">
                      {student.rollNo}
                    </span>
                    <span className="block text-[11px] text-slate-200 leading-snug">
                      {student.department}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-950/80 p-2.5 rounded-lg border border-indigo-800 font-mono mb-4">
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase">Year / Sem</span>
                    <span className="text-slate-200">{student.semester}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase">Blood / DOB</span>
                    <span className="text-slate-200">{student.dateOfBirth}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase">Emergency</span>
                    <span className="text-slate-200">{student.guardianPhone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase">Card Status</span>
                    <span className="text-emerald-400 font-bold">VERIFIED</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-indigo-800 text-center">
                  <div className="h-6 flex items-center justify-center gap-0.5 px-4 opacity-75">
                    {Array.from({ length: 36 }).map((_, i) => (
                      <span
                        key={i}
                        className="bg-slate-300 inline-block h-full"
                        style={{ width: i % 3 === 0 ? '3px' : '1.5px' }}
                      />
                    ))}
                  </div>
                  <span className="text-[9px] font-mono text-indigo-200 block mt-1 tracking-widest">
                    *{student.rollNo}*
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 3. OFFICIAL MARKSHEET TRANSCRIPT VIEW */}
          {viewMode === 'transcript' && (
            <div className="bg-white text-slate-900 p-8 rounded-xl border border-slate-300 shadow-md max-w-2xl mx-auto font-sans">
              <div className="text-center border-b-2 border-slate-800 pb-4 mb-4">
                <span className="text-[10px] font-bold tracking-widest uppercase text-slate-500">
                  Board of Technical Examinations
                </span>
                <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase">
                  Semester Grade Transcript & Marksheet
                </h3>
                <p className="text-xs text-slate-600">
                  Department of {student.department} &bull; {student.semester} ({student.academicYear})
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200 mb-4 font-mono">
                <div>
                  <span className="text-slate-500">Roll No:</span>{' '}
                  <strong className="text-slate-900">{student.rollNo}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Name:</span>{' '}
                  <strong className="text-slate-900">{student.name}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Enrolled:</span>{' '}
                  <strong className="text-slate-900">{student.enrolledDate}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Status:</span>{' '}
                  <strong className="text-slate-900">{student.status}</strong>
                </div>
              </div>

              <table className="w-full text-xs border border-slate-300 mb-4">
                <thead className="bg-slate-100 text-slate-800 font-semibold border-b border-slate-300">
                  <tr>
                    <th className="p-2 text-left">Code</th>
                    <th className="p-2 text-left">Course Title</th>
                    <th className="p-2 text-center">Credits</th>
                    <th className="p-2 text-right">Marks (/100)</th>
                    <th className="p-2 text-center">Grade</th>
                    <th className="p-2 text-right">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono">
                  {student.subjects.map((sub) => (
                    <tr key={sub.code}>
                      <td className="p-2 font-bold text-slate-700">{sub.code}</td>
                      <td className="p-2 font-sans font-medium text-slate-900">{sub.name}</td>
                      <td className="p-2 text-center">{sub.credits}</td>
                      <td className="p-2 text-right font-bold">{sub.marks}</td>
                      <td className="p-2 text-center font-bold">
                        <span className={sub.grade === 'F' ? 'text-rose-600' : 'text-emerald-700'}>
                          {sub.grade}
                        </span>
                      </td>
                      <td className="p-2 text-right">{sub.gradePoint}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-300 font-mono">
                  <tr>
                    <td colSpan={2} className="p-2 font-sans">
                      Cumulative Summary
                    </td>
                    <td className="p-2 text-center">
                      {student.subjects.reduce((acc, curr) => acc + curr.credits, 0)}
                    </td>
                    <td className="p-2 text-right">
                      {student.subjects.reduce((acc, curr) => acc + curr.marks, 0)} / 500
                    </td>
                    <td className="p-2 text-center">
                      <span className={student.cgpa >= 5 ? 'text-emerald-700' : 'text-rose-700'}>
                        {student.cgpa >= 5 ? 'PASS' : 'FAIL'}
                      </span>
                    </td>
                    <td className="p-2 text-right text-sm text-indigo-700 font-black">
                      {student.cgpa} CGPA
                    </td>
                  </tr>
                </tfoot>
              </table>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-4 border-t border-slate-200">
                <span>Controller of Examinations</span>
                <span>Dean Academic Affairs</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
