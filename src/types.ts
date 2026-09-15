export type Role = 'student' | 'teacher' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: Role;
  rollNumber?: string;
  avatar: string;
  batch?: string;
  campus?: string;
  city?: string;
  course?: string;
  phone?: string;
  gender?: string;
  dob?: string;
  qualification?: string;
  cnic?: string;
  address?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
}

export interface TopicItem {
  id: string;
  title: string;
  completed: boolean;
}

export interface CourseModule {
  id: string;
  title: string;
  completedTopics: number;
  totalTopics: number;
  topics: TopicItem[];
}

export interface AttendanceEntry {
  id: string;
  studentId: string;
  rollNumber: string;
  studentName: string;
  date: string;
  classNumber: number;
  status: 'PRESENT' | 'ABSENT' | 'LEAVE';
  notes?: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  course: string;
  batch: string;
  topicsCount: number;
  topicTag?: string;
  isHackathon?: boolean;
  dueDate: string;
  status?: 'APPROVED' | 'SUBMITTED' | 'LATE SUBMITTED' | 'NOT SUBMITTED';
  submissionsClosed?: boolean;
  totalSubmissions?: number;
  createdAt: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  submittedAt: string;
  repoUrl?: string;
  liveUrl?: string;
  remarks?: string;
  status: 'APPROVED' | 'SUBMITTED' | 'LATE SUBMITTED' | 'REJECTED';
  score?: number;
  feedback?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // index 0-3
}

export interface Quiz {
  id: string;
  title: string;
  module: string;
  course: string;
  questionsCount: number;
  questions: QuizQuestion[];
  date: string;
  expiryDate: string;
  status: 'ACTIVE' | 'EXPIRED' | 'DRAFT';
  durationMinutes: number;
  maxAttempts: number;
}

export interface StudentQuizResult {
  id: string;
  quizId: string;
  studentId: string;
  attemptsUsed: number;
  maxAttempts: number;
  scorePercentage: number;
  status: 'PASSED' | 'FAILED' | 'PENDING';
  completedAt?: string;
  note?: string;
}

export interface FeeRecord {
  id: string;
  month: string;
  amount: number;
  type: string;
  dueDate: string;
  voucherId: string;
  status: 'PAID' | 'UNPAID' | 'OVERDUE';
  paidDate?: string;
}

export interface Trainer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  assignedCourse: string;
  assignedBatches: string[];
  totalStudents: number;
  experience: string;
  status: 'ACTIVE' | 'ON LEAVE' | 'INACTIVE';
  joinedDate: string;
}
