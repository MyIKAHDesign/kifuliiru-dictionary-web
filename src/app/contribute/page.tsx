"use client";

import { useState } from "react";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import {
  Plus,
  Clock,
  RotateCcw,
  AlertCircle,
  CheckCircle,
  BookOpen,
  Languages,
  Sparkles,
  Search,
  ChevronDown,
} from "lucide-react";
import ContributeContent from "./ContributeContent";
import { useLocalStorage } from "@/app/hooks/useLocalStorage";

const statusTabs = [
  {
    id: "new",
    label: "New Entry",
    icon: Plus,
    count: null,
    color: "text-violet-600 dark:text-violet-400",
    bgColor: "bg-violet-50 dark:bg-violet-900/20",
    borderColor: "border-violet-200 dark:border-violet-800",
    lightBorderColor: "border-violet-100 dark:border-violet-900/50",
  },
  {
    id: "pending",
    label: "Pending",
    icon: Clock,
    count: 3,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-200 dark:border-blue-800",
    lightBorderColor: "border-blue-100 dark:border-blue-900/50",
  },
  {
    id: "review",
    label: "In Review",
    icon: RotateCcw,
    count: 2,
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
    borderColor: "border-orange-200 dark:border-orange-800",
    lightBorderColor: "border-orange-100 dark:border-orange-900/50",
  },
  {
    id: "revision",
    label: "Needs Revision",
    icon: AlertCircle,
    count: 1,
    color: "text-yellow-600 dark:text-yellow-400",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    borderColor: "border-yellow-200 dark:border-yellow-800",
    lightBorderColor: "border-yellow-100 dark:border-yellow-900/50",
  },
  {
    id: "approved",
    label: "Approved",
    icon: CheckCircle,
    count: 12,
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
    borderColor: "border-emerald-200 dark:border-emerald-800",
    lightBorderColor: "border-emerald-100 dark:border-emerald-900/50",
  },
];

const stats = [
  {
    icon: BookOpen,
    label: "Total Contributions",
    value: "247",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: Languages,
    label: "Languages Covered",
    value: "4",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Sparkles,
    label: "Quality Score",
    value: "98%",
    color: "from-emerald-500 to-emerald-600",
  },
];

export default function ContributorDashboard() {
  const [activeTab, setActiveTab] = useState("new");
  const [searchTerm, setSearchTerm] = useState("");
  const [isStatsVisible, setIsStatsVisible] = useLocalStorage(
    "statsVisible",
    true
  );
  const activeTabData = statusTabs.find((tab) => tab.id === activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 mb-4">
            Contribute to the Dictionary
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Help preserve and grow the Kifuliiru language by adding new words
            and their translations
          </p>
        </div>

        {/* Stats Section */}
        <div className="mb-8">
          <button
            onClick={() => setIsStatsVisible(!isStatsVisible)}
            className="w-full flex items-center justify-between p-4 rounded-t-lg bg-white dark:bg-gray-800 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-purple-500" />
              <span className="font-medium text-gray-900 dark:text-gray-100">
                Thank you for your contributions! Here&apos;s how you&apos;re
                doing...
              </span>
            </div>
            <ChevronDown
              className={`h-5 w-5 text-gray-500 transition-transform ${
                isStatsVisible ? "rotate-180" : ""
              }`}
            />
          </button>

          {isStatsVisible && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-white dark:bg-gray-800 rounded-b-lg shadow-sm">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                >
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}
                  >
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {stat.label}
                    </p>
                    <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      {stat.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div
          className={`w-full border-2 rounded-lg ${activeTabData?.lightBorderColor} transition-colors duration-300 bg-white dark:bg-gray-800`}
        >
          {/* Tabs Container */}
          <div className="w-full overflow-x-auto">
            <div className="flex space-x-1 p-2 min-w-max">
              {statusTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      relative flex items-center px-4 py-2.5 rounded-lg gap-2 transition-all duration-200
                      border-2
                      ${
                        isActive
                          ? `${tab.bgColor} ${tab.color} ${tab.borderColor}`
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                      }
                      ${tab.id === "new" ? "border-dashed" : "border-solid"}
                    `}
                  >
                    <Icon
                      className={`h-4 w-4 ${isActive ? "animate-pulse" : ""}`}
                    />
                    <span className="font-medium">{tab.label}</span>
                    {tab.count !== null && (
                      <Badge
                        variant="secondary"
                        className={`
                        px-2 py-0.5 rounded-full text-xs font-medium
                        ${
                          isActive
                            ? `${tab.bgColor} ${tab.color}`
                            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                        }
                      `}
                      >
                        {tab.count}
                      </Badge>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div className={`h-px w-full ${activeTabData?.lightBorderColor}`} />

          {/* Content Container */}
          <div className="p-4">
            {activeTab !== "new" && (
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <Input
                    placeholder="Search entries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 h-12"
                  />
                </div>
              </div>
            )}

            <div className={activeTab === "new" ? "" : "min-h-[600px]"}>
              {activeTab === "new" ? (
                <ContributeContent />
              ) : (
                <ScrollArea className="h-[600px]">
                  <div className="space-y-4">
                    {{
                      pending: {
                        title: "Pending Entries",
                        color: "text-blue-600 dark:text-blue-400",
                        border: "border-blue-200 dark:border-blue-800/50",
                      },
                      review: {
                        title: "Entries In Review",
                        color: "text-orange-600 dark:text-orange-400",
                        border: "border-orange-200 dark:border-orange-800/50",
                      },
                      revision: {
                        title: "Entries Needing Revision",
                        color: "text-yellow-600 dark:text-yellow-400",
                        border: "border-yellow-200 dark:border-yellow-800/50",
                      },
                      approved: {
                        title: "Approved Entries",
                        color: "text-emerald-600 dark:text-emerald-400",
                        border: "border-emerald-200 dark:border-emerald-800/50",
                      },
                    }[activeTab] && (
                      <div className="space-y-4">
                        <h3
                          className={`text-lg font-semibold ${
                            statusTabs.find((tab) => tab.id === activeTab)
                              ?.color
                          }`}
                        >
                          {
                            statusTabs.find((tab) => tab.id === activeTab)
                              ?.label
                          }
                        </h3>
                        <div
                          className={`h-[500px] flex items-center justify-center border-2 border-dashed rounded-lg ${
                            activeTab === "pending"
                              ? "border-blue-200 dark:border-blue-800/50"
                              : activeTab === "review"
                              ? "border-orange-200 dark:border-orange-800/50"
                              : activeTab === "revision"
                              ? "border-yellow-200 dark:border-yellow-800/50"
                              : "border-emerald-200 dark:border-emerald-800/50"
                          }`}
                        >
                          <p className="text-gray-500 dark:text-gray-400">
                            {
                              statusTabs.find((tab) => tab.id === activeTab)
                                ?.label
                            }{" "}
                            will appear here
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
