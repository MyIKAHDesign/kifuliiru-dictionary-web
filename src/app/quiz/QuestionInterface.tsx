import { motion, AnimatePresence } from "framer-motion";
import { Timer, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Progress } from "@/app/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";

interface Question {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface QuestionScreenProps {
  question: Question | null;
  currentQuestion: number;
  totalQuestions: number;
  timeLeft: number;
  selectedAnswer?: number;
  onAnswer: (answer: number) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const QuestionInterface = ({
  question,
  currentQuestion,
  totalQuestions,
  timeLeft,
  selectedAnswer,
  onAnswer,
  onNext,
  onPrevious,
}: QuestionScreenProps) => {
  const progress = (currentQuestion / totalQuestions) * 100;

  // Show loading state if question is not available
  if (!question) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <Card className="w-full max-w-2xl p-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <p className="text-muted-foreground">Loading question...</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen p-4 flex items-center justify-center"
    >
      <Card className="w-full max-w-2xl p-8 space-y-8">
        {/* Header & Progress */}
        <div className="space-y-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Question {currentQuestion + 1} of {totalQuestions}
            </span>
            <span>{Math.round(progress)}% Complete</span>
          </div>

          <Progress value={progress} className="h-2" />

          <div className="flex justify-end">
            <div className="flex items-center gap-2 py-1 px-4 rounded-full bg-muted/50">
              <Timer className="h-4 w-4" />
              <span
                className={`font-mono ${
                  timeLeft <= 10 ? "text-red-500 font-bold" : ""
                }`}
              >
                {timeLeft}s
              </span>
            </div>
          </div>
        </div>

        {/* Question Content */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <h2 className="text-xl font-semibold leading-tight">
            {question.question}
          </h2>

          {/* Options */}
          <RadioGroup
            value={selectedAnswer?.toString()}
            onValueChange={(value) => onAnswer(parseInt(value))}
            className="space-y-4"
          >
            <AnimatePresence mode="wait">
              {Array.isArray(question.options) &&
                question.options.map((option, index) => (
                  <motion.div
                    key={`${currentQuestion}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <label
                      className={`
                      flex items-center gap-4 p-4 rounded-lg cursor-pointer
                      border-2 transition-all duration-200
                      ${
                        selectedAnswer === index
                          ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/20"
                          : "border-muted hover:border-muted-foreground/50"
                      }
                    `}
                    >
                      <RadioGroupItem value={index.toString()} />
                      <span className="text-base">{option}</span>
                    </label>
                  </motion.div>
                ))}
            </AnimatePresence>
          </RadioGroup>
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={currentQuestion === 0}
            className="w-32"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <Button
            onClick={onNext}
            disabled={selectedAnswer === undefined}
            className="w-32 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            {currentQuestion === totalQuestions - 1 ? "Finish" : "Next"}
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default QuestionInterface;
