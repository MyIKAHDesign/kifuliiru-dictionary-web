import "./globals.css";
import { Playfair_Display, Source_Sans_3 } from "next/font/google";
import { Metadata } from "next";
import { generateMetadata } from "./lib/metadata";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AuthProvider from "./lib/AuthProvider";

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
        url: "/images/hero-library.jpg",
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
    <AuthProvider>
      <html
        lang="en"
        className={`${playfair.variable} ${sourceSans.variable}`}
        suppressHydrationWarning
      >
        <body className="min-h-screen bg-neutral-50 dark:bg-gray-950 text-gray-900 dark:text-gray-50 font-sans antialiased">
          <div className="flex flex-col min-h-screen">
            <Header />{" "}
            {/* Header component should now include SignInButton and UserButton */}
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </body>
      </html>
    </AuthProvider>
  );
}
