// components/quiz/Quiz.tsx
"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import QuizWelcomeScreen from "./QuizWelcomeScreen";
import QuestionInterface from "./QuestionInterface";
import QuizResults from "./QuizResults";

import {
  QuestionFeedback,
  QUIZ_CONFIG,
  QuizQuestion,
  QuizState,
} from "./types";

const Quiz = () => {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [quizState, setQuizState] = useState<QuizState>({
    status: "welcome",
    currentQuestion: 0,
    answers: {},
    timeLeft: QUIZ_CONFIG.TIME_PER_QUESTION,
    score: 0,
    hasPassedQuiz: false,
    questionFeedback: {},
  });

  // Fetch questions from the database
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from("quiz_questions")
          .select("*")
          .eq("quiz_type", "contributor")
          .order("order_number")
          .limit(QUIZ_CONFIG.TOTAL_QUESTIONS);

        if (fetchError) throw fetchError;

        if (!data || data.length === 0) {
          throw new Error("No questions available");
        }

        setQuestions(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load questions"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [supabase]);

  // Timer effect
  useEffect(() => {
    if (quizState.status !== "in-progress") return;

    const timer = setInterval(() => {
      setQuizState((prev) => {
        if (prev.timeLeft <= 1) {
          // Time's up - move to next question or end quiz
          if (prev.currentQuestion < questions.length - 1) {
            return {
              ...prev,
              currentQuestion: prev.currentQuestion + 1,
              timeLeft: QUIZ_CONFIG.TIME_PER_QUESTION,
            };
          } else {
            // Calculate results if it's the last question
            calculateResults();
            return {
              ...prev,
              timeLeft: 0,
            };
          }
        }
        return {
          ...prev,
          timeLeft: prev.timeLeft - 1,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizState.status, quizState.currentQuestion, questions.length]);

  const calculateResults = async () => {
    const results: Record<number, QuestionFeedback> = {};
    let correctCount = 0;

    questions.forEach((question, index) => {
      const isCorrect = quizState.answers[index] === question.correct;
      if (isCorrect) correctCount++;

      results[index] = {
        isCorrect,
        userAnswer: quizState.answers[index] ?? -1,
        correctAnswer: question.correct,
        explanation: question.explanation,
      };
    });

    const finalScore = (correctCount / questions.length) * 100;
    const passed = finalScore >= QUIZ_CONFIG.PASSING_SCORE;

    // Update profile in database
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user?.id) {
        const { data: userProfile } = await supabase
          .from("profiles")
          .select("quiz_attempts")
          .eq("id", session.user.id)
          .single();

        await supabase
          .from("profiles")
          .update({
            quiz_completed: passed,
            quiz_score: finalScore,
            quiz_attempts: (userProfile?.quiz_attempts || 0) + 1,
            last_quiz_attempt: new Date().toISOString(),
          })
          .eq("id", session.user.id);
      }
    } catch (err) {
      console.error("Failed to update profile:", err);
    }

    setQuizState((prev) => ({
      ...prev,
      status: "results",
      score: finalScore,
      hasPassedQuiz: passed,
      questionFeedback: results,
    }));
  };

  const handleStartQuiz = () => {
    setQuizState((prev) => ({
      ...prev,
      status: "in-progress",
      timeLeft: QUIZ_CONFIG.TIME_PER_QUESTION,
    }));
  };

  const handleAnswer = (answer: number) => {
    setQuizState((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [prev.currentQuestion]: answer,
      },
    }));
  };

  const handleNext = () => {
    if (quizState.currentQuestion < questions.length - 1) {
      setQuizState((prev) => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
        timeLeft: QUIZ_CONFIG.TIME_PER_QUESTION,
      }));
    } else {
      calculateResults();
    }
  };

  const handlePrevious = () => {
    setQuizState((prev) => ({
      ...prev,
      currentQuestion: Math.max(0, prev.currentQuestion - 1),
      timeLeft: QUIZ_CONFIG.TIME_PER_QUESTION,
    }));
  };

  const handleRetry = () => {
    setQuizState({
      status: "welcome",
      currentQuestion: 0,
      answers: {},
      timeLeft: QUIZ_CONFIG.TIME_PER_QUESTION,
      score: 0,
      hasPassedQuiz: false,
      questionFeedback: {},
    });
  };

  const handleContinue = () => {
    router.push("/contribute");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading quiz questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-500 dark:text-red-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-sm text-muted-foreground hover:text-primary"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  switch (quizState.status) {
    case "welcome":
      return (
        <QuizWelcomeScreen
          onStart={handleStartQuiz}
          totalQuestions={0}
          timeLimit={0}
        />
      );

    case "in-progress":
      return (
        <QuestionInterface
          question={questions[quizState.currentQuestion]}
          questionNumber={quizState.currentQuestion + 1}
          totalQuestions={questions.length}
          timeLeft={quizState.timeLeft}
          selectedAnswer={quizState.answers[quizState.currentQuestion]}
          onAnswer={handleAnswer}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      );

    case "results":
      return (
        <QuizResults
          score={quizState.score}
          hasPassedQuiz={quizState.hasPassedQuiz}
          questions={questions}
          answers={quizState.answers}
          questionFeedback={quizState.questionFeedback}
          onRetry={handleRetry}
          onContinue={handleContinue}
        />
      );
  }
};

export default Quiz;
