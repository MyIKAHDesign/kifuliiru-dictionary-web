"use client";
import Menu from "./components/Header";
import WelcomeSection from "./components/WelcomeSection";
import NewWordsSection from "./components/NewWordsSection";
import HighlightsSection from "./components/HighlightsSection";
import Footer from "./components/Footer";
import DictionaryCTA from "./components/DictionaryCTA";
import StatsSection from "./components/statsSection";

const newWords = [
  { term: "Umuundu", definition: "A person", date: "2024-10-01" },
  { term: "Ukulya bwija", definition: "Eating healthier", date: "2024-10-10" },
  { term: "Ikabando", definition: "A small village", date: "2024-10-15" },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Menu />
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
