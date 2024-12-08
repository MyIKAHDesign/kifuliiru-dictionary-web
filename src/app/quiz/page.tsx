"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  HelpCircle,
  Timer,
} from "lucide-react";
import { Progress } from "@/app/components/ui/progress";
import {
  calculateQuizScore,
  completeQuizAttempt,
  createQuizAttempt,
  saveQuizProgress,
} from "../lib/quiz-progress-handlers";

interface QuizQuestion {
  id: string; // Changed to string for UUID
  question_text: string;
  explanation: string;
  quiz_type: string;
  order_number: number;
}

interface QuizOption {
  id: string; // Changed to string for UUID
  question_id: string; // Changed to string for UUID
  option_text: string;
  is_correct: boolean;
  option_order: number;
}

interface QuestionWithOptions extends QuizQuestion {
  options: QuizOption[];
}

interface QuizState {
  currentQuestionIndex: number;
  answers: Record<string, string>; // Store UUID of selected option
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
    // Check for existing progress in localStorage or from an API
    const savedProgress = JSON.parse(
      localStorage.getItem("quizProgress") || "null"
    );

    if (savedProgress && savedProgress.currentQuestionIndex !== undefined) {
      // Restore the saved progress into state
      setQuizState(savedProgress);
      setHasStarted(true); // Update the state to indicate the quiz has started
    }
  }, []);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const { data: questionsData, error: questionsError } = await supabase
          .from("quiz_questions")
          .select("*")
          .eq("quiz_type", "contributor")
          .order("order_number")
          .limit(10);

        if (questionsError) throw questionsError;

        const questionIds = questionsData.map((q) => q.id);
        const { data: optionsData, error: optionsError } = await supabase
          .from("quiz_options")
          .select("*")
          .in("question_id", questionIds)
          .order("option_order");

        if (optionsError) throw optionsError;

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

  useEffect(() => {
    if (hasStarted && !quizState.isComplete) {
      const timer = setInterval(() => {
        setQuizState((prev) => {
          if (prev.timeLeft <= 1) {
            handleNext();
            return { ...prev, timeLeft: SECONDS_PER_QUESTION };
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [hasStarted, quizState.isComplete]);

  const handleStartQuiz = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        // Redirect to sign-in page if user is not authenticated
        router.push("/auth/sign-in?redirect=/quiz");
        return;
      }

      // Check if there is existing progress for this user
      const savedProgress = JSON.parse(
        localStorage.getItem("quizProgress") || "null"
      );
      if (savedProgress && savedProgress.attemptId) {
        // Restore the saved progress
        setQuizState(savedProgress);
        setHasStarted(true);
        return;
      }

      // Create a new quiz attempt if no progress exists
      const attemptId = await createQuizAttempt(
        supabase,
        user.id,
        "contributor", // Quiz type
        questions.length // Total number of questions
      );

      const initialProgress: QuizState = {
        attemptId,
        currentQuestionIndex: 0,
        timeLeft: SECONDS_PER_QUESTION,
        answers: {},

        score: 0, // Default score
        hasPassed: false, // Default pass status
        isComplete: false, // Default completion status
      };

      // Save the new progress in both state and localStorage
      setQuizState(initialProgress);
      localStorage.setItem("quizProgress", JSON.stringify(initialProgress));
      setHasStarted(true);
    } catch (error) {
      console.error("Error starting quiz:", error);
    }
  };

  useEffect(() => {
    async function loadExistingProgress() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: existingProgress, error } = await supabase
        .from("quiz_progress")
        .select("*")
        .eq("user_id", user.id)
        .eq("quiz_type", "contributor")
        .single();

      if (error && error.code !== "PGRST202") {
        console.error("Error fetching existing quiz progress:", error);
        return;
      }

      if (existingProgress) {
        // If progress is found, set the state of the quiz from it
        setQuizState((prev) => ({
          ...prev,
          currentQuestionIndex: existingProgress.current_question,
          answers: existingProgress.answers,
          timeLeft: existingProgress.time_left,
          isComplete: existingProgress.is_complete,
        }));
      } else {
        // No existing progress - start fresh or wait for user to start quiz
      }
    }

    loadExistingProgress();
  }, [supabase]);

  useEffect(() => {
    async function fetchQuizResults() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const { data: attemptData, error } = await supabase
          .from("quiz_attempts")
          .select("score, is_passed")
          .eq("id", quizState.attemptId)
          .single();

        if (error) {
          console.error("Error fetching quiz results:", JSON.stringify(error));
          return;
        }

        setQuizState((prev) => ({
          ...prev,
          score: attemptData.score ?? 0,
          hasPassed: attemptData.is_passed ?? false,
        }));
      } catch (error) {
        console.error("Error fetching quiz results:", JSON.stringify(error));
      }
    }

    if (quizState.isComplete) {
      fetchQuizResults();
    }
  }, [quizState.isComplete, quizState.attemptId, supabase]);

  useEffect(() => {
    if (questions.length > 0 && quizState.answers) {
      // Calculate the score
      const correctCount = questions.reduce((count, question) => {
        const userAnswerId = quizState.answers[question.id];
        const isCorrect = question.options.some(
          (opt) => opt.is_correct && opt.id === userAnswerId
        );
        return count + (isCorrect ? 1 : 0);
      }, 0);

      const totalQuestions = questions.length;
      const percentage = (correctCount / totalQuestions) * 100;

      // Update quizState with the score and pass/fail status
      setQuizState((prev) => ({
        ...prev,
        score: correctCount,
        percentage,
        hasPassed: percentage >= 70, // Assuming 70% is the passing mark
      }));
    }
  }, [questions, quizState.answers]);

  const handleAnswer = async (selectedOptionId: string) => {
    try {
      if (!quizState.attemptId) return;

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const currentQuestion = questions[quizState.currentQuestionIndex];

      // Calculate if the selected answer is correct
      const isCorrect = currentQuestion.options.some(
        (opt) => opt.is_correct && opt.id === selectedOptionId
      );

      // Declare and calculate the updated score
      const updatedScore = quizState.score + (isCorrect ? 1 : 0);

      // Save the updated progress
      await saveQuizProgress(supabase, {
        id: quizState.attemptId,
        user_id: user.id,
        quiz_type: "contributor",
        current_question: quizState.currentQuestionIndex,
        answers: {
          ...quizState.answers,
          [currentQuestion.id]: selectedOptionId,
        },
        time_left: quizState.timeLeft,
        last_updated: new Date().toISOString(),
        is_complete: false,
        score: updatedScore, // Include the updated score
      });

      // Update local state with the new score and answer
      setQuizState((prev) => ({
        ...prev,
        answers: {
          ...prev.answers,
          [currentQuestion.id]: selectedOptionId,
        },
        score: updatedScore, // Update the score in local state
      }));
    } catch (error) {
      console.error("Error in handleAnswer:", JSON.stringify(error));
    }
  };

  const handleNext = async () => {
    try {
      if (!quizState.attemptId) return;

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Determine if the current question was answered correctly
      const currentQuestion = questions[quizState.currentQuestionIndex];
      const userAnswerId = quizState.answers[currentQuestion.id];
      const isCorrect = currentQuestion.options.some(
        (opt) => opt.is_correct && opt.id === userAnswerId
      );

      // Increment the score if the answer is correct
      const updatedScore = quizState.score + (isCorrect ? 1 : 0);

      // Save progress, including the updated score
      await saveQuizProgress(supabase, {
        id: quizState.attemptId,
        user_id: user.id,
        quiz_type: "contributor",
        current_question: quizState.currentQuestionIndex,
        answers: quizState.answers,
        time_left: quizState.timeLeft,
        last_updated: new Date().toISOString(),
        is_complete: false,
        score: updatedScore, // Save the updated score
      });

      // Move to the next question or complete the quiz
      if (quizState.currentQuestionIndex < questions.length - 1) {
        setQuizState((prev) => ({
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex + 1,
          timeLeft: SECONDS_PER_QUESTION,
          score: updatedScore, // Update local score
        }));
      } else {
        await completeQuiz(); // Finalize quiz if it's the last question
      }
    } catch (error) {
      console.error("Error in handleNext:", JSON.stringify(error));
    }
  };

  const completeQuiz = async () => {
    try {
      if (!quizState.attemptId) return;

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        console.error("No authenticated user found");
        return;
      }

      const score = await calculateQuizScore(supabase, quizState.attemptId);
      console.log("Checking the score ....", JSON.stringify(score));

      await completeQuizAttempt(supabase, {
        attemptId: quizState.attemptId,
        score,
        totalQuestions: questions.length,
        userId: user.id,
        passingScore: PASSING_SCORE,
      });

      setQuizState((prev) => ({
        ...prev,
        score,
        hasPassed: score >= PASSING_SCORE,
        isComplete: true,
      }));

      await saveQuizProgress(supabase, {
        id: quizState.attemptId,
        user_id: user.id,
        quiz_type: "contributor",
        current_question: quizState.currentQuestionIndex,
        answers: quizState.answers,
        time_left: quizState.timeLeft,
        last_updated: new Date().toISOString(),
        is_complete: true, // Mark quiz as complete
        score: quizState.score, // Save the final score
      });

      if (score >= PASSING_SCORE) {
        setTimeout(() => {
          router.push("/contribute");
        }, 3000);
      }
    } catch (error) {
      console.error("Error completing quiz:", JSON.stringify(error));
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500"></div>
      </div>
    );
  }

  const QuizResults = () => {
    const totalQuestions = questions.length;
    const correctAnswers = questions.reduce((count, question) => {
      const userAnswerId = quizState.answers[question.id];
      const isCorrect = question.options.some(
        (opt) => opt.is_correct && opt.id === userAnswerId
      );
      return count + (isCorrect ? 1 : 0);
    }, 0);

    const percentage = (correctAnswers / totalQuestions) * 100;

    return (
      <div>
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
          {quizState.hasPassed ? "Congratulations!" : "Quiz Complete"}
        </h2>

        <div className="text-center">
          <div className="text-6xl font-bold mb-4">
            {Math.round(percentage)}%
          </div>
          <Progress value={percentage} className="w-full h-2" />
        </div>

        <p className="text-center text-gray-600 dark:text-gray-300">
          {quizState.hasPassed
            ? `You passed with a score of ${Math.round(percentage)}%!`
            : `You scored ${Math.round(
                percentage
              )}%. You need ${PASSING_SCORE}% to pass. Better luck next time!`}
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      {!hasStarted ? (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
          <div className="max-w-xl space-y-8 bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Kifuliiru Contributor Quiz
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              This quiz is your first step to becoming a contributor to the
              Kifuliiru Dictionary. It tests your understanding of the project’s
              goals and ensures you are ready to help preserve the language.
              Answer all the questions to proceed.
            </p>
            <div className="space-y-6">
              <div className="flex items-center space-x-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <BookOpen className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    10 Questions
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    The quiz consists of 10 multiple-choice questions carefully
                    designed to test your knowledge about the Kifuliiru
                    Dictionary project.
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    45 Seconds Per Question
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Each question has a time limit of 45 seconds to ensure quick
                    and decisive responses. Be prepared before starting the
                    quiz.
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    70% Passing Score
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    A minimum score of 70% is required to pass. Passing the quiz
                    demonstrates your readiness to contribute effectively to the
                    Kifuliiru Dictionary.
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
                <HelpCircle className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Review Guidelines
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Before starting the quiz, take a moment to review the
                    guidelines and objectives of the project. This will help you
                    better understand the role of a contributor.
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={handleStartQuiz}
              className="w-full bg-orange-600 text-white rounded-lg py-3 font-medium hover:bg-orange-700 transition-all"
            >
              Start Quiz
              <ArrowRight className="w-5 h-5 inline-block ml-2" />
            </button>
          </div>
        </div>
      ) : !quizState.isComplete ? (
        <div className="max-w-xl mx-auto space-y-6 bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Question {quizState.currentQuestionIndex + 1} of{" "}
              {questions.length}
            </span>
            <div className="flex items-center space-x-2 text-orange-600 dark:text-orange-400">
              <Timer className="w-5 h-5" />
              <span className="font-mono">{quizState.timeLeft}s</span>
            </div>
          </div>
          <Progress
            value={
              ((quizState.currentQuestionIndex + 1) / questions.length) * 100
            }
            className="h-2 rounded-full bg-gray-200 dark:bg-gray-700"
          />
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            {questions[quizState.currentQuestionIndex].question_text}
          </h2>
          <div className="space-y-3">
            {questions[quizState.currentQuestionIndex].options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleAnswer(option.id)}
                className={`w-full p-4 rounded-lg border-2 transition-colors ${
                  quizState.answers[
                    questions[quizState.currentQuestionIndex].id
                  ] === option.id
                    ? "border-orange-600 bg-orange-100"
                    : "border-gray-200 dark:border-gray-700 hover:border-orange-500"
                }`}
              >
                {option.option_text}
              </button>
            ))}
          </div>
          <div className="flex justify-between">
            <button
              disabled={quizState.currentQuestionIndex === 0}
              onClick={() =>
                setQuizState((prev) => ({
                  ...prev,
                  currentQuestionIndex: prev.currentQuestionIndex - 1,
                  timeLeft: SECONDS_PER_QUESTION,
                }))
              }
              className="text-gray-600 dark:text-gray-400"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg"
            >
              {quizState.currentQuestionIndex === questions.length - 1
                ? "Finish"
                : "Next"}
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-xl mx-auto space-y-6 bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
          <QuizResults />
          <div className="space-y-4">
            {questions.map((question, index) => (
              <div
                key={question.id}
                className="p-4 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {index + 1}. {question.question_text}
                </h3>
                <p
                  className={`text-sm ${
                    question.options.some(
                      (opt) =>
                        opt.is_correct &&
                        opt.id === quizState.answers[question.id]
                    )
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  Your Answer:{" "}
                  {
                    question.options.find(
                      (opt) => opt.id === quizState.answers[question.id]
                    )?.option_text
                  }
                </p>
                {!question.options.some(
                  (opt) =>
                    opt.is_correct && opt.id === quizState.answers[question.id]
                ) && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Correct Answer:{" "}
                    {
                      question.options.find((opt) => opt.is_correct)
                        ?.option_text
                    }
                  </p>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center pt-6">
            <button
              className={`w-full py-3 px-6 rounded-lg font-medium transition-colors duration-200 ${
                quizState.hasPassed
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-orange-600 hover:bg-orange-700 text-white"
              }`}
              onClick={() =>
                quizState.hasPassed
                  ? router.push("/contribute")
                  : router.push("/")
              }
            >
              {quizState.hasPassed
                ? "Go to Contributor Dashboard"
                : "Return Home"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
