import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Abafuliiru Cultural Heritage | Learn about the Bifuliiru People",
  description:
    "Discover the rich cultural heritage, traditions, history, and language of the Abafuliiru people of Eastern DRC. Learn about our customs, geography, and community.",
  keywords: [
    "Abafuliiru",
    "Bifuliiru",
    "DRC Culture",
    "African Heritage",
    "South Kivu",
    "Kifuliiru Language",
  ],
  openGraph: {
    title: "Abafuliiru Cultural Heritage",
    description: "Explore the rich cultural heritage of the Abafuliiru people",
    images: [{ url: "/images/abafuliiru-hero.jpg" }],
  },
};

export default function AbafuliiruLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
