"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  Search,
  Volume2,
  Globe2,
  ChevronDown,
  Clock,
  PlayCircle,
  User,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/app/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { DictionaryEntry } from "@/app/lib/supabase";
import { Skeleton } from "../components/ui/skeleton";
import Highlighter from "react-highlight-words";

const FILTERS = ["all", "noun", "verb", "phrase", "adjective"] as const;
type FilterType = (typeof FILTERS)[number];
const WORDS_PER_PAGE = 30;

type LanguageOption = "kifuliiru" | "english" | "french" | "swahili";

const languageLabels: Record<LanguageOption, string> = {
  kifuliiru: "Kifuliiru",
  english: "English",
  french: "Français",
  swahili: "Kiswahili",
};

// Add these types and states at the top of your component
type AudioType = "igambo" | "definition";

interface PlayingAudioState {
  wordId: string;
  type: AudioType;
}

interface DictionaryContentProps {
  initialWords: DictionaryEntry[];
}

export default function DictionaryContent({
  initialWords,
}: DictionaryContentProps) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [words, setWords] = useState<DictionaryEntry[]>(initialWords);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [displayLanguage, setDisplayLanguage] =
    useState<LanguageOption>("kifuliiru");
  const [filter, setFilter] = useState<FilterType>("all");
  const [visibleWords, setVisibleWords] = useState(WORDS_PER_PAGE);
  const [playingAudio, setPlayingAudio] = useState<PlayingAudioState | null>(
    null
  );

  // Handle initial query from URL on mount
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const query = queryParams.get("q");
    if (query) {
      setSearchTerm(query);
      handleSearch(query);
    }
  }, []);

  // Search function
  const handleSearch = async (term: string) => {
    if (!term.trim()) {
      setWords(initialWords);
      setVisibleWords(WORDS_PER_PAGE);
      router.replace("/dictionary");
      return;
    }

    setIsLoading(true);

    try {
      console.log("Initiating search for term:", term);

      // Single-line query string for Supabase
      const { data, error } = await supabase
        .from("magambo")
        .select("*")
        .or(
          `igambo.ilike.%${term}%,kifuliiru.ilike.%${term}%,kingereza.ilike.%${term}%,kifaransa.ilike.%${term}%,kiswahili.ilike.%${term}%`
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase query error:", JSON.stringify(error));
        throw new Error(`Failed to fetch results: ${error.message}`);
      }

      if (!data || data.length === 0) {
        console.warn("No results found for:", term);
        setWords([]);
        return;
      }

      console.log(`Search results: ${data.length} entries found`);

      const sanitizedData = data.map((entry) => ({
        ...entry,
        igambo: entry.igambo || "",
        kifuliiru: entry.kifuliiru || "",
        kingereza: entry.kingereza || "",
        kifaransa: entry.kifaransa || "",
        kiswahili: entry.kiswahili || "",
      }));

      setWords(sanitizedData);
      setVisibleWords(WORDS_PER_PAGE);

      const newUrl = `/dictionary?q=${encodeURIComponent(term.trim())}`;
      router.replace(newUrl);
    } catch (error) {
      console.error("Error during search:", error);
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

  // Updated audio handling function
  const handlePlayAudio = async (
    wordId: string,
    audioType: AudioType,
    audioUrl: string | null | undefined
  ) => {
    if (!audioUrl) {
      console.error(`Invalid audio URL provided for ${audioType}:`, audioUrl);
      return;
    }

    const { data } = supabase.storage.from("audio").getPublicUrl(audioUrl);

    if (!data || !data.publicUrl) {
      console.error("Failed to get public URL from Supabase:", audioUrl);
      return;
    }

    const publicUrl = data.publicUrl;

    console.log(`Playing audio from URL: ${publicUrl}`);

    try {
      setPlayingAudio({ wordId, type: audioType });
      const audio = new Audio(publicUrl);

      audio.onended = () => setPlayingAudio(null);
      audio.onerror = (e) => {
        console.error("Audio loading error:", {
          errorEvent: e,
          wordId,
          audioType,
          publicUrl,
        });
        setPlayingAudio(null);
      };

      await audio.play();
    } catch (err) {
      console.error("Error playing audio:", {
        message: err instanceof Error ? err.message : "Unknown error",
        stack: err instanceof Error ? err.stack : null,
      });
      setPlayingAudio(null);
    }
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <CardHeader className="space-y-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-600 mb-4">
          Kifuliiru Dictionary
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Explore and learn Kifuliiru words and their meanings
        </p>
      </div>

      <div className="max-w-3xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={getPlaceholderText(displayLanguage)}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 
                       dark:border-gray-700 dark:bg-gray-800 focus:ring-2 
                       focus:ring-orange-500 focus:border-transparent
                       text-gray-900 dark:text-gray-100"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex items-center gap-2 px-4 py-3 border rounded-lg 
                 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700
                 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Globe2 className="h-5 w-5" />
                <span>{languageLabels[displayLanguage]}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
               shadow-lg rounded-lg p-2"
            >
              {Object.entries(languageLabels).map(([key, label]) => (
                <DropdownMenuItem
                  key={key}
                  onClick={() => setDisplayLanguage(key as LanguageOption)}
                  className={`cursor-pointer px-4 py-2 rounded-md transition-colors ${
                    displayLanguage === key
                      ? "text-orange-600 font-bold"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-300"
                  }`}
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
                            ? "bg-orange-600 text-white"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                        }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {words.slice(0, visibleWords).map((word) => (
              // Update the card rendering to include both audio buttons when appropriate
              <Card
                key={word.id}
                className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1
           bg-white dark:bg-gray-800 overflow-hidden"
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                        {word.igambo}
                      </CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          handlePlayAudio(
                            word.id,
                            "igambo",
                            word.igambo_audio_url
                          )
                        }
                        className={`p-2 rounded-full transition-all duration-300
                    ${
                      playingAudio?.wordId === word.id &&
                      playingAudio?.type === "igambo"
                        ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                    }`}
                        title="Play word pronunciation"
                        disabled={!word.igambo_audio_url}
                      >
                        {playingAudio?.wordId === word.id &&
                        playingAudio?.type === "igambo" ? (
                          <PlayCircle className="h-5 w-5 animate-pulse" />
                        ) : (
                          <Volume2 className="h-5 w-5" />
                        )}
                      </button>

                      {/* Show definition audio button only when Kifuliiru is selected */}
                      {displayLanguage === "kifuliiru" &&
                        word.kifuliiru_definition_audio_url && (
                          <button
                            onClick={() =>
                              handlePlayAudio(
                                word.id,
                                "definition",
                                word.kifuliiru_definition_audio_url
                              )
                            }
                            className={`p-2 rounded-full transition-all duration-300
                      ${
                        playingAudio?.wordId === word.id &&
                        playingAudio?.type === "definition"
                          ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                      }`}
                            title="Play definition audio"
                          >
                            {playingAudio?.wordId === word.id &&
                            playingAudio?.type === "definition" ? (
                              <PlayCircle className="h-5 w-5 animate-pulse" />
                            ) : (
                              <Volume2 className="h-5 w-5" />
                            )}
                          </button>
                        )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  {/* Highlighting the main word
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    <Highlighter
                      highlightClassName="bg-yellow-200 dark:bg-yellow-400"
                      searchWords={[searchTerm || ""]}
                      autoEscape={true}
                      textToHighlight={word.igambo || ""} // Provide a fallback empty string
                    />
                  </p> */}

                  {/* Highlighting the translation */}
                  <p className="text-gray-700 dark:text-gray-300 text-lg">
                    <Highlighter
                      highlightClassName="bg-yellow-200 dark:bg-yellow-400"
                      searchWords={[searchTerm || ""]}
                      autoEscape={true}
                      textToHighlight={
                        word[
                          displayLanguage === "english"
                            ? "kingereza"
                            : displayLanguage === "french"
                            ? "kifaransa"
                            : displayLanguage === "swahili"
                            ? "kiswahili"
                            : "kifuliiru"
                        ] || "" // Provide a fallback empty string
                      }
                    />
                  </p>
                </CardContent>

                <CardFooter className="border-t border-gray-100 dark:border-gray-700 pt-4">
                  <div className="flex items-center justify-between w-full text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>
                        {new Date(
                          word.created_at ?? Date.now()
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{"Ayivugwe Kabemba and Team"}</span>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>

          {words.length > visibleWords && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleLoadMore}
                className="px-8 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white 
                         rounded-lg hover:from-orange-700 hover:to-amber-700
                         transition-all duration-300 transform hover:scale-105
                         focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              >
                Load More Words
                <span className="text-sm opacity-75 ml-2">
                  ({visibleWords} of {words.length})
                </span>
              </button>
            </div>
          )}
        </>
      )}

      {!isLoading && words.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-block p-6 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <Search className="h-12 w-12 text-orange-600 dark:text-orange-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No words found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm
                ? "Try adjusting your search term or filters"
                : "Start searching to discover Kifuliiru words"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
