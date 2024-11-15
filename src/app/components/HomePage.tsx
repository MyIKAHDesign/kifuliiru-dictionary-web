// src/app/components/HomePage.tsx
"use client";

import WelcomeSection from "./WelcomeSection";
import NewWordsSection from "./NewWordsSection";
import HighlightsSection from "./HighlightsSection";
import Footer from "./Footer";
import DictionaryCTA from "./DictionaryCTA";
import StatsSection from "./statsSection";

interface HomePageProps {
  newWords: Array<{
    term: string;
    definition: string;
    date: string;
  }>;
}

export default function HomePage({ newWords }: HomePageProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex flex-col bg-lightBackground dark:bg-darkBackground text-lightText dark:text-darkText">
        <WelcomeSection />
        <StatsSection />
        <HighlightsSection />
        <NewWordsSection newWords={newWords} />
        <DictionaryCTA />
      </main>
      <Footer />
    </div>
  );
}
