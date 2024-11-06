// components/LanguageSelector.tsx
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/app/components/ui/select";
import { Globe2 } from "lucide-react";
import type { Language } from "../data/types/dictionary";

interface LanguageSelectorProps {
  value: Language;
  onChange: (value: Language) => void;
}

const LANGUAGE_OPTIONS = [
  {
    id: "kifuliiru" as Language,
    label: "Kifuliiru",
    flag: "🇨🇩",
    nativeName: "Kifuliiru",
  },
  {
    id: "swahili" as Language,
    label: "Kiswahili",
    flag: "🇹🇿",
    nativeName: "Kiswahili",
  },
  {
    id: "french" as Language,
    label: "French",
    flag: "🇫🇷",
    nativeName: "Français",
  },
  {
    id: "english" as Language,
    label: "English",
    flag: "🇬🇧",
    nativeName: "English",
  },
] as const;

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  value,
  onChange,
}) => {
  const selectedLanguage = LANGUAGE_OPTIONS.find((lang) => lang.id === value);

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        className="w-[200px] h-11 px-4 
                   bg-white dark:bg-gray-800
                   border-2 border-gray-200 dark:border-gray-700
                   hover:border-indigo-500 dark:hover:border-indigo-400
                   focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400
                   rounded-lg shadow-sm transition-all duration-200
                   [&>svg]:text-gray-600 dark:[&>svg]:text-gray-300"
      >
        <div className="flex items-center gap-3 text-gray-900 dark:text-gray-100">
          <Globe2 className="h-5 w-5 text-indigo-500 dark:text-indigo-400 flex-shrink-0" />
          <div className="flex items-center gap-2 flex-shrink-0">
            <span
              className="text-lg leading-none"
              role="img"
              aria-label={selectedLanguage?.label}
            >
              {selectedLanguage?.flag}
            </span>
            <span className="font-medium text-sm">
              {selectedLanguage?.nativeName}
            </span>
          </div>
        </div>
      </SelectTrigger>
      <SelectContent
        className="bg-white dark:bg-gray-800
                   border-2 border-gray-200 dark:border-gray-700
                   shadow-lg rounded-lg overflow-hidden
                   min-w-[200px]"
      >
        <div className="px-1.5 py-2">
          {LANGUAGE_OPTIONS.map((language) => (
            <SelectItem
              key={language.id}
              value={language.id}
              className={`
    group relative flex items-center px-8 py-2.5 rounded-md
    text-gray-900 dark:text-gray-100 my-1
    hover:bg-gray-100 dark:hover:bg-gray-700/50
    focus:bg-gray-100 dark:focus:bg-gray-700/50
    transition-colors duration-150 outline-none
    cursor-pointer select-none
    ${language.id === value ? "bg-gray-100 dark:bg-gray-700/50" : ""}
  `}
            >
              <span
                className="text-lg leading-none mr-3"
                role="img"
                aria-label={language.label}
              >
                {language.flag}
              </span>

              <span className="font-medium text-sm mr-6">
                {language.nativeName}
              </span>

              {language.id === value && (
                <span
                  className="absolute right-8 top-1/2 -mt-1 h-2 w-2 rounded-full 
                bg-indigo-500 dark:bg-indigo-400"
                />
              )}
            </SelectItem>
          ))}
        </div>
      </SelectContent>
    </Select>
  );
};
