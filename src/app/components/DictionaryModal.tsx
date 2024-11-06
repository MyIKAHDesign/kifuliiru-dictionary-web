// components/DictionaryModal.tsx
import React from "react";
import { FaPlay, FaTimes } from "react-icons/fa";
import type { WordWithTranslations, Language } from "../data/types/dictionary";

interface DictionaryModalProps {
  word: WordWithTranslations;
  language: Language;
  onClose: () => void;
  onPlayTermAudio: () => void;
  onPlayDefinitionAudio: () => void;
  isPlayingTerm: boolean;
  isPlayingDefinition: boolean;
}

export const DictionaryModal: React.FC<DictionaryModalProps> = ({
  word,
  language,
  onClose,

  onPlayDefinitionAudio,

  isPlayingDefinition,
}) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
              {word.term}
            </h2>
            <div className="flex items-center gap-2">
              {word.partOfSpeech && (
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                  {word.partOfSpeech}
                </span>
              )}
              {word.dialect && (
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                  {word.dialect}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <FaTimes />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Definition
            </h3>
            <div className="flex items-start gap-2">
              <p className="text-gray-600 dark:text-gray-300 flex-grow">
                {word.definition[language]}
              </p>
              {word.audioDefinitionUrl && (
                <button
                  onClick={onPlayDefinitionAudio}
                  className={`p-2 rounded-full flex-shrink-0 ${
                    isPlayingDefinition
                      ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-600"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                  } hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors`}
                >
                  <FaPlay
                    className={`h-4 w-4 ${
                      isPlayingDefinition ? "text-indigo-600" : ""
                    }`}
                  />
                </button>
              )}
            </div>
          </div>

          {word.examples && word.examples.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Examples
              </h3>
              <ul className="space-y-2">
                {word.examples.map((example, index) => (
                  <li
                    key={index}
                    className="text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg"
                  >
                    {example[language]}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
