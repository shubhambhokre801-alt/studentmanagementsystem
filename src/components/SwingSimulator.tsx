import React, { useState, useMemo } from 'react';
import {
  StudentRecord,
  DEPARTMENTS,
  YEARS,
  SUBJECT_NAMES,
  calculateStudentMetrics,
} from '../types/student';
import { INITIAL_SAMPLE_STUDENTS } from '../data/sampleStudents';
import {
  Search,
  RotateCcw,
  PlusCircle,
  Edit3,
  Trash2,
  FileText,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Info,
  Printer,
  X,
  Sparkles,
} from 'lucide-react';

interface ToastState {
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

export const SwingSimulator: React.FC = () => {
  // In-memory ArrayList simulation state
  const [students, setStudents] = useState<StudentRecord[]>(INITIAL_SAMPLE_STUDENTS);

  // Form input state
  const [rollNo, setRollNo] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState<string>(DEPARTMENTS[0]);
  const [year, setYear] = useState<string>(YEARS[0]);
  const [phone, setPhone] = useState('');

  // 5 Subject Marks
  const [sub1, setSub1] = useState<string>('');
  const [sub2, setSub2] = useState<string>('');
  const [sub3, setSub3] = useState<string>('');
  const [sub4, setSub4] = useState<string>('');
  const [sub5, setSub5] = useState<string>('');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('ALL');
  const [selectedResultFilter, setSelectedResultFilter] = useState<'ALL' | 'PASS' | 'FAIL'>('ALL');

  // Selected student for row highlight & form population
  const [selectedRollNo, setSelectedRollNo] = useState<string | null>(null);

  // Modal dialog states (simulating JOptionPane and JDialog)
  const [toast, setToast] = useState<ToastState | null>(null);
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<string | null>(null);
  const [marksheetStudent, setMarksheetStudent] = useState<StudentRecord | null>(null);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showStorageNoticeModal, setShowStorageNoticeModal] = useState(false);

  // Live calculation of preview metrics
  const liveMetrics = useMemo(() => {
    const m1 = parseFloat(sub1);
    const m2 = parseFloat(sub2);
    const m3 = parseFloat(sub3);
    const m4 = parseFloat(sub4);
    const m5 = parseFloat(sub5);

    if (isNaN(m1) || isNaN(m2) || isNaN(m3) || isNaN(m4) || isNaN(m5)) {
      return null;
    }
    return calculateStudentMetrics(m1, m2, m3, m4, m5);
  }, [sub1, sub2, sub3, sub4, sub5]);

  // Overall Statistics
  const stats = useMemo(() => {
    const total = students.length;
    const passed = students.filter((s) => s.result === 'PASS').length;
    const failed = students.filter((s) => s.result === 'FAIL').length;
    const avg =
      total > 0
        ? Math.round(
            (students.reduce((acc, curr) => acc + curr.percentage, 0) / total) * 10
          ) / 10
        : 0;
    return { total, passed, failed, avg };
  }, [students]);

