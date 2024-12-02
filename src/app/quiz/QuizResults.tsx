// app/quiz/QuizResults.tsx
import React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Progress } from "@/app/components/ui/progress";
import { Alert, AlertTitle, AlertDescription } from "@/app/components/ui/alert";
import { CheckCircle, XCircle } from "lucide-react";
import { QuizResultsProps } from "../lib/types/quiz";

const QuizResults: React.FC<QuizResultsProps> = ({
  score,
  hasPassedQuiz,
  questions,
  answers,
  questionFeedback,
  onRetry,
}) => {
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
                You scored {Math.round(score)}%. A score of 70% or higher is
                needed to pass.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Detailed Feedback</h3>
            {questions.map((question, index) => (
              <div key={question.id} className="border rounded-lg p-4">
                <div className="flex items-start gap-3">
                  {questionFeedback[index]?.isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 mt-1" />
                  )}
                  <div className="space-y-2 flex-1">
                    <h4 className="font-medium">
                      Question {index + 1}: {question.text}
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
                  onRetry();
                }}
              >
                Back to Start
              </Button>
              <Button onClick={onRetry}>Try Again</Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default QuizResults;
