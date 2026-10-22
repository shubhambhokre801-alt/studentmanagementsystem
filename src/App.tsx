import React, { useState, useEffect, useMemo } from 'react';
import { Student, DEPARTMENTS, SEMESTERS } from './types/studentApp';
import { INITIAL_STUDENTS } from './data/mockStudents';
import { StudentTableView } from './components/StudentTableView';
import { StudentGridView } from './components/StudentGridView';
import { StudentFormModal } from './components/StudentFormModal';
import { StudentDetailsModal } from './components/StudentDetailsModal';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { ExportImportModal } from './components/ExportImportModal';
import { ReportViewer } from './components/ReportViewer';
import { useTheme } from './context/ThemeContext';
import {
  GraduationCap,
  Plus,
  Search,
  LayoutGrid,
  List,
  Download,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Sun,
  Moon,
  Sparkles,
} from 'lucide-react';

const STORAGE_KEY = 'student_mgmt_records_v1';

export default function App() {
  const { theme, setTheme, isDark } = useTheme();

  // Primary Student State initialized from localStorage or mock data
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }
    return INITIAL_STUDENTS;
  });

  // Save to localStorage whenever students change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [students]);

  // Main Navigation Tab
  const [activeTab, setActiveTab] = useState<'students' | 'analytics' | 'report'>('students');

  // View Mode for Students tab (Table vs Card Grid)
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedSemester, setSelectedSemester] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedFeeStatus, setSelectedFeeStatus] = useState<string>('ALL');
  const [selectedAttFilter, setSelectedAttFilter] = useState<'ALL' | 'Good' | 'Warning' | 'Critical'>('ALL');

  // Sorting
  const [sortField, setSortField] = useState<'rollNo' | 'name' | 'cgpa' | 'attendance'>('rollNo');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Selection for Batch Actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modal Dialogs
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);

  const [selectedStudentForDetails, setSelectedStudentForDetails] = useState<Student | null>(null);

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Deletion Confirmation Target
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [batchDeleteConfirm, setBatchDeleteConfirm] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage((prev) => (prev?.text === text ? null : prev));
    }, 4000);
  };

  // Filtered & Sorted Students
  const filteredStudents = useMemo(() => {
    return students
      .filter((s) => {
        const query = searchQuery.trim().toLowerCase();
        const matchesSearch =
          !query ||
          s.name.toLowerCase().includes(query) ||
          s.rollNo.toLowerCase().includes(query) ||
          s.email.toLowerCase().includes(query) ||
          s.city.toLowerCase().includes(query);

        const matchesDept = selectedDept === 'ALL' || s.department === selectedDept;
        const matchesSem = selectedSemester === 'ALL' || s.semester === selectedSemester;
        const matchesStatus = selectedStatus === 'ALL' || s.status === selectedStatus;
        const matchesFee = selectedFeeStatus === 'ALL' || s.fee.status === selectedFeeStatus;
        const matchesAtt =
          selectedAttFilter === 'ALL' || s.attendance.status === selectedAttFilter;

        return matchesSearch && matchesDept && matchesSem && matchesStatus && matchesFee && matchesAtt;
      })
      .sort((a, b) => {
        let valA: any = a[sortField];
        let valB: any = b[sortField];

        if (sortField === 'attendance') {
          valA = a.attendance.percentage;
          valB = b.attendance.percentage;
        }

        if (typeof valA === 'string') {
          return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      });
  }, [
    students,
    searchQuery,
    selectedDept,
    selectedSemester,
    selectedStatus,
    selectedFeeStatus,
    selectedAttFilter,
    sortField,
    sortOrder,
  ]);

  // Handlers for sorting
  const handleSortChange = (field: 'rollNo' | 'name' | 'cgpa' | 'attendance') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Selection Handlers
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredStudents.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredStudents.map((s) => s.id));
    }
  };

  // Add / Edit Handlers
  const handleOpenAddModal = () => {
    setStudentToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (student: Student) => {
    setStudentToEdit(student);
    setIsFormModalOpen(true);
  };

  const handleSaveStudent = (savedStudent: Student) => {
    setStudents((prev) => {
      const exists = prev.some((s) => s.id === savedStudent.id);
      if (exists) {
        return prev.map((s) => (s.id === savedStudent.id ? savedStudent : s));
      }
      return [savedStudent, ...prev];
    });

    if (selectedStudentForDetails?.id === savedStudent.id) {
      setSelectedStudentForDetails(savedStudent);
    }

    showToast(`Student record for '${savedStudent.name}' saved successfully!`);
  };

  // Delete Handler
  const handleDeleteStudent = (id: string) => {
    setDeleteTargetId(id);
  };

  const confirmDeleteStudent = () => {
    if (!deleteTargetId) return;
    const stu = students.find((s) => s.id === deleteTargetId);
    setStudents((prev) => prev.filter((s) => s.id !== deleteTargetId));
    setSelectedIds((prev) => prev.filter((id) => id !== deleteTargetId));
    if (selectedStudentForDetails?.id === deleteTargetId) {
      setSelectedStudentForDetails(null);
    }
    setDeleteTargetId(null);
    showToast(`Student '${stu?.name || 'Record'}' deleted.`, 'info');
  };

  // Batch Operations
  const handleBatchStatusChange = (newStatus: Student['status']) => {
    setStudents((prev) =>
      prev.map((s) => (selectedIds.includes(s.id) ? { ...s, status: newStatus } : s))
    );
    showToast(`Updated status of ${selectedIds.length} students to ${newStatus}.`);
    setSelectedIds([]);
  };

  const confirmBatchDelete = () => {
    setStudents((prev) => prev.filter((s) => !selectedIds.includes(s.id)));
    showToast(`Permanently deleted ${selectedIds.length} students.`);
    setSelectedIds([]);
    setBatchDeleteConfirm(false);
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedDept('ALL');
    setSelectedSemester('ALL');
    setSelectedStatus('ALL');
    setSelectedFeeStatus('ALL');
    setSelectedAttFilter('ALL');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200 selection:bg-indigo-500/20 selection:text-indigo-900 dark:selection:text-indigo-200">
      
      {/* Top Bar following the 3-Zone Contract */}
      <header className="border-b border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md sticky top-0 z-40 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 whitespace-nowrap shrink-0">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0">
              Student Management System
            </span>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-slate-600 dark:text-slate-300">
            <button
              onClick={() => setActiveTab('students')}
              className={`hover:text-indigo-600 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'students' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : ''
              }`}
            >
              Student Directory
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`hover:text-indigo-600 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'analytics' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : ''
              }`}
            >
              Analytics & Insights
            </button>
            <button
              onClick={() => setActiveTab('report')}
              className={`hover:text-indigo-600 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'report' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : ''
              }`}
            >
              Project Report
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action + Theme Toggle */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Theme Toggle Pill Button */}
            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${
                  theme === 'light'
                    ? 'bg-white text-indigo-600 shadow-xs font-semibold'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
                title="Light Theme (Modern Campus)"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-slate-900 text-sky-400 shadow-xs font-semibold'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
                title="Dark Theme (Midnight Pro)"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={() => setIsExportModalOpen(true)}
              className="hidden sm:flex text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium px-3 py-2 rounded-xl items-center gap-1.5 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xs"
              title="Export or Import student records"
            >
              <Download className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Export</span>
            </button>

            <button
              onClick={handleOpenAddModal}
              className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Student</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="md:hidden flex items-center gap-1 overflow-x-auto px-4 py-2 border-t border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/60 text-xs">
          <button
            onClick={() => setActiveTab('students')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors font-medium ${
              activeTab === 'students'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Directory
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors font-medium ${
              activeTab === 'analytics'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors font-medium ${
              activeTab === 'report'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Project Report
          </button>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {/* TAB 1: STUDENT DIRECTORY */}
        {activeTab === 'students' && (
          <div className="space-y-5">
            {/* Top Toolbar: Search, Filters, View Modes */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 space-y-4 shadow-xs">
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
                {/* Search Input */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by student name, roll number, email, or city..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-xs focus:outline-none focus:border-indigo-600 dark:focus:border-sky-500 font-sans shadow-2xs"
                  />
                </div>

                {/* View Mode Toggle & Results Count */}
                <div className="flex items-center justify-between lg:justify-end gap-3 text-xs">
                  <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                    Showing <strong className="text-slate-900 dark:text-white font-bold">{filteredStudents.length}</strong> of{' '}
                    {students.length} students
                  </span>

                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setViewMode('table')}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        viewMode === 'table'
                          ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-white shadow-2xs font-semibold'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                      title="Table View"
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('grid')}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        viewMode === 'grid'
                          ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-white shadow-2xs font-semibold'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                      title="Grid Cards View"
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Filter Controls Row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                {/* Department */}
                <div>
                  <select
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-600 dark:focus:border-sky-500 truncate"
                  >
                    <option value="ALL">All Departments</option>
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Semester */}
                <div>
                  <select
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-600 dark:focus:border-sky-500"
                  >
                    <option value="ALL">All Semesters</option>
                    {SEMESTERS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Enrollment Status */}
                <div>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-600 dark:focus:border-sky-500"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="Active">Active Only</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Graduated">Graduated</option>
                  </select>
                </div>

                {/* Fee Status */}
                <div>
                  <select
                    value={selectedFeeStatus}
                    onChange={(e) => setSelectedFeeStatus(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-600 dark:focus:border-sky-500"
                  >
                    <option value="ALL">All Fee Status</option>
                    <option value="Paid">Paid Fees</option>
                    <option value="Partial">Partial Fees</option>
                    <option value="Overdue">Overdue Fees</option>
                  </select>
                </div>

                {/* Attendance */}
                <div>
                  <select
                    value={selectedAttFilter}
                    onChange={(e) => setSelectedAttFilter(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-600 dark:focus:border-sky-500"
                  >
                    <option value="ALL">All Attendance</option>
                    <option value="Good">&ge; 75% (Good)</option>
                    <option value="Warning">65 - 74% (Warning)</option>
                    <option value="Critical">&lt; 65% (Critical)</option>
                  </select>
                </div>
              </div>

              {/* Active Filters Clear Button */}
              {(searchQuery ||
                selectedDept !== 'ALL' ||
                selectedSemester !== 'ALL' ||
                selectedStatus !== 'ALL' ||
                selectedFeeStatus !== 'ALL' ||
                selectedAttFilter !== 'ALL') && (
                <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                  <span>Filtered view active</span>
                  <button
                    onClick={handleResetFilters}
                    className="text-indigo-600 dark:text-sky-400 hover:underline cursor-pointer font-medium"
                  >
                    Reset all filters
                  </button>
                </div>
              )}
            </div>

            {/* Batch Action Toolbar when items selected */}
            {selectedIds.length > 0 && (
              <div className="bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-500/40 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs text-indigo-900 dark:text-indigo-200 animate-fade-in shadow-xs">
                <div className="flex items-center gap-3">
                  <span className="font-semibold">
                    {selectedIds.length} student{selectedIds.length > 1 ? 's' : ''} selected
                  </span>
                  <div className="h-4 w-px bg-indigo-300 dark:bg-indigo-700" />
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-600 dark:text-slate-300 text-[11px]">Set Status:</span>
                    <button
                      onClick={() => handleBatchStatusChange('Active')}
                      className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200 cursor-pointer text-[10px] font-medium border border-slate-200 dark:border-slate-700"
                    >
                      Active
                    </button>
                    <button
                      onClick={() => handleBatchStatusChange('On Leave')}
                      className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 hover:bg-slate-100 text-amber-700 dark:text-amber-300 cursor-pointer text-[10px] font-medium border border-slate-200 dark:border-slate-700"
                    >
                      On Leave
                    </button>
                    <button
                      onClick={() => handleBatchStatusChange('Graduated')}
                      className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 hover:bg-slate-100 text-indigo-700 dark:text-indigo-300 cursor-pointer text-[10px] font-medium border border-slate-200 dark:border-slate-700"
                    >
                      Graduated
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setBatchDeleteConfirm(true)}
                    className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium cursor-pointer flex items-center gap-1 text-[11px]"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Selected</span>
                  </button>
                  <button
                    onClick={() => setSelectedIds([])}
                    className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white px-2 py-1 text-[11px] cursor-pointer"
                  >
                    Deselect All
                  </button>
                </div>
              </div>
            )}

            {/* View Render (Table vs Grid) */}
            {viewMode === 'table' ? (
              <StudentTableView
                students={filteredStudents}
                selectedIds={selectedIds}
                onToggleSelect={handleToggleSelect}
                onToggleSelectAll={handleToggleSelectAll}
                onSelectStudent={(stu) => setSelectedStudentForDetails(stu)}
                onEditStudent={handleOpenEditModal}
                onDeleteStudent={handleDeleteStudent}
                sortField={sortField}
                sortOrder={sortOrder}
                onSortChange={handleSortChange}
              />
            ) : (
              <StudentGridView
                students={filteredStudents}
                onSelectStudent={(stu) => setSelectedStudentForDetails(stu)}
                onEditStudent={handleOpenEditModal}
                onDeleteStudent={handleDeleteStudent}
              />
            )}
          </div>
        )}

        {/* TAB 2: ANALYTICS DASHBOARD */}
        {activeTab === 'analytics' && (
          <AnalyticsDashboard
            students={students}
            onSelectStudent={(stu) => {
              setSelectedStudentForDetails(stu);
            }}
          />
        )}

        {/* TAB 3: COLLEGE PROJECT REPORT */}
        {activeTab === 'report' && (
          <div className="space-y-4">
            <ReportViewer />
          </div>
        )}
      </main>

      {/* Student Form Modal (Register & Edit) */}
      <StudentFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveStudent}
        studentToEdit={studentToEdit}
        existingRollNumbers={students.map((s) => s.rollNo.toUpperCase())}
      />

      {/* Student Details / Dossier & ID Card Modal */}
      <StudentDetailsModal
        student={selectedStudentForDetails}
        isOpen={Boolean(selectedStudentForDetails)}
        onClose={() => setSelectedStudentForDetails(null)}
        onEdit={(stu) => {
          setSelectedStudentForDetails(null);
          handleOpenEditModal(stu);
        }}
        onDelete={(id) => {
          setSelectedStudentForDetails(null);
          handleDeleteStudent(id);
        }}
      />

      {/* Export / Import Modal */}
      <ExportImportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        students={students}
        onImport={(imported) => {
          setStudents(imported);
          showToast(`Imported ${imported.length} student records.`);
        }}
        onReset={() => {
          setStudents(INITIAL_STUDENTS);
          showToast('Reset to original sample students.');
        }}
      />

      {/* Single Record Delete Confirmation Modal */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-fade-in text-slate-800 dark:text-slate-200">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400 mb-3">
              <AlertTriangle className="w-6 h-6" />
              <h4 className="font-bold text-base text-slate-900 dark:text-white">Delete Student Record?</h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
              Are you sure you want to permanently remove this student record from the system? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 text-xs">
              <button
                type="button"
                onClick={() => setDeleteTargetId(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteStudent}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold cursor-pointer shadow-xs"
              >
                Yes, Delete Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Batch Delete Confirmation Modal */}
      {batchDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-fade-in text-slate-800 dark:text-slate-200">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400 mb-3">
              <AlertTriangle className="w-6 h-6" />
              <h4 className="font-bold text-base text-slate-900 dark:text-white">Confirm Batch Deletion</h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
              You are about to delete <strong>{selectedIds.length}</strong> selected student records.
              Are you sure you want to proceed?
            </p>
            <div className="flex items-center justify-end gap-3 text-xs">
              <button
                type="button"
                onClick={() => setBatchDeleteConfirm(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmBatchDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold cursor-pointer shadow-xs"
              >
                Delete {selectedIds.length} Students
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
          <div
            className={`border rounded-xl px-4 py-3 flex items-center gap-2.5 shadow-xl text-xs backdrop-blur-md ${
              toastMessage.type === 'error'
                ? 'bg-rose-50 dark:bg-rose-950/95 border-rose-300 dark:border-rose-500 text-rose-800 dark:text-rose-100'
                : toastMessage.type === 'info'
                ? 'bg-sky-50 dark:bg-sky-950/95 border-sky-300 dark:border-sky-500 text-sky-800 dark:text-sky-100'
                : 'bg-emerald-50 dark:bg-emerald-950/95 border-emerald-300 dark:border-emerald-500 text-emerald-800 dark:text-emerald-100'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-semibold">{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 py-6 px-4 text-xs text-slate-500 text-center no-print mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 dark:text-slate-400">
          <p>
            Student Management System &bull; Academic Administration Portal
          </p>
          <div className="flex items-center gap-4">
            <button onClick={() => setActiveTab('students')} className="hover:text-indigo-600 dark:hover:text-white cursor-pointer transition">
              Directory
            </button>
            <button onClick={() => setActiveTab('analytics')} className="hover:text-indigo-600 dark:hover:text-white cursor-pointer transition">
              Analytics
            </button>
            <button onClick={() => setActiveTab('report')} className="hover:text-indigo-600 dark:hover:text-white cursor-pointer transition">
              Project Report
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
