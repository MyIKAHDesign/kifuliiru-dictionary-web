// app/quiz/components/QuestionScreen.tsx
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Progress } from "@/app/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { Label } from "@/app/components/ui/label";
import { Timer } from "lucide-react";
import { Question } from "../lib/types/quiz";

interface QuestionScreenProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  timeLeft: number;
  selectedAnswer?: number;
  onAnswer: (answer: string) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function QuestionScreen({
  question,
  questionNumber,
  totalQuestions,
  timeLeft,
  selectedAnswer,
  onAnswer,
  onNext,
  onPrevious,
}: QuestionScreenProps) {
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
                Question {questionNumber} of {totalQuestions}
              </span>
              <span>
                {Math.round((questionNumber / totalQuestions) * 100)}% complete
              </span>
            </div>
            <Progress
              value={(questionNumber / totalQuestions) * 100}
              className="h-2"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <h3 className="text-lg font-medium">{question.question}</h3>
            <RadioGroup
              value={selectedAnswer?.toString()}
              onValueChange={onAnswer}
              className="space-y-4"
            >
              {question.options.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-4 rounded-lg border-2"
                >
                  <RadioGroupItem
                    value={index.toString()}
                    id={`option-${index}`}
                  />
                  <Label
                    htmlFor={`option-${index}`}
                    className="flex-grow cursor-pointer"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={questionNumber === 1}
          >
            Previous
          </Button>
          <Button onClick={onNext} disabled={selectedAnswer === undefined}>
            {questionNumber === totalQuestions ? "Finish Quiz" : "Next"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
