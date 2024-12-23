// app/word-of-day/page.tsx
"use client";

import WordOfTheDay from "@/app/components/WordOfTheDay";

export default function WordOfTheDayPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 mb-4">
            Word of the Day
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Expand your Kifuliiru vocabulary one word at a time. Each day brings
            a new word with translations, pronunciation, and cultural context.
          </p>
        </div>

        {/* Word of the Day Component */}
        <WordOfTheDay />
      </div>
    </main>
  );
}
