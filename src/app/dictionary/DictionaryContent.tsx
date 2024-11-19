"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Footer from "@/app/components/Footer";
import { FaSearch } from "react-icons/fa";
import WordCard from "@/app/components/WordCard";
import { DictionaryModal } from "@/app/components/DictionaryModal";
import { Language } from "@/app/data/types/dictionary";
import { LanguageSelector } from "@/app/components/LanguageSelector";
import {
  DictionaryEntry,
  fetchDictionaryWords,
  searchDictionaryWords,
} from "@/app/lib/supabase";

const FILTERS = ["all", "noun", "verb", "phrase", "adjective"] as const;
type FilterType = (typeof FILTERS)[number];

const WORDS_PER_PAGE = 21;

type AudioPlayingState = {
  wordId: string;
  type: "term" | "definition";
} | null;

export default function DictionaryContent() {
  const searchParams = useSearchParams();
  const [words, setWords] = useState<DictionaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleWords, setVisibleWords] = useState(WORDS_PER_PAGE);
  const [selectedWord, setSelectedWord] = useState<DictionaryEntry | null>(
    null
  );
  const [playingAudio, setPlayingAudio] = useState<AudioPlayingState>(null);
  const [filter, setFilter] = useState<FilterType>("all");
  const [language, setLanguage] = useState<Language>("english");

  // Handle URL query parameter
  // Combine search params and initial load effects
  useEffect(() => {
    const query = searchParams.get("q");
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        if (query) {
          const results = await searchDictionaryWords(query);
          setSearchTerm(query);
          setWords(results);
        } else {
          const data = await fetchDictionaryWords();
          setWords(data);
        }
      } catch (error) {
        console.error("Error loading dictionary words:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, [searchParams]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const data = await fetchDictionaryWords();
        setWords(data);
      } catch (error) {
        console.error("Error loading dictionary words:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    const performSearch = async () => {
      if (!searchTerm.trim()) {
        const allWords = await fetchDictionaryWords();
        setWords(allWords);
        return;
      }

      setIsLoading(true);
      try {
        const results = await searchDictionaryWords(searchTerm);
        setWords(results);
      } catch (error) {
        console.error("Error searching words:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimeout = setTimeout(performSearch, 300);
    return () => clearTimeout(debounceTimeout);
  }, [searchTerm]);

  const filteredWords = words;

  const handlePlayAudio = async (
    url: string,
    wordId: string,
    type: "term" | "definition"
  ) => {
    if (playingAudio?.wordId === wordId && playingAudio?.type === type) {
      setPlayingAudio(null);
      return;
    }

    alert("Audio playback coming soon!");
    setPlayingAudio({ wordId, type });

    setTimeout(() => {
      setPlayingAudio(null);
    }, 1000);
  };

  const handleLoadMore = () => {
    setVisibleWords((prev) => prev + WORDS_PER_PAGE);
  };

  const getPlaceholderText = (lang: Language) => {
    const placeholders: Record<Language, string> = {
      kifuliiru: "Londa amagambo mu Kifuliiru...",
      swahili: "Tafuta maneno kwa Kifuliiru...",
      french: "Rechercher des mots en Kifuliiru...",
      english: "Search for words in Kifuliiru...",
    };
    return placeholders[lang];
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <main className="flex-1 container mx-auto px-4 py-12 max-w-7xl flex flex-col min-h-[calc(100vh-4rem)]">
        <section className="mb-8 flex flex-col items-center">
          <div className="text-center max-w-2xl mb-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Kifuliiru Dictionary
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300">
              {language === "kifuliiru"
                ? "Menya amagambo geꞌKifuliiru mu njira nyororo"
                : language === "swahili"
                ? "Gundua utajiri wa lugha ya Kifuliiru"
                : language === "french"
                ? "Découvrez la richesse de la langue Kifuliiru"
                : "Discover the richness of Kifuliiru language"}
            </p>
          </div>
          <div className="w-full max-w-xs">
            <LanguageSelector
              value={language}
              onChange={(newLang) => setLanguage(newLang)}
            />
          </div>
        </section>

        <section className="max-w-3xl mx-auto mb-8 w-full">
          <div className="relative group">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={getPlaceholderText(language)}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 
                       bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 
                       focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                       text-lg transition-all duration-300 shadow-sm hover:shadow-md"
            />
          </div>

          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            {FILTERS.map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                          ${
                            filter === type
                              ? "bg-indigo-600 text-white"
                              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                          }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </section>

        <section className="flex-1 min-h-[500px]">
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
            </div>
          ) : filteredWords.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {filteredWords.slice(0, visibleWords).map((word, index) => (
                  <WordCard
                    key={word.id}
                    word={{
                      term: word.igambo,
                      definition: {
                        kifuliiru: word.kifuliiru,
                        english: word.kingereza,
                        french: word.kifaransa,
                        swahili: word.kiswahili,
                      },
                      date: word.created_at,
                    }}
                    language={language}
                    index={index}
                    isPlayingTerm={
                      playingAudio?.wordId === word.id &&
                      playingAudio?.type === "term"
                    }
                    isPlayingDefinition={
                      playingAudio?.wordId === word.id &&
                      playingAudio?.type === "definition"
                    }
                    onPlayTermAudio={() => handlePlayAudio("", word.id, "term")}
                    onPlayDefinitionAudio={() =>
                      handlePlayAudio("", word.id, "definition")
                    }
                    onShowDetails={() => setSelectedWord(word)}
                  />
                ))}
              </div>

              {visibleWords < filteredWords.length && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={handleLoadMore}
                    className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white 
                             rounded-full hover:from-indigo-700 hover:to-purple-700 
                             focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                             transform transition-all duration-300 hover:scale-105"
                  >
                    Load More Words
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500 dark:text-gray-400">
              <FaSearch className="h-12 w-12 mb-4 opacity-50" />
              <p className="text-xl font-medium">No words found</p>
              <p className="mt-2">Try adjusting your search or filters</p>
            </div>
          )}
        </section>

        {selectedWord && (
          <DictionaryModal
            word={{
              term: selectedWord.igambo,
              definition: {
                kifuliiru: selectedWord.kifuliiru,
                english: selectedWord.kingereza,
                french: selectedWord.kifaransa,
                swahili: selectedWord.kiswahili,
              },
              date: selectedWord.created_at,
            }}
            language={language}
            onClose={() => setSelectedWord(null)}
            onPlayTermAudio={() => handlePlayAudio("", selectedWord.id, "term")}
            onPlayDefinitionAudio={() =>
              handlePlayAudio("", selectedWord.id, "definition")
            }
            isPlayingTerm={
              playingAudio?.wordId === selectedWord.id &&
              playingAudio?.type === "term"
            }
            isPlayingDefinition={
              playingAudio?.wordId === selectedWord.id &&
              playingAudio?.type === "definition"
            }
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
