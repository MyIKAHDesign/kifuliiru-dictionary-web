import { AuthProvider } from "./lib/firebase/auth";
import { FirebaseProvider } from "./lib/firebase/context";
import "./globals.css";
import { Playfair_Display, Source_Sans_3 } from "next/font/google";

// Configure Playfair Display for headings
const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700", "800", "900"],
});

// Configure Source Sans 3 for body text
const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source-sans",
  weight: ["300", "400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${sourceSans.variable}`}>
      <body className="min-h-screen flex flex-col">
        <FirebaseProvider>
          <AuthProvider>
            <div className="flex flex-col min-h-screen">{children}</div>
          </AuthProvider>
        </FirebaseProvider>
      </body>
    </html>
  );
}
