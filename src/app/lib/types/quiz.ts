// types/quiz.ts

export interface QuizQuestion {
  id: string;
  quiz_type: string;
  question_text: string;
  text: string;
  order_number: number;
  options: string[];
  correct: number;
  explanation: string;
}

export interface WelcomeScreenProps {
  onStart: () => void;
  totalQuestions: number;
  timeLimit: number;
}

export interface QuizResultsProps {
  score: number;
  hasPassedQuiz: boolean;
  questions: QuizQuestion[];
  answers: Record<number, number>;
  questionFeedback: Record<number, QuestionFeedback>;
  onRetry: () => void;
}

export interface QuestionInterfaceProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  timeLeft: number;
  selectedAnswer?: number;
  onAnswer: (answer: number) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export interface QuestionFeedback {
  isCorrect: boolean;
  userAnswer: number;
  correctAnswer: number;
  explanation: string;
}
