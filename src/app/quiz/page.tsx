"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { BookOpen, Clock, CheckCircle2, HelpCircle, Timer } from "lucide-react";

interface QuizQuestion {
  id: number;
  question_text: string;
  explanation: string;
  quiz_type: string;
  order_number: number;
}

interface QuizOption {
  id: number;
  question_id: number;
  option_text: string;
  is_correct: boolean;
  option_order: number;
}

interface QuestionWithOptions extends QuizQuestion {
  options: QuizOption[];
}

interface QuizState {
  currentQuestionIndex: number;
  answers: Record<string, number>;
  timeLeft: number;
  score: number;
  hasPassed: boolean;
  isComplete: boolean;
  attemptId: string | null;
}

const SECONDS_PER_QUESTION = 45;
const PASSING_SCORE = 70;

export default function QuizPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState<QuestionWithOptions[]>([]);
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    answers: {},
    timeLeft: SECONDS_PER_QUESTION,
    score: 0,
    hasPassed: false,
    isComplete: false,
    attemptId: null,
  });
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        // Fetch questions from the database
        const { data: questionsData, error: questionsError } = await supabase
          .from("quiz_questions")
          .select("*")
          .eq("quiz_type", "contributor")
          .order("order_number")
          .limit(10);

        if (questionsError) throw questionsError;

        // Fetch options for all questions
        const questionIds = questionsData.map((q) => q.id);
        const { data: optionsData, error: optionsError } = await supabase
          .from("quiz_options")
          .select("*")
          .in("question_id", questionIds)
          .order("option_order");

        if (optionsError) throw optionsError;

        // Combine questions with their options
        const questionsWithOptions = questionsData.map((question) => ({
          ...question,
          options: optionsData.filter(
            (option) => option.question_id === question.id
          ),
        }));

        setQuestions(questionsWithOptions);
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchQuestions();
  }, [supabase]);

  const handleStartQuiz = () => {
    setHasStarted(true);
  };

  const handleAnswer = (selectedOptionId: number) => {
    const currentQuestion = questions[quizState.currentQuestionIndex];
    setQuizState((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [currentQuestion.id]: selectedOptionId,
      },
    }));
  };

  const handleNext = () => {
    if (quizState.currentQuestionIndex < questions.length - 1) {
      setQuizState((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        timeLeft: SECONDS_PER_QUESTION,
      }));
    } else {
      completeQuiz();
    }
  };

  const completeQuiz = () => {
    const correctAnswers = questions.filter((q) =>
      q.options.some(
        (opt) => opt.is_correct && opt.id === quizState.answers[q.id]
      )
    ).length;

    const score = (correctAnswers / questions.length) * 100;

    setQuizState((prev) => ({
      ...prev,
      score,
      hasPassed: score >= PASSING_SCORE,
      isComplete: true,
    }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      {!hasStarted ? (
        <div className="max-w-2xl mx-auto space-y-8 bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Kifuliiru Contributor Quiz
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Complete this quiz to gain contributor access to the Kifuliiru
              Dictionary.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg flex items-start space-x-3">
              <BookOpen className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {questions.length} Questions
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Multiple choice format
                </p>
              </div>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-start space-x-3">
              <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {SECONDS_PER_QUESTION} Seconds
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Per question time limit
                </p>
              </div>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-start space-x-3">
              <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {PASSING_SCORE}% to Pass
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Required score threshold
                </p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg flex items-start space-x-3">
              <HelpCircle className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Need Help?
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Review guidelines before starting
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={handleStartQuiz}
              className="w-full bg-orange-600 text-white rounded-lg py-3 px-4 font-medium hover:bg-orange-700 transform transition-all duration-200"
            >
              Start Quiz
            </button>
          </div>
        </div>
      ) : !quizState.isComplete ? (
        <div className="mt-8 max-w-2xl mx-auto space-y-6 bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Question {quizState.currentQuestionIndex + 1} of{" "}
              {questions.length}
            </div>
            <div className="flex items-center space-x-2 text-orange-600 dark:text-orange-400">
              <Timer className="w-5 h-5" />
              <span className="font-mono">{quizState.timeLeft}s</span>
            </div>
          </div>

          <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full">
            <div
              className="bg-orange-600 h-2 rounded-full"
              style={{
                width: `${
                  ((quizState.currentQuestionIndex + 1) / questions.length) *
                  100
                }%`,
              }}
            ></div>
          </div>

          <div className="py-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {questions[quizState.currentQuestionIndex].question_text}
            </h2>
          </div>

          <div className="space-y-3">
            {questions[quizState.currentQuestionIndex].options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleAnswer(option.id)}
                className="w-full text-left p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-400 transition-colors"
              >
                <span className="font-medium text-gray-900 dark:text-white">
                  {option.option_text}
                </span>
              </button>
            ))}
          </div>

          <div className="pt-4 flex justify-between">
            <button
              onClick={() =>
                setQuizState((prev) => ({
                  ...prev,
                  currentQuestionIndex: prev.currentQuestionIndex - 1,
                }))
              }
              disabled={quizState.currentQuestionIndex === 0}
              className="text-gray-600 dark:text-gray-400 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700"
            >
              {quizState.currentQuestionIndex === questions.length - 1
                ? "Finish"
                : "Next"}
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-8 max-w-2xl mx-auto space-y-8 bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30">
              <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {Math.round(quizState.score)}% Score
            </h2>
            <p className="text-green-600 dark:text-green-400 font-medium">
              {quizState.hasPassed
                ? "Congratulations! You've passed the quiz."
                : "You did not pass. Try again next time."}
            </p>
          </div>

          {quizState.hasPassed && (
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Access Granted
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    You can now contribute to the Kifuliiru dictionary.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="pt-4">
            <button
              className="w-full bg-green-600 text-white rounded-lg py-3 px-4 font-medium hover:bg-green-700 transform transition-all duration-200"
              onClick={() => router.push("/contribute")}
            >
              Continue to Contributor Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
