import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { SupabaseClient } from "@supabase/supabase-js";
import { Users, Book, Languages, Globe } from "lucide-react";
import StatsCard from "./StatsCard";
import { DatabaseStats, StatData } from "../lib/types/stats.ts";
import GrowthImageCard from "./GrowthImageCardProps";

export default function StatsSection() {
  const [stats, setStats] = useState<DatabaseStats>({
    entries: 0,
    languages: 4, // Fixed number of supported languages
    translations: 0,
    contributors: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClientComponentClient() as SupabaseClient;

  useEffect(() => {
    async function fetchStats() {
      try {
        // Get total dictionary entries
        const { count: entriesCount, error: entriesError } = await supabase
          .from("magambo")
          .select("*", { count: "exact", head: true });

        if (entriesError) throw entriesError;

        // Get total contributors
        const { count: contributorsCount, error: contributorsError } =
          await supabase
            .from("profiles")
            .select("*", { count: "exact", head: true })
            .eq("role", "contributor");

        if (contributorsError) throw contributorsError;

        // Calculate total translations
        const { data: entries, error: translationsError } = await supabase
          .from("magambo")
          .select("kiswahili, kifaransa, kingereza")
          .not("kiswahili", "is", null)
          .not("kifaransa", "is", null)
          .not("kingereza", "is", null);

        if (translationsError) throw translationsError;

        const translationsCount = (entries?.length || 0) * 3; // Times 3 for the additional languages

        setStats({
          entries: entriesCount || 0,
          languages: 4,
          translations: translationsCount,
          contributors: contributorsCount || 0,
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch stats";
        console.error("Error fetching stats:", err);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, [supabase]);

  const statsCards: StatData[] = [
    {
      title: "Dictionary Entries",
      count: stats.entries,
      description: "Words and phrases documented",
      color: "indigo",
      icon: Book,
    },
    {
      title: "Languages",
      count: stats.languages,
      description: "Translations available",
      color: "purple",
      icon: Languages,
    },
    {
      title: "Total Translations",
      count: stats.translations,
      description: "Across all languages",
      color: "blue",
      icon: Globe,
    },
    {
      title: "Contributors",
      count: stats.contributors,
      description: "Active community members",
      buttonLabel: "Become a Contributor",
      buttonLink: "/contribute",
      color: "teal",
      icon: Users,
    },
  ];

  if (error) {
    return (
      <div className="text-center py-12 text-red-600 dark:text-red-400">
        <p>Failed to load statistics. Please try again later.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
      </div>
    );
  }

  return (
    <section className="py-12 px-4 bg-gray-50 dark:bg-gray-900">
      <div id="stats" className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Growing Language Resource
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Join our community in preserving and sharing the richness of the
            Kifuliiru language.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Growth Image */}
          {/* Growth Image */}
          <GrowthImageCard delay={100} />

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {statsCards.map((stat, index) => (
              <StatsCard key={stat.title} {...stat} delay={index * 100} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
