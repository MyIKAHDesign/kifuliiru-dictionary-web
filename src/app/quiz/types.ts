// types.ts

export interface QuestionType {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface WelcomeScreenProps {
  onStart: () => void;
  questionCount: number;
  timePerQuestion: number;
}

export interface QuizResultsProps {
  score: number;
  hasPassedQuiz: boolean;
  questions: QuestionType[];
  answers: Record<number, number>;
  questionFeedback: Record<number, QuestionFeedback>;
  onRetry: () => void;
}

export interface QuestionInterfaceProps {
  question: QuestionType;
  questionNumber: number;
  totalQuestions: number;
  timeLeft: number;
  selectedAnswer?: number;
  onAnswer: (answer: number) => void;
  onNext: () => void;
  onPrevious: () => void;
}

interface QuestionFeedback {
  isCorrect: boolean;
  userAnswer: number;
  correctAnswer: number;
  explanation: string;
}
