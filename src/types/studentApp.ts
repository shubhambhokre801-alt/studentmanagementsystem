export interface SubjectGrade {
  code: string;
  name: string;
  credits: number;
  marks: number; // 0 - 100
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D' | 'F';
  gradePoint: number; // 0 - 10
}

export interface AttendanceRecord {
  totalClasses: number;
  attendedClasses: number;
  percentage: number;
  status: 'Good' | 'Warning' | 'Critical'; // >= 75% Good, 65-74% Warning, <65% Critical
}

export interface FeeRecord {
  totalFee: number;
  paidFee: number;
  dueFee: number;
  status: 'Paid' | 'Partial' | 'Overdue';
  dueDate: string;
}

export interface Student {
  id: string;
  rollNo: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  semester: string;
  academicYear: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  status: 'Active' | 'On Leave' | 'Suspended' | 'Graduated';
  avatarSeed: string;
  guardianName: string;
  guardianPhone: string;
  address: string;
  city: string;
  cgpa: number; // 0.0 - 10.0
  subjects: SubjectGrade[];
  attendance: AttendanceRecord;
  fee: FeeRecord;
  enrolledDate: string;
}

export const DEPARTMENTS = [
  'Computer Science & Engineering',
  'Information Technology',
  'Data Science & AI',
  'Electronics & Communication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Business Administration',
] as const;

export const SEMESTERS = [
  'Semester 1',
  'Semester 2',
  'Semester 3',
  'Semester 4',
  'Semester 5',
  'Semester 6',
  'Semester 7',
  'Semester 8',
] as const;

export const DEFAULT_SUBJECTS: Omit<SubjectGrade, 'marks' | 'grade' | 'gradePoint'>[] = [
  { code: 'CS301', name: 'Data Structures & Algorithms', credits: 4 },
  { code: 'CS302', name: 'Database Management Systems', credits: 4 },
  { code: 'CS303', name: 'Computer Networks', credits: 3 },
  { code: 'CS304', name: 'Operating Systems', credits: 3 },
  { code: 'CS305', name: 'Software Engineering', credits: 3 },
];

export function calculateGrade(marks: number): { grade: SubjectGrade['grade']; gradePoint: number } {
  if (marks >= 90) return { grade: 'A+', gradePoint: 10 };
  if (marks >= 80) return { grade: 'A', gradePoint: 9 };
  if (marks >= 70) return { grade: 'B+', gradePoint: 8 };
  if (marks >= 60) return { grade: 'B', gradePoint: 7 };
  if (marks >= 50) return { grade: 'C', gradePoint: 6 };
  if (marks >= 40) return { grade: 'D', gradePoint: 5 };
  return { grade: 'F', gradePoint: 0 };
}

export function calculateCgpa(subjects: SubjectGrade[]): number {
  if (!subjects.length) return 0;
  const totalPoints = subjects.reduce((acc, sub) => acc + sub.gradePoint * sub.credits, 0);
  const totalCredits = subjects.reduce((acc, sub) => acc + sub.credits, 0);
  return totalCredits > 0 ? Math.round((totalPoints / totalCredits) * 100) / 100 : 0;
}
