import { motion } from "framer-motion";
import { Award, Target, Brain, Trophy } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/app/components/ui/card";

interface QuizStats {
  latestScore: number;
  averageScore: number;
  quizzesTaken: number;
  lastQuizDate: string;
  bestScore: number;
}

export function QuizStatsSection() {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const mockQuizStats: QuizStats = {
    latestScore: 95,
    averageScore: 92,
    quizzesTaken: 3,
    lastQuizDate: "2024-03-19",
    bestScore: 98,
  };

  const stats = [
    {
      icon: Trophy,
      label: "Latest Score",
      value: `${mockQuizStats.latestScore}%`,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    },
    {
      icon: Target,
      label: "Average Score",
      value: `${mockQuizStats.averageScore}%`,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      icon: Brain,
      label: "Quizzes Taken",
      value: mockQuizStats.quizzesTaken,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      icon: Award,
      label: "Best Score",
      value: `${mockQuizStats.bestScore}%`,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mb-8"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Quiz Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </p>
                    <h4 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
                      {stat.value}
                    </h4>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
