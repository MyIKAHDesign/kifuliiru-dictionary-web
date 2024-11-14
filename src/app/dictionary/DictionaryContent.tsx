"use client";

import { useState } from "react";
import Footer from "@/app/components/Footer";
import { FaSearch } from "react-icons/fa";
import WordCard from "@/app/components/WordCard";
import { DictionaryModal } from "@/app/components/DictionaryModal";
import { Language, WordWithTranslations } from "@/app/data/types/dictionary";
import { LanguageSelector } from "@/app/components/LanguageSelector";
import Header from "@/app/components/Header";

const FILTERS = ["all", "noun", "verb", "phrase", "adjective"] as const;
type FilterType = (typeof FILTERS)[number];

const sampleWordsWithTranslations: WordWithTranslations[] = [
  {
    term: "Umuundu",
    definition: {
      kifuliiru:
        "Umundu úli mu bandu ábatangwiriri mu mihugo neꞌmigeeza yeꞌkihugo.",
      english:
        "A person in the community who plays a significant role in social gatherings and cultural events.",
      french:
        "Une personne dans la communauté qui joue un rôle important dans les rassemblements sociaux et les événements culturels.",
      swahili:
        "Mtu katika jamii anayechukua nafasi muhimu katika mikusanyiko ya kijamii na matukio ya kitamaduni.",
    },
    date: "2024-10-01",
    audioTermUrl: "/audio/umuundu-term.mp3",
    audioDefinitionUrl: "/audio/umuundu-definition.mp3",
    partOfSpeech: "noun",
    examples: [
      {
        kifuliiru: "Umuundu akola mu kyaro kyitu",
        english: "The person works in our village",
        french: "La personne travaille dans notre village",
        swahili: "Mtu anafanya kazi katika kijiji chetu",
      },
    ],
    dialect: "Central Kifuliiru",
  },
];

const WORDS_PER_PAGE = 9;

type AudioPlayingState = {
  wordId: string;
  type: "term" | "definition";
} | null;

export default function DictionaryContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleWords, setVisibleWords] = useState(WORDS_PER_PAGE);
  const [selectedWord, setSelectedWord] = useState<WordWithTranslations | null>(
    null
  );
  const [playingAudio, setPlayingAudio] = useState<AudioPlayingState>(null);
  const [filter, setFilter] = useState<FilterType>("all");
  const [language, setLanguage] = useState<Language>("english");

  const filteredWords = sampleWordsWithTranslations.filter((word) => {
    const searchInDefinition = word.definition[language]
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const searchInTerm = word.term
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || word.partOfSpeech === filter;
    return (searchInDefinition || searchInTerm) && matchesFilter;
  });

  const handlePlayAudio = async (
    url: string,
    wordId: string,
    type: "term" | "definition"
  ) => {
    if (playingAudio?.wordId === wordId && playingAudio?.type === type) {
      setPlayingAudio(null);
      return;
    }
    setPlayingAudio({ wordId, type });
    const audio = new Audio(url);
    audio.onended = () => setPlayingAudio(null);
    try {
      await audio.play();
    } catch (error) {
      console.error("Error playing audio:", error);
      setPlayingAudio(null);
    }
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
      <Header />

      <main className="flex-1 container mx-auto px-4 py-12 max-w-7xl flex flex-col min-h-[calc(100vh-4rem)]">
        {/* Hero Section with Language Selector */}
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

        {/* Search and Filters sections */}
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

        {/* Words Grid Section */}
        <section className="flex-1 min-h-[500px]">
          {filteredWords.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {filteredWords.slice(0, visibleWords).map((word, index) => (
                  <WordCard
                    key={word.term}
                    word={word}
                    language={language}
                    index={index}
                    isPlayingTerm={
                      playingAudio?.wordId === word.term &&
                      playingAudio?.type === "term"
                    }
                    isPlayingDefinition={
                      playingAudio?.wordId === word.term &&
                      playingAudio?.type === "definition"
                    }
                    onPlayTermAudio={() =>
                      handlePlayAudio(
                        word.audioTermUrl || "",
                        word.term,
                        "term"
                      )
                    }
                    onPlayDefinitionAudio={() =>
                      handlePlayAudio(
                        word.audioDefinitionUrl || "",
                        word.term,
                        "definition"
                      )
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

        {/* Dictionary Modal */}
        {selectedWord && (
          <DictionaryModal
            word={selectedWord}
            language={language}
            onClose={() => setSelectedWord(null)}
            onPlayTermAudio={() =>
              handlePlayAudio(
                selectedWord.audioTermUrl || "",
                selectedWord.term,
                "term"
              )
            }
            onPlayDefinitionAudio={() =>
              handlePlayAudio(
                selectedWord.audioDefinitionUrl || "",
                selectedWord.term,
                "definition"
              )
            }
            isPlayingTerm={
              playingAudio?.wordId === selectedWord.term &&
              playingAudio?.type === "term"
            }
            isPlayingDefinition={
              playingAudio?.wordId === selectedWord.term &&
              playingAudio?.type === "definition"
            }
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
