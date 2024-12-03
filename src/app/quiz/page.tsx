// app/quiz/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { LoadingScreen } from "./components/LoadingScreen";
import { ErrorScreen } from "./components/ErrorScreen";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { QuestionScreen } from "./components/QuestionScreen";
import { ResultsScreen } from "./components/ResultsScreen";
import { QUESTIONS, QUIZ_CONFIG } from "./lib/constants";
import type {
  UserProfile,
  AnswerRecord,
  QuestionFeedbackRecord,
} from "./lib/types/quiz";

export default function QuizPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  // Auth and Profile States
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Quiz States
  const [hasStarted, setHasStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord>({});
  const [showResults, setShowResults] = useState(false);
  const [hasPassedQuiz, setHasPassedQuiz] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number>(
    QUIZ_CONFIG.TIME_PER_QUESTION
  );
  const [questionFeedback, setQuestionFeedback] =
    useState<QuestionFeedbackRecord>({});

  // Auth check effect
  useEffect(() => {
    async function checkAccess() {
      try {
        const {
          data: { session },
          error: authError,
        } = await supabase.auth.getSession();

        if (authError) throw authError;

        if (!session) {
          router.push("/auth/sign-in?redirect_url=/quiz");
          return;
        }

        // Fetch user profile and role
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select(
            "id, role, quiz_completed, quiz_score, quiz_attempts, last_quiz_attempt"
          )
          .eq("id", session.user.id)
          .single();

        if (profileError) throw profileError;

        if (!profile) {
          throw new Error("Profile not found");
        }

        // Check role permissions
        if (profile.role === "viewer") {
          setUserProfile(profile);
        } else if (["editor", "admin", "super_admin"].includes(profile.role)) {
          router.push("/contribute");
          return;
        } else {
          throw new Error("Unauthorized: Insufficient permissions");
        }

        // Check attempt limits
        if (
          profile.quiz_attempts >= QUIZ_CONFIG.MAX_DAILY_ATTEMPTS &&
          profile.last_quiz_attempt
        ) {
          const lastAttempt = new Date(profile.last_quiz_attempt);
          const now = new Date();
          if (now.getTime() - lastAttempt.getTime() < 24 * 60 * 60 * 1000) {
            throw new Error(
              "Maximum quiz attempts reached for today. Please try again tomorrow."
            );
          }
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    checkAccess();
  }, [router, supabase]);

  // Timer effect
  useEffect(() => {
    if (!hasStarted || timeLeft <= 0 || showResults) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, showResults, hasStarted]);

  // Quiz handlers
  const handleTimeUp = () => {
    if (!answers[currentQuestion]) {
      setAnswers((prev) => ({ ...prev, [currentQuestion]: -1 }));
      handleNext();
    }
  };

  const handleAnswer = (answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion]: parseInt(answer),
    }));
  };

  const handleNext = () => {
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setTimeLeft(QUIZ_CONFIG.TIME_PER_QUESTION);
    } else {
      calculateResults();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
      setTimeLeft(QUIZ_CONFIG.TIME_PER_QUESTION);
    }
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setHasPassedQuiz(false);
    setScore(0);
    setTimeLeft(QUIZ_CONFIG.TIME_PER_QUESTION);
    setQuestionFeedback({});
  };

  const calculateResults = async () => {
    if (!userProfile) return;

    const results: QuestionFeedbackRecord = {};
    let correctCount = 0;

    QUESTIONS.forEach((question, index) => {
      const isCorrect = answers[index] === question.correct;
      if (isCorrect) correctCount++;

      results[index] = {
        isCorrect,
        userAnswer: answers[index],
        correctAnswer: question.correct,
        explanation: question.explanation,
      };
    });

    const finalScore = (correctCount / QUESTIONS.length) * 100;
    const passed = finalScore >= QUIZ_CONFIG.PASS_THRESHOLD;

    try {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          quiz_completed: passed,
          quiz_score: finalScore,
          quiz_attempts: (userProfile.quiz_attempts || 0) + 1,
          last_quiz_attempt: new Date().toISOString(),
          role: passed ? "editor" : "viewer",
        })
        .eq("id", userProfile.id);

      if (updateError) throw updateError;

      setScore(finalScore);
      setHasPassedQuiz(passed);
      setQuestionFeedback(results);
      setShowResults(true);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      // Using underscore to indicate we're intentionally not using the error
      setError("Failed to save quiz results. Please try again.");
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorScreen message={error} onRetry={() => router.push("/")} />;
  }

  if (!hasStarted) {
    return (
      <WelcomeScreen
        questionsCount={QUESTIONS.length}
        onStart={() => setHasStarted(true)}
      />
    );
  }

  if (showResults) {
    return (
      <ResultsScreen
        score={score}
        hasPassedQuiz={hasPassedQuiz}
        questions={QUESTIONS}
        answers={answers}
        questionFeedback={questionFeedback}
        onRetry={handleRetry}
        onReset={() => {
          setHasStarted(false);
          handleRetry();
        }}
      />
    );
  }

  return (
    <QuestionScreen
      question={QUESTIONS[currentQuestion]}
      questionNumber={currentQuestion + 1}
      totalQuestions={QUESTIONS.length}
      timeLeft={timeLeft}
      selectedAnswer={answers[currentQuestion]}
      onAnswer={handleAnswer}
      onNext={handleNext}
      onPrevious={handlePrevious}
    />
  );
}
