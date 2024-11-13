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
import { numbersData } from "@/app/data/numbers";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

// Define valid language options
type LanguageOption = "kifuliiru" | "english" | "french" | "swahili";

// Update the filteredNumbers type to use the explicit type from the data
const filteredNumbers = (
  numbers: Array<{
    value: number;
    kifuliiru: string;
    english: string;
    french: string;
    swahili: string;
  }>,
  search: string
) => {
  return numbers.filter(
    (number) =>
      number.value.toString().includes(search) ||
      Object.values(number).some(
        (val) =>
          typeof val === "string" &&
          val.toLowerCase().includes(search.toLowerCase())
      )
  );
};

export default function NumbersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [displayLanguage, setDisplayLanguage] =
    useState<LanguageOption>("kifuliiru");
  const [itemsToShow, setItemsToShow] = useState(20);

  const languageOptions = [
    { value: "kifuliiru" as LanguageOption, label: "Kifuliiru" },
    { value: "english" as LanguageOption, label: "English" },
    { value: "french" as LanguageOption, label: "Français" },
    { value: "swahili" as LanguageOption, label: "Kiswahili" },
  ];

  const filtered = filteredNumbers(numbersData, searchTerm);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Numbers in Kifuliiru
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Learn numbers from 1 to 100 in Kifuliiru with translations in
                multiple languages
              </p>
            </div>

            {/* Control Panel */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              {/* Search Bar */}
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

              {/* Language Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="flex items-center gap-2 px-4 py-3 border rounded-lg bg-white dark:bg-gray-800 
                                    border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700
                                    transition-colors"
                  >
                    <Globe2 className="h-5 w-5" />
                    <span>
                      {
                        languageOptions.find(
                          (lang) => lang.value === displayLanguage
                        )?.label
                      }
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {languageOptions.map((lang) => (
                    <DropdownMenuItem
                      key={lang.value}
                      onClick={() => setDisplayLanguage(lang.value)}
                    >
                      {lang.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Numbers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.slice(0, itemsToShow).map((number) => (
                <Card
                  key={number.value}
                  className="group hover:shadow-lg transition-shadow duration-300"
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        {number.value}
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
              ))}
            </div>

            {/* Load More Button */}
            {itemsToShow < filtered.length && (
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

            {/* Quick Tips */}
            <div className="mt-12 p-6 bg-orange-50 dark:bg-gray-800 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Understanding Kifuliiru Numbers
              </h2>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>• Basic numbers (1-10) have unique names</li>
                <li>
                  • &quot;Makumi&quot; is used for multiples of ten (20, 30,
                  etc.)
                </li>
                <li>
                  • &quot;na&quot; means &quot;and&quot; when combining tens
                  with ones
                </li>
                <li>• &quot;Igana or Ijana&quot; represents one hundred</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
