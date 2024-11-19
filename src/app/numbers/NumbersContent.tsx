"use client";

import React, { useState, useMemo } from "react";
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

type LanguageOption = "kifuliiru" | "kingereza" | "kifaransa" | "kiswahili";

const languageLabels: Record<LanguageOption, string> = {
  kifuliiru: "Kifuliiru",
  kingereza: "English",
  kifaransa: "Français",
  kiswahili: "Kiswahili",
};

export default function NumbersContent({
  initialNumbers = [],
}: NumbersContentProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [displayLanguage, setDisplayLanguage] =
    useState<LanguageOption>("kifuliiru");
  const [itemsToShow, setItemsToShow] = useState(20);

  // Memoized search results
  const filteredNumbers = useMemo(() => {
    if (!searchTerm.trim()) return initialNumbers;

    const searchLower = searchTerm.toLowerCase();

    return initialNumbers.filter((number) => {
      // Check numeric value
      if (number.muharuro.toString().includes(searchLower)) return true;

      // Check all language translations
      const translations = [
        number.kifuliiru,
        number.kingereza,
        number.kifaransa,
        number.kiswahili,
      ].map((text) => text.toLowerCase());

      // Return true if any translation contains the search term
      return translations.some((text) => text.includes(searchLower));
    });
  }, [searchTerm, initialNumbers]);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Numbers in Kifuliiru
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Learn numbers from 1 to 100 in Kifuliiru with translations
              </p>
            </div>

            {/* Search and Controls */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search numbers or words..."
                  className="w-full pl-10 pr-4 py-3 border rounded-lg bg-white dark:bg-gray-800 
                           border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-orange-500 
                           focus:border-transparent transition-colors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="flex items-center gap-2 px-4 py-3 border rounded-lg bg-white dark:bg-gray-800 
                             border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700
                             transition-colors"
                  >
                    <Globe2 className="h-5 w-5" />
                    <span>{languageLabels[displayLanguage]}</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {(Object.keys(languageLabels) as LanguageOption[]).map(
                    (lang) => (
                      <DropdownMenuItem
                        key={lang}
                        onClick={() => setDisplayLanguage(lang)}
                      >
                        {languageLabels[lang]}
                      </DropdownMenuItem>
                    )
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Numbers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredNumbers.length > 0 ? (
                filteredNumbers.slice(0, itemsToShow).map((number) => (
                  <Card
                    key={number.id}
                    className="group hover:shadow-lg transition-shadow duration-300"
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                          {number.muharuro}
                        </span>
                        <button
                          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 
                                   transition-colors opacity-0 group-hover:opacity-100"
                          aria-label="Listen to pronunciation"
                        >
                          <Volume2 className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                        </button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex flex-col">
                          <p className="text-xl font-medium text-gray-900 dark:text-white">
                            {number.kifuliiru}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {number[displayLanguage]}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-2 text-center py-12 text-gray-600 dark:text-gray-400">
                  No numbers found
                </div>
              )}
            </div>

            {/* Load More Button */}
            {filteredNumbers.length > itemsToShow && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setItemsToShow((prev) => prev + 20)}
                  className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg
                           transition-colors duration-200"
                >
                  Load More Numbers
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
