// src/app/categories/CategoriesContent.tsx
"use client";

import React, { useState } from "react";
import { Search, ChevronRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import Header from "../components/Header";
import Footer from "../components/Footer";

const CategoriesContent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = {
    "Family & Relationships": {
      icon: "👨‍👩‍👧‍👦",
      words: [
        { kifuliiru: "Tata", english: "Father", french: "Père" },
        { kifuliiru: "Maawe", english: "Mother", french: "Mère" },
        { kifuliiru: "Mwana", english: "Child", french: "Enfant" },
        { kifuliiru: "Mwali", english: "Daughter", french: "Fille" },
      ],
    },
    "Nature & Environment": {
      icon: "🌳",
      words: [
        { kifuliiru: "Lwiji", english: "River", french: "Rivière" },
        { kifuliiru: "Mugazi", english: "Mountain", french: "Montagne" },
        { kifuliiru: "Kyasi", english: "Grass", french: "Herbe" },
        { kifuliiru: "Izuuba", english: "Sun", french: "Soleil" },
      ],
    },
    "Food & Cooking": {
      icon: "🍲",
      words: [
        { kifuliiru: "Byokulya", english: "Food", french: "Nourriture" },
        { kifuliiru: "Maata", english: "Milk", french: "Lait" },
        { kifuliiru: "Mukate", english: "Bread", french: "Pain" },
        { kifuliiru: "Matunda", english: "Fruit", french: "Fruit" },
      ],
    },
    "Daily Activities": {
      icon: "⌚",
      words: [
        { kifuliiru: "Kulya", english: "To eat", french: "Manger" },
        { kifuliiru: "Kugenda", english: "To walk", french: "Marcher" },
        { kifuliiru: "Kulaala", english: "To sleep", french: "Dormir" },
        { kifuliiru: "Kukola", english: "To work", french: "Travailler" },
      ],
    },
    "Colors & Description": {
      icon: "🎨",
      words: [
        { kifuliiru: "Mideru", english: "White", french: "Blanc" },
        { kifuliiru: "Mwiiru", english: "Black", french: "Noir" },
        { kifuliiru: "Muduku", english: "Red", french: "Rouge" },
        { kifuliiru: "Mululu", english: "Blue", french: "Bleu" },
      ],
    },
  };

  const filteredCategories = Object.entries(categories).filter(([name]) =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Kifuliiru Word Categories
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Explore Kifuliiru vocabulary organized by themes and categories
              </p>
            </div>

            {/* Search */}
            <div className="relative mb-8">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search categories..."
                className="w-full pl-10 pr-4 py-3 border rounded-lg bg-white dark:bg-gray-800 
                         border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-orange-500 
                         focus:border-transparent transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCategories.map(([name, data]) => (
                <Card
                  key={name}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg
                           ${
                             selectedCategory === name
                               ? "ring-2 ring-orange-500"
                               : ""
                           }`}
                  onClick={() =>
                    setSelectedCategory(name === selectedCategory ? null : name)
                  }
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span className="text-2xl">{data.icon}</span>
                        <span className="text-lg text-gray-900 dark:text-white">
                          {name}
                        </span>
                      </span>
                      <ChevronRight
                        className={`h-5 w-5 text-gray-400 transition-transform duration-300
                                 ${
                                   selectedCategory === name ? "rotate-90" : ""
                                 }`}
                      />
                    </CardTitle>
                  </CardHeader>

                  {selectedCategory === name && (
                    <CardContent>
                      <div className="mt-4 space-y-4">
                        {data.words.map((word, index) => (
                          <div
                            key={index}
                            className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                          >
                            <div className="font-medium text-gray-900 dark:text-white">
                              {word.kifuliiru}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {word.english} • {word.french}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>

            {/* Learning Tips */}
            <div className="mt-12 p-6 bg-orange-50 dark:bg-gray-800 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Learning Tips
              </h2>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>• Focus on one category at a time</li>
                <li>• Practice words in context with example sentences</li>
                <li>• Review related words together to build connections</li>
                <li>
                  • Use the vocabulary in daily conversations when possible
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CategoriesContent;
