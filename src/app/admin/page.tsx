"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  Users,
  Book,
  Hash,
  Settings,
  Check,
  X,
  ChevronRight,
  Loader2,
} from "lucide-react";
import DictionaryManagement from "./dictionary_management";
import { Database } from "../lib/supabase";

interface Activity {
  type: "new_entry" | "update" | "validation";
  user: string;
  word: string;
  time: string;
}

interface Stat {
  label: string;
  value: string;
}

interface DashboardOverviewProps {
  stats: Stat[];
  recentActivity: Activity[];
  pendingEntries: number;
}

// Dashboard Overview Component with proper typing
const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  stats,
  recentActivity,
  pendingEntries,
}) => (
  <div className="p-6">
    {/* Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
        >
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {stat.label}
          </h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
            {stat.value}
          </p>
        </div>
      ))}
    </div>

    {/* Two Column Layout */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Pending Approvals */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Pending Approvals
          </h3>
          <div className="space-y-4">
            {[...Array(pendingEntries)].map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 
                dark:bg-gray-700/50 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      New Dictionary Entry
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Submitted by Kabemba A.
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    className="p-2 text-green-600 hover:bg-green-50 
                    dark:hover:bg-green-900/50 rounded-full"
                  >
                    <Check className="h-5 w-5" />
                  </button>
                  <button
                    className="p-2 text-red-600 hover:bg-red-50 
                    dark:hover:bg-red-900/50 rounded-full"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-4 bg-gray-50 
                dark:bg-gray-700/50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white">
                    <span className="font-medium">{activity.user}</span>
                    {activity.type === "new_entry" && " added a new word "}
                    {activity.type === "update" && " updated the entry for "}
                    {activity.type === "validation" && " validated "}
                    <span className="font-medium">{activity.word}</span>
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {activity.time}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Create a Numbers Management component
const NumbersManagement: React.FC = () => (
  <div className="p-6">
    <h2 className="text-2xl font-semibold mb-4">Number System Management</h2>
    <p>Numbers management interface coming soon...</p>
  </div>
);

// Create a Users Management component
const UsersManagement: React.FC = () => (
  <div className="p-6">
    <h2 className="text-2xl font-semibold mb-4">User Management</h2>
    <p>User management interface coming soon...</p>
  </div>
);

const AdminDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [pendingEntries] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    async function checkAuth() {
      try {
        // Check if user is authenticated
        const {
          data: { session },
          error: authError,
        } = await supabase.auth.getSession();

        if (authError || !session) {
          router.push(`/auth/sign-in?redirect_url=${window.location.pathname}`);
          return;
        }

        // Get user's role from profiles table
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role, email")
          .eq("id", session.user.id)
          .single();

        if (profileError || !profile) {
          console.error("Error fetching user profile:", profileError);
          router.push("/unauthorized");
          return;
        }

        // Check if user has admin privileges
        if (profile.role !== "admin" && profile.role !== "super_admin") {
          router.push("/unauthorized");
          return;
        }

        setUserEmail(profile.email);
        setIsAuthorized(true);
      } catch (error) {
        console.error("Error during authentication check:", error);
        router.push("/unauthorized");
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, [router, supabase]);

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: Settings },
    { id: "dictionary", label: "Dictionary Entries", icon: Book },
    { id: "numbers", label: "Number System", icon: Hash },
    { id: "users", label: "User Management", icon: Users },
  ];

  const stats: Stat[] = [
    { label: "Total Entries", value: "2,451" },
    { label: "Active Contributors", value: "127" },
    { label: "Pending Reviews", value: String(pendingEntries) },
    { label: "This Week's Additions", value: "43" },
  ];

  const recentActivity: Activity[] = [
    {
      type: "new_entry",
      user: "Kabemba A.",
      word: "akasiisa",
      time: "2 hours ago",
    },
    {
      type: "update",
      user: "Marie K.",
      word: "umuganho",
      time: "4 hours ago",
    },
    {
      type: "validation",
      user: "John D.",
      word: "ubuzima",
      time: "5 hours ago",
    },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "dictionary":
        return <DictionaryManagement />;
      case "numbers":
        return <NumbersManagement />;
      case "users":
        return <UsersManagement />;
      default:
        return (
          <DashboardOverview
            stats={stats}
            recentActivity={recentActivity}
            pendingEntries={pendingEntries}
          />
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-gray-600 dark:text-gray-300">
            Loading admin dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // Router will handle the redirect
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 shadow-lg">
        <div className="flex flex-col h-full">
          <div className="p-4">
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">
              Kifuliiru Admin
            </h1>
            {userEmail && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {userEmail}
              </p>
            )}
          </div>

          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {sidebarItems.map(({ id, label, icon: Icon }) => (
                <li key={id}>
                  <button
                    onClick={() => setActiveSection(id)}
                    className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors
                      ${
                        activeSection === id
                          ? "bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveSection("dictionary")}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 
                       rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 
                       focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add New Entry
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white dark:bg-gray-800 shadow">
          <div className="px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              {sidebarItems.find((item) => item.id === activeSection)?.label ||
                "Dashboard Overview"}
            </h2>
          </div>
        </header>

        {/* Render the active section content */}
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
