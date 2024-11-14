import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ibufuliiru | Traditional Homeland of the Bafuliiru People",
  description:
    "Explore the ancestral lands of the Bafuliiru people in South Kivu, DRC. Discover rich landscapes, sacred sites, and cultural heritage of Ibufuliiru.",
  keywords: [
    "Ibufuliiru",
    "Bafuliiru homeland",
    "South Kivu",
    "DRC geography",
    "African landscapes",
    "Bafuliiru territory",
    "Cultural lands",
    "Sacred sites",
  ],
  openGraph: {
    title: "Discover Ibufuliiru",
    description: "The ancestral homeland of the Bafuliiru people",
    images: [{ url: "/images/ibufuliiru-hero.jpg" }],
  },
};

export default function IbufuliiruLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
