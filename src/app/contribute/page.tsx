"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
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
  Loader2,
} from "lucide-react";
import ContributeContent from "./ContributeContent";
import { useLocalStorage } from "@/app/hooks/useLocalStorage";
import { DictionaryEntry } from "@/app/lib/supabase";
import EntryCard from "../components/EntryCard";

interface EntryStats {
  totalContributions: number;
  languagesCovered: number;
  qualityScore: number;
}

const statusTabs = [
  {
    id: "new",
    label: "New Entry",
    icon: Plus,
    color: "text-violet-600 dark:text-violet-400",
    bgColor: "bg-violet-50 dark:bg-violet-900/20",
    borderColor: "border-violet-200 dark:border-violet-800",
    lightBorderColor: "border-violet-100 dark:border-violet-900/50",
  },
  {
    id: "pending",
    label: "Pending",
    icon: Clock,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-200 dark:border-blue-800",
    lightBorderColor: "border-blue-100 dark:border-blue-900/50",
  },
  {
    id: "review",
    label: "In Review",
    icon: RotateCcw,
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
    borderColor: "border-orange-200 dark:border-orange-800",
    lightBorderColor: "border-orange-100 dark:border-orange-900/50",
  },
  {
    id: "revision",
    label: "Needs Revision",
    icon: AlertCircle,
    color: "text-yellow-600 dark:text-yellow-400",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    borderColor: "border-yellow-200 dark:border-yellow-800",
    lightBorderColor: "border-yellow-100 dark:border-yellow-900/50",
  },
  {
    id: "approved",
    label: "Approved",
    icon: CheckCircle,
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
    borderColor: "border-emerald-200 dark:border-emerald-800",
    lightBorderColor: "border-emerald-100 dark:border-emerald-900/50",
  },
];

export default function ContributorDashboard() {
  const [activeTab, setActiveTab] = useState("new");
  const [searchTerm, setSearchTerm] = useState("");
  const [isStatsVisible, setIsStatsVisible] = useLocalStorage(
    "statsVisible",
    true
  );
  const [entries, setEntries] = useState<DictionaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<EntryStats>({
    totalContributions: 0,
    languagesCovered: 0,
    qualityScore: 0,
  });
  const [entryCounts, setEntryCounts] = useState<Record<string, number>>({});

  const supabase = createClientComponentClient();

  const activeTabData = statusTabs.find((tab) => tab.id === activeTab);

  useEffect(() => {
    async function fetchUserStats() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session?.user?.id) return;

        const { data, error } = await supabase
          .from("magambo")
          .select("*")
          .eq("owner_id", session.user.id);

        if (error) throw error;

        // Calculate stats
        const stats = calculateStats(data || []);
        setStats(stats);

        // Calculate counts for each status
        const counts = statusTabs.reduce(
          (acc, tab) => ({
            ...acc,
            [tab.id]:
              data?.filter((entry) => entry.status === tab.id).length || 0,
          }),
          {}
        );
        setEntryCounts(counts);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    }

    fetchUserStats();
  }, [supabase]);

  useEffect(() => {
    // Changes for the fetchEntries function:
    async function fetchEntries() {
      if (activeTab === "new") return;

      setLoading(true);
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session?.user?.id) return;

        let query = supabase
          .from("magambo")
          .select("*")
          .eq("owner_id", session.user.id)
          .order("created_at", { ascending: false });

        if (searchTerm) {
          query = query.or(
            `igambo.ilike.%${searchTerm}%,kifuliiru.ilike.%${searchTerm}%,kiswahili.ilike.%${searchTerm}%,kifaransa.ilike.%${searchTerm}%,kingereza.ilike.%${searchTerm}%`
          );
        }

        const { data, error } = await query;
        if (error) throw error;

        // Filter entries based on their state
        const filteredData =
          data?.filter((entry) => {
            switch (activeTab) {
              case "pending":
                return !entry.publish_date && !entry.unpublish_date;
              case "review":
                return entry.publish_date && !entry.unpublish_date;
              case "revision":
                return entry.unpublish_date;
              case "approved":
                return (
                  entry.publish_date &&
                  !entry.unpublish_date &&
                  entry.nayemera_consent
                );
              default:
                return false;
            }
          }) || [];

        setEntries(filteredData);
      } catch (error) {
        console.error("Error fetching entries:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchEntries();
  }, [activeTab, searchTerm, supabase]);

  function calculateStats(data: DictionaryEntry[]): EntryStats {
    const totalContributions = data.length;

    const languagesCount = data.reduce((count, entry) => {
      if (entry.kiswahili) count++;
      if (entry.kifaransa) count++;
      if (entry.kingereza) count++;
      return count;
    }, 0);

    const qualityScore =
      (data.filter(
        (entry) => entry.status === "approved" || entry.status === "review"
      ).length /
        Math.max(totalContributions, 1)) *
      100;

    return {
      totalContributions,
      languagesCovered: Math.min(4, languagesCount > 0 ? languagesCount : 1),
      qualityScore: Math.round(qualityScore),
    };
  }

  const getStatsData = () => [
    {
      icon: BookOpen,
      label: "Total Contributions",
      value: stats.totalContributions.toString(),
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Languages,
      label: "Languages Covered",
      value: stats.languagesCovered.toString(),
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Sparkles,
      label: "Quality Score",
      value: `${stats.qualityScore}%`,
      color: "from-emerald-500 to-emerald-600",
    },
  ];

  function renderContent() {
    if (activeTab === "new") {
      return <ContributeContent />;
    }

    if (loading) {
      return (
        <div className="flex items-center justify-center h-[500px]">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      );
    }

    if (entries.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-[500px] text-gray-500 dark:text-gray-400">
          <div className="mb-4">
            {activeTabData?.icon && (
              <activeTabData.icon className="h-12 w-12 opacity-20" />
            )}
          </div>
          <p className="text-lg">
            No {activeTabData?.label.toLowerCase()} entries found
          </p>
          <p className="text-sm mt-2">
            {searchTerm
              ? "Try adjusting your search"
              : "Start contributing to see your entries here"}
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-6">
        {entries.map((entry) => (
          <EntryCard key={entry.id} entry={entry} />
        ))}
      </div>
    );
  }

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
                Your Contribution Statistics
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
              {getStatsData().map((stat) => (
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
                const count = entryCounts[tab.id];

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
                    {count !== undefined && count > 0 && (
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
                        {count}
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
                    className="pl-9 h-12 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
            )}

            <ScrollArea className="h-[600px]">{renderContent()}</ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}
