// lib/types/quiz.ts

// Define specific types for quiz answers structure
export interface QuizAnswer {
  optionId: string;
  timestamp: string;
  timeSpent: number;
}

export interface QuizAnswers {
  [questionId: string]: QuizAnswer;
}

export interface QuizProgress {
  id: string;
  user_id: string;
  quiz_type: string;
  current_question: number;
  answers: QuizAnswers;
  time_left: number;
  start_time: string;
  created_at: string;
  updated_at: string;
}

export interface QuizAttempt {
  id: number;
  user_id: string;
  started_at: string;
  completed_at: string | null;
  score: number | null;
  total_questions: number;
  quiz_type: string;
  current_question: number;
  answers: QuizAnswers;
  time_left: number;
}

export interface QuizResponse {
  id: string;
  attempt_id: string;
  question_id: string;
  selected_option_id: string;
  is_correct: boolean;
  time_spent: number;
  created_at: string;
  response_order: number;
}

export interface QuizQuestion {
  id: number;
  question_text: string;
  explanation: string;
  created_at: string;
  updated_at: string;
  quiz_type: string;
  order_number: number;
}

export interface QuizOption {
  id: number;
  question_id: number;
  option_text: string;
  is_correct: boolean;
  option_order: number;
  created_at: string;
  updated_at: string;
}

// Additional utility types
export type QuizType = "contributor" | "language" | "cultural";

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  timeTaken: number;
  passed: boolean;
}

export interface QuizMetadata {
  attemptId: number;
  questionCount: number;
  timePerQuestion: number;
  passingScore: number;
}

//FROM OLD TYPES.TS
export interface Question {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface QuestionFeedback {
  isCorrect: boolean;
  userAnswer: number;
  correctAnswer: number;
  explanation: string;
}

export interface QuestionFeedbackRecord {
  [key: number]: QuestionFeedback;
}

export interface AnswerRecord {
  [key: number]: number;
}

export interface UserProfile {
  id: string;
  role: string;
  quiz_completed: boolean;
  quiz_score: number | null;
  quiz_attempts: number;
  last_quiz_attempt: string | null;
}

// Optional: Add role types for better type safety
export const ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  EDITOR: "editor",
  VIEWER: "viewer",
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];
