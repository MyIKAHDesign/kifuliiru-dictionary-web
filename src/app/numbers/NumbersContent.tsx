"use client";

import React, { useState } from "react";
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
import type { NumberEntry } from "@/app/lib/supabase";

interface NumbersContentProps {
  initialNumbers: NumberEntry[];
}

type LanguageOption = "kifuliiru" | "english" | "french" | "swahili";

const languageLabels: Record<LanguageOption, string> = {
  kifuliiru: "Kifuliiru",
  english: "English",
  french: "Français",
  swahili: "Kiswahili",
};

export default function NumbersContent({
  initialNumbers = [],
}: NumbersContentProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [displayLanguage, setDisplayLanguage] =
    useState<LanguageOption>("english");
  const [itemsToShow, setItemsToShow] = useState(20);

  // Filter numbers based on search term
  const filteredNumbers = initialNumbers.filter((number) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      number.muharuro.toString().includes(searchLower) ||
      number.kifuliiru.toLowerCase().includes(searchLower) ||
      number.kingereza.toLowerCase().includes(searchLower) ||
      number.kifaransa.toLowerCase().includes(searchLower) ||
      number.kiswahili.toLowerCase().includes(searchLower)
    );
  });

  const getPlaceholderText = (lang: LanguageOption) => {
    const placeholders: Record<LanguageOption, string> = {
      kifuliiru: "Looza imihaaruro mu Kifuliiru...",
      swahili: "Tafuta nambari kwa Kifuliiru...",
      french: "Rechercher des numéros en Kifuliiru...",
      english: "Search for numbers in Kifuliiru...",
    };
    return placeholders[lang];
  };

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 mb-4">
            Numbers in Kifuliiru
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Learn numbers from 1 to 100 in Kifuliiru with translations
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-12">
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNumbers.slice(0, itemsToShow).map((number) => (
            <Card
              key={number.muharuro}
              className="group bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm
                       border border-gray-200/50 dark:border-gray-700/50
                       hover:shadow-xl dark:hover:shadow-orange-500/5
                       transition-all duration-300 hover:-translate-y-1"
            >
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {number.muharuro}
                  </span>
                  <button
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700/50
                             opacity-0 group-hover:opacity-100 transition-all duration-300"
                    aria-label="Listen to pronunciation"
                  >
                    <Volume2 className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-xl font-medium text-gray-900 dark:text-gray-100">
                    {number.kifuliiru}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {
                      number[
                        displayLanguage === "english"
                          ? "kingereza"
                          : displayLanguage === "french"
                          ? "kifaransa"
                          : displayLanguage === "swahili"
                          ? "kiswahili"
                          : "kifuliiru"
                      ]
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredNumbers.length > itemsToShow && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setItemsToShow((prev) => prev + 20)}
              className="px-8 py-3 bg-orange-600 hover:bg-orange-700 
                       dark:bg-orange-500 dark:hover:bg-orange-600
                       text-white rounded-lg shadow-md hover:shadow-xl
                       transition-all duration-300 transform hover:-translate-y-1"
            >
              Load More Numbers
              <span className="ml-2 text-sm opacity-75">
                ({itemsToShow} of {filteredNumbers.length})
              </span>
            </button>
          </div>
        )}

        {filteredNumbers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No numbers found. Try adjusting your search criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
