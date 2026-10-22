export interface ReportSection {
  id: string;
  number: string;
  title: string;
  content: string;
  subsections?: { title: string; text: string }[];
}

export const COLLEGE_REPORT = {
  projectTitle: 'Student Management System',
  academicYear: '2025 - 2026',
  courseName: 'Bachelor of Technology (B.Tech / B.E / BCA / B.Sc Computer Science)',
  subjectName: 'Object-Oriented Programming with Java & GUI Development',
  abstract: `The Student Management System is an interactive Desktop Graphical User Interface (GUI) application developed in Java using the Swing and AWT frameworks. The project addresses the academic need for an intuitive, lightweight administrative tool to register, view, search, update, calculate performance metrics, and manage student academic records. Operating without an external database, the application utilizes Java's built-in ArrayList data structure to manage records dynamically in computer memory (RAM). The system enforces data integrity through comprehensive input validation (preventing duplicate roll numbers, checking 10-digit mobile numbers, and bounding marks between 0 and 100), calculates total marks, percentage, letter grades, and evaluates pass/fail status in real-time. This project demonstrates core Object-Oriented Programming (OOP) paradigms including Encapsulation, Abstraction, and Event-Driven UI Architecture.`,
  
  sections: [
    {
      id: 'intro',
      number: '1',
      title: 'Introduction & Background',
      content: `In educational institutions such as schools and colleges, managing student profiles, contact information, and academic marks is a fundamental administrative responsibility. Traditional paper-based registers or fragmented manual ledgers are susceptible to human calculation errors, record loss, and slow lookups.

The "Student Management System" is a desktop-based software solution designed to streamline student data processing. Developed using Java Swing, it provides an intuitive, colorful graphical interface that allows academic administrators, professors, and lab instructors to add new students, browse all registered students in a formatted tabular grid, perform instant search by unique Roll Number, edit student details, and remove obsolete records.

This project specifically adheres to an in-memory architecture (without external database dependencies), making it self-contained, lightweight, easily portable, and optimal for beginner Java learners and academic demonstrations.`,
    },
    {
      id: 'objectives',
      number: '2',
      title: 'Project Objectives',
      content: `The primary objectives of the Student Management System are:
• To build a user-friendly, responsive desktop GUI application using Java Swing.
• To implement CRUD (Create, Read, Update, Delete) operations on student records without requiring SQL database configurations or external drivers.
• To implement the Java Collections Framework (specifically ArrayList<Student>) to store and manipulate objects dynamically in RAM.
• To automate academic performance calculations, including Total Marks (out of 500), Percentage (%), Letter Grade assignment (A+, A, B, C, D, F), and Pass/Fail evaluation.
• To enforce strict validation rules:
   - Prevent duplicate Roll Numbers.
   - Enforce mandatory non-empty inputs.
   - Restrict subject marks to valid numerical ranges (0 to 100).
   - Verify valid 10-digit telephone numbers.
• To apply fundamental Object-Oriented Programming principles: Encapsulation (private fields with public getters/setters), Modular Class Design, and Event-Driven Programming with ActionListeners.`,
    },
    {
      id: 'requirements',
      number: '3',
      title: 'System Requirements (Software & Hardware)',
      content: `The application is designed to be highly lightweight and platform-independent due to Java's "Write Once, Run Anywhere" (WORA) philosophy.

A. Software Requirements:
• Operating System: Windows 10/11, macOS, or Linux (Ubuntu, Debian, Fedora, etc.)
• Programming Language: Java (Standard Edition)
• Java Development Kit: JDK 8 or higher (JDK 11, 17, or 21 LTS recommended)
• GUI Library: Java Swing (javax.swing.*) and Abstract Window Toolkit (java.awt.*) - Included in standard JDK!
• IDE / Editor (Any of the following):
   - Notepad / TextEdit with Command Prompt (for quick runs)
   - Visual Studio Code with Java Extension Pack
   - IntelliJ IDEA Community Edition
   - Eclipse IDE for Java Developers
• Database: None (Operates in-memory using RAM storage)

B. Hardware Requirements:
• Processor: Intel Core i3 / AMD Ryzen 3 or higher (or equivalent Apple Silicon M-series)
• RAM: Minimum 2 GB (4 GB or 8 GB recommended)
• Storage: 50 MB free disk space for JDK and project files
• Display: 1366 x 768 minimum screen resolution (Fits standard laptop displays)`,
    },
    {
      id: 'design',
      number: '4',
      title: 'System Architecture & Class Design',
      content: `The system follows the Model-View-Controller (MVC) architectural pattern:

1. Model Layer (Student.java):
   - Represents the core Student entity.
   - Encapsulates private fields: rollNo, name, department, year, phoneNumber, mark1, mark2, mark3, mark4, mark5.
   - Provides public getters and setters to maintain data integrity.
   - Contains business logic methods: calculateTotalMarks(), calculatePercentage(), getResult(), and getGrade().

2. Controller / Service Layer (StudentManager.java):
   - Manages the internal ArrayList<Student> collection.
   - Methods:
     • boolean addStudent(Student s): Appends a student after verifying roll number uniqueness.
     • boolean isRollNoExists(String rollNo): Checks for duplication.
     • ArrayList<Student> getAllStudents(): Returns all current records.
     • Student searchByRollNo(String rollNo): Performs linear search.
     • boolean updateStudent(String rollNo, Student updated): Modifies existing student details.
     • boolean deleteStudent(String rollNo): Removes record from the collection.
     • int getTotalCount(), getPassCount(), getFailCount(), getAveragePercentage(): Computes summary statistics.

3. View / Presentation Layer (StudentManagementApp.java):
   - Built with Java Swing extending JFrame.
   - Left side: Form Panel with JTextFields, JComboBoxes, and action buttons (Add, Update, Delete, Clear).
   - Right side: Summary Metric Cards + Search Bar + JTable embedded inside JScrollPane.
   - Custom Cell Renderer: Displays "PASS" in green text and "FAIL" in red text for clear visual feedback.`,
    },
    {
      id: 'features',
      number: '5',
      title: 'Detailed Functional Modules',
      content: `1. Add Student Module:
   Allows administrators to register a new student with their Roll Number, Full Name, Department, Year, 10-digit Phone, and marks in 5 core subjects (Java, DSA, DBMS, OS, Computer Networks). Validates inputs before inserting into memory.

2. View All Students Module:
   Displays all active student records in a formatted JTable with columns for Roll No, Name, Department, Year, Phone, Total Marks (/500), Percentage, Grade, and Result. Selecting any row instantly transfers data to the input form.

3. Search by Roll Number Module:
   Enables users to enter a specific Roll Number. The system scans the ArrayList and displays the matching record in the table while loading details into the input fields for immediate inspection or editing.

4. Update Student Module:
   Allows administrators to modify personal details, department, year, phone number, or subject marks for an existing Roll Number. The unique Roll Number is preserved to maintain identity integrity.

5. Delete Student Module:
   Removes a student record from the in-memory ArrayList. Includes an interactive confirmation dialog (JOptionPane.showConfirmDialog) to prevent accidental deletions.

6. Grade & Pass/Fail Calculation Module:
   - Total Marks = Sum of 5 subjects (Max: 500).
   - Percentage = Total Marks / 5.0.
   - Passing Criterion: Minimum 35 marks in every individual subject AND overall percentage >= 40.0%. If any subject is below 35, the result is flagged as FAIL with Grade 'F'.
   - Grades: A+ (>=90%), A (80-89%), B (70-79%), C (60-69%), D (40-59%), F (<40% or failed subject).

7. Clear Form & Reset Module:
   Wipes input fields and resets calculation labels so users can input a new student quickly without manual backspacing.`,
    },
    {
      id: 'working',
      number: '6',
      title: 'Working of the System',
      content: `The typical user interaction workflow proceeds as follows:

1. Application Launch:
   The main() method invokes SwingUtilities.invokeLater() to ensure the GUI is built safely on the Event Dispatch Thread (EDT). The JFrame is initialized and centered on screen. Initial sample data is loaded into the ArrayList to provide immediate visual feedback.

2. Adding a Record:
   The user enters student details into the registration form. When the "Add Student" button is clicked, an ActionListener triggers the validation pipeline. If validation passes and the Roll Number is unique, a new Student object is instantiated and added to the ArrayList. The JTable and statistics cards refresh automatically.

3. Searching & Updating:
   When searching by Roll Number, the linear search algorithm iterates over the ArrayList. If found, the table displays the isolated result, and fields populate. The user modifies necessary values (e.g., re-evaluating marks) and clicks "Update Details".

4. Deletion:
   The user selects a student and clicks "Delete Student". A confirmation prompt appears. Upon user agreement, the element is removed from the ArrayList, and the table repopulates.`,
    },
    {
      id: 'advantages-limitations',
      number: '7',
      title: 'Advantages & Limitations (In-Memory Analysis)',
      content: `A. Advantages of the System:
• Zero Configuration: Requires no MySQL server, PostgreSQL setup, or external JDBC drivers. Runs out-of-the-box on any computer with Java installed.
• Blazing Fast Speed: All read and write operations take place directly in the computer's Random Access Memory (RAM), resulting in instantaneous response times without network or disk I/O latency.
• Clean & Beginner-Friendly: The codebase is well-structured and easy for students to understand, modify, and defend during viva examinations.
• Platform Independent: Works identically on Windows, Linux, and macOS.
• Interactive & Colorful: Modern color-coded buttons, formatted table headers, and status cards make it visually appealing.

B. Limitations & The "Without Database" Factor:
• Memory Volatility (Data Loss on Exit):
  BECAUSE NO EXTERNAL DATABASE (LIKE MYSQL) OR PERMANENT FILE STORAGE IS USED, ALL RECORDS RESIDE TEMPORARILY IN RAM. WHEN THE DESKTOP APPLICATION IS CLOSED OR THE SYSTEM IS POWERED OFF, THE ARRAYLIST IS CLEARED BY THE JAVA GARBAGE COLLECTOR, AND ALL ENTERED DATA IS LOST.
• Scalability Limit:
  While ArrayList is ideal for hundreds or thousands of student records in a college department demo, managing millions of records in RAM would consume substantial heap memory.
• Single User Only:
  Without a centralized server or database, records cannot be concurrently accessed or edited across multiple network devices.`,
    },
    {
      id: 'future-scope',
      number: '8',
      title: 'Future Enhancements',
      content: `If this project is expanded into a full enterprise software in the future, the following enhancements could be incorporated:
1. Database Integration: Connecting to MySQL or SQLite using JDBC (Java Database Connectivity) for permanent storage.
2. File Export: Exporting student marksheets to PDF using iText library or saving reports as CSV / Excel sheets.
3. User Authentication: Role-based login system for Administrators, Teachers, and Students with hashed passwords.
4. Attendance Tracking: Adding daily attendance logs alongside academic marks.
5. Email / SMS Alerts: Automated notifications sent to parents regarding student grades and attendance.`,
    },
    {
      id: 'conclusion',
      number: '9',
      title: 'Conclusion',
      content: `The Student Management System successfully demonstrates how Java Swing can be utilized to construct an attractive, intuitive desktop application for academic administration. By employing the ArrayList collection class, the project eliminates the complexity of database administration while maintaining complete CRUD functionality, duplicate prevention, and automated academic calculations.

The project demonstrates core Java competencies: Object-Oriented Design, Encapsulation, Exception Handling, Event-Driven Programming, and Graphical User Interface construction. It serves as an exemplary college laboratory submission that effectively balances technical depth with beginner-friendly accessibility.`,
    }
  ]
};
