// types/quiz.ts

export const QUIZ_CONFIG = {
  PASSING_SCORE: 70,
  TIME_PER_QUESTION: 45,
  TOTAL_QUESTIONS: 10,
} as const;

export interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface QuizState {
  status: "welcome" | "in-progress" | "results";
  currentQuestion: number;
  answers: Record<number, number>;
  timeLeft: number;
  score: number;
  hasPassedQuiz: boolean;
  questionFeedback: Record<number, QuestionFeedback>;
}

export interface QuizFeedback {
  score: number;
  hasPassedQuiz: boolean;
  attemptedQuestions: number;
  correctAnswers: number;
  questionFeedback: Record<number, QuestionFeedback>;
}

export interface QuestionFeedback {
  isCorrect: boolean;
  userAnswer: number;
  correctAnswer: number;
  explanation: string;
}

export interface WelcomeScreenProps {
  onStart: () => void;
}

export interface QuestionScreenProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  timeLeft: number;
  selectedAnswer?: number;
  onAnswer: (answer: number) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export interface ResultsScreenProps {
  score: number;
  hasPassedQuiz: boolean;
  questions: QuizQuestion[];
  answers: Record<number, number>;
  questionFeedback: Record<number, QuestionFeedback>;
  onRetry: () => void;
  onContinue: () => void;
}
