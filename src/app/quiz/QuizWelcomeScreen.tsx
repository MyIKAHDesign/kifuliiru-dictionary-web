// app/quiz/QuizWelcomeScreen.tsx
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { WelcomeScreenProps } from "../lib/types/quiz";

const QuizWelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStart,
  totalQuestions,
  timeLimit,
}) => {
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
                The quiz consists of {totalQuestions} multiple choice questions
              </li>
              <li>You have {timeLimit} seconds to answer each question</li>
              <li>You need 70% or higher to pass</li>
              <li>You can retake the quiz if you don&apos;t pass</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90"
            onClick={onStart}
          >
            Start Quiz
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default QuizWelcomeScreen;
