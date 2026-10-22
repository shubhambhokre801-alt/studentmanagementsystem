import { StudentRecord, calculateStudentMetrics } from '../types/student';

function createSample(
  rollNo: string,
  name: string,
  department: string,
  year: string,
  phone: string,
  sub1: number,
  sub2: number,
  sub3: number,
  sub4: number,
  sub5: number
): StudentRecord {
  const metrics = calculateStudentMetrics(sub1, sub2, sub3, sub4, sub5);
  return {
    rollNo,
    name,
    department,
    year,
    phone,
    sub1,
    sub2,
    sub3,
    sub4,
    sub5,
    ...metrics,
  };
}

export const INITIAL_SAMPLE_STUDENTS: StudentRecord[] = [
  createSample('CS101', 'Aarav Sharma', 'Computer Science & Engineering (CSE)', '3rd Year', '9876543210', 92, 88, 95, 89, 94),
  createSample('CS102', 'Priya Patel', 'Computer Science & Engineering (CSE)', '3rd Year', '9823456789', 78, 82, 85, 74, 80),
  createSample('IT201', 'Rohan Verma', 'Information Technology (IT)', '2nd Year', '9123456780', 65, 70, 68, 62, 74),
  createSample('EC305', 'Ananya Iyer', 'Electronics & Communication (ECE)', '4th Year', '9988776655', 88, 91, 84, 86, 90),
  createSample('ME402', 'Vikram Singh', 'Mechanical Engineering (ME)', '1st Year', '9765432109', 32, 45, 52, 40, 48), // Failed sub1 (<35)
];
