"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Volume2, Globe2, ChevronDown } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { DictionaryEntry, searchDictionaryWords } from "@/app/lib/supabase";

const FILTERS = ["all", "noun", "verb", "phrase", "adjective"] as const;
type FilterType = (typeof FILTERS)[number];
const WORDS_PER_PAGE = 50;

type LanguageOption = "kifuliiru" | "english" | "french" | "swahili";

const languageLabels: Record<LanguageOption, string> = {
  kifuliiru: "Kifuliiru",
  english: "English",
  french: "Français",
  swahili: "Kiswahili",
};

interface DictionaryContentProps {
  initialWords: DictionaryEntry[];
}

export default function DictionaryContent({
  initialWords,
}: DictionaryContentProps) {
  const searchParams = useSearchParams();
  const [words, setWords] = useState<DictionaryEntry[]>(initialWords);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [displayLanguage, setDisplayLanguage] =
    useState<LanguageOption>("kifuliiru");
  const [filter, setFilter] = useState<FilterType>("all");
  const [visibleWords, setVisibleWords] = useState(WORDS_PER_PAGE);

  // Handle URL query parameter
  useEffect(() => {
    const query = searchParams.get("q");
    if (query) {
      setSearchTerm(query);
      handleSearch(query);
    }
  }, [searchParams]);

  // Search function
  const handleSearch = async (term: string) => {
    if (!term.trim()) {
      setWords(initialWords);
      setVisibleWords(WORDS_PER_PAGE);
      return;
    }

    setIsLoading(true);
    try {
      const results = await searchDictionaryWords(term);
      setWords(results);
      setVisibleWords(WORDS_PER_PAGE);
    } catch (error) {
      console.error("Error searching:", error);
      setWords([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleLoadMore = () => {
    setVisibleWords((prev) => prev + WORDS_PER_PAGE);
  };

  const getPlaceholderText = (lang: LanguageOption) => {
    const placeholders: Record<LanguageOption, string> = {
      kifuliiru: "Looza amagambo mu Kifuliiru...",
      swahili: "Tafuta maneno kwa Kifuliiru...",
      french: "Rechercher des mots en Kifuliiru...",
      english: "Search for words in Kifuliiru...",
    };
    return placeholders[lang];
  };

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 mb-4">
            Kifuliiru Dictionary
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Explore and learn Kifuliiru words and their meanings
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder={getPlaceholderText(displayLanguage)}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 
                         dark:border-gray-700 dark:bg-gray-800/50 
                         text-gray-900 dark:text-gray-100
                         placeholder:text-gray-500 dark:placeholder:text-gray-400
                         focus:ring-2 focus:ring-orange-500/50 dark:focus:ring-orange-400/50 
                         focus:border-transparent backdrop-blur-sm
                         shadow-sm hover:shadow-md transition-all duration-300"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center gap-2 px-4 py-3 border rounded-lg 
                         bg-white/80 dark:bg-gray-800/50 
                         border-gray-200 dark:border-gray-700/50
                         text-gray-700 dark:text-gray-300
                         hover:bg-gray-50 dark:hover:bg-gray-700/50
                         transition-colors backdrop-blur-sm"
                >
                  <Globe2 className="h-5 w-5" />
                  <span>{languageLabels[displayLanguage]}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="backdrop-blur-md">
                {Object.entries(languageLabels).map(([key, label]) => (
                  <DropdownMenuItem
                    key={key}
                    onClick={() => setDisplayLanguage(key as LanguageOption)}
                    className="hover:bg-orange-50 dark:hover:bg-orange-950/50"
                  >
                    {label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            {FILTERS.map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                        ${
                          filter === type
                            ? "bg-orange-600 dark:bg-orange-500 text-white shadow-md"
                            : "bg-gray-100 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/50"
                        }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-orange-500 dark:border-orange-400 border-t-transparent" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {words.slice(0, visibleWords).map((word) => (
              <Card
                key={word.id}
                className="group bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm
                         border border-gray-200/50 dark:border-gray-700/50
                         hover:shadow-xl dark:hover:shadow-orange-500/5
                         transition-all duration-300
                         hover:-translate-y-1"
              >
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span className="text-gray-900 dark:text-gray-100">
                      {word.igambo}
                    </span>
                    <button
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-full
                               opacity-0 group-hover:opacity-100 transition-all duration-300"
                      aria-label="Listen to pronunciation"
                    >
                      <Volume2 className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-medium text-gray-800 dark:text-gray-200">
                      {word.kifuliiru}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {displayLanguage === "english"
                        ? word.kingereza
                        : displayLanguage === "french"
                        ? word.kifaransa
                        : displayLanguage === "swahili"
                        ? word.kiswahili
                        : word.kifuliiru}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {words.length > visibleWords && (
          <div className="flex justify-center mt-8">
            <button
              onClick={handleLoadMore}
              className="px-8 py-3 bg-orange-600 hover:bg-orange-700 
                     dark:bg-orange-500 dark:hover:bg-orange-600
                     text-white rounded-lg shadow-md hover:shadow-xl
                     transition-all duration-300 transform hover:-translate-y-1"
            >
              Load More Words
              <span className="ml-2 text-sm opacity-75">
                ({visibleWords} of {words.length})
              </span>
            </button>
          </div>
        )}

        {!isLoading && words.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No words found. Try adjusting your search criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
