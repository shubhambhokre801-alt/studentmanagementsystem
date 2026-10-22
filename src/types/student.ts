export interface StudentRecord {
  rollNo: string;
  name: string;
  department: string;
  year: string;
  phone: string;
  sub1: number; // Java Programming
  sub2: number; // Data Structures & Algorithms
  sub3: number; // Database Management Systems
  sub4: number; // Operating Systems
  sub5: number; // Computer Networks
  totalMarks: number;
  percentage: number;
  result: 'PASS' | 'FAIL';
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
}

export const SUBJECT_NAMES = [
  'Java Programming',
  'Data Structures & Algorithms',
  'Database Management Systems',
  'Operating Systems',
  'Computer Networks',
] as const;

export const DEPARTMENTS = [
  'Computer Science & Engineering (CSE)',
  'Information Technology (IT)',
  'Electronics & Communication (ECE)',
  'Mechanical Engineering (ME)',
  'Civil Engineering (CE)',
  'Electrical Engineering (EE)',
] as const;

export const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'] as const;

export function calculateStudentMetrics(
  sub1: number,
  sub2: number,
  sub3: number,
  sub4: number,
  sub5: number
): { totalMarks: number; percentage: number; result: 'PASS' | 'FAIL'; grade: StudentRecord['grade'] } {
  const totalMarks = sub1 + sub2 + sub3 + sub4 + sub5;
  const percentage = Math.round((totalMarks / 5.0) * 100) / 100;
  
  // Pass criterion: minimum 35 marks in each subject and minimum 40% overall
  const hasFailedSubject = [sub1, sub2, sub3, sub4, sub5].some(mark => mark < 35);
  const result: 'PASS' | 'FAIL' = !hasFailedSubject && percentage >= 40 ? 'PASS' : 'FAIL';

  let grade: StudentRecord['grade'] = 'F';
  if (result === 'FAIL') {
    grade = 'F';
  } else if (percentage >= 90) {
    grade = 'A+';
  } else if (percentage >= 80) {
    grade = 'A';
  } else if (percentage >= 70) {
    grade = 'B';
  } else if (percentage >= 60) {
    grade = 'C';
  } else {
    grade = 'D';
  }

  return { totalMarks, percentage, result, grade };
}
