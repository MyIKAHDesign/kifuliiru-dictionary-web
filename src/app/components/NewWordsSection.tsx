"use client";

import { useEffect, useState } from "react";
import { Calendar, User, ChevronRight } from "lucide-react";
import { supabase } from "@/app/lib/supabase";
import type { DictionaryEntry } from "@/app/lib/supabase";

export default function LatestWordsSection() {
  const [words, setWords] = useState<DictionaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredWord, setHoveredWord] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLatestWords() {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("magambo")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(6);

        if (error) throw error;
        setWords(data || []);
      } catch (error) {
        console.error("Error fetching words:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLatestWords();
  }, []);

  if (isLoading) {
    return (
      <section className="w-full bg-orange-50/40 dark:bg-orange-900/10">
        <div className="w-4/5 mx-auto py-12 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent" />
        </div>
      </section>
    );
  }

  if (!words.length) {
    return (
      <section className="w-full bg-orange-50/40 dark:bg-orange-900/10">
        <div className="w-4/5 mx-auto py-12 text-center text-gray-500">
          No words available
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-orange-50/40 dark:bg-orange-900/10 py-12">
      <div className="w-4/5 mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            Latest Words
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {words.length} entries
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {words.map((word) => (
            <div
              key={word.id}
              className="group relative"
              onMouseEnter={() => setHoveredWord(word.igambo)}
              onMouseLeave={() => setHoveredWord(null)}
            >
              <div
                className={`
                  absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 
                  rounded-xl transition-opacity duration-300
                  ${hoveredWord === word.igambo ? "opacity-100" : "opacity-0"}
                `}
              />

              <div
                className="relative p-6 bg-white dark:bg-gray-800 rounded-xl
                            border border-gray-100 dark:border-gray-700
                            transform transition-all duration-300
                            hover:shadow-xl hover:-translate-y-1
                            h-full"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      {word.igambo}
                    </h3>
                    <ChevronRight
                      className={`h-5 w-5 text-indigo-500 transform transition-transform duration-300
                                ${
                                  hoveredWord === word.igambo
                                    ? "translate-x-1 opacity-100"
                                    : "opacity-0"
                                }`}
                    />
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed flex-grow">
                    {word.kifuliiru}
                  </p>

                  <div className="flex flex-col gap-2 pt-4 text-sm border-t border-gray-100 dark:border-gray-700 mt-4">
                    <div className="flex items-center text-gray-500 dark:text-gray-400">
                      <User className="h-4 w-4 mr-2" />
                      <span className="truncate">
                        Ayivugwe Kabemba and Team
                      </span>
                    </div>
                    <div className="flex items-center text-gray-500 dark:text-gray-400">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>
                        {new Date(word.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
