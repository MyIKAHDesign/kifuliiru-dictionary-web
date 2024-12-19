import React from "react";
import ContributionGraphs from "./ContributionGraphs";
import RecentActivity from "./RecentActivity";
import AchievementsSection from "./AchievementsSection";

export default function ContributorDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Contributor Dashboard
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Stats Overview */}
          <div className="lg:col-span-2">
            <ContributionGraphs />
          </div>
          <div className="lg:col-span-1">
            <RecentActivity />
          </div>
        </div>

        {/* Achievements Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <AchievementsSection />
        </div>
      </div>
    </div>
  );
}
