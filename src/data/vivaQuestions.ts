export interface VivaItem {
  id: number;
  question: string;
  category: 'Java Core' | 'Swing & GUI' | 'Collections & Memory' | 'Project Logic';
  answer: string;
  keyPoints: string[];
}

export const VIVA_QUESTIONS: VivaItem[] = [
  {
    id: 1,
    question: "What is Java Swing and how is it different from AWT (Abstract Window Toolkit)?",
    category: "Swing & GUI",
    answer: "Java Swing is a GUI widget toolkit that is part of Java Foundation Classes (JFC). Unlike AWT (which uses heavyweight native OS controls), Swing components are 'lightweight' because they are written entirely in pure Java. This makes Swing platform-independent and allows for customizable Look and Feel (like Nimbus, Metal, or System).",
    keyPoints: [
      "AWT components are Heavyweight (depend on host OS peers).",
      "Swing components are Lightweight (100% written in Java, start with 'J' like JFrame, JButton).",
      "Swing provides advanced components like JTable, JTree, and JTabbedPane that AWT lacks."
    ]
  },
  {
    id: 2,
    question: "Why did you use ArrayList instead of a traditional array (Student[]) to store records?",
    category: "Collections & Memory",
    answer: "A standard Java array (Student[]) has a fixed size defined at the time of creation. If we declare an array of size 50, we cannot easily add a 51st student, and space is wasted if we only have 5 students. An ArrayList is a resizable, dynamic array from the java.util package. It automatically grows its capacity as new students are added and shrinks when students are deleted using methods like .add() and .remove().",
    keyPoints: [
      "Dynamic sizing: Grows automatically without index overflow.",
      "Built-in utility methods: add(), remove(), get(), size(), and clear().",
      "Type safety via Generics: ArrayList<Student> guarantees only Student objects can be added."
    ]
  },
  {
    id: 3,
    question: "What happens to the student data when you close the application, and why?",
    category: "Project Logic",
    answer: "All student data is completely lost when the application closes. This is because the application runs 'Without Database' and stores objects strictly in RAM (Random Access Memory) via the ArrayList. RAM is volatile memory. Once the JVM process terminates, the operating system reclaims the heap memory and the Java Garbage Collector frees the memory.",
    keyPoints: [
      "RAM is volatile memory; data persists only while the program is running.",
      "To preserve data permanently, an external relational database (like MySQL via JDBC) or file storage (CSV, JSON, Serialization) would be required."
    ]
  },
  {
    id: 4,
    question: "How does your project prevent duplicate roll numbers?",
    category: "Project Logic",
    answer: "Before adding a new student, the addStudent() method calls a helper method isRollNoExists(String rollNo). It loops through the existing ArrayList<Student> using a for-each loop and compares each student's roll number with the entered roll number using .equalsIgnoreCase(). If a match is found, the addition is rejected and an error dialog is displayed to the user via JOptionPane.",
    keyPoints: [
      "Linear scan through the ArrayList compares roll numbers.",
      "Case-insensitive comparison (CS101 equals cs101).",
      "JOptionPane.showMessageDialog alerts the user before any state change."
    ]
  },
  {
    id: 5,
    question: "What is the purpose of DefaultTableModel in JTable?",
    category: "Swing & GUI",
    answer: "JTable follows the MVC (Model-View-Controller) design pattern. The JTable itself is only the View (how things look). DefaultTableModel is the Model that actually holds the data (rows and columns). When we add a student, we add a row to DefaultTableModel using model.addRow(), and the JTable automatically re-renders the new data on screen.",
    keyPoints: [
      "Separates data from GUI rendering.",
      "Provides methods like addRow(), removeRow(), and setRowCount(0) to refresh tables cleanly.",
      "Allows overriding isCellEditable(row, col) to make cells read-only so users edit via form buttons."
    ]
  },
  {
    id: 6,
    question: "How does the system validate marks and input fields?",
    category: "Project Logic",
    answer: "We perform a 3-tier validation check in Java: 1) Empty Check: We ensure mandatory text fields are not empty using .getText().trim().isEmpty(). 2) Format Check: We wrap Double.parseDouble() in a try-catch block for NumberFormatException to ensure marks are numeric. 3) Range Check: We verify that each mark is between 0.0 and 100.0 inclusive.",
    keyPoints: [
      "Throws NumberFormatException if someone types letters into a marks field.",
      "Boundary check: (mark < 0 || mark > 100) displays an invalid range message.",
      "Phone number regex validation (e.g., \\d{10}) ensures exactly 10 digits."
    ]
  },
  {
    id: 7,
    question: "Explain the Object-Oriented Programming (OOP) concepts applied in this project.",
    category: "Java Core",
    answer: "This project implements four core OOP concepts: 1) Encapsulation: The Student class hides its fields with private access and exposes public getters and setters. 2) Abstraction: The StudentManager class exposes simple methods like addStudent() and deleteStudent() while hiding the internal ArrayList manipulation. 3) Inheritance: StudentManagementApp extends JFrame to inherit window management capabilities. 4) Polymorphism: Method overriding of isCellEditable() and toString().",
    keyPoints: [
      "Encapsulation: private String rollNo; + public String getRollNo().",
      "Inheritance: class StudentManagementApp extends JFrame.",
      "Polymorphism: Overriding methods in event listeners and table models."
    ]
  },
  {
    id: 8,
    question: "Why is SwingUtilities.invokeLater() used in the main method?",
    category: "Swing & GUI",
    answer: "Swing is not thread-safe. All GUI component creation, event handling, and repainting must execute on a dedicated thread known as the Event Dispatch Thread (EDT). SwingUtilities.invokeLater() places the task on the EDT event queue, preventing race conditions, UI freezing, and unpredictable graphics rendering bugs.",
    keyPoints: [
      "Ensures GUI runs on the Event Dispatch Thread (EDT).",
      "Avoids race conditions and thread concurrency bugs in Swing applications."
    ]
  },
  {
    id: 9,
    question: "What is an ActionListener and how does it handle button clicks?",
    category: "Swing & GUI",
    answer: "ActionListener is an interface belonging to the java.awt.event package. When a user clicks a button (like 'Add Student'), an ActionEvent is generated. The button notifies all registered ActionListeners by invoking their actionPerformed(ActionEvent e) method. In modern Java, we can implement this cleanly using lambda expressions (e -> handleAddStudent()).",
    keyPoints: [
      "Event-Driven Programming model.",
      "Source (JButton) -> Event (ActionEvent) -> Listener (ActionListener).",
      "Can be written using anonymous inner classes or concise Java 8+ lambdas."
    ]
  },
  {
    id: 10,
    question: "How does the system calculate Result and Grade for a student?",
    category: "Project Logic",
    answer: "The Result is evaluated by checking two conditions: individual subject threshold and aggregate percentage. If any of the 5 subjects has a mark below 35, the student is marked as 'FAIL'. If all subjects are >= 35 and the overall percentage is >= 40%, the result is 'PASS'. The Grade is derived from percentage: >=90% is A+, >=80% is A, >=70% is B, >=60% is C, >=40% is D, and any failed student receives 'F'.",
    keyPoints: [
      "Individual subject minimum: 35/100 to prevent passing students with zero in one topic.",
      "Aggregate minimum: 40% for PASS.",
      "Grade scale: A+, A, B, C, D, and F."
    ]
  },
  {
    id: 11,
    question: "What layout managers are used in the application and why?",
    category: "Swing & GUI",
    answer: "We use multiple layout managers together: BorderLayout for the overall window structure (NORTH for header, CENTER for main workspace, SOUTH for status bar); GridLayout for organized, evenly-spaced input label-field pairs and buttons; and BoxLayout / FlowLayout for search bars and toolbars. Combining standard layout managers ensures the window adapts gracefully across different screen sizes.",
    keyPoints: [
      "BorderLayout: Divides window into North, South, East, West, and Center.",
      "GridLayout: Arranges components into neat rows and columns.",
      "JSplitPane: Allows resizable division between input form and table."
    ]
  },
  {
    id: 12,
    question: "How would you upgrade this project to permanently save data if required in the future?",
    category: "Collections & Memory",
    answer: "To persist data permanently, we have three paths: 1) File I/O: Writing and reading CSV or text files using BufferedReader and PrintWriter. 2) Java Object Serialization: Writing Student objects to a binary file using ObjectOutputStream. 3) Database Connectivity (JDBC): Connecting to MySQL, SQLite, or PostgreSQL using JDBC drivers and executing SQL queries (INSERT, SELECT, UPDATE, DELETE).",
    keyPoints: [
      "File I/O with CSV or JSON.",
      "Java Object Serialization (implementing Serializable interface).",
      "JDBC with MySQL or SQLite for enterprise relational persistence."
    ]
  }
];
