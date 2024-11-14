import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kifuliiru Language | Learn, Explore, and Preserve",
  description:
    "Discover the rich linguistic heritage of Kifuliiru, the language of the Bafuliiru people. Explore grammar, vocabulary, cultural expressions, and modern language resources.",
  keywords: [
    "Kifuliiru",
    "Bafuliiru language",
    "African languages",
    "Bantu languages",
    "South Kivu languages",
    "DRC languages",
    "Language learning",
    "Cultural preservation",
  ],
  openGraph: {
    title: "Kifuliiru Language Portal",
    description: "Learn and explore the Kifuliiru language",
    images: [{ url: "/images/kifuliiru-hero.jpg" }],
  },
};

export default function KifuliiruLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
