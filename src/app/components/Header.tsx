"use client";

import Link from "next/link";
import { usePathname } from "next/navigation"; // Import usePathname
import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Session } from "@supabase/auth-helpers-nextjs";
import { Button } from "./ui/button";
import DevelopmentBanner from "./DevelopmentBanner";
import { ProfileMenu } from "./ProfileMenu";
import {
  Menu,
  X,
  Home,
  BookOpen,
  Hash,
  Grid,
  PenSquare,
  Globe,
  Building,
  Users,
  Sun,
  Moon,
  ArrowRight,
} from "lucide-react";
import LanguageSelector from "./LanguageSelector";

export function Header() {
  const pathname = usePathname(); // Get current path
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [isDark, setIsDark] = useState(false);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const darkModePreference = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const storedTheme = localStorage.getItem("theme");
    const initialDark = storedTheme
      ? storedTheme === "dark"
      : darkModePreference;
    setIsDark(initialDark);
    updateTheme(initialDark);

    async function getSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });

      return () => subscription.unsubscribe();
    }

    getSession();
  }, [supabase.auth]);

  const updateTheme = (dark: boolean) => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    updateTheme(newDark);
  };

  const getNavigationLinks = () => [
    { name: "Home", icon: Home, path: "/" },
    { name: "Dictionary", icon: BookOpen, path: "/dictionary" },
    { name: "Numbers", icon: Hash, path: "/numbers" },
    { name: "Categories", icon: Grid, path: "/categories" },
    {
      name: session ? "Contribute" : "Become a Contributor",
      icon: PenSquare,
      path: session ? "/contribute" : "/auth/sign-in",
    },
    { name: "Kifuliiru", icon: Globe, path: "/kifuliiru" },
    { name: "Ibufuliiru", icon: Building, path: "/ibufuliiru" },
    { name: "Abafuliiru", icon: Users, path: "/abafuliiru" },
    { name: "About Us", icon: Grid, path: "/about" },
  ];

  return (
    <>
      <DevelopmentBanner />
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center space-x-2 transition-colors"
            >
              <span className="text-xl font-bold text-gray-900 dark:text-gray-100 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                Kifuliiru
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {getNavigationLinks().map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`text-sm font-medium flex items-center gap-2 group transition-colors ${
                    pathname === link.path
                      ? "text-orange-600 dark:text-orange-400"
                      : "text-gray-700 hover:text-orange-600 dark:text-gray-300 dark:hover:text-orange-400"
                  }`}
                >
                  <link.icon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                  <span>{link.name}</span>
                </Link>
              ))}
            </nav>

            {/* Desktop Auth/Profile, Language, and Theme Toggle */}
            <div className="hidden md:flex items-center space-x-4">
              <LanguageSelector />

              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 
                       transition-colors"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>

              {session ? (
                <ProfileMenu />
              ) : (
                <Link href="/auth/sign-in">
                  <Button
                    variant="default"
                    className="relative overflow-hidden group px-6 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-600"
                  >
                    <span className="relative flex items-center gap-2">
                      <span>Sign In</span>
                      <ArrowRight
                        className="w-4 h-4 transition-transform duration-300 
                                         group-hover:translate-x-1"
                      />
                    </span>
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 
                       transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
