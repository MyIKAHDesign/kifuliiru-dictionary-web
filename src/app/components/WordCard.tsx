// components/WordCard.tsx
import React from "react";
import { FaPlay, FaInfo } from "react-icons/fa";
import type { WordWithTranslations, Language } from "../data/types/dictionary";

interface WordCardProps {
  word: WordWithTranslations;
  language: Language;
  index: number;
  isPlayingTerm: boolean;
  isPlayingDefinition: boolean;
  onPlayTermAudio: () => void;
  onPlayDefinitionAudio: () => void;
  onShowDetails: () => void;
}

const WordCard: React.FC<WordCardProps> = ({
  word,
  language,

  isPlayingTerm,

  onPlayTermAudio,

  onShowDetails,
}) => {
  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl 
                 transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {word.term}
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {word.partOfSpeech} {word.dialect && `• ${word.dialect}`}
          </span>
        </div>
        <button
          onClick={onPlayTermAudio}
          className={`p-2 rounded-full ${
            isPlayingTerm
              ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-600"
              : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
          } hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors`}
        >
          <FaPlay
            className={`h-4 w-4 ${isPlayingTerm ? "text-indigo-600" : ""}`}
          />
        </button>
      </div>

      <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
        {word.definition[language]}
      </p>

      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {new Date(word.date).toLocaleDateString()}
        </span>
        <button
          onClick={onShowDetails}
          className="flex items-center text-indigo-600 dark:text-indigo-400 
                   hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
        >
          <span className="mr-1">Details</span>
          <FaInfo className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
};

export default WordCard;
