// src/app/layout.tsx
import { AuthProvider } from "./lib/firebase/auth";
import { FirebaseProvider } from "./lib/firebase/context";
import "./globals.css";
import { Playfair_Display, Source_Sans_3 } from "next/font/google";
import { Metadata } from "next";
import { generateMetadata } from "./lib/metadata";

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source-sans",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = generateMetadata({
  title: "Home",
  description: "Discover the beauty of the Kifuliiru language",
  keywords: ["Kifuliiru", "dictionary", "language", "learning", "translation"],
  openGraph: {
    images: [
      {
        url: "/images/home-og.jpg",
        width: 1200,
        height: 630,
        alt: "Kifuliiru Dictionary - Language Learning Platform",
      },
    ],
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${sourceSans.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-neutral-50 dark:bg-gray-950 text-gray-900 dark:text-gray-50 font-sans antialiased">
        <FirebaseProvider>
          <AuthProvider>
            <main className="flex flex-col min-h-screen">{children}</main>
          </AuthProvider>
        </FirebaseProvider>
      </body>
    </html>
  );
}
