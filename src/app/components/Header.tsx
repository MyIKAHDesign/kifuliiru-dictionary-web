import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";
import DevelopmentBanner from "./DevelopmentBanner";

const Header = () => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Navigation links with icons remain the same
  const navigationLinks = [
    { name: "Home", icon: Home, path: "/" },
    { name: "Dictionary", icon: BookOpen, path: "/dictionary" },
    { name: "Numbers", icon: Hash, path: "/numbers" },
    { name: "Categories", icon: Grid, path: "/categories" },
    { name: "Contribute", icon: PenSquare, path: "/contribute" },
    { name: "Kifuliiru", icon: Globe, path: "/kifuliiru" },
    { name: "Ibufuliiru", icon: Building, path: "/ibufuliiru" },
    { name: "Abafuliiru", icon: Users, path: "/abafuliiru" },
  ];

  // Rest of your existing useEffect, updateTheme, toggleTheme, and other functions remain the same
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

  // Your existing renderNavLink function remains the same
  const renderNavLink = (
    item: (typeof navigationLinks)[0],
    mobile: boolean = false
  ) => {
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

  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Simple Construction Banner */}

      {/* Development Banner */}
      <DevelopmentBanner />
      {/* Your existing header code remains the same */}
      <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
        {/* Rest of your existing header JSX remains exactly the same */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link
              href="/"
              className="text-2xl font-bold text-gray-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 transition-colors group"
            >
              <span className="flex items-center gap-2">
                <Globe className="h-6 w-6 transition-transform duration-300 ease-in-out group-hover:scale-110" />
                Kifuliiru
              </span>
            </Link>

            {/* Mobile menu button */}
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

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navigationLinks.map((item) => renderNavLink(item))}

              {/* Theme toggle button */}
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
            </div>
          </div>

          {/* Mobile menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 py-4 space-y-4">
              {navigationLinks.map((item) => renderNavLink(item, true))}

              {/* Mobile theme toggle */}
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
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Header;
