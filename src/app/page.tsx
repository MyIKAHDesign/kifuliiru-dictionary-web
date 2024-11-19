// src/app/page.tsx
import { Metadata } from "next";
import { generateMetadata } from "./lib/metadata";
import HomePage from "./components/HomePage";

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
  return <HomePage />;
}
