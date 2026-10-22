import React, { useState } from 'react';
import {
  Student,
  DEPARTMENTS,
  SEMESTERS,
  DEFAULT_SUBJECTS,
  calculateGrade,
  calculateCgpa,
  SubjectGrade,
} from '../types/studentApp';
import { X, User, GraduationCap, ShieldCheck, DollarSign, AlertCircle } from 'lucide-react';

interface StudentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (student: Student) => void;
  studentToEdit?: Student | null;
  existingRollNumbers: string[];
}

export const StudentFormModal: React.FC<StudentFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  studentToEdit,
  existingRollNumbers,
}) => {
  if (!isOpen) return null;

  const isEditing = Boolean(studentToEdit);

  // Form State
  const [activeTab, setActiveTab] = useState<'basic' | 'academic' | 'guardian' | 'fee'>('basic');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Basic Information
  const [rollNo, setRollNo] = useState(studentToEdit?.rollNo || '');
  const [name, setName] = useState(studentToEdit?.name || '');
  const [email, setEmail] = useState(studentToEdit?.email || '');
  const [phone, setPhone] = useState(studentToEdit?.phone || '');
  const [department, setDepartment] = useState(studentToEdit?.department || DEPARTMENTS[0]);
  const [semester, setSemester] = useState(studentToEdit?.semester || SEMESTERS[0]);
  const [gender, setGender] = useState<Student['gender']>(studentToEdit?.gender || 'Male');
  const [dateOfBirth, setDateOfBirth] = useState(studentToEdit?.dateOfBirth || '2004-01-01');
  const [status, setStatus] = useState<Student['status']>(studentToEdit?.status || 'Active');

  // Guardian & Address
  const [guardianName, setGuardianName] = useState(studentToEdit?.guardianName || '');
  const [guardianPhone, setGuardianPhone] = useState(studentToEdit?.guardianPhone || '');
  const [city, setCity] = useState(studentToEdit?.city || '');
  const [address, setAddress] = useState(studentToEdit?.address || '');

  // Academic Marks
  const [marks, setMarks] = useState<number[]>(
    studentToEdit?.subjects.map((s) => s.marks) || [85, 80, 75, 78, 82]
  );

  // Attendance
  const [attendedClasses, setAttendedClasses] = useState<number>(
    studentToEdit?.attendance.attendedClasses ?? 105
  );
  const [totalClasses, setTotalClasses] = useState<number>(
    studentToEdit?.attendance.totalClasses ?? 120
  );

  // Fees
  const [totalFee, setTotalFee] = useState<number>(studentToEdit?.fee.totalFee ?? 65000);
  const [paidFee, setPaidFee] = useState<number>(studentToEdit?.fee.paidFee ?? 65000);
  const [dueDate, setDueDate] = useState<string>(studentToEdit?.fee.dueDate || '2026-11-30');

  const handleMarkChange = (index: number, val: string) => {
    const num = Math.min(100, Math.max(0, parseInt(val, 10) || 0));
    setMarks((prev) => {
      const copy = [...prev];
      copy[index] = num;
      return copy;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanRollNo = rollNo.trim().toUpperCase();
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    if (!cleanRollNo) {
      setErrorMsg('Roll Number is mandatory.');
      setActiveTab('basic');
      return;
    }

    if (!isEditing || cleanRollNo !== studentToEdit?.rollNo.toUpperCase()) {
      if (existingRollNumbers.includes(cleanRollNo)) {
        setErrorMsg(`Roll Number '${cleanRollNo}' is already taken by another student.`);
        setActiveTab('basic');
        return;
      }
    }

    if (!cleanName) {
      setErrorMsg('Student Name is mandatory.');
      setActiveTab('basic');
      return;
    }

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMsg('A valid email address is required.');
      setActiveTab('basic');
      return;
    }

    if (!cleanPhone || cleanPhone.length < 7) {
      setErrorMsg('A valid phone number is required.');
      setActiveTab('basic');
      return;
    }

    const computedSubjects: SubjectGrade[] = DEFAULT_SUBJECTS.map((sub, i) => {
      const mark = marks[i] ?? 0;
      const { grade, gradePoint } = calculateGrade(mark);
      return {
        ...sub,
        marks: mark,
        grade,
        gradePoint,
      };
    });

    const cgpa = calculateCgpa(computedSubjects);

    const safeTotalClasses = Math.max(1, totalClasses);
    const safeAttended = Math.min(safeTotalClasses, Math.max(0, attendedClasses));
    const attPct = Math.round((safeAttended / safeTotalClasses) * 100);
    const attStatus: Student['attendance']['status'] =
      attPct >= 75 ? 'Good' : attPct >= 65 ? 'Warning' : 'Critical';

    const safeTotalFee = Math.max(0, totalFee);
    const safePaidFee = Math.max(0, paidFee);
    const dueFee = Math.max(0, safeTotalFee - safePaidFee);
    const feeStatus: Student['fee']['status'] =
      dueFee <= 0 ? 'Paid' : safePaidFee > 0 ? 'Partial' : 'Overdue';

    const semNumber = parseInt(semester.replace(/\D/g, ''), 10) || 1;
    const academicYear = `${Math.ceil(semNumber / 2)}${
      Math.ceil(semNumber / 2) === 1
        ? 'st'
        : Math.ceil(semNumber / 2) === 2
        ? 'nd'
        : Math.ceil(semNumber / 2) === 3
        ? 'rd'
        : 'th'
    } Year`;

    const savedStudent: Student = {
      id: studentToEdit?.id || `stu-${Date.now()}`,
      rollNo: cleanRollNo,
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      department,
      semester,
      academicYear,
      dateOfBirth,
      gender,
      status,
      avatarSeed: cleanName.toLowerCase().replace(/\s+/g, '-'),
      guardianName: guardianName.trim() || 'Parent/Guardian',
      guardianPhone: guardianPhone.trim() || cleanPhone,
      address: address.trim() || 'Campus Residential Hostel, Sector 2',
      city: city.trim() || 'Metro City',
      cgpa,
      subjects: computedSubjects,
      attendance: {
        totalClasses: safeTotalClasses,
        attendedClasses: safeAttended,
        percentage: attPct,
        status: attStatus,
      },
      fee: {
        totalFee: safeTotalFee,
        paidFee: safePaidFee,
        dueFee,
        status: feeStatus,
        dueDate,
      },
      enrolledDate: studentToEdit?.enrolledDate || new Date().toISOString().split('T')[0],
    };

    onSave(savedStudent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl animate-fade-in my-8 text-slate-800 dark:text-slate-100">
        {/* Modal Header */}
        <div className="bg-slate-50 dark:bg-slate-800 px-6 py-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-700">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-600 dark:text-sky-400" />
              {isEditing ? `Edit Student: ${studentToEdit?.name}` : 'Register New Student'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Fill in student personal details, academic grades, attendance, and fee status.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('basic')}
            className={`pb-2.5 px-3 font-medium transition-colors cursor-pointer border-b-2 ${
              activeTab === 'basic'
                ? 'border-indigo-600 text-indigo-600 dark:border-sky-500 dark:text-sky-400 font-semibold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            1. Basic & Personal
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('academic')}
            className={`pb-2.5 px-3 font-medium transition-colors cursor-pointer border-b-2 ${
              activeTab === 'academic'
                ? 'border-indigo-600 text-indigo-600 dark:border-sky-500 dark:text-sky-400 font-semibold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            2. Academic Grades
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('guardian')}
            className={`pb-2.5 px-3 font-medium transition-colors cursor-pointer border-b-2 ${
              activeTab === 'guardian'
                ? 'border-indigo-600 text-indigo-600 dark:border-sky-500 dark:text-sky-400 font-semibold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            3. Guardian & Address
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('fee')}
            className={`pb-2.5 px-3 font-medium transition-colors cursor-pointer border-b-2 ${
              activeTab === 'fee'
                ? 'border-indigo-600 text-indigo-600 dark:border-sky-500 dark:text-sky-400 font-semibold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            4. Attendance & Fees
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-500/40 rounded-lg flex items-center gap-2 text-rose-700 dark:text-rose-200 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Modal Form */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 max-h-[58vh] overflow-y-auto space-y-4 text-xs">
            {/* TAB 1: BASIC INFORMATION */}
            {activeTab === 'basic' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                      Roll Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. CS2024-001"
                      value={rollNo}
                      onChange={(e) => setRollNo(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-600 dark:focus:border-sky-500 font-mono text-xs uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                      Student Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Aarav Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-600 dark:focus:border-sky-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="student@campus.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-600 dark:focus:border-sky-500 text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                      Contact Phone <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="10-digit mobile"
                      value={phone}
                      maxLength={10}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-600 dark:focus:border-sky-500 font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                      Department
                    </label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-600 dark:focus:border-sky-500 text-xs"
                    >
                      {DEPARTMENTS.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                      Semester
                    </label>
                    <select
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-600 dark:focus:border-sky-500 text-xs"
                    >
                      {SEMESTERS.map((sem) => (
                        <option key={sem} value={sem}>
                          {sem}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as any)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-600 dark:focus:border-sky-500 text-xs"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-600 dark:focus:border-sky-500 text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Enrollment Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-600 dark:focus:border-sky-500 text-xs"
                    >
                      <option value="Active">Active</option>
                      <option value="On Leave">On Leave</option>
                      <option value="Suspended">Suspended</option>
                      <option value="Graduated">Graduated</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: ACADEMIC GRADES */}
            {activeTab === 'academic' && (
              <div className="space-y-4">
                <div className="p-3 bg-slate-100 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Semester Core Subjects Evaluation</span>
                  <span className="text-xs font-mono text-indigo-600 dark:text-sky-400 font-bold">
                    Est. CGPA:{' '}
                    {calculateCgpa(
                      DEFAULT_SUBJECTS.map((s, i) => ({
                        ...s,
                        marks: marks[i],
                        ...calculateGrade(marks[i]),
                      }))
                    )}{' '}
                    / 10.0
                  </span>
                </div>

                <div className="space-y-2.5">
                  {DEFAULT_SUBJECTS.map((sub, idx) => {
                    const mark = marks[idx] || 0;
                    const { grade, gradePoint } = calculateGrade(mark);
                    return (
                      <div
                        key={sub.code}
                        className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between gap-4"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-indigo-600 dark:text-sky-400 font-bold">{sub.code}</span>
                            <span className="text-slate-800 dark:text-slate-200 font-medium truncate">{sub.name}</span>
                          </div>
                          <span className="text-[11px] text-slate-400">Credits: {sub.credits}</span>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right">
                            <span className="block text-[10px] text-slate-400">Grade / Points</span>
                            <span className="font-mono font-bold text-xs text-slate-700 dark:text-slate-200">
                              {grade} ({gradePoint} pts)
                            </span>
                          </div>
                          <div>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={mark}
                              onChange={(e) => handleMarkChange(idx, e.target.value)}
                              className="w-20 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-right text-slate-900 dark:text-slate-100 font-mono text-xs focus:border-indigo-600 dark:focus:border-sky-500 focus:outline-none"
                            />
                            <span className="text-[10px] text-slate-400 block text-right mt-0.5">/ 100</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: GUARDIAN & ADDRESS */}
            {activeTab === 'guardian' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Guardian / Parent Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Sharma"
                      value={guardianName}
                      onChange={(e) => setGuardianName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-600 dark:focus:border-sky-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Guardian Emergency Phone</label>
                    <input
                      type="tel"
                      placeholder="10-digit number"
                      value={guardianPhone}
                      maxLength={10}
                      onChange={(e) => setGuardianPhone(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-600 dark:focus:border-sky-500 font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">City / Town</label>
                    <input
                      type="text"
                      placeholder="e.g. Bangalore"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-600 dark:focus:border-sky-500 text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Residential Address</label>
                    <textarea
                      rows={2}
                      placeholder="Street, locality, pin code..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-600 dark:focus:border-sky-500 text-xs resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: ATTENDANCE & FEES */}
            {activeTab === 'fee' && (
              <div className="space-y-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    Attendance Record
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 text-[11px] mb-1">Attended Classes</label>
                      <input
                        type="number"
                        min="0"
                        value={attendedClasses}
                        onChange={(e) => setAttendedClasses(parseInt(e.target.value, 10) || 0)}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded px-3 py-1.5 text-slate-900 dark:text-slate-100 font-mono text-xs focus:outline-none focus:border-indigo-600 dark:focus:border-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 text-[11px] mb-1">Total Classes Held</label>
                      <input
                        type="number"
                        min="1"
                        value={totalClasses}
                        onChange={(e) => setTotalClasses(parseInt(e.target.value, 10) || 1)}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded px-3 py-1.5 text-slate-900 dark:text-slate-100 font-mono text-xs focus:outline-none focus:border-indigo-600 dark:focus:border-sky-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-amber-500" />
                    Academic Tuition & Fees
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 text-[11px] mb-1">Total Semester Fee ($)</label>
                      <input
                        type="number"
                        min="0"
                        value={totalFee}
                        onChange={(e) => setTotalFee(parseInt(e.target.value, 10) || 0)}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded px-3 py-1.5 text-slate-900 dark:text-slate-100 font-mono text-xs focus:outline-none focus:border-indigo-600 dark:focus:border-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 text-[11px] mb-1">Paid Amount ($)</label>
                      <input
                        type="number"
                        min="0"
                        value={paidFee}
                        onChange={(e) => setPaidFee(parseInt(e.target.value, 10) || 0)}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded px-3 py-1.5 text-slate-900 dark:text-slate-100 font-mono text-xs focus:outline-none focus:border-indigo-600 dark:focus:border-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 text-[11px] mb-1">Payment Due Date</label>
                      <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded px-3 py-1.5 text-slate-900 dark:text-slate-100 font-mono text-xs focus:outline-none focus:border-indigo-600 dark:focus:border-sky-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="bg-slate-50 dark:bg-slate-800 px-6 py-3.5 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-sky-600 dark:hover:bg-sky-500 rounded-lg transition-colors cursor-pointer shadow-sm"
              >
                {isEditing ? 'Save Changes' : 'Register Student'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
