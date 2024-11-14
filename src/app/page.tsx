// src/app/page.tsx
import { Metadata } from "next";
import { generateMetadata } from "./lib/metadata";
import HomePage from "./components/HomePage";

const newWords = [
  { term: "Umuundu", definition: "A person", date: "2024-10-01" },
  { term: "Ukulya bwija", definition: "Eating healthier", date: "2024-10-10" },
  { term: "Ikabando", definition: "A small village", date: "2024-10-15" },
];

export const metadata: Metadata = generateMetadata({
  title: "Home",
  description:
    "Discover and explore the Kifuliiru language through our comprehensive digital dictionary",
  keywords: [
    "kifuliiru learning",
    "african languages",
    "cultural preservation",
  ],
});

export default function Home() {
  return <HomePage newWords={newWords} />;
}
