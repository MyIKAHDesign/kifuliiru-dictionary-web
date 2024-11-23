"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { SignedIn, UserButton, useAuth, useUser } from "@clerk/nextjs";
import {
  Sun,
  Moon,
  Menu,
  X,
  Home,
  BookOpen,
  Hash,
  Grid,
  Globe,
  Building,
  Users,
  LucideIcon,
  PenLine,
} from "lucide-react";
import DevelopmentBanner from "./DevelopmentBanner";

interface UserMetadata {
  quizCompleted?: boolean;
  role?: string;
}

interface NavigationItem {
  name: string;
  icon: LucideIcon;
  path: string;
}

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const handleContributorClick = async () => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      localStorage.setItem("postLoginRedirect", "/contribute");
      router.push("/sign-in");
      return;
    }

    const metadata = user?.publicMetadata as UserMetadata;

    if (metadata?.quizCompleted) {
      router.push("/contribute");
    } else {
      router.push("/quiz");
    }
  };

  const getNavigationLinks = (): NavigationItem[] => [
    { name: "Home", icon: Home, path: "/" },
    { name: "Dictionary", icon: BookOpen, path: "/dictionary" },
    { name: "Numbers", icon: Hash, path: "/numbers" },
    { name: "Categories", icon: Grid, path: "/categories" },
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
  }, []);

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      const redirectPath = localStorage.getItem("postLoginRedirect");
      if (redirectPath) {
        localStorage.removeItem("postLoginRedirect");
        const metadata = user.publicMetadata as UserMetadata;

        if (redirectPath === "/contribute" && !metadata?.quizCompleted) {
          router.push("/quiz");
        } else {
          router.push(redirectPath);
        }
      }
    }
  }, [isLoaded, isSignedIn, router, user]);

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
    <>
      <DevelopmentBanner />
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

              {/* Professional CTA Button with animation */}
              <button
                onClick={handleContributorClick}
                onMouseEnter={() => setIsButtonHovered(true)}
                onMouseLeave={() => setIsButtonHovered(false)}
                className="group relative px-6 py-2.5 rounded-lg overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                {/* Animated background effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 transition-transform duration-300 transform origin-left group-hover:scale-x-100 scale-x-0" />

                {/* Button ripple effect */}
                <div className="absolute inset-0 bg-white/20 transform origin-center transition-transform duration-500 scale-0 group-hover:scale-100 rounded-lg" />

                {/* Button content */}
                <div className="relative flex items-center justify-center gap-2 transform transition-transform duration-300 group-hover:scale-105">
                  <PenLine
                    className={`w-4 h-4 transition-all duration-300 transform ${
                      isButtonHovered ? "rotate-12" : ""
                    }`}
                  />
                  <span className="font-medium">Contribute</span>
                </div>
              </button>

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

              <SignedIn>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      userButtonBox: "hover:opacity-80 transition-opacity",
                      userButtonTrigger: "focus:shadow-none",
                    },
                  }}
                />
              </SignedIn>
            </div>
          </div>

          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 py-4 space-y-4">
              {getNavigationLinks().map((item) => renderNavLink(item, true))}

              {/* Mobile CTA Button */}
              <button
                onClick={handleContributorClick}
                className="w-full px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center justify-center gap-2">
                  <PenLine className="w-4 h-4" />
                  <span className="font-medium">Contribute</span>
                </div>
              </button>

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

              <SignedIn>
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700 flex justify-center">
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        userButtonBox: "hover:opacity-80 transition-opacity",
                        userButtonTrigger: "focus:shadow-none",
                      },
                    }}
                  />
                </div>
              </SignedIn>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Header;
