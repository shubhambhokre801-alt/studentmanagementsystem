export interface RunStep {
  title: string;
  description: string;
  command?: string;
  tips?: string[];
}

export interface IDEGuide {
  id: string;
  name: string;
  icon: string;
  subtitle: string;
  steps: RunStep[];
}

export const HOW_TO_RUN_GUIDES: IDEGuide[] = [
  {
    id: 'cmd-notepad',
    name: 'Command Prompt & Notepad',
    icon: 'Terminal',
    subtitle: 'Classic beginner method suitable for college lab exams and viva',
    steps: [
      {
        title: 'Step 1: Check if JDK is Installed',
        description: 'Open Command Prompt (cmd) on Windows or Terminal on macOS/Linux. Type the command below to ensure JDK is installed and registered in your system PATH.',
        command: 'javac -version\njava -version',
        tips: [
          'If you see "javac 17.x.x" (or 8, 11, 21), your JDK is ready!',
          'If you see "\'javac\' is not recognized", you need to install JDK and configure PATH (see troubleshooting below).'
        ]
      },
      {
        title: 'Step 2: Create a Dedicated Folder',
        description: 'Create a new folder on your computer (e.g. on Desktop or Documents named "StudentManagementProject").',
        command: 'mkdir StudentManagementProject\ncd StudentManagementProject',
        tips: ['Keep all .java files inside this single directory.']
      },
      {
        title: 'Step 3: Save the Java Source Files',
        description: 'Open Notepad or any text editor. Copy each Java file and save them with their exact filenames and .java extension (choose "All Files (*.*)" in Notepad so it doesn\'t save as .txt):',
        tips: [
          'Option A (Modular, Recommended for OOP grading): Save Student.java, StudentManager.java, and StudentManagementApp.java',
          'Option B (Single File): Save StudentManagementSystem.java'
        ]
      },
      {
        title: 'Step 4: Compile the Java Source Code',
        description: 'Navigate to the project directory in your terminal and compile the files using the Java Compiler (javac):',
        command: '# For Modular setup:\njavac Student.java StudentManager.java StudentManagementApp.java\n# Or simply compile all files:\njavac *.java\n\n# If using the Single-File edition:\njavac StudentManagementSystem.java',
        tips: [
          'When compilation succeeds, javac produces .class bytecode files in the directory without any error messages.'
        ]
      },
      {
        title: 'Step 5: Run the Desktop GUI Application',
        description: 'Execute the Java application using the Java Virtual Machine (JVM):',
        command: '# For Modular setup:\njava StudentManagementApp\n\n# For Single-File edition:\njava StudentManagementSystem',
        tips: [
          'Note: Do NOT type .class or .java when running with java command (type java StudentManagementApp, not java StudentManagementApp.class).',
          'The desktop GUI window will appear immediately on your screen!'
        ]
      }
    ]
  },
  {
    id: 'vscode',
    name: 'Visual Studio Code',
    icon: 'Code2',
    subtitle: 'Modern code editor workflow with syntax highlighting and Run button',
    steps: [
      {
        title: 'Step 1: Install Extension Pack for Java',
        description: 'Open VS Code. Go to the Extensions panel (Ctrl+Shift+X or Cmd+Shift+X). Search for "Extension Pack for Java" by Microsoft and click Install.',
        tips: ['This extension bundle includes language support, debugger, and project runner.']
      },
      {
        title: 'Step 2: Open Project Folder',
        description: 'In VS Code, click File -> Open Folder... and select your "StudentManagementProject" folder containing the .java files.',
      },
      {
        title: 'Step 3: Run with One Click',
        description: 'Open StudentManagementApp.java (or StudentManagementSystem.java). You will see a small "Run | Debug" button floating directly above the "public static void main(String[] args)" line.',
        tips: [
          'Click "Run", or press F5 / Ctrl+F5.',
          'The Java Swing desktop window will launch directly!'
        ]
      }
    ]
  },
  {
    id: 'intellij-eclipse',
    name: 'IntelliJ IDEA / Eclipse',
    icon: 'Layers',
    subtitle: 'Full IDE workflow for academic lab project submissions',
    steps: [
      {
        title: 'Step 1: Create a New Java Project',
        description: 'In IntelliJ IDEA: Click File -> New -> Project -> Select Java SDK -> Click Next -> Finish.\nIn Eclipse: Click File -> New -> Java Project -> Name the project -> Finish.',
      },
      {
        title: 'Step 2: Add Files into the src/ Directory',
        description: 'Copy Student.java, StudentManager.java, and StudentManagementApp.java into the "src" folder of your project.',
      },
      {
        title: 'Step 3: Run the Main Class',
        description: 'Right-click StudentManagementApp.java -> Click "Run \'StudentManagementApp.main()\'".',
        tips: ['The GUI window pops up with full native Java Swing controls!']
      }
    ]
  }
];

export const TROUBLESHOOTING_TIPS = [
  {
    error: "'javac' is not recognized as an internal or external command",
    cause: "The JDK 'bin' folder is not added to your system's PATH environment variable.",
    solution: "1. Find where Java is installed (e.g., C:\\Program Files\\Java\\jdk-17\\bin).\n2. Search Windows for 'Environment Variables'.\n3. Under System Variables, select 'Path' -> click Edit -> click New -> paste the bin path.\n4. Restart Command Prompt and test with 'javac -version'."
  },
  {
    error: "Error: Could not find or load main class StudentManagementApp",
    cause: "Running the command from the wrong folder, or accidentally typing '.class' or '.java' after the class name.",
    solution: "Make sure you are in the exact directory where the .class files were generated. Type 'java StudentManagementApp' without any extension."
  },
  {
    error: "Data resets after closing the application",
    cause: "Expected behavior by design! The project strictly fulfills the requirement of 'Without database', using an in-memory ArrayList<Student> in RAM.",
    solution: "This is a key requirement of the college assignment. Explain to your teacher that data resides in RAM during application lifecycle, which is standard for in-memory GUI submissions."
  }
];
