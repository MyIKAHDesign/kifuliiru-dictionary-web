// components/quiz/QuizResults.tsx
import { motion } from "framer-motion";
import { CheckCircle, XCircle, ChevronRight, RotateCcw } from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Progress } from "@/app/components/ui/progress";
import { ResultsScreenProps } from "./types";

const QuizResults: React.FC<ResultsScreenProps> = ({
  score,
  hasPassedQuiz,
  questions,
  answers,
  questionFeedback,
  onRetry,
  onContinue,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen p-4 flex items-center justify-center"
    >
      <Card className="w-full max-w-3xl p-8 space-y-8">
        {/* Score Display */}
        <div className="text-center space-y-6">
          <motion.h1
            className="text-3xl font-bold"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            Quiz Results
          </motion.h1>

          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex flex-col items-center"
          >
            <span className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              {Math.round(score)}%
            </span>
            <Progress value={score} className="w-64 h-2 mt-4" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`
              p-4 rounded-lg border-2 
              ${
                hasPassedQuiz
                  ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                  : "border-red-500 bg-red-50 dark:bg-red-900/20"
              }
            `}
          >
            {hasPassedQuiz ? (
              <div className="flex items-center justify-center gap-2 text-green-700 dark:text-green-300">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">
                  Congratulations! You&apos;ve passed the quiz.
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 text-red-700 dark:text-red-300">
                <XCircle className="h-5 w-5" />
                <span className="font-medium">
                  You need a score of 70% or higher to pass.
                </span>
              </div>
            )}
          </motion.div>
        </div>

        {/* Detailed Feedback */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-6"
        >
          <h2 className="text-xl font-semibold">Detailed Feedback</h2>

          <div className="space-y-4">
            {questions.map((question, index) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className={`
                  p-4 rounded-lg border 
                  ${
                    questionFeedback[index]?.isCorrect
                      ? "border-green-200 dark:border-green-800"
                      : "border-red-200 dark:border-red-800"
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  {questionFeedback[index]?.isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mt-1" />
                  )}

                  <div className="space-y-2 flex-1">
                    <p className="font-medium">
                      Question {index + 1}: {question.text}
                    </p>

                    <div className="text-sm space-y-1">
                      <p className="text-muted-foreground">
                        Your answer: {question.options[answers[index]]}
                      </p>
                      {!questionFeedback[index]?.isCorrect && (
                        <p className="text-muted-foreground">
                          Correct answer: {question.options[question.correct]}
                        </p>
                      )}
                      <p className="text-sm mt-2 text-muted-foreground">
                        {question.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex justify-center gap-4 pt-4"
        >
          {hasPassedQuiz ? (
            <Button
              onClick={onContinue}
              className="h-12 px-8 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              Continue to Contribute
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={onRetry} className="h-12 px-8">
                <RotateCcw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </>
          )}
        </motion.div>
      </Card>
    </motion.div>
  );
};

export default QuizResults;
