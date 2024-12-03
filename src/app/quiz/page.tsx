"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { CheckCircle, XCircle, Timer, Loader2 } from "lucide-react";
import { Progress } from "@/app/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { Label } from "@/app/components/ui/label";
import Link from "next/link";

// Types
interface QuestionFeedback {
  isCorrect: boolean;
  userAnswer: number;
  correctAnswer: number;
  explanation: string;
}

interface QuestionFeedbackRecord {
  [key: number]: QuestionFeedback;
}

interface AnswerRecord {
  [key: number]: number;
}

interface UserProfile {
  id: string;
  role: string;
  quiz_completed: boolean;
  quiz_score: number | null;
  quiz_attempts: number;
  last_quiz_attempt: string | null;
}

export default function ContributorQuiz() {
  const TIME_PER_QUESTION = 45;
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
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [questionFeedback, setQuestionFeedback] =
    useState<QuestionFeedbackRecord>({});

  // Check authentication and access rights
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

        // Check quiz attempts
        if (profile.quiz_attempts >= 3 && profile.last_quiz_attempt) {
          const lastAttempt = new Date(profile.last_quiz_attempt);
          const now = new Date();
          if (now.getTime() - lastAttempt.getTime() < 24 * 60 * 60 * 1000) {
            throw new Error(
              "Maximum quiz attempts reached for today. Please try again tomorrow."
            );
          }
        }
      } catch (error) {
        console.error("Access check error:", error);
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    checkAccess();
  }, [router, supabase]);

  // Timer Effect
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

  // Quiz Questions
  const questions = [
    {
      question: "What is the primary goal of the Kifuliiru project?",
      options: [
        "To create a social media platform",
        "To document and preserve the Kifuliiru language",
        "To teach English to Kifuliiru speakers",
        "To develop mobile games",
      ],
      correct: 1,
      explanation:
        "The Kifuliiru project's main goal is language preservation and documentation, ensuring that the cultural and linguistic heritage is maintained for future generations. This includes comprehensive documentation of vocabulary, grammar, cultural context, and usage patterns.",
    },
    {
      question: "Which of these is important when contributing to the project?",
      options: [
        "Using formal academic language only",
        "Adding as many words as possible quickly",
        "Ensuring accurate translations and cultural context",
        "Focusing only on modern terms",
      ],
      correct: 2,
      explanation:
        "Accuracy and cultural context are crucial for meaningful contributions. Quality over quantity ensures reliable documentation and respects the language's cultural significance. Each entry should include proper translations, usage examples, and relevant cultural information.",
    },
    {
      question: "How should you handle uncertain translations?",
      options: [
        "Skip them entirely",
        "Make your best guess",
        "Copy from another language",
        "Mark them for review and consult native speakers",
      ],
      correct: 3,
      explanation:
        "When facing uncertain translations, it's essential to mark them for review and consult native speakers. This ensures accuracy and prevents the spread of misinformation. Native speakers can provide proper context, usage, and cultural significance of terms.",
    },
    {
      question: "What is the best approach when documenting cultural terms?",
      options: [
        "Only include modern interpretations",
        "Document both traditional and contemporary usage",
        "Skip complex cultural concepts",
        "Use English equivalents only",
      ],
      correct: 1,
      explanation:
        "Cultural terms should be documented with both their traditional and contemporary usage patterns. This comprehensive approach helps preserve historical meaning while acknowledging how terms have evolved in modern contexts.",
    },
    {
      question: "How should dialectal variations be handled?",
      options: [
        "Ignore minor variations",
        "Choose the most common version only",
        "Document all significant variations and their contexts",
        "Standardize to one dialect",
      ],
      correct: 2,
      explanation:
        "All significant dialectal variations should be documented with their specific contexts, including regional usage, pronunciation differences, and meaning variations. This preserves the language's diversity and helps users understand regional differences.",
    },
    {
      question: "What is the recommended process for adding new terms?",
      options: [
        "Add them immediately as you think of them",
        "Copy from similar languages",
        "Verify with multiple native speakers and document sources",
        "Use personal experience only",
      ],
      correct: 2,
      explanation:
        "New terms should be verified with multiple native speakers and properly documented with sources. This validation process ensures accuracy, proper usage, and cultural appropriateness while maintaining the integrity of the dictionary.",
    },
    {
      question: "How should traditional proverbs and idioms be documented?",
      options: [
        "Literal translation only",
        "Skip them as they're too complex",
        "Include literal translation, meaning, and cultural context",
        "Modern equivalents only",
      ],
      correct: 2,
      explanation:
        "Proverbs and idioms require comprehensive documentation including literal translation, intended meaning, and cultural context. This helps preserve both the linguistic and cultural aspects while ensuring users understand their proper usage and significance.",
    },
    {
      question:
        "What is the best practice for handling grammatical documentation?",
      options: [
        "Focus on vocabulary only",
        "Document with examples and usage contexts",
        "Use English grammar rules",
        "Simplify all complex structures",
      ],
      correct: 1,
      explanation:
        "Grammar should be documented with clear examples and usage contexts. This approach helps users understand how words and phrases are used in practice, while preserving the unique grammatical structures of Kifuliiru.",
    },
    {
      question: "How should you approach phonetic transcription?",
      options: [
        "Use English phonetics",
        "Skip pronunciation details",
        "Follow standard IPA conventions accurately",
        "Approximate sounds",
      ],
      correct: 2,
      explanation:
        "Phonetic transcription should follow standard IPA conventions accurately to ensure consistent and precise pronunciation documentation. This helps maintain pronunciation accuracy and assists learners in correctly pronouncing words.",
    },
    {
      question: "What should you do if you find conflicting information?",
      options: [
        "Use the first version you found",
        "Ignore the conflicts",
        "Document all variants and seek consensus from native speakers",
        "Choose randomly",
      ],
      correct: 2,
      explanation:
        "When encountering conflicting information, all variants should be documented and consensus sought from native speakers. This approach acknowledges potential regional or historical variations while ensuring accuracy through expert consultation.",
    },
  ];

  // Handle quiz completion
  const handleQuizCompletion = async (passed: boolean, finalScore: number) => {
    if (!userProfile) return;

    try {
      const updates = {
        quiz_completed: passed,
        quiz_score: finalScore,
        quiz_attempts: (userProfile.quiz_attempts || 0) + 1,
        last_quiz_attempt: new Date().toISOString(),
        role: passed ? "editor" : "viewer",
      };

      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", userProfile.id);

      if (error) throw error;

      if (passed) {
        router.push("/contribute");
      }
    } catch (error) {
      console.error("Failed to update quiz results:", error);
      setError("Failed to save quiz results. Please try again.");
    }
  };

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
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setTimeLeft(TIME_PER_QUESTION);
    } else {
      calculateResults();
    }
  };

  const calculateResults = () => {
    const results: QuestionFeedbackRecord = {};
    let correctCount = 0;

    questions.forEach((question, index) => {
      const isCorrect = answers[index] === question.correct;
      if (isCorrect) correctCount++;

      results[index] = {
        isCorrect,
        userAnswer: answers[index],
        correctAnswer: question.correct,
        explanation: question.explanation,
      };
    });

    const finalScore = (correctCount / questions.length) * 100;
    setScore(finalScore);
    const passed = finalScore >= 70;
    setHasPassedQuiz(passed);
    setQuestionFeedback(results);
    setShowResults(true);

    // Update profile with quiz results
    handleQuizCompletion(passed, finalScore);
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setHasPassedQuiz(false);
    setScore(0);
    setTimeLeft(TIME_PER_QUESTION);
    setQuestionFeedback({});
  };

  const handleStartQuiz = () => {
    setHasStarted(true);
    setTimeLeft(TIME_PER_QUESTION);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Access Error
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  // 1. Welcome Screen
  if (!hasStarted) {
    return (
      <div className="py-12">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Contributor Quiz
            </CardTitle>
            <CardDescription className="text-center text-base">
              Test your knowledge about the Kifuliiru project and contribution
              guidelines
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 rounded-lg p-6 space-y-4">
              <h3 className="font-semibold text-lg">Before you begin:</h3>
              <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                <li>
                  The quiz consists of {questions.length} multiple choice
                  questions
                </li>
                <li>
                  You have {TIME_PER_QUESTION} seconds to answer each question
                </li>
                <li>You need 70% or higher to pass</li>
                <li>You can retake the quiz if you don&apos;t pass</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90"
              onClick={handleStartQuiz}
            >
              Start Quiz
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // 2. Results Screen
  if (showResults) {
    return (
      <div className="py-12">
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader className="text-center">
            <h2 className="text-2xl font-bold">Quiz Results</h2>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="text-center">
              <div className="text-6xl font-bold mb-4">
                {Math.round(score)}%
              </div>
              <Progress value={score} className="w-full h-2" />
            </div>

            {hasPassedQuiz ? (
              <Alert>
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle>Congratulations!</AlertTitle>
                <AlertDescription>
                  You have passed the quiz with a score of {Math.round(score)}
                  %. You can now contribute to the Kifuliiru project.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Not Quite There</AlertTitle>
                <AlertDescription>
                  You scored {Math.round(score)}%. A score of 70% or higher is
                  needed to pass.
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Detailed Feedback</h3>
              {questions.map((question, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    {questionFeedback[index]?.isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600 mt-1" />
                    )}
                    <div className="space-y-2 flex-1">
                      <h4 className="font-medium">
                        Question {index + 1}: {question.question}
                      </h4>
                      <div className="text-sm">
                        <p className="text-gray-600 dark:text-gray-300">
                          Your answer:{" "}
                          {answers[index] === -1
                            ? "Time expired"
                            : question.options[answers[index]]}
                        </p>
                        {!questionFeedback[index]?.isCorrect && (
                          <p className="text-gray-600 dark:text-gray-300">
                            Correct answer: {question.options[question.correct]}
                          </p>
                        )}
                        <p className="mt-2 text-gray-700 dark:text-gray-200">
                          {question.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-center gap-4">
            {hasPassedQuiz ? (
              <Link href="/contribute">
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  Proceed to Contribute
                </Button>
              </Link>
            ) : (
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setHasStarted(false);
                    handleRetry();
                  }}
                >
                  Back to Start
                </Button>
                <Button onClick={handleRetry}>Try Again</Button>
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    );
  }

  // 3. Quiz Screen
  return (
    <div className="py-12">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Contributor Quiz</h2>
            <div className="flex items-center gap-2">
              <Timer className="h-5 w-5" />
              <span
                className={`font-mono ${
                  timeLeft <= 10 ? "text-red-600 font-bold" : ""
                }`}
              >
                {timeLeft}s
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span>
                {Math.round((currentQuestion / questions.length) * 100)}%
                complete
              </span>
            </div>
            <Progress
              value={(currentQuestion / questions.length) * 100}
              className="h-2"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <h3 className="text-lg font-medium">
              {questions[currentQuestion].question}
            </h3>
            <RadioGroup
              value={answers[currentQuestion]?.toString()}
              onValueChange={handleAnswer}
              className="space-y-4"
            >
              {questions[currentQuestion].options.map((option, index) => (
                <div
                  key={index}
                  className="relative flex items-center space-x-3 p-4 rounded-lg 
                    transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 
                    border-2 border-transparent 
                    data-[state=checked]:bg-primary/5 data-[state=checked]:border-primary/30 
                    data-[state=checked]:shadow-sm cursor-pointer"
                >
                  <RadioGroupItem
                    value={index.toString()}
                    id={`option-${index}`}
                  />
                  <Label
                    htmlFor={`option-${index}`}
                    className="flex-grow cursor-pointer font-medium"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => {
              if (currentQuestion > 0) {
                setCurrentQuestion((prev) => prev - 1);
                setTimeLeft(TIME_PER_QUESTION);
              }
            }}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={answers[currentQuestion] === undefined}
          >
            {currentQuestion < questions.length - 1 ? "Next" : "Finish Quiz"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
