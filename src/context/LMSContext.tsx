import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Role,
  UserProfile,
  CourseModule,
  AttendanceEntry,
  Assignment,
  Submission,
  Quiz,
  StudentQuizResult,
  FeeRecord,
  Trainer,
  ActivityLog,
  ActivityActionType,
  ActivityCategory,
} from '../types';
import {
  INITIAL_STUDENT_PROFILE,
  INITIAL_TEACHER_PROFILE,
  INITIAL_ADMIN_PROFILE,
  ALL_STUDENTS_LIST,
  INITIAL_MODULES,
  INITIAL_ATTENDANCE,
  INITIAL_ASSIGNMENTS,
  INITIAL_SUBMISSIONS,
  INITIAL_QUIZZES,
  INITIAL_STUDENT_QUIZ_RESULTS,
  INITIAL_FEE_RECORDS,
  INITIAL_TRAINERS,
  INITIAL_ACTIVITY_LOGS,
} from '../data/mockData';

export type StudentTab = 'dashboard' | 'progress' | 'attendance' | 'payment' | 'assignment' | 'quiz' | 'profile';
export type TeacherTab = 'students' | 'attendance' | 'assignments' | 'quizzes';
export type AdminTab = 'trainers' | 'studentProgress' | 'activityLog';

interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface LMSContextType {
  isAuthenticated: boolean;
  login: (role: Role, credentials?: { cnic?: string; email?: string; password?: string }) => void;
  logout: () => void;
  registerPassword: (cnic: string, dob: string, password: string) => boolean;
  role: Role;
  setRole: (role: Role) => void;
  currentUser: UserProfile;
  updateUserProfile: (data: Partial<UserProfile>) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  studentTab: StudentTab;
  setStudentTab: (tab: StudentTab) => void;
  teacherTab: TeacherTab;
  setTeacherTab: (tab: TeacherTab) => void;
  adminTab: AdminTab;
  setAdminTab: (tab: AdminTab) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  // Data states
  students: UserProfile[];
  modules: CourseModule[];
  attendance: AttendanceEntry[];
  assignments: Assignment[];
  submissions: Submission[];
  quizzes: Quiz[];
  quizResults: StudentQuizResult[];
  feeRecords: FeeRecord[];
  trainers: Trainer[];
  activityLogs: ActivityLog[];
  notifications: ToastNotification[];

  // Actions
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
  markAttendance: (records: { studentId: string; rollNumber: string; studentName: string; status: 'PRESENT' | 'ABSENT' | 'LEAVE'; date: string; classNumber: number }[]) => void;
  submitAssignment: (assignmentId: string, repoUrl: string, liveUrl: string, remarks?: string) => void;
  gradeSubmission: (submissionId: string, status: 'APPROVED' | 'REJECTED', score?: number, feedback?: string) => void;
  createAssignment: (newAsg: Omit<Assignment, 'id' | 'createdAt'>) => void;
  updateAssignment: (id: string, update: Partial<Assignment>) => void;
  deleteAssignment: (id: string) => void;
  createQuiz: (newQuiz: Omit<Quiz, 'id'>) => void;
  submitQuizAttempt: (quizId: string, scorePercentage: number) => void;
  addStudent: (studentData: Omit<UserProfile, 'id'>) => void;
  updateStudentStatus: (studentId: string, status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED') => void;
  addTrainer: (trainerData: Omit<Trainer, 'id'>) => void;
  updateTrainer: (id: string, update: Partial<Trainer>) => void;
  deleteTrainer: (id: string) => void;
  addActivityLog: (entry: Omit<ActivityLog, 'id' | 'timestamp'>) => void;
  clearActivityLogs: () => void;
  toggleTopicCompletion: (moduleId: string, topicId: string) => void;
  resetAllData: () => void;
}

const LMSContext = createContext<LMSContextType | undefined>(undefined);

export const LMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('smit_lms_auth') === 'true';
  });

  const [role, setRoleState] = useState<Role>(() => {
    return (localStorage.getItem('smit_lms_role') as Role) || 'student';
  });

  const [studentTab, setStudentTab] = useState<StudentTab>('dashboard');
  const [teacherTab, setTeacherTab] = useState<TeacherTab>('students');
  const [adminTab, setAdminTab] = useState<AdminTab>('trainers');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return true;
  });
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);

  // Stored state items
  const [students, setStudents] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('smit_students');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= ALL_STUDENTS_LIST.length) {
          return parsed;
        }
      } catch (e) {
        console.error('Failed to parse smit_students', e);
      }
    }
    return ALL_STUDENTS_LIST;
  });

  const [modules, setModules] = useState<CourseModule[]>(() => {
    const saved = localStorage.getItem('smit_modules');
    return saved ? JSON.parse(saved) : INITIAL_MODULES;
  });

  const [attendance, setAttendance] = useState<AttendanceEntry[]>(() => {
    const saved = localStorage.getItem('smit_attendance');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem('smit_assignments');
    return saved ? JSON.parse(saved) : INITIAL_ASSIGNMENTS;
  });

  const [submissions, setSubmissions] = useState<Submission[]>(() => {
    const saved = localStorage.getItem('smit_submissions');
    return saved ? JSON.parse(saved) : INITIAL_SUBMISSIONS;
  });

  const [quizzes, setQuizzes] = useState<Quiz[]>(() => {
    const saved = localStorage.getItem('smit_quizzes');
    return saved ? JSON.parse(saved) : INITIAL_QUIZZES;
  });

  const [quizResults, setQuizResults] = useState<StudentQuizResult[]>(() => {
    const saved = localStorage.getItem('smit_quiz_results');
    return saved ? JSON.parse(saved) : INITIAL_STUDENT_QUIZ_RESULTS;
  });

  const [feeRecords] = useState<FeeRecord[]>(INITIAL_FEE_RECORDS);

  const [trainers, setTrainers] = useState<Trainer[]>(() => {
    const saved = localStorage.getItem('smit_trainers');
    return saved ? JSON.parse(saved) : INITIAL_TRAINERS;
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('smit_activity_logs');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITY_LOGS;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('smit_lms_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('smit_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('smit_modules', JSON.stringify(modules));
  }, [modules]);

  useEffect(() => {
    localStorage.setItem('smit_attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('smit_assignments', JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem('smit_submissions', JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem('smit_quizzes', JSON.stringify(quizzes));
  }, [quizzes]);

  useEffect(() => {
    localStorage.setItem('smit_quiz_results', JSON.stringify(quizResults));
  }, [quizResults]);

  useEffect(() => {
    localStorage.setItem('smit_trainers', JSON.stringify(trainers));
  }, [trainers]);

  useEffect(() => {
    localStorage.setItem('smit_activity_logs', JSON.stringify(activityLogs));
  }, [activityLogs]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const login = (newRole: Role, credentials?: { cnic?: string; email?: string; password?: string }) => {
    setIsAuthenticated(true);
    localStorage.setItem('smit_lms_auth', 'true');
    setRoleState(newRole);
    localStorage.setItem('smit_lms_role', newRole);
    showToast(`Welcome back! Logged in as ${newRole.toUpperCase()}.`, 'success');
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('smit_lms_auth');
    showToast('Logged out of SMIT Portal.', 'info');
  };

  const registerPassword = (cnic: string, dob: string, password: string): boolean => {
    showToast(`Password created successfully for CNIC ${cnic}! You can now login.`, 'success');
    return true;
  };

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    showToast(`Switched view to ${newRole.toUpperCase()} portal`, 'info');
  };

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('smit_lms_dark') === 'true';
  });

  const [customStudentProfile, setCustomStudentProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('smit_current_student');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.avatar || parsed.avatar.includes('unsplash.com')) {
          parsed.avatar = '/assets/abdul_mateen.jpg';
        }
        return { ...INITIAL_STUDENT_PROFILE, ...parsed };
      } catch (e) {
        return INITIAL_STUDENT_PROFILE;
      }
    }
    return INITIAL_STUDENT_PROFILE;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    localStorage.setItem('smit_lms_dark', String(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      showToast(`Switched to ${next ? 'Dark' : 'Light'} Mode`, 'info');
      return next;
    });
  };

  const updateUserProfile = (data: Partial<UserProfile>) => {
    setCustomStudentProfile((prev) => {
      const updated = { ...prev, ...data };
      localStorage.setItem('smit_current_student', JSON.stringify(updated));
      return updated;
    });
  };

  const currentUser: UserProfile =
    role === 'student'
      ? customStudentProfile
      : role === 'teacher'
      ? INITIAL_TEACHER_PROFILE
      : INITIAL_ADMIN_PROFILE;

  const logActivity = (
    action: ActivityActionType,
    category: ActivityCategory,
    title: string,
    description: string,
    targetId?: string,
    targetName?: string,
    metadata?: Record<string, string | number | boolean>
  ) => {
    const newLog: ActivityLog = {
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      action,
      category,
      title,
      description,
      performedBy: {
        name: currentUser.name,
        role: currentUser.role,
        email: currentUser.email,
      },
      targetId,
      targetName,
      metadata,
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  const addActivityLog = (entry: Omit<ActivityLog, 'id' | 'timestamp'>) => {
    const newLog: ActivityLog = {
      ...entry,
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
    };
    setActivityLogs((prev) => [newLog, ...prev]);
    showToast('Activity log recorded successfully', 'success');
  };

  const clearActivityLogs = () => {
    setActivityLogs([]);
    localStorage.removeItem('smit_activity_logs');
    showToast('Activity log history cleared', 'info');
  };

  const markAttendance = (
    records: { studentId: string; rollNumber: string; studentName: string; status: 'PRESENT' | 'ABSENT' | 'LEAVE'; date: string; classNumber: number }[]
  ) => {
    const newEntries: AttendanceEntry[] = records.map((r, idx) => ({
      id: `att_${Date.now()}_${idx}`,
      studentId: r.studentId,
      rollNumber: r.rollNumber,
      studentName: r.studentName,
      date: r.date,
      classNumber: r.classNumber,
      status: r.status,
    }));

    setAttendance((prev) => [...newEntries, ...prev]);
    logActivity(
      'ATTENDANCE_MARKED',
      'ATTENDANCE',
      'Batch Attendance Recorded',
      `Submitted class #${records[0]?.classNumber || 1} attendance for ${records.length} students on ${records[0]?.date || 'today'}.`,
      undefined,
      undefined,
      {
        totalRecords: records.length,
        classNumber: records[0]?.classNumber || 1,
        date: records[0]?.date || '',
      }
    );
    showToast(`Attendance marked successfully for ${records.length} students on ${records[0]?.date || 'today'}`, 'success');
  };

  const submitAssignment = (assignmentId: string, repoUrl: string, liveUrl: string, remarks?: string) => {
    const newSubmission: Submission = {
      id: `sub_${Date.now()}`,
      assignmentId,
      studentId: INITIAL_STUDENT_PROFILE.id,
      studentName: INITIAL_STUDENT_PROFILE.name,
      rollNumber: INITIAL_STUDENT_PROFILE.rollNumber || '777873',
      submittedAt: new Date().toLocaleString(),
      repoUrl,
      liveUrl,
      remarks,
      status: 'SUBMITTED',
    };

    setSubmissions((prev) => [newSubmission, ...prev]);
    setAssignments((prev) =>
      prev.map((asg) =>
        asg.id === assignmentId ? { ...asg, status: 'SUBMITTED', totalSubmissions: (asg.totalSubmissions || 0) + 1 } : asg
      )
    );
    const targetAsg = assignments.find((a) => a.id === assignmentId);
    logActivity(
      'UPDATE',
      'ASSIGNMENT',
      'Assignment Solution Submitted',
      `${INITIAL_STUDENT_PROFILE.name} submitted solution for "${targetAsg?.title || 'Assignment'}".`,
      assignmentId,
      targetAsg?.title
    );
    showToast('Assignment submitted successfully for evaluation!', 'success');
  };

  const gradeSubmission = (
    submissionId: string,
    status: 'APPROVED' | 'REJECTED',
    score?: number,
    feedback?: string
  ) => {
    setSubmissions((prev) =>
      prev.map((sub) =>
        sub.id === submissionId
          ? {
              ...sub,
              status,
              score: score ?? sub.score,
              feedback: feedback || sub.feedback,
            }
          : sub
      )
    );

    const sub = submissions.find((s) => s.id === submissionId);
    if (sub && sub.studentId === INITIAL_STUDENT_PROFILE.id) {
      setAssignments((prev) =>
        prev.map((asg) => (asg.id === sub.assignmentId ? { ...asg, status: status } : asg))
      );
    }
    logActivity(
      'ASSIGNMENT_GRADED',
      'ASSIGNMENT',
      `Assignment Evaluation: ${status}`,
      `Graded submission for ${sub?.studentName || 'Student'} (${status}${score !== undefined ? ` - ${score}/100` : ''}).`,
      submissionId,
      sub?.studentName,
      {
        status,
        score: score ?? 0,
      }
    );
    showToast(`Submission marked as ${status}`, 'success');
  };

  const createAssignment = (newAsg: Omit<Assignment, 'id' | 'createdAt'>) => {
    const asg: Assignment = {
      ...newAsg,
      id: `asg_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      totalSubmissions: 0,
      status: 'NOT SUBMITTED',
    };
    setAssignments((prev) => [asg, ...prev]);
    logActivity(
      'ASSIGNMENT_CREATED',
      'ASSIGNMENT',
      'New Assignment Published',
      `Created and published "${asg.title}" for ${asg.batch} (Due: ${asg.dueDate}).`,
      asg.id,
      asg.title,
      {
        batch: asg.batch,
        dueDate: asg.dueDate,
        course: asg.course,
      }
    );
    showToast(`Assignment "${asg.title}" created successfully!`, 'success');
  };

  const updateAssignment = (id: string, update: Partial<Assignment>) => {
    const existing = assignments.find((a) => a.id === id);
    setAssignments((prev) =>
      prev.map((asg) => (asg.id === id ? { ...asg, ...update } : asg))
    );
    logActivity(
      'UPDATE',
      'ASSIGNMENT',
      'Assignment Details Modified',
      `Updated assignment details for "${update.title || existing?.title || 'Assignment'}".`,
      id,
      update.title || existing?.title
    );
    showToast('Assignment updated successfully', 'info');
  };

  const deleteAssignment = (id: string) => {
    const existing = assignments.find((a) => a.id === id);
    setAssignments((prev) => prev.filter((asg) => asg.id !== id));
    logActivity(
      'DELETE',
      'ASSIGNMENT',
      'Assignment Removed',
      `Deleted assignment "${existing?.title || id}".`,
      id,
      existing?.title
    );
    showToast('Assignment deleted', 'info');
  };

  const createQuiz = (newQuiz: Omit<Quiz, 'id'>) => {
    const quiz: Quiz = {
      ...newQuiz,
      id: `q_${Date.now()}`,
    };
    setQuizzes((prev) => [quiz, ...prev]);
    logActivity(
      'QUIZ_CREATED',
      'QUIZ',
      'New Quiz Published',
      `Created quiz assessment "${quiz.title}" (${quiz.questionsCount} questions, ${quiz.durationMinutes} mins).`,
      quiz.id,
      quiz.title,
      {
        course: quiz.course,
        module: quiz.module,
        status: quiz.status,
      }
    );
    showToast(`Quiz "${quiz.title}" created for ${quiz.course}`, 'success');
  };

  const submitQuizAttempt = (quizId: string, scorePercentage: number) => {
    const passed = scorePercentage >= 60;
    const existing = quizResults.find((r) => r.quizId === quizId && r.studentId === INITIAL_STUDENT_PROFILE.id);

    if (existing) {
      setQuizResults((prev) =>
        prev.map((r) =>
          r.id === existing.id
            ? {
                ...r,
                attemptsUsed: Math.min(r.attemptsUsed + 1, r.maxAttempts),
                scorePercentage: Math.max(r.scorePercentage, scorePercentage),
                status: passed ? 'PASSED' : 'FAILED',
                completedAt: new Date().toLocaleDateString(),
              }
            : r
        )
      );
    } else {
      const newResult: StudentQuizResult = {
        id: `sqr_${Date.now()}`,
        quizId,
        studentId: INITIAL_STUDENT_PROFILE.id,
        attemptsUsed: 1,
        maxAttempts: 3,
        scorePercentage,
        status: passed ? 'PASSED' : 'FAILED',
        completedAt: new Date().toLocaleDateString(),
        note: '–',
      };
      setQuizResults((prev) => [newResult, ...prev]);
    }

    const qz = quizzes.find((q) => q.id === quizId);
    logActivity(
      'UPDATE',
      'QUIZ',
      'Student Quiz Attempt Recorded',
      `${INITIAL_STUDENT_PROFILE.name} attempted quiz "${qz?.title || 'Quiz'}" scoring ${scorePercentage}%.`,
      quizId,
      qz?.title,
      {
        scorePercentage,
        passed,
      }
    );

    showToast(
      passed
        ? `Congratulations! Quiz passed with ${scorePercentage}%!`
        : `Quiz completed. Score: ${scorePercentage}%. Try again if attempts remain.`,
      passed ? 'success' : 'warning'
    );
  };

  const addStudent = (studentData: Omit<UserProfile, 'id'>) => {
    const newStudent: UserProfile = {
      ...studentData,
      id: `std_${Date.now()}`,
      avatar:
        studentData.avatar ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    };
    setStudents((prev) => [newStudent, ...prev]);
    logActivity(
      'CREATE',
      'STUDENT',
      'New Student Registered',
      `Enrolled student ${newStudent.name} (Roll #${newStudent.rollNumber || 'N/A'}) into ${newStudent.course || 'Curriculum'}.`,
      newStudent.id,
      newStudent.name,
      {
        rollNumber: newStudent.rollNumber || '',
        email: newStudent.email,
        status: newStudent.status,
        batch: newStudent.batch || '',
      }
    );
    showToast(`Student "${newStudent.name}" (Roll: ${newStudent.rollNumber}) added!`, 'success');
  };

  const updateStudentStatus = (studentId: string, status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED') => {
    const targetStudent = students.find((s) => s.id === studentId);
    const oldStatus = targetStudent?.status || 'UNKNOWN';
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, status } : s))
    );
    logActivity(
      'STATUS_CHANGE',
      'STUDENT',
      'Student Status Modified',
      `Changed status of ${targetStudent?.name || 'Student'} (Roll #${targetStudent?.rollNumber || 'N/A'}) from ${oldStatus} to ${status}.`,
      studentId,
      targetStudent?.name,
      {
        previousStatus: oldStatus,
        newStatus: status,
        rollNumber: targetStudent?.rollNumber || '',
      }
    );
    showToast(`Student status updated to ${status}`, 'info');
  };

  const addTrainer = (trainerData: Omit<Trainer, 'id'>) => {
    const newTrainer: Trainer = {
      ...trainerData,
      id: `trn_${Date.now()}`,
      avatar:
        trainerData.avatar ||
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    };
    setTrainers((prev) => [newTrainer, ...prev]);
    logActivity(
      'CREATE',
      'TRAINER',
      'New Trainer Registered',
      `Enrolled trainer ${newTrainer.name} for ${newTrainer.assignedCourse}.`,
      newTrainer.id,
      newTrainer.name,
      {
        assignedCourse: newTrainer.assignedCourse,
        assignedBatches: newTrainer.assignedBatches.join(', '),
        totalStudents: newTrainer.totalStudents,
        status: newTrainer.status,
      }
    );
    showToast(`Trainer "${newTrainer.name}" registered successfully!`, 'success');
  };

  const updateTrainer = (id: string, update: Partial<Trainer>) => {
    const existing = trainers.find((t) => t.id === id);
    setTrainers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...update } : t))
    );
    logActivity(
      'UPDATE',
      'TRAINER',
      'Trainer Profile Updated',
      `Updated profile details and allocations for ${update.name || existing?.name || 'Trainer'}.`,
      id,
      update.name || existing?.name,
      {
        assignedCourse: update.assignedCourse || existing?.assignedCourse || '',
        status: update.status || existing?.status || 'ACTIVE',
      }
    );
    showToast('Trainer details updated', 'info');
  };

  const deleteTrainer = (id: string) => {
    const existing = trainers.find((t) => t.id === id);
    setTrainers((prev) => prev.filter((t) => t.id !== id));
    logActivity(
      'DELETE',
      'TRAINER',
      'Trainer Removed from Registry',
      `Removed trainer record for ${existing?.name || id} from institutional registry.`,
      id,
      existing?.name
    );
    showToast('Trainer removed from registry', 'info');
  };

  const toggleTopicCompletion = (moduleId: string, topicId: string) => {
    setModules((prev) =>
      prev.map((m) => {
        if (m.id !== moduleId) return m;
        const newTopics = m.topics.map((t) =>
          t.id === topicId ? { ...t, completed: !t.completed } : t
        );
        const completedCount = newTopics.filter((t) => t.completed).length;
        return {
          ...m,
          topics: newTopics,
          completedTopics: completedCount,
        };
      })
    );
  };

  const resetAllData = () => {
    setStudents(ALL_STUDENTS_LIST);
    setModules(INITIAL_MODULES);
    setAttendance(INITIAL_ATTENDANCE);
    setAssignments(INITIAL_ASSIGNMENTS);
    setSubmissions(INITIAL_SUBMISSIONS);
    setQuizzes(INITIAL_QUIZZES);
    setQuizResults(INITIAL_STUDENT_QUIZ_RESULTS);
    setTrainers(INITIAL_TRAINERS);
    setActivityLogs(INITIAL_ACTIVITY_LOGS);
    logActivity(
      'SYSTEM_RESET',
      'SYSTEM',
      'System Master Data Reset',
      'Reinitialized institutional database back to factory mock state.'
    );
    showToast('Reset data to initial state', 'info');
  };

  return (
    <LMSContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        registerPassword,
        role,
        setRole,
        currentUser,
        updateUserProfile,
        isDarkMode,
        toggleDarkMode,
        studentTab,
        setStudentTab,
        teacherTab,
        setTeacherTab,
        adminTab,
        setAdminTab,
        sidebarOpen,
        setSidebarOpen,
        toggleSidebar,
        students,
        modules,
        attendance,
        assignments,
        submissions,
        quizzes,
        quizResults,
        feeRecords,
        trainers,
        activityLogs,
        notifications,
        showToast,
        removeToast,
        markAttendance,
        submitAssignment,
        gradeSubmission,
        createAssignment,
        updateAssignment,
        deleteAssignment,
        createQuiz,
        submitQuizAttempt,
        addStudent,
        updateStudentStatus,
        addTrainer,
        updateTrainer,
        deleteTrainer,
        addActivityLog,
        clearActivityLogs,
        toggleTopicCompletion,
        resetAllData,
      }}
    >
      {children}
    </LMSContext.Provider>
  );
};

export const useLMS = () => {
  const context = useContext(LMSContext);
  if (!context) {
    throw new Error('useLMS must be used within an LMSProvider');
  }
  return context;
};
