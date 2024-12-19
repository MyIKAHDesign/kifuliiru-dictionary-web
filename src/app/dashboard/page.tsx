"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  BookOpen,
  Hash,
  Star,
  Clock,
  Calendar,
  ChevronRight,
  MessageSquare,
  Edit,
  Loader2,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Contribution {
  id: string;
  igambo: string;
  created_at: string;
  status: string;
}

interface ContributionDataPoint {
  date: string;
  contributions: number;
}

interface UserStats {
  wordsAdded: number;
  qualityScore: number;
  reviews: number;
  hoursContributed: number;
}

const defaultStats: UserStats = {
  wordsAdded: 0,
  qualityScore: 0,
  reviews: 0,
  hoursContributed: 0,
};

export default function UserDashboard() {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<UserStats>(defaultStats);
  const [contributionData, setContributionData] = useState<
    ContributionDataPoint[]
  >([]);
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch user's contributions
      const { data: contributions, error: contributionsError } = await supabase
        .from("magambo")
        .select("*")
        .order("created_at", { ascending: false });

      if (contributionsError) {
        throw new Error(contributionsError.message);
      }

      // Calculate stats from contributions
      const calculatedStats: UserStats = {
        wordsAdded: contributions?.length || 0,
        qualityScore: calculateQualityScore(contributions || []),
        reviews: calculateReviews(contributions || []),
        hoursContributed: calculateHours(contributions || []),
      };

      // Generate contribution graph data
      const graphData = generateContributionData(contributions || []);

      // Set states
      setContributions(contributions?.slice(0, 5) || []); // Only last 5 for recent activity
      setContributionData(graphData);
      setStats(calculatedStats);
    } catch (err) {
      console.error("Error fetching dashboard data:", {
        message: err instanceof Error ? err.message : "Unknown error occurred",
        error: err,
      });
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load dashboard data. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Helper functions to calculate stats
  const calculateQualityScore = (contributions: Contribution[]): number => {
    // For now, return a placeholder score
    // You can implement your own quality scoring logic
    return contributions.length > 0 ? 98 : 0;
  };

  const calculateReviews = (contributions: Contribution[]): number => {
    return contributions.filter((c) => c.status === "reviewed").length;
  };

  const calculateHours = (contributions: Contribution[]): number => {
    // Estimate hours based on contributions
    // You can implement your own logic here
    return Math.round(contributions.length * 0.5); // Assuming 30 mins per contribution
  };

  const generateContributionData = (
    contributions: Contribution[]
  ): ContributionDataPoint[] => {
    const last7Days = [...Array(7)]
      .map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split("T")[0];
      })
      .reverse();

    return last7Days.map((date) => ({
      date,
      contributions: contributions.filter((c) => c.created_at.startsWith(date))
        .length,
    }));
  };

  const mainStats = [
    {
      icon: BookOpen,
      label: "Words Added",
      value: stats.wordsAdded,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      icon: Star,
      label: "Quality Score",
      value: `${stats.qualityScore}%`,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    },
    {
      icon: MessageSquare,
      label: "Reviews",
      value: stats.reviews,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      icon: Clock,
      label: "Hours Contributed",
      value: stats.hoursContributed,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-gray-600 dark:text-gray-400">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center max-w-md px-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your contributions and impact on the Kifuliiru dictionary
            project.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {mainStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </p>
                  <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
                    {stat.value}
                  </h3>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor} ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Activity Feed */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center text-gray-900 dark:text-white">
                <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                Recent Activity
              </h2>

              <div className="space-y-4">
                <AnimatePresence>
                  {contributions.map((contribution, index) => (
                    <motion.div
                      key={contribution.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/50 rounded-lg">
                          <Edit className="w-4 h-4 text-blue-500" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {contribution.igambo}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(contribution.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Contribution Graph */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          >
            <h2 className="text-xl font-semibold mb-6 flex items-center text-gray-900 dark:text-white">
              <Hash className="w-5 h-5 mr-2 text-blue-500" />
              Contribution Activity
            </h2>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={contributionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    stroke="#6B7280"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis stroke="#6B7280" tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="contributions"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={{ fill: "#3B82F6", strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
