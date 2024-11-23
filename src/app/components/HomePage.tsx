"use client";
import HighlightsSection from "@/app/components/HighlightsSection";
import NewWordsSection from "@/app/components/NewWordsSection";
import DictionaryCTA from "@/app/components/DictionaryCTA";
import HeroSection from "./WelcomeSection";
import StatsSection from "./statsSection";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <main>
        <HeroSection />
        <StatsSection />
        <HighlightsSection />
        <NewWordsSection />
        <DictionaryCTA />
      </main>
    </div>
  );
}
