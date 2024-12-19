import React from "react";
import {
  Trophy,
  BookMarked,
  Star,
  MessageSquare,
  Medal,
  ThumbsUp,
  Target,
  Lightbulb,
  TrendingUp,
  Heart,
} from "lucide-react";
import { Progress } from "@/app/components/ui/progress";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";

export default function AchievementsSection() {
  const achievements = [
    {
      title: "Word Master",
      description: "Added over 100 entries to the dictionary",
      icon: BookMarked,
      progress: 65,
      target: 100,
      current: 65,
      color: "text-blue-500",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: "Quality Champion",
      description: "Maintained 95% accuracy in contributions",
      icon: Star,
      progress: 92,
      target: 95,
      current: 92,
      color: "text-yellow-500",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
    },
    {
      title: "Community Guide",
      description: "Helped 50 users with queries",
      icon: MessageSquare,
      progress: 80,
      target: 50,
      current: 40,
      color: "text-green-500",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      title: "Cultural Expert",
      description: "Added context to 200 entries",
      icon: Medal,
      progress: 45,
      target: 200,
      current: 90,
      color: "text-purple-500",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
  ];

  const badges = [
    {
      icon: Trophy,
      name: "Top Contributor",
      date: "2024",
      color: "text-amber-500",
      bgColor: "bg-amber-100 dark:bg-amber-900/20",
    },
    {
      icon: ThumbsUp,
      name: "Quality Excellence",
      date: "March",
      color: "text-blue-500",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      icon: Target,
      name: "Goal Achiever",
      date: "Q1",
      color: "text-green-500",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      icon: Lightbulb,
      name: "Innovator",
      date: "2024",
      color: "text-yellow-500",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
    },
    {
      icon: TrendingUp,
      name: "Rising Star",
      date: "Feb",
      color: "text-purple-500",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
    {
      icon: Heart,
      name: "Community Love",
      date: "Jan",
      color: "text-red-500",
      bgColor: "bg-red-100 dark:bg-red-900/20",
    },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
          Your Achievements
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Track your progress and celebrate milestones
        </p>
      </div>

      {/* Main Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {achievements.map((achievement, index) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl ${achievement.bgColor}`}>
                <achievement.icon className={`h-6 w-6 ${achievement.color}`} />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                      {achievement.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {achievement.description}
                    </p>
                  </div>
                  <Badge variant="secondary" className="ml-2">
                    {achievement.current}/{achievement.target}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <Progress value={achievement.progress} className="h-2" />
                  <p className="text-xs text-right text-gray-500 dark:text-gray-400">
                    {achievement.progress}% Complete
                  </p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Badges Section */}
      <div className="mt-12">
        <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
          Earned Badges
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="group relative flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div
                className={`p-3 rounded-full ${badge.bgColor} mb-3 transition-transform duration-300 group-hover:scale-110`}
              >
                <badge.icon className={`h-6 w-6 ${badge.color}`} />
              </div>
              <h4 className="text-sm font-medium text-center text-gray-900 dark:text-gray-100">
                {badge.name}
              </h4>
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {badge.date}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Motivation Message */}
      <div className="text-center mt-12">
        <p className="text-gray-600 dark:text-gray-400">
          Keep contributing to unlock more achievements and badges!
        </p>
      </div>
    </div>
  );
}
