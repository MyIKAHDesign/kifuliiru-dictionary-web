// app/quiz/QuestionInterface.tsx
import React from "react";
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
import { QuestionInterfaceProps } from "../lib/types/quiz";

const QuestionInterface: React.FC<QuestionInterfaceProps> = ({
  question,
  questionNumber,
  totalQuestions,
  timeLeft,
  selectedAnswer,
  onAnswer,
  onNext,
  onPrevious,
}) => {
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
                {Math.round(((questionNumber - 1) / totalQuestions) * 100)}%
                complete
              </span>
            </div>
            <Progress
              value={((questionNumber - 1) / totalQuestions) * 100}
              className="h-2"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <h3 className="text-lg font-medium">{question.text}</h3>
            <RadioGroup
              value={selectedAnswer?.toString()}
              onValueChange={(value) => onAnswer(parseInt(value))}
              className="space-y-4"
            >
              {question.options.map((option, index) => (
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
            onClick={onPrevious}
            disabled={questionNumber === 1}
          >
            Previous
          </Button>
          <Button onClick={onNext} disabled={selectedAnswer === undefined}>
            {questionNumber < totalQuestions ? "Next" : "Finish Quiz"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default QuestionInterface;
