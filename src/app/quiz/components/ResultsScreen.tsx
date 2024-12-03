// app/quiz/components/ResultsScreen.tsx
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/app/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { Button } from "@/app/components/ui/button";
import { Progress } from "@/app/components/ui/progress";
import { CheckCircle, XCircle } from "lucide-react";
import type {
  Question,
  QuestionFeedbackRecord,
  AnswerRecord,
} from "../lib/types/quiz";
import { QUIZ_CONFIG } from "../lib/constants";

interface ResultsScreenProps {
  score: number;
  hasPassedQuiz: boolean;
  questions: Question[];
  answers: AnswerRecord;
  questionFeedback: QuestionFeedbackRecord;
  onRetry: () => void;
  onReset: () => void;
}

export function ResultsScreen({
  score,
  hasPassedQuiz,
  questions,
  answers,
  questionFeedback,
  onRetry,
  onReset,
}: ResultsScreenProps) {
  return (
    <div className="py-12">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader className="text-center">
          <h2 className="text-2xl font-bold">Quiz Results</h2>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="text-center">
            <div className="text-6xl font-bold mb-4">{Math.round(score)}%</div>
            <Progress value={score} className="w-full h-2" />
          </div>

          {hasPassedQuiz ? (
            <Alert>
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle>Congratulations!</AlertTitle>
              <AlertDescription>
                You have passed the quiz with a score of {Math.round(score)}%.
                You can now contribute to the Kifuliiru project.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Not Quite There</AlertTitle>
              <AlertDescription>
                You scored {Math.round(score)}%. A score of{" "}
                {QUIZ_CONFIG.PASS_THRESHOLD}% or higher is needed to pass.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Detailed Feedback</h3>
            {questions.map((question, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-start gap-3">
                  {questionFeedback[index]?.isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
                  )}
                  <div className="space-y-2 flex-1">
                    <h4 className="font-medium">
                      Question {index + 1}: {question.question}
                    </h4>
                    <div className="text-sm space-y-1">
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
                      <p className="mt-2 text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800/50 p-2 rounded">
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
              <Button variant="outline" onClick={onReset}>
                Back to Start
              </Button>
              <Button onClick={onRetry}>Try Again</Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
