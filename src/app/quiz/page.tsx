// app/quiz/page.tsx
"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/app/components/ui/alert";
import { Progress } from "@/app/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { Label } from "@/app/components/ui/label";
import { Timer, CheckCircle, XCircle } from "lucide-react";

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
  answers: Record<string, number>; // question_id -> selected_option_id
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
  const [, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuestionWithOptions[]>([]);
  const [, setUserRole] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    answers: {},
    timeLeft: SECONDS_PER_QUESTION,
    score: 0,
    hasPassed: false,
    isComplete: false,
    attemptId: null,
  });

  // Function to fetch questions with their options
  const fetchQuestionsWithOptions = async () => {
    // Fetch questions
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
    return questionsData.map((question: QuizQuestion) => ({
      ...question,
      options: optionsData.filter((opt) => opt.question_id === question.id),
    }));
  };

  // Initialize quiz
  useEffect(() => {
    async function initializeQuiz() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) {
          router.push("/auth/sign-in?redirect=/quiz");
          return;
        }

        // Check user role
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (profileError) throw profileError;
        setUserRole(profile?.role || "viewer");

        if (profile?.role === "contributor") {
          router.push("/contribute");
          return;
        }

        const questionsWithOptions = await fetchQuestionsWithOptions();
        setQuestions(questionsWithOptions);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load quiz");
      } finally {
        setIsLoading(false);
      }
    }

    initializeQuiz();
  }, [supabase, router]);

  // Timer effect
  useEffect(() => {
    if (hasStarted && !quizState.isComplete && !isLoading) {
      const timer = setInterval(() => {
        setQuizState((prev) => {
          if (prev.timeLeft <= 1) {
            handleTimeUp();
            return { ...prev, timeLeft: 0 };
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [hasStarted, quizState.isComplete, isLoading]);

  // Start new quiz attempt
  const startNewAttempt = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user?.id) throw new Error("No authenticated user");

    const { data: attempt, error } = await supabase
      .from("quiz_attempts")
      .insert({
        user_id: session.user.id,
        quiz_type: "contributor",
        started_at: new Date().toISOString(),
        current_question: 0,
        score: 0,
        total_questions: questions.length,
      })
      .select()
      .single();

    if (error) throw error;
    return attempt.id;
  };

  const handleTimeUp = () => {
    const currentQuestion = questions[quizState.currentQuestionIndex];
    if (!quizState.answers[currentQuestion.id]) {
      handleAnswer("-1");
      handleNext();
    }
  };

  /* const calculateScore = async (): Promise<number> => {
    if (!quizState.attemptId) return 0;

    const { data: responses } = await supabase
      .from("quiz_responses")
      .select("is_correct")
      .eq("attempt_id", quizState.attemptId);

    if (!responses) return 0;

    const correctAnswers = responses.filter((r) => r.is_correct).length;
    return (correctAnswers / questions.length) * 100;
  }; */

  const handleStartQuiz = async () => {
    try {
      const attemptId = await startNewAttempt();
      setQuizState((prev) => ({ ...prev, attemptId }));
      setHasStarted(true);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to start quiz. Please try again.";

      setError(errorMessage);
      console.error("Error starting quiz:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  ////////////@NewCode///////////////////
  // Add these functions in your QuizPage component

  // Track quiz progress
  const updateQuizProgress = async () => {
    if (!quizState.attemptId) return;

    try {
      const { error } = await supabase.from("quiz_progress").upsert({
        id: quizState.attemptId,
        user_id: (await supabase.auth.getUser()).data.user?.id,
        quiz_type: "contributor",
        current_question: quizState.currentQuestionIndex,
        answers: quizState.answers,
        time_left: quizState.timeLeft,
        start_time: new Date().toISOString(),
      });

      if (error) throw error;
    } catch (error) {
      console.error("Error updating quiz progress:", error);
    }
  };

  // Save each answer
  const saveQuizResponse = async (
    questionId: number,
    selectedOptionId: number
  ) => {
    if (!quizState.attemptId) {
      console.error("No quiz attempt ID found");
      return;
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user?.id) {
      console.error("No authenticated user found");
      return;
    }

    try {
      // First validate the response data
      if (
        !Number.isInteger(questionId) ||
        !Number.isInteger(selectedOptionId)
      ) {
        throw new Error("Invalid question or option ID");
      }

      // Get the correct option for this question
      const currentQuestion = questions.find((q) => q.id === questionId);
      if (!currentQuestion) {
        throw new Error("Question not found");
      }

      const isCorrect =
        currentQuestion.options.find((opt) => opt.id === selectedOptionId)
          ?.is_correct || false;

      // Save the response
      const { error: responseError } = await supabase
        .from("quiz_responses")
        .insert({
          attempt_id: quizState.attemptId,
          user_id: session.user.id,
          question_id: questionId,
          selected_option_id: selectedOptionId,
          is_correct: isCorrect,
          time_spent: SECONDS_PER_QUESTION - quizState.timeLeft,
          response_order: quizState.currentQuestionIndex,
        });

      if (responseError) {
        throw responseError;
      }

      // Update the attempt progress
      const { error: progressError } = await supabase
        .from("quiz_attempts")
        .update({
          current_question: quizState.currentQuestionIndex,
          last_response_at: new Date().toISOString(),
          answers: {
            ...quizState.answers,
            [questionId]: selectedOptionId,
          },
        })
        .eq("id", quizState.attemptId);

      if (progressError) {
        throw progressError;
      }
    } catch (error) {
      console.error("Error saving quiz response:", error);
      // Optionally set an error state here if you want to show it to the user
      setError(
        error instanceof Error ? error.message : "Failed to save response"
      );
    }
  };

  // Update handleNext to include progress tracking
  const handleNext = async () => {
    await updateQuizProgress();

    if (quizState.currentQuestionIndex < questions.length - 1) {
      setQuizState((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        timeLeft: SECONDS_PER_QUESTION,
      }));
    } else {
      await completeQuiz();
    }
  };

  // Update handleAnswer to use the new saveQuizResponse
  const handleAnswer = async (optionId: string) => {
    const currentQuestion = questions[quizState.currentQuestionIndex];
    const selectedOptionId = parseInt(optionId);

    // Update local state first for immediate UI response
    setQuizState((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [currentQuestion.id]: selectedOptionId,
      },
    }));

    // Then save to database
    await saveQuizResponse(currentQuestion.id, selectedOptionId);
  };

  const calculateScore = async (): Promise<number> => {
    if (!quizState.attemptId) {
      return 0;
    }

    // Fetch all responses for this attempt
    const { data: responses, error } = await supabase
      .from("quiz_responses")
      .select("is_correct")
      .eq("attempt_id", quizState.attemptId);

    if (error) {
      console.error("Error calculating score:", error);
      return 0;
    }

    if (!responses || responses.length === 0) {
      return 0;
    }

    // Calculate percentage of correct answers
    const correctAnswers = responses.filter(
      (response) => response.is_correct
    ).length;
    return (correctAnswers / questions.length) * 100;
  };

  // Update completeQuiz with better error handling
  const completeQuiz = async () => {
    try {
      if (!quizState.attemptId) {
        throw new Error("No quiz attempt ID found");
      }

      const score = await calculateScore();
      const passed = score >= PASSING_SCORE;

      // Update quiz attempt with final results
      const { error: attemptError } = await supabase
        .from("quiz_attempts")
        .update({
          completed_at: new Date().toISOString(),
          score,
          is_passed: passed,
          total_questions: questions.length,
        })
        .eq("id", quizState.attemptId);

      if (attemptError) throw attemptError;

      // If passed, update user role
      if (passed) {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session?.user?.id) {
          throw new Error("No authenticated user found");
        }

        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            role: "contributor",
            quiz_completed: true,
            quiz_score: score,
            quiz_completed_at: new Date().toISOString(),
          })
          .eq("id", session.user.id);

        if (profileError) throw profileError;
      }

      // Update UI state
      setQuizState((prev) => ({
        ...prev,
        score,
        hasPassed: passed,
        isComplete: true,
      }));
    } catch (error) {
      console.error("Error completing quiz:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to complete quiz. Please try again."
      );
    }
  };

  ////////////fin@NewCode///////////////

  if (!hasStarted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Contributor Quiz</CardTitle>
            <CardDescription>
              Pass this quiz to become a contributor and help build the
              Kifuliiru dictionary.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Quiz Details:</h3>
              <ul className="space-y-2 list-disc list-inside text-sm">
                <li>{questions.length} questions to answer</li>
                <li>{SECONDS_PER_QUESTION} seconds per question</li>
                <li>{PASSING_SCORE}% required to pass</li>
                <li>
                  You&apos;ll become a contributor immediately upon passing
                </li>
              </ul>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleStartQuiz} className="w-full">
              Start Quiz
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (quizState.isComplete) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Quiz Results</CardTitle>
            <CardDescription className="text-center text-xl">
              Your Score: {Math.round(quizState.score)}%
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Progress value={quizState.score} className="w-full h-2" />

            {quizState.hasPassed ? (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Congratulations!</AlertTitle>
                <AlertDescription>
                  You are now a contributor! You can start adding entries to the
                  Kifuliiru dictionary.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Not Quite There</AlertTitle>
                <AlertDescription>
                  You need {PASSING_SCORE}% to pass. Feel free to try again when
                  you&apos;re ready.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            {quizState.hasPassed ? (
              <Button
                onClick={() => router.push("/contribute")}
                className="bg-green-600 hover:bg-green-700"
              >
                Start Contributing
              </Button>
            ) : (
              <Button onClick={() => router.push("/")} variant="outline">
                Return Home
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[quizState.currentQuestionIndex];

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center mb-4">
            <CardTitle>
              Question {quizState.currentQuestionIndex + 1} of{" "}
              {questions.length}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4" />
              <span
                className={`font-mono ${
                  quizState.timeLeft <= 10 ? "text-red-500" : ""
                }`}
              >
                {quizState.timeLeft}s
              </span>
            </div>
          </div>
          <Progress
            value={(quizState.currentQuestionIndex / questions.length) * 100}
            className="w-full h-2"
          />
        </CardHeader>

        <CardContent className="space-y-6">
          <h3 className="text-lg font-medium">
            {currentQuestion.question_text}
          </h3>

          <RadioGroup
            value={quizState.answers[currentQuestion.id]?.toString()}
            onValueChange={handleAnswer}
            className="space-y-3"
          >
            {currentQuestion.options.map((option) => (
              <div
                key={option.id}
                className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <RadioGroupItem
                  value={option.id.toString()}
                  id={`option-${option.id}`}
                />
                <Label htmlFor={`option-${option.id}`}>
                  {option.option_text}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() =>
              setQuizState((prev) => ({
                ...prev,
                currentQuestionIndex: prev.currentQuestionIndex - 1,
                timeLeft: SECONDS_PER_QUESTION,
              }))
            }
            disabled={quizState.currentQuestionIndex === 0}
          >
            Previous
          </Button>

          <Button
            onClick={handleNext}
            disabled={!quizState.answers[currentQuestion.id]}
          >
            {quizState.currentQuestionIndex === questions.length - 1
              ? "Finish"
              : "Next"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
