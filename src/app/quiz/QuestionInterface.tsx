import React from "react";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { Label } from "@/app/components/ui/label";

interface QuizQuestion {
  id: number;
  text: string;
  options: string[];
  correct: number;
  explanation?: string;
}

interface QuestionInterfaceProps {
  question: QuizQuestion;
  selectedAnswer?: number;
  onAnswerSelect: (answer: number) => void;
  showFeedback?: boolean;
}

export default function QuestionInterface({
  question,
  selectedAnswer,
  onAnswerSelect,
  showFeedback = false,
}: QuestionInterfaceProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">{question.text}</h3>
      <RadioGroup
        value={selectedAnswer?.toString()}
        onValueChange={(value) => onAnswerSelect(parseInt(value))}
        className="space-y-4"
      >
        {question.options.map((option, index) => (
          <div
            key={index}
            className={`
              relative flex items-center space-x-3 p-4 rounded-lg 
              transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 
              border-2 border-transparent 
              ${
                selectedAnswer === index
                  ? "bg-primary/5 border-primary/30 shadow-sm"
                  : ""
              }
              ${
                showFeedback && index === question.correct
                  ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                  : ""
              }
              ${
                showFeedback &&
                selectedAnswer === index &&
                index !== question.correct
                  ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                  : ""
              }
              cursor-pointer
            `}
          >
            <RadioGroupItem
              value={index.toString()}
              id={`option-${index}`}
              disabled={showFeedback}
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

      {showFeedback && question.explanation && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
}
