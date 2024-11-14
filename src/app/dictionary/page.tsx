import { Metadata } from "next";
import { generateMetadata } from "../lib/metadata";
import DictionaryContent from "./DictionaryContent";

export const metadata: Metadata = generateMetadata({
  title: "Browse Dictionary",
  description:
    "Browse and search through our comprehensive collection of Kifuliiru words and phrases",
  keywords: [
    "dictionary search",
    "word lookup",
    "translations",
    "Kifuliiru language",
  ],
  openGraph: {
    images: [
      {
        url: "/images/dictionary-og.jpg",
        width: 1200,
        height: 630,
        alt: "Kifuliiru Dictionary Search",
      },
    ],
  },
});

export default function Page() {
  return <DictionaryContent />;
}
