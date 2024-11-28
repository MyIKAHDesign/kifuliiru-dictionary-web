"use client";

import Link from "next/link";
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
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

type Language = "en" | "fr" | "sw" | "kf";

const languages: Record<Language, string> = {
  kf: "Kifuliiru",
  sw: "Kiswahili",
  en: "English",
  fr: "Français",
};

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<Language>("kf");
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
  ];

  const LanguageSelector = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <span>{languages[currentLanguage]}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {(Object.entries(languages) as [Language, string][]).map(
          ([code, name]) => (
            <DropdownMenuItem
              key={code}
              onClick={() => setCurrentLanguage(code)}
              className={`${
                currentLanguage === code
                  ? "text-orange-600 dark:text-orange-400"
                  : ""
              } cursor-pointer`}
            >
              {name}
            </DropdownMenuItem>
          )
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );

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
                  className="text-sm font-medium text-gray-700 hover:text-orange-600 
                           dark:text-gray-300 dark:hover:text-orange-400 
                           transition-colors flex items-center gap-2 group"
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

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4">
              <nav className="flex flex-col space-y-4">
                {getNavigationLinks().map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    className="text-sm font-medium text-gray-700 hover:text-orange-600 
                             dark:text-gray-300 dark:hover:text-orange-400 
                             transition-colors px-4 py-2 hover:bg-gray-50 
                             dark:hover:bg-gray-800 rounded-md flex items-center gap-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.name}
                  </Link>
                ))}

                <div className="px-4 py-2">
                  <button
                    onClick={toggleTheme}
                    className="w-full flex items-center gap-2 px-2 py-1.5 text-sm 
                             text-gray-700 dark:text-gray-300 hover:text-orange-600 
                             dark:hover:text-orange-400"
                  >
                    {isDark ? (
                      <>
                        <Sun className="h-4 w-4" />
                        Light Mode
                      </>
                    ) : (
                      <>
                        <Moon className="h-4 w-4" />
                        Dark Mode
                      </>
                    )}
                  </button>
                </div>

                <div className="px-4 py-2">
                  <LanguageSelector />
                </div>

                {session && (
                  <div className="px-4 py-2">
                    <ProfileMenu />
                  </div>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  );
}

export default Header;
