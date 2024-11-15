import { Metadata } from "next";

interface PageMetadata {
  title: string;
  description?: string;
  keywords?: string[];
  openGraph?: {
    title?: string;
    description?: string;
    images?:
      | string
      | string[]
      | {
          url: string;
          width?: number;
          height?: number;
          alt?: string;
        }[];
  };
}

const baseTitle = "Kifuliiru Dictionary";
const baseDescription =
  "Explore and preserve the richness of the Kifuliiru language";

export const generateMetadata = (page: PageMetadata): Metadata => {
  const title = page.title ? `${page.title} | ${baseTitle}` : baseTitle;
  const description = page.description || baseDescription;

  return {
    title,
    description,
    icons: {
      icon: "/icon.png",
      shortcut: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },
    keywords: [
      "kifuliiru",
      "dictionary",
      "language",
      "translation",
      ...(page.keywords || []),
    ],

    openGraph: {
      type: "website",
      siteName: baseTitle,
      title: page.openGraph?.title || title,
      description: page.openGraph?.description || description,
      images: page.openGraph?.images || [
        {
          url: "/hero-library.jpg",
          width: 1200,
          height: 630,
          alt: "Kifuliiru Dictionary",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/hero-library.jpg"],
    },
  };
};
