"use client";

import React, { useState } from "react";
import { Search, Volume2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import Header from "../components/Header";
import Footer from "../components/Footer";

const NumbersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const numbers = [
    { value: 1, kifuliiru: "Muguma", pronunciation: "moo-goo-ma" },
    { value: 2, kifuliiru: "Biri", pronunciation: "bee-ree" },
    { value: 3, kifuliiru: "Bishatu", pronunciation: "bee-sha-too" },
    { value: 4, kifuliiru: "Bina", pronunciation: "bee-na" },
    { value: 5, kifuliiru: "Bitaanu", pronunciation: "bee-taa-noo" },
    { value: 6, kifuliiru: "Ndatu", pronunciation: "n-da-too" },
    { value: 7, kifuliiru: "Birinda", pronunciation: "bee-reen-da" },
    { value: 8, kifuliiru: "Munaana", pronunciation: "moo-naa-na" },
    { value: 9, kifuliiru: "Mwenda", pronunciation: "m-wen-da" },
    { value: 10, kifuliiru: "Ikumi", pronunciation: "ee-koo-mee" },
    {
      value: 20,
      kifuliiru: "Makumi abiri",
      pronunciation: "ma-koo-mee a-bee-ree",
    },
    {
      value: 30,
      kifuliiru: "Makumi ashatu",
      pronunciation: "ma-koo-mee a-sha-too",
    },
    { value: 40, kifuliiru: "Makumi ana", pronunciation: "ma-koo-mee a-na" },
    {
      value: 50,
      kifuliiru: "Makumi ataanu",
      pronunciation: "ma-koo-mee a-taa-noo",
    },
    { value: 100, kifuliiru: "Igana", pronunciation: "ee-ga-na" },
    { value: 1000, kifuliiru: "Kihumbi", pronunciation: "kee-hoom-bee" },
  ];

  const filteredNumbers = numbers.filter(
    (number) =>
      number.value.toString().includes(searchTerm) ||
      number.kifuliiru.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                Learn to count and express numbers in Kifuliiru, from basic
                numerals to larger quantities
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative mb-8">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search numbers or Kifuliiru words..."
                className="w-full pl-10 pr-4 py-3 border rounded-lg bg-white dark:bg-gray-800 
                         border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-orange-500 
                         focus:border-transparent transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Numbers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredNumbers.map((number) => (
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
                      <p className="text-xl font-medium text-gray-900 dark:text-white">
                        {number.kifuliiru}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                        Pronunciation: {number.pronunciation}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Tips */}
            <div className="mt-12 p-6 bg-orange-50 dark:bg-gray-800 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Tips for Learning Numbers
              </h2>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>• Numbers 1-10 have unique names</li>
                <li>• Tens (20, 30, etc.) use the prefix &quot;Makumi&quot;</li>
                <li>• 100 (Igana) and 1000 (Kihumbi) have special terms</li>
                <li>
                  • Practice counting everyday objects to reinforce learning
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

export default NumbersPage;
