import React from 'react';
import { Student } from '../types/studentApp';
import {
  Users,
  Award,
  CalendarCheck,
  CreditCard,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';

interface AnalyticsDashboardProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  students,
  onSelectStudent,
}) => {
  const total = students.length;
  const activeCount = students.filter((s) => s.status === 'Active').length;

  const averageCgpa =
    total > 0
      ? Math.round((students.reduce((acc, curr) => acc + curr.cgpa, 0) / total) * 100) / 100
      : 0;

  const averageAttendance =
    total > 0
      ? Math.round(
          students.reduce((acc, curr) => acc + curr.attendance.percentage, 0) / total
        )
      : 0;

  const totalFeeExpected = students.reduce((acc, curr) => acc + curr.fee.totalFee, 0);
  const totalFeeCollected = students.reduce((acc, curr) => acc + curr.fee.paidFee, 0);
  const totalFeeDue = students.reduce((acc, curr) => acc + curr.fee.dueFee, 0);
  const feeCollectionPct =
    totalFeeExpected > 0 ? Math.round((totalFeeCollected / totalFeeExpected) * 100) : 0;

  // Department counts
  const deptMap: { [key: string]: { count: number; totalCgpa: number } } = {};
  students.forEach((s) => {
    if (!deptMap[s.department]) {
      deptMap[s.department] = { count: 0, totalCgpa: 0 };
    }
    deptMap[s.department].count += 1;
    deptMap[s.department].totalCgpa += s.cgpa;
  });

  // Top Performers (Honor Roll)
  const honorRoll = [...students].sort((a, b) => b.cgpa - a.cgpa).slice(0, 4);

  // At-Risk Students (Attendance < 75% or Overdue Fee)
  const atRiskStudents = students.filter(
    (s) => s.attendance.percentage < 75 || s.fee.status === 'Overdue'
  );

  return (
    <div className="space-y-6">
      {/* 4 Core KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Enrolled */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">Total Enrollment</span>
            <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono tabular-nums">
              {total}
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              {activeCount} Active ({total > 0 ? Math.round((activeCount / total) * 100) : 0}%)
            </span>
          </div>
          <div className="mt-3 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Enrolled Students</span>
            <span>All Semesters</span>
          </div>
        </div>

        {/* KPI 2: Average CGPA */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">Institutional GPA</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-600 dark:text-amber-300 font-mono tabular-nums">
              {averageCgpa}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">/ 10.0 Scale</span>
          </div>
          <div className="mt-3 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Class Performance</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
              {students.filter((s) => s.cgpa >= 8).length} Honors (&ge;8.0)
            </span>
          </div>
        </div>

        {/* KPI 3: Attendance Average */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">Average Attendance</span>
            <CalendarCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
              {averageAttendance}%
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Class Average</span>
          </div>
          <div className="mt-3 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Minimum Target: 75%</span>
            <span
              className={
                students.filter((s) => s.attendance.percentage < 75).length > 0
                  ? 'text-rose-600 dark:text-rose-400 font-semibold'
                  : 'text-emerald-600 dark:text-emerald-400'
              }
            >
              {students.filter((s) => s.attendance.percentage < 75).length} Critical
            </span>
          </div>
        </div>

        {/* KPI 4: Fee Collection Rate */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">Tuition Collection</span>
            <CreditCard className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-indigo-700 dark:text-indigo-300 font-mono tabular-nums">
              {feeCollectionPct}%
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              ${(totalFeeCollected / 1000).toFixed(0)}k Collected
            </span>
          </div>
          <div className="mt-3 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Pending Balance:</span>
            <span className="text-amber-600 dark:text-amber-400 font-mono font-semibold">
              ${totalFeeDue.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Department Distribution & Honor Roll */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Department Distribution (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Department Enrollment & Academic Standing
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Student count and average CGPA distribution across academic departments.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-500">{Object.keys(deptMap).length} Depts</span>
          </div>

          <div className="space-y-3">
            {Object.entries(deptMap).map(([dept, data]) => {
              const pctOfTotal = total > 0 ? Math.round((data.count / total) * 100) : 0;
              const deptAvgCgpa =
                data.count > 0 ? Math.round((data.totalCgpa / data.count) * 10) / 10 : 0;

              return (
                <div
                  key={dept}
                  className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/60 dark:border-slate-800 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{dept}</span>
                    <div className="flex items-center gap-3 font-mono text-[11px]">
                      <span className="text-slate-500">{data.count} Students ({pctOfTotal}%)</span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                        Avg {deptAvgCgpa} CGPA
                      </span>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-slate-200 dark:bg-slate-900 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-linear-to-r from-indigo-500 to-sky-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(8, pctOfTotal)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Academic Honor Roll (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                Academic Honor Roll
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Top-ranking students this academic term.</p>
            </div>
            <span className="text-xs font-mono text-amber-600 dark:text-amber-400 font-semibold">
              &ge; 8.5 CGPA
            </span>
          </div>

          <div className="space-y-2.5">
            {honorRoll.map((stu, rank) => (
              <div
                key={stu.id}
                onClick={() => onSelectStudent(stu)}
                className="p-3 bg-slate-50 dark:bg-slate-950 hover:bg-indigo-50/50 dark:hover:bg-slate-850 rounded-xl border border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-3 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`w-6 h-6 rounded-lg text-xs font-bold font-mono flex items-center justify-center shrink-0 ${
                      rank === 0
                        ? 'bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/40'
                        : rank === 1
                        ? 'bg-slate-200 text-slate-700 border border-slate-300 dark:bg-slate-400/20 dark:text-slate-300 dark:border-slate-400/40'
                        : rank === 2
                        ? 'bg-amber-50 text-amber-900 border border-amber-200 dark:bg-amber-700/20 dark:text-amber-500 dark:border-amber-700/40'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    #{rank + 1}
                  </span>
                  <div className="min-w-0">
                    <h5 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                      {stu.name}
                    </h5>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono block truncate">
                      {stu.rollNo} &bull; {stu.department.replace(/\(.*\)/, '').trim()}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-mono font-black text-sm text-amber-600 dark:text-amber-300 tabular-nums">
                    {stu.cgpa}
                  </span>
                  <span className="text-[10px] text-slate-400 block font-sans">CGPA</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* At-Risk Warning Callout */}
      {atRiskStudents.length > 0 && (
        <div className="bg-amber-50/60 dark:bg-slate-900 border border-amber-300 dark:border-amber-500/30 rounded-2xl p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Academic & Administrative Action Required ({atRiskStudents.length} Students)
              </h3>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Click student to inspect record</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
            {atRiskStudents.map((stu) => (
              <div
                key={stu.id}
                onClick={() => onSelectStudent(stu)}
                className="p-3 bg-white dark:bg-slate-950 rounded-xl border border-amber-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-slate-700 transition-colors cursor-pointer flex items-center justify-between shadow-xs"
              >
                <div>
                  <h5 className="font-bold text-xs text-slate-900 dark:text-slate-100">{stu.name}</h5>
                  <span className="text-[11px] font-mono text-slate-500">{stu.rollNo}</span>
                </div>
                <div className="text-right space-y-0.5">
                  {stu.attendance.percentage < 75 && (
                    <span className="inline-block text-[10px] font-bold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/80 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-500/30">
                      Att: {stu.attendance.percentage}%
                    </span>
                  )}
                  {stu.fee.status === 'Overdue' && (
                    <span className="block text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/80 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-500/30">
                      Fee Overdue
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
