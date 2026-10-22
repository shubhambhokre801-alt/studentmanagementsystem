export interface JavaSourceFile {
  filename: string;
  description: string;
  packageDescription: string;
  code: string;
}

export const JAVA_PROJECT_FILES: JavaSourceFile[] = [
  {
    filename: 'Student.java',
    description: 'Model class encapsulating all student properties, calculation methods, and validation logic.',
    packageDescription: 'Core Model Entity (OOP Encapsulation)',
    code: `/**
 * Project: Student Management System
 * File: Student.java
 * Description: Model class representing a Student entity with complete
 * encapsulation, getter/setter methods, and grade/result calculations.
 * 
 * Storage: Stored in-memory via ArrayList (no database required).
 */
public class Student {
    // Private attributes (Encapsulation)
    private String rollNo;
    private String name;
    private String department;
    private String year;
    private String phoneNumber;
    
    // Marks in 5 core subjects (out of 100 each)
    private double mark1; // Java Programming
    private double mark2; // Data Structures & Algorithms
    private double mark3; // Database Management Systems
    private double mark4; // Operating Systems
    private double mark5; // Computer Networks

    // Default Constructor
    public Student() {
    }

    // Parameterized Constructor
    public Student(String rollNo, String name, String department, String year, 
                   String phoneNumber, double mark1, double mark2, double mark3, 
                   double mark4, double mark5) {
        this.rollNo = rollNo;
        this.name = name;
        this.department = department;
        this.year = year;
        this.phoneNumber = phoneNumber;
        this.mark1 = mark1;
        this.mark2 = mark2;
        this.mark3 = mark3;
        this.mark4 = mark4;
        this.mark5 = mark5;
    }

    // --- Business Logic Methods ---

    /**
     * Calculates the sum of all 5 subject marks (Max: 500).
     */
    public double calculateTotalMarks() {
        return mark1 + mark2 + mark3 + mark4 + mark5;
    }

    /**
     * Calculates the percentage (Total Marks / 5.0).
     */
    public double calculatePercentage() {
        return calculateTotalMarks() / 5.0;
    }

    /**
     * Determines Pass or Fail status.
     * Criteria: Minimum 35 marks in each subject and at least 40% overall.
     */
    public String getResult() {
        if (mark1 < 35 || mark2 < 35 || mark3 < 35 || mark4 < 35 || mark5 < 35) {
            return "FAIL";
        }
        return (calculatePercentage() >= 40.0) ? "PASS" : "FAIL";
    }

    /**
     * Computes the letter grade based on percentage.
     */
    public String getGrade() {
        if (getResult().equals("FAIL")) {
            return "F";
        }
        double pct = calculatePercentage();
        if (pct >= 90.0) return "A+";
        if (pct >= 80.0) return "A";
        if (pct >= 70.0) return "B";
        if (pct >= 60.0) return "C";
        return "D";
    }

    // --- Getters and Setters ---

    public String getRollNo() {
        return rollNo;
    }

    public void setRollNo(String rollNo) {
        this.rollNo = rollNo;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public double getMark1() {
        return mark1;
    }

    public void setMark1(double mark1) {
        this.mark1 = mark1;
    }

    public double getMark2() {
        return mark2;
    }

    public void setMark2(double mark2) {
        this.mark2 = mark2;
    }

    public double getMark3() {
        return mark3;
    }

    public void setMark3(double mark3) {
        this.mark3 = mark3;
    }

    public double getMark4() {
        return mark4;
    }

    public void setMark4(double mark4) {
        this.mark4 = mark4;
    }

    public double getMark5() {
        return mark5;
    }

    public void setMark5(double mark5) {
        this.mark5 = mark5;
    }

    @Override
    public String toString() {
        return "Student [RollNo=" + rollNo + ", Name=" + name + ", Dept=" + department + 
               ", Year=" + year + ", Phone=" + phoneNumber + ", Total=" + calculateTotalMarks() + 
               ", Percentage=" + String.format("%.2f", calculatePercentage()) + "%" + 
               ", Result=" + getResult() + ", Grade=" + getGrade() + "]";
    }
}
`
  },
  {
    filename: 'StudentManager.java',
    description: 'Controller class managing student records in an in-memory ArrayList without external database.',
    packageDescription: 'Business Logic & In-Memory Data Store',
    code: `import java.util.ArrayList;

/**
 * Project: Student Management System
 * File: StudentManager.java
 * Description: Manages the collection of students in memory using Java's ArrayList.
 * Implements CRUD operations, duplicate roll number checks, and statistics.
 * 
 * Note: Data is stored in RAM and resets when the application terminates.
 */
public class StudentManager {
    // In-memory collection storing Student objects
    private ArrayList<Student> studentList;

    public StudentManager() {
        this.studentList = new ArrayList<>();
    }

    /**
     * Checks if a student with the given roll number already exists.
     * Prevents duplicate roll numbers.
     */
    public boolean isRollNoExists(String rollNo) {
        if (rollNo == null) return false;
        for (Student s : studentList) {
            if (s.getRollNo().equalsIgnoreCase(rollNo.trim())) {
                return true;
            }
        }
        return false;
    }

    /**
     * Adds a new student record to the ArrayList.
     * Returns true on success, false if duplicate roll number is found.
     */
    public boolean addStudent(Student student) {
        if (student == null) return false;
        if (isRollNoExists(student.getRollNo())) {
            return false; // Duplicate roll number rejected
        }
        studentList.add(student);
        return true;
    }

    /**
     * Returns a copy of all students.
     */
    public ArrayList<Student> getAllStudents() {
        return new ArrayList<>(studentList);
    }

    /**
     * Searches for a student by their unique roll number.
     * Returns matching Student or null if not found.
     */
    public Student searchByRollNo(String rollNo) {
        if (rollNo == null) return null;
        for (Student s : studentList) {
            if (s.getRollNo().equalsIgnoreCase(rollNo.trim())) {
                return s;
            }
        }
        return null;
    }

    /**
     * Updates an existing student record identified by roll number.
     * Returns true if updated successfully, false if student not found.
     */
    public boolean updateStudent(String rollNo, Student updatedData) {
        for (int i = 0; i < studentList.size(); i++) {
            Student existing = studentList.get(i);
            if (existing.getRollNo().equalsIgnoreCase(rollNo.trim())) {
                // Keep the original unique roll number
                updatedData.setRollNo(existing.getRollNo());
                studentList.set(i, updatedData);
                return true;
            }
        }
        return false;
    }

    /**
     * Deletes a student record by roll number.
     * Returns true if deleted, false if not found.
     */
    public boolean deleteStudent(String rollNo) {
        for (int i = 0; i < studentList.size(); i++) {
            if (studentList.get(i).getRollNo().equalsIgnoreCase(rollNo.trim())) {
                studentList.remove(i);
                return true;
            }
        }
        return false;
    }

    /**
     * Returns the total count of registered students.
     */
    public int getTotalCount() {
        return studentList.size();
    }

    /**
     * Returns the count of students who passed.
     */
    public int getPassCount() {
        int count = 0;
        for (Student s : studentList) {
            if ("PASS".equalsIgnoreCase(s.getResult())) {
                count++;
            }
        }
        return count;
    }

    /**
     * Returns the count of students who failed.
     */
    public int getFailCount() {
        int count = 0;
        for (Student s : studentList) {
            if ("FAIL".equalsIgnoreCase(s.getResult())) {
                count++;
            }
        }
        return count;
    }

    /**
     * Calculates the overall class average percentage.
     */
    public double getAveragePercentage() {
        if (studentList.isEmpty()) return 0.0;
        double sum = 0.0;
        for (Student s : studentList) {
            sum += s.calculatePercentage();
        }
        return sum / studentList.size();
    }

    /**
     * Clears all in-memory records.
     */
    public void clearAll() {
        studentList.clear();
    }
}
`
  },
  {
    filename: 'StudentManagementApp.java',
    description: 'Complete Java Swing Desktop GUI window with clean dashboard, modern cards, JTable, and dialogs.',
    packageDescription: 'Presentation Layer (Java Swing Desktop GUI)',
    code: `import javax.swing.*;
import javax.swing.border.EmptyBorder;
import javax.swing.border.TitledBorder;
import javax.swing.table.DefaultTableCellRenderer;
import javax.swing.table.DefaultTableModel;
import javax.swing.table.JTableHeader;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.util.ArrayList;

/**
 * Project: Student Management System
 * File: StudentManagementApp.java
 * Description: Graphical User Interface built with Java Swing.
 * Features:
 *  - Professional dashboard with navigation & statistics cards
 *  - Form for Add, Search, Update, Delete with validation
 *  - Live calculation of Total Marks, Percentage, and Pass/Fail
 *  - JTable with formatted rows and click-to-edit integration
 *  - Explicit warning about in-memory data volatility
 */
public class StudentManagementApp extends JFrame {

    // Manager instance handling business logic & in-memory ArrayList
    private final StudentManager studentManager;

    // Input form components
    private JTextField txtRollNo;
    private JTextField txtName;
    private JComboBox<String> cmbDepartment;
    private JComboBox<String> cmbYear;
    private JTextField txtPhone;

    // 5 Subject Marks fields (0-100)
    private JTextField txtMark1; // Java
    private JTextField txtMark2; // DSA
    private JTextField txtMark3; // DBMS
    private JTextField txtMark4; // OS
    private JTextField txtMark5; // CN

    // Live preview labels for calculated values
    private JLabel lblTotalPreview;
    private JLabel lblPercentagePreview;
    private JLabel lblResultPreview;

    // Action buttons
    private JButton btnAdd;
    private JButton btnUpdate;
    private JButton btnDelete;
    private JButton btnClear;
    private JButton btnSearch;
    private JButton btnRefresh;
    private JButton btnSampleData;

    // Search bar field
    private JTextField txtSearchRollNo;

    // JTable components
    private JTable studentTable;
    private DefaultTableModel tableModel;

    // Summary dashboard card labels
    private JLabel lblStatTotal;
    private JLabel lblStatPassed;
    private JLabel lblStatFailed;
    private JLabel lblStatAverage;

    public StudentManagementApp() {
        studentManager = new StudentManager();
        initUI();
        loadSampleData(); // Preload realistic sample records for demonstration
        updateDashboardStats();
    }

    private void initUI() {
        setTitle("Student Management System (Java Swing GUI)");
        setSize(1180, 720);
        setMinimumSize(new Dimension(1000, 650));
        setLocationRelativeTo(null); // Center on screen
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLayout(new BorderLayout(10, 10));

        // Create Navigation Menu Bar
        setJMenuBar(createMenuBar());

        // Header Panel (Dashboard Title & In-Memory Storage Banner)
        add(createHeaderPanel(), BorderLayout.NORTH);

        // Center Split: Left Form Panel + Right Table & Summary Panel
        JSplitPane splitPane = new JSplitPane(JSplitPane.HORIZONTAL_SPLIT, createFormPanel(), createTablePanel());
        splitPane.setDividerLocation(380);
        splitPane.setContinuousLayout(true);
        splitPane.setBorder(null);
        add(splitPane, BorderLayout.CENTER);

        // Footer status bar
        add(createFooterPanel(), BorderLayout.SOUTH);

        // Attach Event Listeners
        registerEvents();
    }

    /**
     * Top Menu Bar with File, Actions, and Help menus.
     */
    private JMenuBar createMenuBar() {
        JMenuBar menuBar = new JMenuBar();

        // File Menu
        JMenu menuFile = new JMenu("File");
        JMenuItem itemSample = new JMenuItem("Load Sample Students");
        itemSample.addActionListener(e -> loadSampleData());
        JMenuItem itemClearAll = new JMenuItem("Clear All Records");
        itemClearAll.addActionListener(e -> clearAllRecords());
        JMenuItem itemExit = new JMenuItem("Exit Application");
        itemExit.addActionListener(e -> System.exit(0));

        menuFile.add(itemSample);
        menuFile.add(itemClearAll);
        menuFile.addSeparator();
        menuFile.add(itemExit);

        // Help Menu
        JMenu menuHelp = new JMenu("Help");
        JMenuItem itemAbout = new JMenuItem("About System");
        itemAbout.addActionListener(e -> showAboutDialog());
        JMenuItem itemStorageNotice = new JMenuItem("Storage Architecture");
        itemStorageNotice.addActionListener(e -> JOptionPane.showMessageDialog(this,
                "STORAGE NOTICE:\n" +
                "This application utilizes an in-memory ArrayList<Student> data store.\n" +
                "No external SQL database or local file system is connected.\n" +
                "All student records will be completely reset when the application closes.",
                "Storage Information", JOptionPane.INFORMATION_MESSAGE));

        menuHelp.add(itemAbout);
        menuHelp.add(itemStorageNotice);

        menuBar.add(menuFile);
        menuBar.add(menuHelp);
        return menuBar;
    }

    /**
     * Header with Title, College Project Badge, and RAM notice.
     */
    private JPanel createHeaderPanel() {
        JPanel header = new JPanel(new BorderLayout());
        header.setBackground(new Color(24, 43, 73));
        header.setBorder(new EmptyBorder(12, 20, 12, 20));

        JLabel lblTitle = new JLabel("STUDENT MANAGEMENT SYSTEM");
        lblTitle.setFont(new Font("Segoe UI", Font.BOLD, 20));
        lblTitle.setForeground(Color.WHITE);

        JLabel lblSubtitle = new JLabel("College Submission Project • Desktop GUI • In-Memory ArrayList Mode");
        lblSubtitle.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        lblSubtitle.setForeground(new Color(180, 205, 237));

        JPanel titleBlock = new JPanel(new GridLayout(2, 1, 0, 2));
        titleBlock.setOpaque(false);
        titleBlock.add(lblTitle);
        titleBlock.add(lblSubtitle);

        // Quick Action button in header
        btnSampleData = new JButton("Load Sample Data");
        btnSampleData.setFocusPainted(false);
        btnSampleData.setBackground(new Color(59, 130, 246));
        btnSampleData.setForeground(Color.WHITE);
        btnSampleData.setFont(new Font("Segoe UI", Font.BOLD, 12));

        header.add(titleBlock, BorderLayout.WEST);
        header.add(btnSampleData, BorderLayout.EAST);
        return header;
    }

    /**
     * Left Panel containing the Student Details and Marks Input Form.
     */
    private JPanel createFormPanel() {
        JPanel formContainer = new JPanel(new BorderLayout(10, 10));
        formContainer.setBorder(new EmptyBorder(10, 15, 10, 10));

        JPanel formPanel = new JPanel();
        formPanel.setLayout(new BoxLayout(formPanel, BoxLayout.Y_AXIS));
        formPanel.setBorder(BorderFactory.createTitledBorder(
                BorderFactory.createLineBorder(new Color(203, 213, 225)),
                " Student Registration Form ",
                TitledBorder.LEFT,
                TitledBorder.TOP,
                new Font("Segoe UI", Font.BOLD, 14),
                new Color(30, 41, 59)
        ));

        // Basic Info Inputs
        txtRollNo = new JTextField();
        txtName = new JTextField();
        cmbDepartment = new JComboBox<>(new String[]{
                "Computer Science & Engineering (CSE)",
                "Information Technology (IT)",
                "Electronics & Communication (ECE)",
                "Mechanical Engineering (ME)",
                "Civil Engineering (CE)"
        });
        cmbYear = new JComboBox<>(new String[]{"1st Year", "2nd Year", "3rd Year", "4th Year"});
        txtPhone = new JTextField();

        // 5 Subject Marks
        txtMark1 = new JTextField();
        txtMark2 = new JTextField();
        txtMark3 = new JTextField();
        txtMark4 = new JTextField();
        txtMark5 = new JTextField();

        JPanel fields = new JPanel(new GridLayout(10, 2, 8, 8));
        fields.setBorder(new EmptyBorder(10, 10, 10, 10));

        fields.add(new JLabel("Roll Number:*"));
        fields.add(txtRollNo);

        fields.add(new JLabel("Student Name:*"));
        fields.add(txtName);

        fields.add(new JLabel("Department:"));
        fields.add(cmbDepartment);

        fields.add(new JLabel("Academic Year:"));
        fields.add(cmbYear);

        fields.add(new JLabel("Phone Number:*"));
        fields.add(txtPhone);

        fields.add(new JLabel("Java Programming (0-100):*"));
        fields.add(txtMark1);

        fields.add(new JLabel("Data Structures (0-100):*"));
        fields.add(txtMark2);

        fields.add(new JLabel("DBMS (0-100):*"));
        fields.add(txtMark3);

        fields.add(new JLabel("Operating Systems (0-100):*"));
        fields.add(txtMark4);

        fields.add(new JLabel("Computer Networks (0-100):*"));
        fields.add(txtMark5);

        formPanel.add(fields);

        // Live calculation preview box
        JPanel calcBox = new JPanel(new GridLayout(1, 3, 5, 5));
        calcBox.setBorder(BorderFactory.createTitledBorder("Live Metrics"));
        lblTotalPreview = new JLabel("Total: - / 500", SwingConstants.CENTER);
        lblPercentagePreview = new JLabel("Percentage: - %", SwingConstants.CENTER);
        lblResultPreview = new JLabel("Result: -", SwingConstants.CENTER);
        lblTotalPreview.setFont(new Font("Segoe UI", Font.BOLD, 11));
        lblPercentagePreview.setFont(new Font("Segoe UI", Font.BOLD, 11));
        lblResultPreview.setFont(new Font("Segoe UI", Font.BOLD, 11));
        calcBox.add(lblTotalPreview);
        calcBox.add(lblPercentagePreview);
        calcBox.add(lblResultPreview);
        formPanel.add(calcBox);

        // Buttons Panel
        JPanel btnPanel = new JPanel(new GridLayout(2, 2, 8, 8));
        btnPanel.setBorder(new EmptyBorder(12, 10, 10, 10));

        btnAdd = new JButton("Add Student");
        btnAdd.setBackground(new Color(16, 185, 129)); // Green
        btnAdd.setForeground(Color.WHITE);
        btnAdd.setFont(new Font("Segoe UI", Font.BOLD, 12));

        btnUpdate = new JButton("Update Details");
        btnUpdate.setBackground(new Color(245, 158, 11)); // Amber
        btnUpdate.setForeground(Color.WHITE);
        btnUpdate.setFont(new Font("Segoe UI", Font.BOLD, 12));

        btnDelete = new JButton("Delete Student");
        btnDelete.setBackground(new Color(239, 68, 68)); // Red
        btnDelete.setForeground(Color.WHITE);
        btnDelete.setFont(new Font("Segoe UI", Font.BOLD, 12));

        btnClear = new JButton("Clear Fields");
        btnClear.setBackground(new Color(100, 116, 139)); // Slate
        btnClear.setForeground(Color.WHITE);
        btnClear.setFont(new Font("Segoe UI", Font.BOLD, 12));

        btnPanel.add(btnAdd);
        btnPanel.add(btnUpdate);
        btnPanel.add(btnDelete);
        btnPanel.add(btnClear);

        formContainer.add(new JScrollPane(formPanel), BorderLayout.CENTER);
        formContainer.add(btnPanel, BorderLayout.SOUTH);
        return formContainer;
    }

    /**
     * Right Panel containing Summary Stats Cards, Search Bar, and JTable.
     */
    private JPanel createTablePanel() {
        JPanel rightPanel = new JPanel(new BorderLayout(8, 8));
        rightPanel.setBorder(new EmptyBorder(10, 5, 10, 15));

        // Top Summary Metric Cards
        JPanel statsRow = new JPanel(new GridLayout(1, 4, 10, 10));
        statsRow.setPreferredSize(new Dimension(600, 65));

        lblStatTotal = new JLabel("0", SwingConstants.CENTER);
        lblStatPassed = new JLabel("0", SwingConstants.CENTER);
        lblStatFailed = new JLabel("0", SwingConstants.CENTER);
        lblStatAverage = new JLabel("0.0%", SwingConstants.CENTER);

        statsRow.add(createStatCard("Total Enrolled", lblStatTotal, new Color(59, 130, 246)));
        statsRow.add(createStatCard("Passed", lblStatPassed, new Color(16, 185, 129)));
        statsRow.add(createStatCard("Failed", lblStatFailed, new Color(239, 68, 68)));
        statsRow.add(createStatCard("Class Average", lblStatAverage, new Color(139, 92, 246)));

        // Search Bar Panel
        JPanel searchPanel = new JPanel(new BorderLayout(8, 8));
        searchPanel.setBorder(new EmptyBorder(8, 0, 8, 0));

        JPanel searchControls = new JPanel(new FlowLayout(FlowLayout.LEFT, 8, 0));
        searchControls.add(new JLabel("Search by Roll Number:"));
        txtSearchRollNo = new JTextField(12);
        btnSearch = new JButton("Search");
        btnSearch.setBackground(new Color(37, 99, 235));
        btnSearch.setForeground(Color.WHITE);

        btnRefresh = new JButton("Reset Table View");
        btnRefresh.setBackground(new Color(100, 116, 139));
        btnRefresh.setForeground(Color.WHITE);

        searchControls.add(txtSearchRollNo);
        searchControls.add(btnSearch);
        searchControls.add(btnRefresh);

        searchPanel.add(statsRow, BorderLayout.NORTH);
        searchPanel.add(searchControls, BorderLayout.SOUTH);

        // JTable Configuration
        String[] columnNames = {
                "Roll No", "Student Name", "Department", "Year", "Phone",
                "Total (/500)", "Percentage", "Grade", "Result"
        };
        tableModel = new DefaultTableModel(columnNames, 0) {
            @Override
            public boolean isCellEditable(int row, int column) {
                return false; // Make read-only; editing happens through form controls
            }
        };

        studentTable = new JTable(tableModel);
        studentTable.setRowHeight(26);
        studentTable.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        studentTable.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);

        // Header Styling
        JTableHeader header = studentTable.getTableHeader();
        header.setFont(new Font("Segoe UI", Font.BOLD, 12));
        header.setBackground(new Color(241, 245, 249));
        header.setForeground(new Color(15, 23, 42));

        // Center align numerical & status columns
        DefaultTableCellRenderer centerRenderer = new DefaultTableCellRenderer();
        centerRenderer.setHorizontalAlignment(SwingConstants.CENTER);
        studentTable.getColumnModel().getColumn(0).setCellRenderer(centerRenderer);
        studentTable.getColumnModel().getColumn(3).setCellRenderer(centerRenderer);
        studentTable.getColumnModel().getColumn(5).setCellRenderer(centerRenderer);
        studentTable.getColumnModel().getColumn(6).setCellRenderer(centerRenderer);
        studentTable.getColumnModel().getColumn(7).setCellRenderer(centerRenderer);

        // Custom renderer for PASS (green) / FAIL (red) badge
        studentTable.getColumnModel().getColumn(8).setCellRenderer(new DefaultTableCellRenderer() {
            @Override
            public Component getTableCellRendererComponent(JTable table, Object value,
                                                           boolean isSelected, boolean hasFocus, int row, int column) {
                Component c = super.getTableCellRendererComponent(table, value, isSelected, hasFocus, row, column);
                setHorizontalAlignment(SwingConstants.CENTER);
                setFont(new Font("Segoe UI", Font.BOLD, 12));
                if ("PASS".equals(value)) {
                    setForeground(new Color(16, 185, 129));
                } else {
                    setForeground(new Color(239, 68, 68));
                }
                return c;
            }
        });

        JScrollPane tableScrollPane = new JScrollPane(studentTable);
        rightPanel.add(searchPanel, BorderLayout.NORTH);
        rightPanel.add(tableScrollPane, BorderLayout.CENTER);
        return rightPanel;
    }

    private JPanel createStatCard(String title, JLabel valueLabel, Color accentColor) {
        JPanel card = new JPanel(new BorderLayout());
        card.setBackground(Color.WHITE);
        card.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(new Color(226, 232, 240), 1),
                new EmptyBorder(6, 10, 6, 10)
        ));

        JLabel lblCardTitle = new JLabel(title);
        lblCardTitle.setFont(new Font("Segoe UI", Font.PLAIN, 11));
        lblCardTitle.setForeground(new Color(100, 116, 139));

        valueLabel.setFont(new Font("Segoe UI", Font.BOLD, 18));
        valueLabel.setForeground(accentColor);

        card.add(lblCardTitle, BorderLayout.NORTH);
        card.add(valueLabel, BorderLayout.CENTER);
        return card;
    }

    private JPanel createFooterPanel() {
        JPanel footer = new JPanel(new BorderLayout());
        footer.setBorder(new EmptyBorder(6, 15, 6, 15));
        footer.setBackground(new Color(248, 250, 252));

        JLabel lblNotice = new JLabel("⚠️  Non-Persistent In-Memory Storage: Records will be lost when the application is closed.");
        lblNotice.setFont(new Font("Segoe UI", Font.ITALIC, 11));
        lblNotice.setForeground(new Color(180, 83, 9)); // Amber dark

        JLabel lblHint = new JLabel("Click any row in the table to load its data into the form for updating.");
        lblHint.setFont(new Font("Segoe UI", Font.PLAIN, 11));
        lblHint.setForeground(new Color(100, 116, 139));

        footer.add(lblNotice, BorderLayout.WEST);
        footer.add(lblHint, BorderLayout.EAST);
        return footer;
    }

    /**
     * Registers all action and table listeners.
     */
    private void registerEvents() {
        // Add Button
        btnAdd.addActionListener(e -> handleAddStudent());

        // Update Button
        btnUpdate.addActionListener(e -> handleUpdateStudent());

        // Delete Button
        btnDelete.addActionListener(e -> handleDeleteStudent());

        // Clear Fields Button
        btnClear.addActionListener(e -> clearInputFields());

        // Search Button
        btnSearch.addActionListener(e -> handleSearch());

        // Reset Table View Button
        btnRefresh.addActionListener(e -> {
            txtSearchRollNo.setText("");
            renderTableData(studentManager.getAllStudents());
        });

        // Sample Data Button
        btnSampleData.addActionListener(e -> loadSampleData());

        // Table Row Selection -> Auto-populate form
        studentTable.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                int selectedRow = studentTable.getSelectedRow();
                if (selectedRow != -1) {
                    String rollNo = (String) tableModel.getValueAt(selectedRow, 0);
                    Student s = studentManager.searchByRollNo(rollNo);
                    if (s != null) {
                        populateForm(s);
                    }
                }
            }
        });
    }

    /**
     * Adds a new student after thorough validation.
     */
    private void handleAddStudent() {
        // 1. Validate empty fields
        String rollNo = txtRollNo.getText().trim();
        String name = txtName.getText().trim();
        String phone = txtPhone.getText().trim();

        if (rollNo.isEmpty() || name.isEmpty() || phone.isEmpty() ||
                txtMark1.getText().trim().isEmpty() || txtMark2.getText().trim().isEmpty() ||
                txtMark3.getText().trim().isEmpty() || txtMark4.getText().trim().isEmpty() ||
                txtMark5.getText().trim().isEmpty()) {
            JOptionPane.showMessageDialog(this,
                    "Validation Error: All fields marked with (*) are mandatory!",
                    "Input Error", JOptionPane.WARNING_MESSAGE);
            return;
        }

        // 2. Prevent duplicate roll numbers
        if (studentManager.isRollNoExists(rollNo)) {
            JOptionPane.showMessageDialog(this,
                    "Duplicate Roll Number: A student with Roll No '" + rollNo + "' already exists!\\n" +
                    "Please enter a unique roll number.",
                    "Duplicate Record", JOptionPane.ERROR_MESSAGE);
            return;
        }

        // 3. Validate phone number (simple 10 digit check)
        if (!phone.matches("\\\\d{10}")) {
            JOptionPane.showMessageDialog(this,
                    "Invalid Phone: Please enter a valid 10-digit mobile number.",
                    "Input Error", JOptionPane.WARNING_MESSAGE);
            return;
        }

        // 4. Validate marks (must be numeric and between 0 and 100)
        double m1, m2, m3, m4, m5;
        try {
            m1 = Double.parseDouble(txtMark1.getText().trim());
            m2 = Double.parseDouble(txtMark2.getText().trim());
            m3 = Double.parseDouble(txtMark3.getText().trim());
            m4 = Double.parseDouble(txtMark4.getText().trim());
            m5 = Double.parseDouble(txtMark5.getText().trim());
        } catch (NumberFormatException ex) {
            JOptionPane.showMessageDialog(this,
                    "Invalid Marks: All subject marks must be valid numbers.",
                    "Input Error", JOptionPane.ERROR_MESSAGE);
            return;
        }

        if (isOutOfRange(m1) || isOutOfRange(m2) || isOutOfRange(m3) || isOutOfRange(m4) || isOutOfRange(m5)) {
            JOptionPane.showMessageDialog(this,
                    "Invalid Marks Range: Marks must be between 0 and 100 for each subject.",
                    "Input Error", JOptionPane.ERROR_MESSAGE);
            return;
        }

        // Create student and add to ArrayList
        Student newStudent = new Student(rollNo, name,
                (String) cmbDepartment.getSelectedItem(),
                (String) cmbYear.getSelectedItem(),
                phone, m1, m2, m3, m4, m5);

        boolean added = studentManager.addStudent(newStudent);
        if (added) {
            renderTableData(studentManager.getAllStudents());
            updateDashboardStats();
            clearInputFields();
            JOptionPane.showMessageDialog(this,
                    "Student '" + name + "' (Roll: " + rollNo + ") added successfully!",
                    "Success", JOptionPane.INFORMATION_MESSAGE);
        }
    }

    /**
     * Updates details of the student with the specified Roll Number.
     */
    private void handleUpdateStudent() {
        String rollNo = txtRollNo.getText().trim();
        if (rollNo.isEmpty()) {
            JOptionPane.showMessageDialog(this,
                    "Please specify the Roll Number of the student you want to update.",
                    "Notice", JOptionPane.WARNING_MESSAGE);
            return;
        }

        if (!studentManager.isRollNoExists(rollNo)) {
            JOptionPane.showMessageDialog(this,
                    "Student with Roll No '" + rollNo + "' not found.",
                    "Not Found", JOptionPane.ERROR_MESSAGE);
            return;
        }

        String name = txtName.getText().trim();
        String phone = txtPhone.getText().trim();

        if (name.isEmpty() || phone.isEmpty()) {
            JOptionPane.showMessageDialog(this,
                    "Name and Phone cannot be blank.",
                    "Input Error", JOptionPane.WARNING_MESSAGE);
            return;
        }

        double m1, m2, m3, m4, m5;
        try {
            m1 = Double.parseDouble(txtMark1.getText().trim());
            m2 = Double.parseDouble(txtMark2.getText().trim());
            m3 = Double.parseDouble(txtMark3.getText().trim());
            m4 = Double.parseDouble(txtMark4.getText().trim());
            m5 = Double.parseDouble(txtMark5.getText().trim());
        } catch (NumberFormatException ex) {
            JOptionPane.showMessageDialog(this,
                    "Marks must be valid numbers.", "Error", JOptionPane.ERROR_MESSAGE);
            return;
        }

        if (isOutOfRange(m1) || isOutOfRange(m2) || isOutOfRange(m3) || isOutOfRange(m4) || isOutOfRange(m5)) {
            JOptionPane.showMessageDialog(this,
                    "Marks must be between 0 and 100.", "Error", JOptionPane.ERROR_MESSAGE);
            return;
        }

        Student updated = new Student(rollNo, name,
                (String) cmbDepartment.getSelectedItem(),
                (String) cmbYear.getSelectedItem(),
                phone, m1, m2, m3, m4, m5);

        studentManager.updateStudent(rollNo, updated);
        renderTableData(studentManager.getAllStudents());
        updateDashboardStats();
        JOptionPane.showMessageDialog(this,
                "Student details updated successfully for Roll No: " + rollNo,
                "Updated", JOptionPane.INFORMATION_MESSAGE);
    }

    /**
     * Deletes a student after asking for user confirmation.
     */
    private void handleDeleteStudent() {
        String rollNo = txtRollNo.getText().trim();
        if (rollNo.isEmpty()) {
            JOptionPane.showMessageDialog(this,
                    "Please enter or select a Roll Number to delete.",
                    "Notice", JOptionPane.WARNING_MESSAGE);
            return;
        }

        if (!studentManager.isRollNoExists(rollNo)) {
            JOptionPane.showMessageDialog(this,
                    "No student found with Roll Number: " + rollNo,
                    "Not Found", JOptionPane.ERROR_MESSAGE);
            return;
        }

        int choice = JOptionPane.showConfirmDialog(this,
                "Are you sure you want to permanently delete student with Roll No '" + rollNo + "'?\\n" +
                "(Record will be removed from memory)",
                "Confirm Deletion", JOptionPane.YES_NO_OPTION, JOptionPane.QUESTION_MESSAGE);

        if (choice == JOptionPane.YES_OPTION) {
            studentManager.deleteStudent(rollNo);
            renderTableData(studentManager.getAllStudents());
            updateDashboardStats();
            clearInputFields();
            JOptionPane.showMessageDialog(this,
                    "Student record deleted successfully.",
                    "Deleted", JOptionPane.INFORMATION_MESSAGE);
        }
    }

    /**
     * Searches for a student by roll number.
     */
    private void handleSearch() {
        String query = txtSearchRollNo.getText().trim();
        if (query.isEmpty()) {
            JOptionPane.showMessageDialog(this,
                    "Please enter a Roll Number to search.",
                    "Notice", JOptionPane.WARNING_MESSAGE);
            return;
        }

        Student found = studentManager.searchByRollNo(query);
        if (found != null) {
            // Display only this student in table
            ArrayList<Student> single = new ArrayList<>();
            single.add(found);
            renderTableData(single);
            populateForm(found);
            JOptionPane.showMessageDialog(this,
                    "Student found! Details loaded into the form.",
                    "Search Result", JOptionPane.INFORMATION_MESSAGE);
        } else {
            JOptionPane.showMessageDialog(this,
                    "No student found matching Roll Number: " + query,
                    "Not Found", JOptionPane.INFORMATION_MESSAGE);
        }
    }

    /**
     * Populates the input form fields with an existing Student object's details.
     */
    private void populateForm(Student s) {
        txtRollNo.setText(s.getRollNo());
        txtName.setText(s.getName());
        cmbDepartment.setSelectedItem(s.getDepartment());
        cmbYear.setSelectedItem(s.getYear());
        txtPhone.setText(s.getPhoneNumber());
        txtMark1.setText(String.valueOf(s.getMark1()));
        txtMark2.setText(String.valueOf(s.getMark2()));
        txtMark3.setText(String.valueOf(s.getMark3()));
        txtMark4.setText(String.valueOf(s.getMark4()));
        txtMark5.setText(String.valueOf(s.getMark5()));

        lblTotalPreview.setText("Total: " + s.calculateTotalMarks() + " / 500");
        lblPercentagePreview.setText("Percentage: " + String.format("%.2f", s.calculatePercentage()) + "%");
        lblResultPreview.setText("Result: " + s.getResult() + " (" + s.getGrade() + ")");
    }

    /**
     * Clears all inputs and resets live previews.
     */
    private void clearInputFields() {
        txtRollNo.setText("");
        txtName.setText("");
        cmbDepartment.setSelectedIndex(0);
        cmbYear.setSelectedIndex(0);
        txtPhone.setText("");
        txtMark1.setText("");
        txtMark2.setText("");
        txtMark3.setText("");
        txtMark4.setText("");
        txtMark5.setText("");
        lblTotalPreview.setText("Total: - / 500");
        lblPercentagePreview.setText("Percentage: - %");
        lblResultPreview.setText("Result: -");
        studentTable.clearSelection();
    }

    /**
     * Updates the JTable rows from the given list of students.
     */
    private void renderTableData(ArrayList<Student> list) {
        tableModel.setRowCount(0); // Clear current rows
        for (Student s : list) {
            Object[] row = {
                    s.getRollNo(),
                    s.getName(),
                    s.getDepartment(),
                    s.getYear(),
                    s.getPhoneNumber(),
                    String.format("%.1f", s.calculateTotalMarks()),
                    String.format("%.2f%%", s.calculatePercentage()),
                    s.getGrade(),
                    s.getResult()
            };
            tableModel.addRow(row);
        }
    }

    /**
     * Updates the 4 dashboard metric cards.
     */
    private void updateDashboardStats() {
        lblStatTotal.setText(String.valueOf(studentManager.getTotalCount()));
        lblStatPassed.setText(String.valueOf(studentManager.getPassCount()));
        lblStatFailed.setText(String.valueOf(studentManager.getFailCount()));
        lblStatAverage.setText(String.format("%.1f%%", studentManager.getAveragePercentage()));
    }

    private boolean isOutOfRange(double mark) {
        return mark < 0.0 || mark > 100.0;
    }

    /**
     * Pre-populates sample students for demonstration during college viva/presentation.
     */
    private void loadSampleData() {
        studentManager.clearAll();
        studentManager.addStudent(new Student("CS101", "Aarav Sharma", "Computer Science & Engineering (CSE)", "3rd Year", "9876543210", 92, 88, 95, 89, 94));
        studentManager.addStudent(new Student("CS102", "Priya Patel", "Computer Science & Engineering (CSE)", "3rd Year", "9823456789", 78, 82, 85, 74, 80));
        studentManager.addStudent(new Student("IT201", "Rohan Verma", "Information Technology (IT)", "2nd Year", "9123456780", 65, 70, 68, 62, 74));
        studentManager.addStudent(new Student("EC305", "Ananya Iyer", "Electronics & Communication (ECE)", "4th Year", "9988776655", 88, 91, 84, 86, 90));
        studentManager.addStudent(new Student("ME402", "Vikram Singh", "Mechanical Engineering (ME)", "1st Year", "9765432109", 32, 45, 52, 40, 48)); // Failed

        renderTableData(studentManager.getAllStudents());
        updateDashboardStats();
    }

    private void clearAllRecords() {
        int confirm = JOptionPane.showConfirmDialog(this,
                "Clear all student records from memory?",
                "Confirm", JOptionPane.YES_NO_OPTION);
        if (confirm == JOptionPane.YES_OPTION) {
            studentManager.clearAll();
            renderTableData(studentManager.getAllStudents());
            updateDashboardStats();
            clearInputFields();
        }
    }

    private void showAboutDialog() {
        JOptionPane.showMessageDialog(this,
                "Student Management System v1.0\\n" +
                "Language: Java 8+\\n" +
                "Framework: Java Swing & AWT\\n" +
                "Architecture: In-Memory (ArrayList)\\n" +
                "Design: Desktop GUI Application\\n" +
                "Developed for: Academic College Submission",
                "About Project", JOptionPane.INFORMATION_MESSAGE);
    }

    /**
     * Main entry point of the Java Desktop Application.
     */
    public static void main(String[] args) {
        // Set Look and Feel for modern appearance
        try {
            for (UIManager.LookAndFeelInfo info : UIManager.getInstalledLookAndFeels()) {
                if ("Nimbus".equals(info.getName())) {
                    UIManager.setLookAndFeel(info.getClassName());
                    break;
                }
            }
        } catch (Exception ignored) {
            // Fallback to default Swing Look & Feel
        }

        // Run GUI on Event Dispatch Thread (Swing best practice)
        SwingUtilities.invokeLater(() -> {
            StudentManagementApp app = new StudentManagementApp();
            app.setVisible(true);
        });
    }
}
`
  },
  {
    filename: 'StudentManagementSystem.java',
    description: 'Single-file runnable edition containing Student, StudentManager, and Swing GUI for single-file submission requirements.',
    packageDescription: 'All-In-One Single File (Convenient for 1-File College Submissions)',
    code: `import javax.swing.*;
import javax.swing.border.EmptyBorder;
import javax.swing.border.TitledBorder;
import javax.swing.table.DefaultTableCellRenderer;
import javax.swing.table.DefaultTableModel;
import javax.swing.table.JTableHeader;
import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.util.ArrayList;

/**
 * ============================================================================
 * PROJECT: STUDENT MANAGEMENT SYSTEM (ALL-IN-ONE SINGLE FILE EDITION)
 * ============================================================================
 * 
 * Instructions:
 * 1. Save this exact code in a file named: StudentManagementSystem.java
 * 2. Open Command Prompt / Terminal in that folder.
 * 3. Compile: javac StudentManagementSystem.java
 * 4. Run:     java StudentManagementSystem
 * 
 * Features:
 * - In-Memory ArrayList storage (Without Database)
 * - Complete Java Swing GUI
 * - Add, View, Search, Update, Delete students
 * - Live Total, Percentage, Grade & Pass/Fail calculations
 * - Input validation & duplicate roll number prevention
 * ============================================================================
 */

// Model Class
class StudentModel {
    private String rollNo;
    private String name;
    private String department;
    private String year;
    private String phoneNumber;
    private double m1, m2, m3, m4, m5;

    public StudentModel(String rollNo, String name, String department, String year,
                        String phoneNumber, double m1, double m2, double m3, double m4, double m5) {
        this.rollNo = rollNo;
        this.name = name;
        this.department = department;
        this.year = year;
        this.phoneNumber = phoneNumber;
        this.m1 = m1;
        this.m2 = m2;
        this.m3 = m3;
        this.m4 = m4;
        this.m5 = m5;
    }

    public double calculateTotal() {
        return m1 + m2 + m3 + m4 + m5;
    }

    public double calculatePercentage() {
        return calculateTotal() / 5.0;
    }

    public String getResult() {
        if (m1 < 35 || m2 < 35 || m3 < 35 || m4 < 35 || m5 < 35) return "FAIL";
        return calculatePercentage() >= 40.0 ? "PASS" : "FAIL";
    }

    public String getGrade() {
        if ("FAIL".equals(getResult())) return "F";
        double p = calculatePercentage();
        if (p >= 90) return "A+";
        if (p >= 80) return "A";
        if (p >= 70) return "B";
        if (p >= 60) return "C";
        return "D";
    }

    public String getRollNo() { return rollNo; }
    public void setRollNo(String rollNo) { this.rollNo = rollNo; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getYear() { return year; }
    public void setYear(String year) { this.year = year; }
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    public double getM1() { return m1; }
    public double getM2() { return m2; }
    public double getM3() { return m3; }
    public double getM4() { return m4; }
    public double getM5() { return m5; }
}

// Controller / Business Logic Class
class ManagerController {
    private final ArrayList<StudentModel> list = new ArrayList<>();

    public boolean isRollNoExists(String rollNo) {
        for (StudentModel s : list) {
            if (s.getRollNo().equalsIgnoreCase(rollNo.trim())) return true;
        }
        return false;
    }

    public boolean addStudent(StudentModel s) {
        if (isRollNoExists(s.getRollNo())) return false;
        list.add(s);
        return true;
    }

    public ArrayList<StudentModel> getAll() {
        return new ArrayList<>(list);
    }

    public StudentModel search(String rollNo) {
        for (StudentModel s : list) {
            if (s.getRollNo().equalsIgnoreCase(rollNo.trim())) return s;
        }
        return null;
    }

    public boolean update(String rollNo, StudentModel updated) {
        for (int i = 0; i < list.size(); i++) {
            if (list.get(i).getRollNo().equalsIgnoreCase(rollNo.trim())) {
                updated.setRollNo(list.get(i).getRollNo());
                list.set(i, updated);
                return true;
            }
        }
        return false;
    }

    public boolean delete(String rollNo) {
        for (int i = 0; i < list.size(); i++) {
            if (list.get(i).getRollNo().equalsIgnoreCase(rollNo.trim())) {
                list.remove(i);
                return true;
            }
        }
        return false;
    }

    public int getTotal() { return list.size(); }
    public int getPassed() {
        int c = 0;
        for (StudentModel s : list) if ("PASS".equals(s.getResult())) c++;
        return c;
    }
    public int getFailed() {
        int c = 0;
        for (StudentModel s : list) if ("FAIL".equals(s.getResult())) c++;
        return c;
    }
    public double getAvg() {
        if (list.isEmpty()) return 0.0;
        double s = 0.0;
        for (StudentModel st : list) s += st.calculatePercentage();
        return s / list.size();
    }
}

// Main Swing Application Frame
public class StudentManagementSystem extends JFrame {
    private final ManagerController manager = new ManagerController();

    private JTextField txtRoll, txtName, txtPhone, txtM1, txtM2, txtM3, txtM4, txtM5, txtSearch;
    private JComboBox<String> cmbDept, cmbYear;
    private JLabel lblTotal, lblPct, lblRes, lblCardTotal, lblCardPass, lblCardFail, lblCardAvg;
    private JTable table;
    private DefaultTableModel model;

    public StudentManagementSystem() {
        setTitle("Student Management System (In-Memory ArrayList)");
        setSize(1150, 700);
        setMinimumSize(new Dimension(980, 600));
        setLocationRelativeTo(null);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLayout(new BorderLayout(8, 8));

        initUI();
        seedSampleData();
        refreshStats();
    }

    private void initUI() {
        // North Header
        JPanel pnlHeader = new JPanel(new BorderLayout());
        pnlHeader.setBackground(new Color(24, 43, 73));
        pnlHeader.setBorder(new EmptyBorder(12, 20, 12, 20));
        JLabel title = new JLabel("STUDENT MANAGEMENT SYSTEM");
        title.setFont(new Font("Segoe UI", Font.BOLD, 20));
        title.setForeground(Color.WHITE);
        JLabel subtitle = new JLabel("College Project • Java Swing • In-Memory ArrayList Mode (No Database)");
        subtitle.setForeground(new Color(180, 205, 237));
        JPanel titleBox = new JPanel(new GridLayout(2, 1));
        titleBox.setOpaque(false);
        titleBox.add(title);
        titleBox.add(subtitle);
        pnlHeader.add(titleBox, BorderLayout.WEST);
        add(pnlHeader, BorderLayout.NORTH);

        // Center split
        JSplitPane split = new JSplitPane(JSplitPane.HORIZONTAL_SPLIT, buildFormPanel(), buildTablePanel());
        split.setDividerLocation(370);
        add(split, BorderLayout.CENTER);

        // Footer Notice
        JPanel pnlFooter = new JPanel(new FlowLayout(FlowLayout.LEFT));
        pnlFooter.setBackground(new Color(248, 250, 252));
        JLabel note = new JLabel("Note: Data is saved in-memory (RAM) and resets when this window is closed.");
        note.setForeground(new Color(180, 83, 9));
        pnlFooter.add(note);
        add(pnlFooter, BorderLayout.SOUTH);
    }

    private JPanel buildFormPanel() {
        JPanel p = new JPanel(new BorderLayout(5, 5));
        p.setBorder(new EmptyBorder(10, 10, 10, 5));

        JPanel form = new JPanel(new GridLayout(10, 2, 6, 6));
        form.setBorder(BorderFactory.createTitledBorder("Student Details"));

        txtRoll = new JTextField();
        txtName = new JTextField();
        cmbDept = new JComboBox<>(new String[]{"CSE", "IT", "ECE", "ME", "Civil"});
        cmbYear = new JComboBox<>(new String[]{"1st Year", "2nd Year", "3rd Year", "4th Year"});
        txtPhone = new JTextField();
        txtM1 = new JTextField();
        txtM2 = new JTextField();
        txtM3 = new JTextField();
        txtM4 = new JTextField();
        txtM5 = new JTextField();

        form.add(new JLabel("Roll Number:*")); form.add(txtRoll);
        form.add(new JLabel("Student Name:*")); form.add(txtName);
        form.add(new JLabel("Department:")); form.add(cmbDept);
        form.add(new JLabel("Year:")); form.add(cmbYear);
        form.add(new JLabel("Phone (10 digits):*")); form.add(txtPhone);
        form.add(new JLabel("Subject 1 (Java):*")); form.add(txtM1);
        form.add(new JLabel("Subject 2 (DSA):*")); form.add(txtM2);
        form.add(new JLabel("Subject 3 (DBMS):*")); form.add(txtM3);
        form.add(new JLabel("Subject 4 (OS):*")); form.add(txtM4);
        form.add(new JLabel("Subject 5 (CN):*")); form.add(txtM5);

        JPanel metrics = new JPanel(new GridLayout(1, 3));
        lblTotal = new JLabel("Total: -");
        lblPct = new JLabel("Pct: -");
        lblRes = new JLabel("Result: -");
        metrics.add(lblTotal); metrics.add(lblPct); metrics.add(lblRes);

        JPanel btnGrid = new JPanel(new GridLayout(2, 2, 6, 6));
        JButton btnAdd = new JButton("Add Student");
        JButton btnUpd = new JButton("Update");
        JButton btnDel = new JButton("Delete");
        JButton btnClr = new JButton("Clear");

        btnAdd.setBackground(new Color(16, 185, 129)); btnAdd.setForeground(Color.WHITE);
        btnUpd.setBackground(new Color(245, 158, 11)); btnUpd.setForeground(Color.WHITE);
        btnDel.setBackground(new Color(239, 68, 68));  btnDel.setForeground(Color.WHITE);
        btnClr.setBackground(new Color(100, 116, 139)); btnClr.setForeground(Color.WHITE);

        btnAdd.addActionListener(e -> addStudentAction());
        btnUpd.addActionListener(e -> updateAction());
        btnDel.addActionListener(e -> deleteAction());
        btnClr.addActionListener(e -> clearInputs());

        btnGrid.add(btnAdd); btnGrid.add(btnUpd);
        btnGrid.add(btnDel); btnGrid.add(btnClr);

        JPanel topBox = new JPanel(new BorderLayout());
        topBox.add(form, BorderLayout.CENTER);
        topBox.add(metrics, BorderLayout.SOUTH);

        p.add(topBox, BorderLayout.CENTER);
        p.add(btnGrid, BorderLayout.SOUTH);
        return p;
    }

    private JPanel buildTablePanel() {
        JPanel p = new JPanel(new BorderLayout(5, 5));
        p.setBorder(new EmptyBorder(10, 5, 10, 10));

        // Stats cards
        JPanel stats = new JPanel(new GridLayout(1, 4, 8, 8));
        lblCardTotal = new JLabel("0", SwingConstants.CENTER);
        lblCardPass = new JLabel("0", SwingConstants.CENTER);
        lblCardFail = new JLabel("0", SwingConstants.CENTER);
        lblCardAvg = new JLabel("0.0%", SwingConstants.CENTER);

        stats.add(makeStatCard("Total", lblCardTotal, new Color(59, 130, 246)));
        stats.add(makeStatCard("Passed", lblCardPass, new Color(16, 185, 129)));
        stats.add(makeStatCard("Failed", lblCardFail, new Color(239, 68, 68)));
        stats.add(makeStatCard("Class Avg", lblCardAvg, new Color(139, 92, 246)));

        // Search bar
        JPanel searchBar = new JPanel(new FlowLayout(FlowLayout.LEFT));
        searchBar.add(new JLabel("Search Roll No:"));
        txtSearch = new JTextField(12);
        JButton btnSearch = new JButton("Search");
        JButton btnReset = new JButton("Reset");
        btnSearch.addActionListener(e -> searchAction());
        btnReset.addActionListener(e -> {
            txtSearch.setText("");
            renderTable(manager.getAll());
        });
        searchBar.add(txtSearch); searchBar.add(btnSearch); searchBar.add(btnReset);

        JPanel topSection = new JPanel(new BorderLayout());
        topSection.add(stats, BorderLayout.NORTH);
        topSection.add(searchBar, BorderLayout.SOUTH);

        // Table
        String[] cols = {"Roll No", "Name", "Dept", "Year", "Phone", "Total", "Percentage", "Grade", "Result"};
        model = new DefaultTableModel(cols, 0) {
            @Override public boolean isCellEditable(int r, int c) { return false; }
        };
        table = new JTable(model);
        table.setRowHeight(24);

        table.addMouseListener(new MouseAdapter() {
            @Override public void mouseClicked(MouseEvent e) {
                int row = table.getSelectedRow();
                if (row != -1) {
                    String roll = (String) model.getValueAt(row, 0);
                    StudentModel s = manager.search(roll);
                    if (s != null) fillInputs(s);
                }
            }
        });

        p.add(topSection, BorderLayout.NORTH);
        p.add(new JScrollPane(table), BorderLayout.CENTER);
        return p;
    }

    private JPanel makeStatCard(String title, JLabel valLabel, Color c) {
        JPanel card = new JPanel(new BorderLayout());
        card.setBackground(Color.WHITE);
        card.setBorder(BorderFactory.createLineBorder(new Color(226, 232, 240)));
        JLabel t = new JLabel(title, SwingConstants.CENTER);
        t.setFont(new Font("Segoe UI", Font.PLAIN, 11));
        valLabel.setFont(new Font("Segoe UI", Font.BOLD, 16));
        valLabel.setForeground(c);
        card.add(t, BorderLayout.NORTH);
        card.add(valLabel, BorderLayout.CENTER);
        return card;
    }

    private void addStudentAction() {
        String roll = txtRoll.getText().trim();
        String name = txtName.getText().trim();
        String phone = txtPhone.getText().trim();

        if (roll.isEmpty() || name.isEmpty() || phone.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Please fill in all mandatory fields.", "Validation Error", JOptionPane.WARNING_MESSAGE);
            return;
        }

        if (manager.isRollNoExists(roll)) {
            JOptionPane.showMessageDialog(this, "Roll Number already exists! Use a unique Roll No.", "Duplicate Error", JOptionPane.ERROR_MESSAGE);
            return;
        }

        try {
            double m1 = Double.parseDouble(txtM1.getText().trim());
            double m2 = Double.parseDouble(txtM2.getText().trim());
            double m3 = Double.parseDouble(txtM3.getText().trim());
            double m4 = Double.parseDouble(txtM4.getText().trim());
            double m5 = Double.parseDouble(txtM5.getText().trim());

            if (m1 < 0 || m1 > 100 || m2 < 0 || m2 > 100 || m3 < 0 || m3 > 100 || m4 < 0 || m4 > 100 || m5 < 0 || m5 > 100) {
                JOptionPane.showMessageDialog(this, "Marks must be between 0 and 100.", "Invalid Marks", JOptionPane.ERROR_MESSAGE);
                return;
            }

            StudentModel s = new StudentModel(roll, name, (String) cmbDept.getSelectedItem(), (String) cmbYear.getSelectedItem(), phone, m1, m2, m3, m4, m5);
            manager.addStudent(s);
            renderTable(manager.getAll());
            refreshStats();
            clearInputs();
            JOptionPane.showMessageDialog(this, "Student added successfully!", "Success", JOptionPane.INFORMATION_MESSAGE);
        } catch (NumberFormatException ex) {
            JOptionPane.showMessageDialog(this, "Please enter valid numeric marks.", "Format Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    private void updateAction() {
        String roll = txtRoll.getText().trim();
        if (roll.isEmpty() || !manager.isRollNoExists(roll)) {
            JOptionPane.showMessageDialog(this, "Roll Number not found to update.", "Error", JOptionPane.ERROR_MESSAGE);
            return;
        }
        try {
            double m1 = Double.parseDouble(txtM1.getText().trim());
            double m2 = Double.parseDouble(txtM2.getText().trim());
            double m3 = Double.parseDouble(txtM3.getText().trim());
            double m4 = Double.parseDouble(txtM4.getText().trim());
            double m5 = Double.parseDouble(txtM5.getText().trim());

            StudentModel s = new StudentModel(roll, txtName.getText().trim(), (String) cmbDept.getSelectedItem(), (String) cmbYear.getSelectedItem(), txtPhone.getText().trim(), m1, m2, m3, m4, m5);
            manager.update(roll, s);
            renderTable(manager.getAll());
            refreshStats();
            JOptionPane.showMessageDialog(this, "Student updated successfully!", "Success", JOptionPane.INFORMATION_MESSAGE);
        } catch (Exception ex) {
            JOptionPane.showMessageDialog(this, "Invalid inputs for update.", "Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    private void deleteAction() {
        String roll = txtRoll.getText().trim();
        if (roll.isEmpty() || !manager.isRollNoExists(roll)) {
            JOptionPane.showMessageDialog(this, "Select a valid student roll number to delete.", "Error", JOptionPane.ERROR_MESSAGE);
            return;
        }
        int confirm = JOptionPane.showConfirmDialog(this, "Delete student " + roll + "?", "Confirm", JOptionPane.YES_NO_OPTION);
        if (confirm == JOptionPane.YES_OPTION) {
            manager.delete(roll);
            renderTable(manager.getAll());
            refreshStats();
            clearInputs();
            JOptionPane.showMessageDialog(this, "Record deleted from memory.", "Deleted", JOptionPane.INFORMATION_MESSAGE);
        }
    }

    private void searchAction() {
        String roll = txtSearch.getText().trim();
        if (roll.isEmpty()) return;
        StudentModel s = manager.search(roll);
        if (s != null) {
            ArrayList<StudentModel> res = new ArrayList<>();
            res.add(s);
            renderTable(res);
            fillInputs(s);
        } else {
            JOptionPane.showMessageDialog(this, "No record found for Roll: " + roll, "Search Result", JOptionPane.INFORMATION_MESSAGE);
        }
    }

    private void fillInputs(StudentModel s) {
        txtRoll.setText(s.getRollNo());
        txtName.setText(s.getName());
        cmbDept.setSelectedItem(s.getDepartment());
        cmbYear.setSelectedItem(s.getYear());
        txtPhone.setText(s.getPhoneNumber());
        txtM1.setText(String.valueOf(s.getM1()));
        txtM2.setText(String.valueOf(s.getM2()));
        txtM3.setText(String.valueOf(s.getM3()));
        txtM4.setText(String.valueOf(s.getM4()));
        txtM5.setText(String.valueOf(s.getM5()));

        lblTotal.setText("Total: " + s.calculateTotal() + "/500");
        lblPct.setText("Pct: " + String.format("%.1f%%", s.calculatePercentage()));
        lblRes.setText("Result: " + s.getResult());
    }

    private void clearInputs() {
        txtRoll.setText(""); txtName.setText(""); txtPhone.setText("");
        txtM1.setText(""); txtM2.setText(""); txtM3.setText(""); txtM4.setText(""); txtM5.setText("");
        lblTotal.setText("Total: -"); lblPct.setText("Pct: -"); lblRes.setText("Result: -");
        table.clearSelection();
    }

    private void renderTable(ArrayList<StudentModel> list) {
        model.setRowCount(0);
        for (StudentModel s : list) {
            model.addRow(new Object[]{
                    s.getRollNo(), s.getName(), s.getDepartment(), s.getYear(), s.getPhoneNumber(),
                    String.format("%.0f", s.calculateTotal()), String.format("%.1f%%", s.calculatePercentage()),
                    s.getGrade(), s.getResult()
            });
        }
    }

    private void refreshStats() {
        lblCardTotal.setText(String.valueOf(manager.getTotal()));
        lblCardPass.setText(String.valueOf(manager.getPassed()));
        lblCardFail.setText(String.valueOf(manager.getFailed()));
        lblCardAvg.setText(String.format("%.1f%%", manager.getAvg()));
    }

    private void seedSampleData() {
        manager.addStudent(new StudentModel("CS101", "Aarav Sharma", "CSE", "3rd Year", "9876543210", 92, 88, 95, 89, 94));
        manager.addStudent(new StudentModel("CS102", "Priya Patel", "CSE", "3rd Year", "9823456789", 78, 82, 85, 74, 80));
        manager.addStudent(new StudentModel("IT201", "Rohan Verma", "IT", "2nd Year", "9123456780", 65, 70, 68, 62, 74));
        manager.addStudent(new StudentModel("ME402", "Vikram Singh", "ME", "1st Year", "9765432109", 30, 45, 52, 40, 48)); // Fail
        renderTable(manager.getAll());
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            new StudentManagementSystem().setVisible(true);
        });
    }
}
`
  }
];
