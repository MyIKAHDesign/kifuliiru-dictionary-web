// components/quiz/QuizWelcomeScreen.tsx
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import type { WelcomeScreenProps } from "@/app/lib/types/quiz";
import { QUIZ_CONFIG } from "./types";

const QuizWelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const requirements = [
    `${QUIZ_CONFIG.TOTAL_QUESTIONS} multiple choice questions`,
    `${QUIZ_CONFIG.TIME_PER_QUESTION} seconds per question`,
    `${QUIZ_CONFIG.PASSING_SCORE}% to pass`,
    "Retake if needed",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen p-4 flex items-center justify-center"
    >
      <Card className="w-full max-w-lg p-8 space-y-8">
        <div className="space-y-2 text-center">
          <motion.h1
            className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            Contributor Quiz
          </motion.h1>
          <p className="text-muted-foreground">
            Test your knowledge about Kifuliiru project guidelines
          </p>
        </div>

        <motion.div
          className="bg-muted/50 rounded-lg p-6 space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="font-semibold text-lg">Before you begin:</h2>
          <ul className="space-y-3">
            {requirements.map((requirement, index) => (
              <motion.li
                key={index}
                className="flex items-center gap-3 text-muted-foreground"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <CheckCircle className="h-5 w-5 text-blue-500" />
                <span>{requirement}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="pt-4"
        >
          <Button
            onClick={onStart}
            className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            Start Quiz
          </Button>
        </motion.div>
      </Card>
    </motion.div>
  );
};

export default QuizWelcomeScreen;
