"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { User } from "@supabase/auth-helpers-nextjs";
import {
  Sun,
  Moon,
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
  LucideIcon,
} from "lucide-react";

const Header = () => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClientComponentClient();

  interface NavigationItem {
    name: string;
    icon: LucideIcon;
    path: string;
  }

  const getNavigationLinks = () => [
    { name: "Home", icon: Home, path: "/" },
    { name: "Dictionary", icon: BookOpen, path: "/dictionary" },
    { name: "Numbers", icon: Hash, path: "/numbers" },
    { name: "Categories", icon: Grid, path: "/categories" },
    {
      name: isAuthenticated ? "Contribute" : "Become a Contributor",
      icon: PenSquare,
      path: isAuthenticated ? "/contribute" : "/auth/sign-in",
    },
    { name: "Kifuliiru", icon: Globe, path: "/kifuliiru" },
    { name: "Ibufuliiru", icon: Building, path: "/ibufuliiru" },
    { name: "Abafuliiru", icon: Users, path: "/abafuliiru" },
  ];

  useEffect(() => {
    setMounted(true);
    const darkModePreference = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const storedTheme = localStorage.getItem("theme");
    const initialDark = storedTheme
      ? storedTheme === "dark"
      : darkModePreference;
    setIsDark(initialDark);
    updateTheme(initialDark);

    // Check auth status
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      setUser(session?.user || null);
    };

    checkUser();

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
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

  const handleMobileMenuClick = () => {
    setIsMobileMenuOpen(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const renderAuthButton = (isMobile: boolean = false) => {
    const buttonClasses = isMobile
      ? "w-full flex items-center justify-center"
      : "flex items-center";

    return (
      <div className={buttonClasses}>
        {!isAuthenticated ? (
          <Link href="/auth/sign-in">
            <button
              className={`${
                isMobile ? "w-full" : ""
              } px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white transition-colors`}
            >
              Sign In
            </button>
          </Link>
        ) : (
          <div className="flex items-center gap-4">
            {user?.email && (
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {user.email}
              </span>
            )}
            <button
              onClick={handleSignOut}
              className={`${
                isMobile ? "w-full" : ""
              } px-4 py-2 rounded-lg border border-orange-600 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-colors`}
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderNavLink = (item: NavigationItem, mobile: boolean = false) => {
    const isActive = pathname === item.path;
    const Icon = item.icon;

    const baseClasses = mobile
      ? "block transition-all duration-200 ease-in-out"
      : "transition-all duration-200 ease-in-out";

    const activeClasses = isActive
      ? "text-orange-600 dark:text-orange-400"
      : "text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400";

    return (
      <Link
        key={item.name}
        href={item.path}
        className={`${baseClasses} ${activeClasses} group`}
        onClick={mobile ? handleMobileMenuClick : undefined}
      >
        <span className="flex items-center gap-2">
          <Icon
            className={`h-4 w-4 transition-transform duration-300 ease-in-out group-hover:scale-110 ${
              isActive ? "text-orange-600 dark:text-orange-400" : ""
            }`}
          />
          <span className={`${isActive ? "font-medium" : ""}`}>
            {item.name}
          </span>
        </span>
      </Link>
    );
  };

  if (!mounted) return null;

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="text-2xl font-bold text-gray-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 transition-colors group"
          >
            <span className="flex items-center gap-2">
              <Globe className="h-6 w-6 transition-transform duration-300 ease-in-out group-hover:scale-110" />
              Kifuliiru
            </span>
          </Link>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            )}
          </button>

          <div className="hidden md:flex items-center space-x-6">
            {getNavigationLinks().map((item) => renderNavLink(item))}

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 ease-in-out group"
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <Sun className="h-5 w-5 text-yellow-400 transition-transform duration-300 ease-in-out group-hover:rotate-180" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600 transition-transform duration-300 ease-in-out group-hover:-rotate-90" />
              )}
            </button>

            {renderAuthButton()}
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 space-y-4">
            {getNavigationLinks().map((item) => renderNavLink(item, true))}

            <button
              onClick={toggleTheme}
              className="w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 ease-in-out group"
              aria-label="Toggle dark mode"
            >
              <span className="flex items-center justify-center gap-2">
                {isDark ? (
                  <>
                    <Sun className="h-5 w-5 text-yellow-400 transition-transform duration-300 ease-in-out group-hover:rotate-180" />
                    <span className="text-gray-600 dark:text-gray-300">
                      Light Mode
                    </span>
                  </>
                ) : (
                  <>
                    <Moon className="h-5 w-5 text-gray-600 transition-transform duration-300 ease-in-out group-hover:-rotate-90" />
                    <span className="text-gray-600 dark:text-gray-300">
                      Dark Mode
                    </span>
                  </>
                )}
              </span>
            </button>

            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              {renderAuthButton(true)}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
