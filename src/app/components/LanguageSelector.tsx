"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Globe, ChevronDown } from "lucide-react";

type Language = "en" | "fr" | "sw" | "kf";

const languages: Record<Language, string> = {
  kf: "Kifuliiru",
  sw: "Kiswahili",
  en: "English",
  fr: "Français",
};

const LanguageSelector: React.FC = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>("kf");

  const handleLanguageChange = (language: Language) => {
    setCurrentLanguage(language);
    // Add any additional logic for language change, e.g., updating context or localStorage
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-md"
        >
          <Globe className="h-4 w-4" />
          <span>{languages[currentLanguage]}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-md"
      >
        {(Object.entries(languages) as [Language, string][]).map(
          ([code, name]) => (
            <DropdownMenuItem
              key={code}
              onClick={() => handleLanguageChange(code as Language)}
              className={`${
                currentLanguage === code
                  ? "text-orange-600 dark:text-orange-400"
                  : ""
              } cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2`}
            >
              {name}
            </DropdownMenuItem>
          )
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