  // Filtered students list for JTable
  const displayedStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        s.rollNo.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase().trim());

      const matchesDept =
        selectedDeptFilter === 'ALL' || s.department === selectedDeptFilter;

      const matchesResult =
        selectedResultFilter === 'ALL' || s.result === selectedResultFilter;

      return matchesSearch && matchesDept && matchesResult;
    });
  }, [students, searchQuery, selectedDeptFilter, selectedResultFilter]);

  const showToast = (
    title: string,
    message: string,
    type: 'success' | 'error' | 'warning' | 'info'
  ) => {
    setToast({ title, message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 4500);
  };

  // Populate form from selected student
  const handleSelectStudent = (student: StudentRecord) => {
    setSelectedRollNo(student.rollNo);
    setRollNo(student.rollNo);
    setName(student.name);
    setDepartment(student.department);
    setYear(student.year);
    setPhone(student.phone);
    setSub1(student.sub1.toString());
    setSub2(student.sub2.toString());
    setSub3(student.sub3.toString());
    setSub4(student.sub4.toString());
    setSub5(student.sub5.toString());
  };

  // Clear inputs
  const handleClearInputs = () => {
    setSelectedRollNo(null);
    setRollNo('');
    setName('');
    setDepartment(DEPARTMENTS[0]);
    setYear(YEARS[0]);
    setPhone('');
    setSub1('');
    setSub2('');
    setSub3('');
    setSub4('');
    setSub5('');
  };

  // Add Student Handler (Matching Java Swing implementation)
  const handleAddStudent = () => {
    const trimmedRoll = rollNo.trim().toUpperCase();
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();

    // 1. Mandatory empty fields validation
    if (
      !trimmedRoll ||
      !trimmedName ||
      !trimmedPhone ||
      sub1 === '' ||
      sub2 === '' ||
      sub3 === '' ||
      sub4 === '' ||
      sub5 === ''
    ) {
      showToast(
        'Validation Error',
        'All fields marked with (*) are required. Please fill in all fields.',
        'warning'
      );
      return;
    }

    // 2. Prevent duplicate roll numbers
    const exists = students.some(
      (s) => s.rollNo.toUpperCase() === trimmedRoll
    );
    if (exists) {
      showToast(
        'Duplicate Roll Number',
        `A student with Roll Number '${trimmedRoll}' already exists in memory! Roll number must be unique.`,
        'error'
      );
      return;
    }

    // 3. Validate phone number (10 digits)
    if (!/^\d{10}$/.test(trimmedPhone)) {
      showToast(
        'Invalid Phone Number',
        'Please enter a valid 10-digit mobile number (digits only).',
        'warning'
      );
      return;
    }

    // 4. Validate subject marks (0-100)
    const m1 = parseFloat(sub1);
    const m2 = parseFloat(sub2);
    const m3 = parseFloat(sub3);
    const m4 = parseFloat(sub4);
    const m5 = parseFloat(sub5);

    if (
      isNaN(m1) ||
      isNaN(m2) ||
      isNaN(m3) ||
      isNaN(m4) ||
      isNaN(m5)
    ) {
      showToast(
        'Invalid Marks Format',
        'All 5 subject marks must be valid numbers.',
        'error'
      );
      return;
    }

    if (
      m1 < 0 ||
      m1 > 100 ||
      m2 < 0 ||
      m2 > 100 ||
      m3 < 0 ||
      m3 > 100 ||
      m4 < 0 ||
      m4 > 100 ||
      m5 < 0 ||
      m5 > 100
    ) {
      showToast(
        'Marks Out of Range',
        'Subject marks must be between 0 and 100.',
        'error'
      );
      return;
    }

    const metrics = calculateStudentMetrics(m1, m2, m3, m4, m5);
    const newStudent: StudentRecord = {
      rollNo: trimmedRoll,
      name: trimmedName,
      department,
      year,
      phone: trimmedPhone,
      sub1: m1,
      sub2: m2,
      sub3: m3,
      sub4: m4,
      sub5: m5,
      ...metrics,
    };

    setStudents((prev) => [newStudent, ...prev]);
    showToast(
      'Student Added',
      `Student '${trimmedName}' (Roll: ${trimmedRoll}) successfully registered into ArrayList memory!`,
      'success'
    );
    handleClearInputs();
  };

  // Update Student Handler
  const handleUpdateStudent = () => {
    const trimmedRoll = rollNo.trim().toUpperCase();
    if (!trimmedRoll) {
      showToast(
        'No Student Selected',
        'Please select a student from the table or enter the Roll Number to update.',
        'warning'
      );
      return;
    }

    const index = students.findIndex(
      (s) => s.rollNo.toUpperCase() === trimmedRoll
    );
    if (index === -1) {
      showToast(
        'Student Not Found',
        `No student found with Roll Number '${trimmedRoll}'.`,
        'error'
      );
      return;
    }

    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    if (!trimmedName || !trimmedPhone) {
      showToast(
        'Empty Fields',
        'Student Name and Phone Number cannot be blank.',
        'warning'
      );
      return;
    }

    if (!/^\d{10}$/.test(trimmedPhone)) {
      showToast(
        'Invalid Phone Number',
        'Please enter a valid 10-digit mobile number.',
        'warning'
      );
      return;
    }

    const m1 = parseFloat(sub1);
    const m2 = parseFloat(sub2);
    const m3 = parseFloat(sub3);
    const m4 = parseFloat(sub4);
    const m5 = parseFloat(sub5);

    if (
      isNaN(m1) ||
      isNaN(m2) ||
      isNaN(m3) ||
      isNaN(m4) ||
      isNaN(m5) ||
      m1 < 0 ||
      m1 > 100 ||
      m2 < 0 ||
      m2 > 100 ||
      m3 < 0 ||
      m3 > 100 ||
      m4 < 0 ||
      m4 > 100 ||
      m5 < 0 ||
      m5 > 100
    ) {
      showToast(
        'Invalid Marks',
        'Subject marks must be numbers between 0 and 100.',
        'error'
      );
      return;
    }

    const metrics = calculateStudentMetrics(m1, m2, m3, m4, m5);
    const updated: StudentRecord = {
      rollNo: trimmedRoll,
      name: trimmedName,
      department,
      year,
      phone: trimmedPhone,
      sub1: m1,
      sub2: m2,
      sub3: m3,
      sub4: m4,
      sub5: m5,
      ...metrics,
    };

    setStudents((prev) => {
      const copy = [...prev];
      copy[index] = updated;
      return copy;
    });

    showToast(
      'Record Updated',
      `Details for Roll No '${trimmedRoll}' were successfully updated in memory!`,
      'success'
    );
  };

  // Delete Student
  const handleDeleteRequest = () => {
    const trimmedRoll = rollNo.trim().toUpperCase();
    if (!trimmedRoll) {
      showToast(
        'Selection Required',
        'Please select a student from the table or provide a Roll Number to delete.',
        'warning'
      );
      return;
    }

    const exists = students.some(
      (s) => s.rollNo.toUpperCase() === trimmedRoll
    );
    if (!exists) {
      showToast(
        'Record Not Found',
        `No student found with Roll Number '${trimmedRoll}'.`,
        'error'
      );
      return;
    }

    setDeleteConfirmTarget(trimmedRoll);
  };

  const confirmDelete = () => {
    if (!deleteConfirmTarget) return;
    setStudents((prev) =>
      prev.filter((s) => s.rollNo.toUpperCase() !== deleteConfirmTarget)
    );
    showToast(
      'Student Deleted',
      `Student record (Roll No: ${deleteConfirmTarget}) has been removed from memory.`,
      'info'
    );
    setDeleteConfirmTarget(null);
    handleClearInputs();
  };

  // Search Action
  const handleSearchClick = () => {
    if (!searchQuery.trim()) {
      showToast('Search Query Empty', 'Enter a roll number or name to search.', 'info');
      return;
    }
    const match = students.find(
      (s) =>
        s.rollNo.toLowerCase() === searchQuery.trim().toLowerCase() ||
        s.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
    );
    if (match) {
      handleSelectStudent(match);
      showToast(
        'Student Located',
        `Found '${match.name}' (${match.rollNo}). Form has been populated.`,
        'success'
      );
    } else {
      showToast(
        'No Results',
        `No student matched query '${searchQuery}'.`,
        'warning'
      );
    }
  };

  // Reset to initial sample data
  const handleResetSampleData = () => {
    setStudents(INITIAL_SAMPLE_STUDENTS);
    handleClearInputs();
    setSearchQuery('');
    setSelectedDeptFilter('ALL');
    setSelectedResultFilter('ALL');
    showToast(
      'Sample Data Loaded',
      'Pre-populated with 5 diverse student records for demonstration.',
      'info'
    );
  };

  return (
    <div className="w-full bg-slate-900 text-slate-100 rounded-xl overflow-hidden shadow-2xl border border-slate-700/80">
      {/* Java Swing Desktop Window Frame Header */}
      <div className="bg-slate-800 px-4 py-2.5 flex items-center justify-between border-b border-slate-700 select-none">
        <div className="flex items-center gap-3">
          {/* OS Window Buttons */}
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block hover:opacity-80 transition cursor-pointer" title="Close Window" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block hover:opacity-80 transition cursor-pointer" title="Minimize" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block hover:opacity-80 transition cursor-pointer" title="Maximize" />
          </div>
          <div className="h-4 w-px bg-slate-600 mx-1" />
          <span className="text-xs font-semibold text-slate-200 tracking-wide font-mono">
            Student Management System (Java Swing GUI Application) [In-Memory Mode]
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="px-2 py-0.5 rounded bg-slate-700/60 font-mono text-[11px] text-amber-300 border border-amber-500/20">
            RAM ArrayList Storage
          </span>
        </div>
      </div>

      {/* Menu Bar (File, Edit, Students, Help) */}
      <div className="bg-slate-850 bg-slate-800/90 px-4 py-1.5 flex items-center gap-6 text-xs text-slate-300 border-b border-slate-700/80">
        <div className="flex items-center gap-5 font-medium">
          <button
            onClick={handleResetSampleData}
            className="hover:text-white transition-colors cursor-pointer"
          >
            File
          </button>
          <button
            onClick={handleClearInputs}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Clear Form
          </button>
          <button
            onClick={() => setShowStorageNoticeModal(true)}
            className="hover:text-white transition-colors cursor-pointer text-amber-300"
          >
            Storage Notice
          </button>
          <button
            onClick={() => setShowAboutModal(true)}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Help / About
          </button>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={handleResetSampleData}
            className="text-[11px] bg-slate-700 hover:bg-slate-600 text-slate-200 px-2.5 py-1 rounded transition-colors flex items-center gap-1.5 cursor-pointer font-medium"
          >
            <Sparkles className="w-3 h-3 text-sky-400" />
            Reload Sample Data
          </button>
        </div>
      </div>

      {/* In-Memory Warning Banner */}
      <div className="bg-amber-950/40 border-b border-amber-500/30 px-4 py-2 flex items-center justify-between text-xs text-amber-200">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Academic Submission Note:</strong> Operating in memory-only mode (<code className="font-mono bg-amber-900/60 px-1 py-0.5 rounded text-[11px]">ArrayList&lt;Student&gt;</code>) without external database. All student data resides in RAM.
          </span>
        </div>
        <button
          onClick={() => setShowStorageNoticeModal(true)}
          className="underline hover:text-amber-100 text-[11px] cursor-pointer shrink-0 ml-3"
        >
          Why no database?
        </button>
      </div>

      {/* Main Workspace (Split View: Form on Left, Dashboard & Table on Right) */}
      <div className="p-4 grid grid-cols-1 lg:grid-cols-12 gap-5 bg-slate-900">
        
        {/* LEFT COLUMN: Student Registration Form (4 cols on lg) */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-4">
          <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-700">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-400" />
                Student Registration Form
              </h3>
              {selectedRollNo && (
                <span className="text-[11px] font-mono text-amber-400 bg-amber-950/60 border border-amber-500/30 px-1.5 py-0.5 rounded">
                  Editing: {selectedRollNo}
                </span>
              )}
            </div>

            <div className="space-y-3 text-xs">
              {/* Roll Number & Name */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Roll Number <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CS101"
                    value={rollNo}
                    onChange={(e) => setRollNo(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Student Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Aarav Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              {/* Department & Year */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-slate-100 focus:outline-none focus:border-sky-500 text-xs truncate"
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Academic Year
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-slate-100 focus:outline-none focus:border-sky-500 text-xs"
                  >
                    {YEARS.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Phone Number (10 digits) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 9876543210"
                  value={phone}
                  maxLength={10}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>

              {/* Subject Marks Group */}
              <div className="pt-2 border-t border-slate-700">
                <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Subject Marks (Max 100 Each, Min 35 to Pass)
                </span>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-300 truncate text-[11px]">1. {SUBJECT_NAMES[0]}:</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="0-100"
                      value={sub1}
                      onChange={(e) => setSub1(e.target.value)}
                      className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-100 focus:outline-none focus:border-sky-500 text-right font-mono text-xs"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-300 truncate text-[11px]">2. {SUBJECT_NAMES[1]}:</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="0-100"
                      value={sub2}
                      onChange={(e) => setSub2(e.target.value)}
                      className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-100 focus:outline-none focus:border-sky-500 text-right font-mono text-xs"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-300 truncate text-[11px]">3. {SUBJECT_NAMES[2]}:</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="0-100"
                      value={sub3}
                      onChange={(e) => setSub3(e.target.value)}
                      className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-100 focus:outline-none focus:border-sky-500 text-right font-mono text-xs"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-300 truncate text-[11px]">4. {SUBJECT_NAMES[3]}:</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="0-100"
                      value={sub4}
                      onChange={(e) => setSub4(e.target.value)}
                      className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-100 focus:outline-none focus:border-sky-500 text-right font-mono text-xs"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-300 truncate text-[11px]">5. {SUBJECT_NAMES[4]}:</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="0-100"
                      value={sub5}
                      onChange={(e) => setSub5(e.target.value)}
                      className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-100 focus:outline-none focus:border-sky-500 text-right font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Live Preview Box */}
              <div className="bg-slate-900/90 border border-slate-700 rounded p-2.5 mt-2">
                <div className="text-[11px] font-semibold text-slate-400 mb-1.5 flex items-center justify-between">
                  <span>Calculated Performance (Live)</span>
                  {liveMetrics && (
                    <span className={liveMetrics.result === 'PASS' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      {liveMetrics.result} (Grade: {liveMetrics.grade})
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-slate-800/80 p-1.5 rounded border border-slate-700/60">
                    <span className="block text-[10px] text-slate-400">Total Marks</span>
                    <span className="text-xs font-bold text-white font-mono">
                      {liveMetrics ? `${liveMetrics.totalMarks} / 500` : '- / 500'}
                    </span>
                  </div>
                  <div className="bg-slate-800/80 p-1.5 rounded border border-slate-700/60">
                    <span className="block text-[10px] text-slate-400">Percentage</span>
                    <span className="text-xs font-bold text-sky-400 font-mono">
                      {liveMetrics ? `${liveMetrics.percentage}%` : '- %'}
                    </span>
                  </div>
                  <div className="bg-slate-800/80 p-1.5 rounded border border-slate-700/60">
                    <span className="block text-[10px] text-slate-400">Result</span>
                    <span className={`text-xs font-bold ${liveMetrics?.result === 'PASS' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {liveMetrics ? liveMetrics.result : '-'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Form Action Buttons (Add, Update, Delete, Clear) */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleAddStudent}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 px-3 rounded text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Add Student
                </button>

                <button
                  type="button"
                  onClick={handleUpdateStudent}
                  className="bg-amber-600 hover:bg-amber-500 text-white font-semibold py-2 px-3 rounded text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Update Details
                </button>

                <button
                  type="button"
                  onClick={handleDeleteRequest}
                  className="bg-rose-600 hover:bg-rose-500 text-white font-semibold py-2 px-3 rounded text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Student
                </button>

                <button
                  type="button"
                  onClick={handleClearInputs}
                  className="bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold py-2 px-3 rounded text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Clear Fields
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Statistics Cards + Search Bar + JTable (8 cols on lg) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          
          {/* Top 4 Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-800/90 border border-slate-700 rounded-lg p-3 text-center">
              <span className="block text-[11px] text-slate-400 font-medium">Total Enrolled</span>
              <span className="text-xl font-bold text-sky-400 font-mono tabular-nums">{stats.total}</span>
              <span className="block text-[10px] text-slate-400 mt-0.5">Students in RAM</span>
            </div>

            <div className="bg-slate-800/90 border border-slate-700 rounded-lg p-3 text-center">
              <span className="block text-[11px] text-slate-400 font-medium">Passed</span>
              <span className="text-xl font-bold text-emerald-400 font-mono tabular-nums">{stats.passed}</span>
              <span className="block text-[10px] text-emerald-400/80 mt-0.5">
                {stats.total > 0 ? `${Math.round((stats.passed / stats.total) * 100)}% Pass Rate` : '0%'}
              </span>
            </div>

            <div className="bg-slate-800/90 border border-slate-700 rounded-lg p-3 text-center">
              <span className="block text-[11px] text-slate-400 font-medium">Failed</span>
              <span className="text-xl font-bold text-rose-400 font-mono tabular-nums">{stats.failed}</span>
              <span className="block text-[10px] text-rose-400/80 mt-0.5">
                {stats.total > 0 ? `${Math.round((stats.failed / stats.total) * 100)}% Fail Rate` : '0%'}
              </span>
            </div>

            <div className="bg-slate-800/90 border border-slate-700 rounded-lg p-3 text-center">
              <span className="block text-[11px] text-slate-400 font-medium">Class Average</span>
              <span className="text-xl font-bold text-indigo-400 font-mono tabular-nums">{stats.avg}%</span>
              <span className="block text-[10px] text-slate-400 mt-0.5">Mean Score</span>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-3 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by Roll Number or Name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearchClick()}
                  className="w-full bg-slate-900 border border-slate-700 rounded pl-8 pr-2.5 py-1.5 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-sky-500 font-mono text-xs"
                />
              </div>
              <button
                type="button"
                onClick={handleSearchClick}
                className="bg-sky-600 hover:bg-sky-500 text-white font-medium px-3 py-1.5 rounded transition-colors cursor-pointer"
              >
                Search
              </button>
              {(searchQuery || selectedDeptFilter !== 'ALL' || selectedResultFilter !== 'ALL') && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedDeptFilter('ALL');
                    setSelectedResultFilter('ALL');
                  }}
                  className="text-slate-400 hover:text-slate-200 px-2 py-1.5 text-xs underline cursor-pointer"
                >
                  Reset Filters
                </button>
              )}
            </div>

            {/* Quick Filter dropdowns */}
            <div className="flex items-center gap-2">
              <select
                value={selectedResultFilter}
                onChange={(e) => setSelectedResultFilter(e.target.value as any)}
                className="bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-slate-300 text-xs focus:outline-none"
              >
                <option value="ALL">All Status</option>
                <option value="PASS">Passed Only</option>
                <option value="FAIL">Failed Only</option>
              </select>

              <select
                value={selectedDeptFilter}
                onChange={(e) => setSelectedDeptFilter(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-slate-300 text-xs focus:outline-none max-w-[150px] truncate"
              >
                <option value="ALL">All Depts</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* JTable Container */}
          <div className="bg-slate-800/90 border border-slate-700 rounded-lg overflow-hidden shadow-sm">
            <div className="px-4 py-2.5 bg-slate-850 bg-slate-800 border-b border-slate-700 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200">
                Registered Students JTable ({displayedStudents.length} Records)
              </span>
              <span className="text-slate-400 text-[11px]">
                Tip: Click any row to load into form • Double-click for Marksheet
              </span>
            </div>

            <div className="overflow-x-auto max-h-[380px]">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-900/90 text-slate-300 uppercase text-[10px] tracking-wider sticky top-0 border-b border-slate-700">
                  <tr>
                    <th className="py-2.5 px-3">Roll No</th>
                    <th className="py-2.5 px-3">Name</th>
                    <th className="py-2.5 px-3">Dept</th>
                    <th className="py-2.5 px-3">Year</th>
                    <th className="py-2.5 px-3">Phone</th>
                    <th className="py-2.5 px-3 text-right">Total (/500)</th>
                    <th className="py-2.5 px-3 text-right">Percentage</th>
                    <th className="py-2.5 px-3 text-center">Grade</th>
                    <th className="py-2.5 px-3 text-center">Result</th>
                    <th className="py-2.5 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60 font-sans">
                  {displayedStudents.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-8 text-center text-slate-400">
                        No students found matching current filters.
                      </td>
                    </tr>
                  ) : (
                    displayedStudents.map((student) => {
                      const isSelected = selectedRollNo === student.rollNo;
                      return (
                        <tr
                          key={student.rollNo}
                          onClick={() => handleSelectStudent(student)}
                          onDoubleClick={() => setMarksheetStudent(student)}
                          className={`cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-sky-950/60 text-white font-medium'
                              : 'hover:bg-slate-750 hover:bg-slate-700/50 text-slate-200'
                          }`}
                        >
                          <td className="py-2.5 px-3 font-mono font-semibold text-sky-300">
                            {student.rollNo}
                          </td>
                          <td className="py-2.5 px-3 font-medium text-slate-100">
                            {student.name}
                          </td>
                          <td className="py-2.5 px-3 text-slate-300 text-[11px] max-w-[140px] truncate" title={student.department}>
                            {student.department.replace(/\(.*\)/, '').trim()}
                          </td>
                          <td className="py-2.5 px-3 text-slate-300 text-[11px]">
                            {student.year}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-300 text-[11px]">
                            {student.phone}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-right tabular-nums text-slate-200 font-semibold">
                            {student.totalMarks}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-right tabular-nums text-sky-400 font-semibold">
                            {student.percentage}%
                          </td>
                          <td className="py-2.5 px-3 text-center font-mono font-bold">
                            <span className={student.grade === 'F' ? 'text-rose-400' : 'text-emerald-400'}>
                              {student.grade}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wide ${
                                student.result === 'PASS'
                                  ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-rose-950/80 text-rose-400 border border-rose-500/30'
                              }`}
                            >
                              {student.result}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setMarksheetStudent(student);
                              }}
                              className="text-xs text-sky-400 hover:text-sky-300 bg-sky-950/40 hover:bg-sky-900/60 border border-sky-500/30 px-2 py-0.5 rounded transition-colors"
                              title="View formal Marksheet"
                            >
                              Marksheet
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table Footer Instructions */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
            <span>Pass Threshold: &ge; 35 in each of the 5 subjects and &ge; 40% aggregate.</span>
            <span>Total records in memory: {students.length}</span>
          </div>

        </div>
      </div>

      {/* JOptionPane Style Toast Feedback Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm animate-fade-in shadow-2xl">
          <div
            className={`border rounded-lg p-3.5 flex items-start gap-3 backdrop-blur-md ${
              toast.type === 'success'
                ? 'bg-emerald-950/95 border-emerald-500 text-emerald-100'
                : toast.type === 'error'
                ? 'bg-rose-950/95 border-rose-500 text-rose-100'
                : toast.type === 'warning'
                ? 'bg-amber-950/95 border-amber-500 text-amber-100'
                : 'bg-slate-900/95 border-sky-500 text-slate-100'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {toast.type === 'error' && <XCircle className="w-5 h-5 text-rose-400" />}
              {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-sky-400" />}
            </div>
            <div className="flex-1 text-xs">
              <span className="font-bold block text-sm mb-0.5">{toast.title}</span>
              <p className="opacity-90 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => setToast(null)}
              className="text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* JOptionPane.showConfirmDialog Deletion Modal */}
      {deleteConfirmTarget && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-lg max-w-md w-full p-5 shadow-2xl animate-scale-up">
            <div className="flex items-center gap-3 mb-3 text-rose-400">
              <AlertTriangle className="w-6 h-6" />
              <h4 className="font-bold text-base text-white">Confirm Record Deletion</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Are you sure you want to permanently delete student with Roll Number{' '}
              <strong className="text-white font-mono bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700">
                {deleteConfirmTarget}
              </strong>
              ? This action will remove the record from Java in-memory ArrayList.
            </p>
            <div className="flex items-center justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setDeleteConfirmTarget(null)}
                className="bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium px-4 py-2 rounded transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="bg-rose-600 hover:bg-rose-500 text-white font-semibold px-4 py-2 rounded transition-colors cursor-pointer"
              >
                Yes, Delete Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Marksheet Modal (Formal College Grade Card) */}
      {marksheetStudent && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-xl max-w-xl w-full p-6 shadow-2xl border border-slate-200">
            {/* College Marksheet Header */}
            <div className="text-center border-b-2 border-slate-800 pb-4 mb-4">
              <span className="text-[11px] font-bold tracking-widest uppercase text-slate-500">
                Academic Progress & Performance Report
              </span>
              <h2 className="text-xl font-black text-slate-900 tracking-tight mt-0.5">
                STUDENT MARKSHEET
              </h2>
              <p className="text-xs text-slate-600">
                Department of Engineering & Computer Applications • Academic Session 2025-26
              </p>
            </div>

            {/* Student Info Details Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200 mb-4 font-mono">
              <div>
                <span className="text-slate-500">Roll Number:</span>{' '}
                <strong className="text-slate-900">{marksheetStudent.rollNo}</strong>
              </div>
              <div>
                <span className="text-slate-500">Student Name:</span>{' '}
                <strong className="text-slate-900">{marksheetStudent.name}</strong>
              </div>
              <div>
                <span className="text-slate-500">Department:</span>{' '}
                <strong className="text-slate-900">{marksheetStudent.department}</strong>
              </div>
              <div>
                <span className="text-slate-500">Academic Year:</span>{' '}
                <strong className="text-slate-900">{marksheetStudent.year}</strong>
              </div>
              <div className="col-span-2">
                <span className="text-slate-500">Phone Number:</span>{' '}
                <strong className="text-slate-900">{marksheetStudent.phone}</strong>
              </div>
            </div>

            {/* Subject Marks Breakdown Table */}
            <table className="w-full text-xs border border-slate-300 mb-4">
              <thead className="bg-slate-100 text-slate-800 font-semibold border-b border-slate-300">
                <tr>
                  <th className="p-2 text-left">Subject Code & Name</th>
                  <th className="p-2 text-center">Max Marks</th>
                  <th className="p-2 text-center">Min Pass</th>
                  <th className="p-2 text-right">Marks Obtained</th>
                  <th className="p-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono">
                {[
                  { name: SUBJECT_NAMES[0], mark: marksheetStudent.sub1 },
                  { name: SUBJECT_NAMES[1], mark: marksheetStudent.sub2 },
                  { name: SUBJECT_NAMES[2], mark: marksheetStudent.sub3 },
                  { name: SUBJECT_NAMES[3], mark: marksheetStudent.sub4 },
                  { name: SUBJECT_NAMES[4], mark: marksheetStudent.sub5 },
                ].map((s, idx) => (
                  <tr key={idx} className={s.mark < 35 ? 'bg-rose-50 text-rose-700' : ''}>
                    <td className="p-2 font-sans font-medium text-slate-800">
                      {idx + 1}. {s.name}
                    </td>
                    <td className="p-2 text-center">100</td>
                    <td className="p-2 text-center">35</td>
                    <td className="p-2 text-right font-bold">{s.mark}</td>
                    <td className="p-2 text-center font-bold">
                      {s.mark >= 35 ? (
                        <span className="text-emerald-600">PASS</span>
                      ) : (
                        <span className="text-rose-600">FAIL</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-300">
                <tr>
                  <td className="p-2">Grand Total</td>
                  <td className="p-2 text-center">500</td>
                  <td className="p-2 text-center">200</td>
                  <td className="p-2 text-right font-mono text-sm text-sky-800">
                    {marksheetStudent.totalMarks}
                  </td>
                  <td className="p-2 text-center">
                    <span
                      className={
                        marksheetStudent.result === 'PASS'
                          ? 'text-emerald-700'
                          : 'text-rose-700'
                      }
                    >
                      {marksheetStudent.result}
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>

            {/* Performance Metric Summary */}
            <div className="grid grid-cols-3 gap-3 text-center mb-5 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div>
                <span className="block text-[11px] text-slate-500 uppercase">
                  Aggregate Percentage
                </span>
                <span className="text-lg font-black font-mono text-slate-900">
                  {marksheetStudent.percentage}%
                </span>
              </div>
              <div>
                <span className="block text-[11px] text-slate-500 uppercase">
                  Grade Awarded
                </span>
                <span
                  className={`text-lg font-black font-mono ${
                    marksheetStudent.grade === 'F' ? 'text-rose-600' : 'text-emerald-600'
                  }`}
                >
                  {marksheetStudent.grade}
                </span>
              </div>
              <div>
                <span className="block text-[11px] text-slate-500 uppercase">
                  Final Decision
                </span>
                <span
                  className={`text-lg font-black tracking-wide ${
                    marksheetStudent.result === 'PASS' ? 'text-emerald-700' : 'text-rose-700'
                  }`}
                >
                  {marksheetStudent.result}
                </span>
              </div>
            </div>

            {/* Marksheet Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
              <span className="text-[11px] text-slate-500 italic">
                Generated via In-Memory ArrayList Store
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium py-1.5 px-3 rounded flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-300"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Marksheet
                </button>
                <button
                  type="button"
                  onClick={() => setMarksheetStudent(null)}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-1.5 px-4 rounded transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* About Project Dialog */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-lg max-w-md w-full p-5 shadow-2xl text-slate-200 text-xs">
            <div className="flex items-center justify-between border-b border-slate-700 pb-2 mb-3">
              <h4 className="font-bold text-sm text-white flex items-center gap-2">
                <Info className="w-4 h-4 text-sky-400" />
                About Student Management System
              </h4>
              <button
                onClick={() => setShowAboutModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 leading-relaxed">
              <p>
                <strong>Project:</strong> Student Management System (College Submission)
              </p>
              <p>
                <strong>Language:</strong> Java 8+ / Standard Edition
              </p>
              <p>
                <strong>GUI Toolkit:</strong> Java Swing (JFrame, JPanel, JTable, DefaultTableModel)
              </p>
              <p>
                <strong>Data Storage:</strong> In-memory <code className="font-mono bg-slate-900 px-1 py-0.5 rounded text-amber-300">ArrayList&lt;Student&gt;</code> without any external database.
              </p>
              <p>
                <strong>Architecture:</strong> Model-View-Controller (MVC) with clean encapsulation, validation routines, and OOP design.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-700 text-right">
              <button
                type="button"
                onClick={() => setShowAboutModal(false)}
                className="bg-sky-600 hover:bg-sky-500 text-white font-medium px-4 py-1.5 rounded transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Storage Information Dialog */}
      {showStorageNoticeModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-lg max-w-md w-full p-5 shadow-2xl text-slate-200 text-xs">
            <div className="flex items-center justify-between border-b border-slate-700 pb-2 mb-3">
              <h4 className="font-bold text-sm text-amber-300 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                Why No Database? (Academic Design)
              </h4>
              <button
                onClick={() => setShowStorageNoticeModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2.5 leading-relaxed text-slate-300">
              <p>
                This project was specifically designed to meet the college requirement of:
                <strong className="text-white block mt-1">
                  &ldquo;Application Type: Desktop GUI Application &bull; Database: Without database &bull; Store records in memory via ArrayList&rdquo;
                </strong>
              </p>
              <p>
                <strong>Why this is important for college evaluation:</strong>
              </p>
              <ul className="list-disc pl-4 space-y-1 text-slate-300">
                <li>Demonstrates mastery of Java Collections Framework (<code className="text-amber-300 font-mono">ArrayList</code>).</li>
                <li>Zero external dependencies: Examiners can run the project on any computer with only JDK installed—no need to install MySQL or configure JDBC drivers.</li>
                <li>Fast and lightweight execution entirely in RAM.</li>
              </ul>
              <div className="bg-amber-950/60 border border-amber-500/30 p-2.5 rounded text-amber-200 text-[11px]">
                <strong>Examiner Note:</strong> When the application window closes, the JVM shuts down and all entered student records in RAM are reclaimed. This is the expected and correct behavior for non-database in-memory projects.
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-700 text-right">
              <button
                type="button"
                onClick={() => setShowStorageNoticeModal(false)}
                className="bg-amber-600 hover:bg-amber-500 text-white font-medium px-4 py-1.5 rounded transition-colors"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
