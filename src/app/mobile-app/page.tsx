"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Globe2,
  BookOpen,
  Hash,
  Users,
  Map,
  Download,
  AppleIcon,
  Database,
  ChevronRight,
  Star,
  MessageSquare,
} from "lucide-react";
import { Toaster } from "../components/ui/toaster";

export default function MobileAppShowcase() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [, setIsVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % screenshots.length);
    }, 5000);

    // Check system dark mode preference
    if (typeof window !== "undefined") {
      setIsDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const handleComingSoon = (feature: string) => {
    toast.info(`${feature} coming soon! Stay tuned for updates.`, {
      position: "bottom-center",
      duration: 3000,
      className: isDarkMode ? "dark" : "",
    });
  };

  const screenshots = [
    {
      title: "Dictionary",
      description: "Search and explore Kifuliiru words with ease",
      image: "/api/placeholder/260/540",
    },
    {
      title: "Learning",
      description: "Interactive lessons and quizzes",
      image: "/api/placeholder/260/540",
    },
    {
      title: "Culture",
      description: "Rich cultural content and stories",
      image: "/api/placeholder/260/540",
    },
  ];

  const features = [
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Offline Dictionary",
      description:
        "Access the complete Kifuliiru dictionary even without internet connection.",
      color: "orange",
    },
    {
      icon: <Globe2 className="h-6 w-6" />,
      title: "Multi-language Support",
      description:
        "Translations in English, French, and Kiswahili with native audio.",
      color: "blue",
    },
    {
      icon: <Hash className="h-6 w-6" />,
      title: "Number System",
      description: "Learn to count and use numbers in Kifuliiru interactively.",
      color: "purple",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Cultural Content",
      description: "Explore Bafuliiru culture through rich multimedia content.",
      color: "green",
    },
    {
      icon: <Map className="h-6 w-6" />,
      title: "Community Map",
      description: "Discover Bafuliiru villages and cultural landmarks.",
      color: "pink",
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: "Regular Updates",
      description: "Continuously updated with new content from our community.",
      color: "indigo",
    },
  ];

  const stats = [
    { value: "10K+", label: "Downloads" },
    { value: "4.8", label: "App Rating" },
    { value: "2K+", label: "Active Users" },
  ];

  return (
    <div
      className={`min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300`}
    >
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-400/90 to-orange-500/90 dark:from-orange-600/80 dark:to-orange-700/80">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          className="absolute inset-0 bg-grid-white/[0.1] dark:bg-grid-white/[0.05]"
        />

        <div className="relative container mx-auto px-4 py-24">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex-1 text-center lg:text-left"
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-white dark:text-gray-100">
                Kifuliiru in
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-white to-orange-100 dark:from-orange-100 dark:to-orange-200">
                  Your Pocket
                </span>
              </h1>

              <p className="text-xl md:text-2xl mb-8 text-orange-50 dark:text-orange-100">
                Explore, learn, and contribute to the Kifuliiru language
                anywhere, anytime.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleComingSoon("iOS App")}
                  className="group inline-flex items-center justify-center gap-2 bg-white/90 dark:bg-white/95 text-orange-600 px-8 py-4 rounded-xl font-medium hover:bg-white transition-colors"
                >
                  <AppleIcon className="h-5 w-5" />
                  <span>App Store</span>
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleComingSoon("Android App")}
                  className="group inline-flex items-center justify-center gap-2 bg-white/90 dark:bg-white/95 text-orange-600 px-8 py-4 rounded-xl font-medium hover:bg-white transition-colors"
                >
                  <Download className="h-5 w-5" />
                  <span>Play Store</span>
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </motion.button>
              </div>

              {/* App Stats */}
              <div className="mt-12 grid grid-cols-3 gap-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.2 }}
                    className="text-center"
                  >
                    <div className="text-3xl font-bold mb-1 text-white dark:text-gray-100">
                      {stat.value}
                    </div>
                    <div className="text-sm text-orange-100 dark:text-orange-200">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Phone Mockup */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex-1 relative"
            >
              <div className="relative mx-auto w-[280px] h-[580px] bg-gray-900 dark:bg-gray-950 rounded-[3rem] ring-1 ring-gray-900/10 dark:ring-gray-700/30 shadow-2xl">
                <div className="absolute top-[0.8125rem] left-1/2 w-[9.75rem] h-[0.875rem] -translate-x-1/2 rounded-full bg-gray-800 dark:bg-gray-700"></div>
                <div className="absolute top-[0.875rem] bottom-[0.875rem] left-[0.875rem] right-[0.875rem] rounded-[2.25rem] overflow-hidden bg-white dark:bg-gray-800">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={activeFeature}
                      src={screenshots[activeFeature].image}
                      alt={screenshots[activeFeature].title}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="w-full h-full object-cover"
                    />
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-24">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center mb-16 text-gray-900 dark:text-white"
        >
          Powerful Features for Language Learning
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => handleComingSoon(feature.title)}
              className="cursor-pointer p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div
                className={`w-12 h-12 bg-${feature.color}-100 dark:bg-${feature.color}-900/30 rounded-xl flex items-center justify-center text-${feature.color}-600 dark:text-${feature.color}-400 mb-4`}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Download CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-white dark:bg-gray-800"
      >
        <div className="container mx-auto px-4 py-24 text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
            Start Your Journey Today
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            Join the community of users learning and preserving the Kifuliiru
            language.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleComingSoon("iOS App")}
              className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500/90 to-orange-600/90 dark:from-orange-500 dark:to-orange-600 text-white px-8 py-4 rounded-xl font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300"
            >
              <AppleIcon className="h-5 w-5" />
              <span>Download for iOS</span>
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleComingSoon("Android App")}
              className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500/90 to-orange-600/90 dark:from-orange-500 dark:to-orange-600 text-white px-8 py-4 rounded-xl font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300"
            >
              <Download className="h-5 w-5" />
              <span>Download for Android</span>
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </motion.button>
          </div>

          {/* Testimonials/Ratings */}
          <div className="mt-16 flex flex-wrap justify-center gap-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              onClick={() => handleComingSoon("App Store Reviews")}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Star className="h-5 w-5 text-yellow-400" fill="currentColor" />
              <Star className="h-5 w-5 text-yellow-400" fill="currentColor" />
              <Star className="h-5 w-5 text-yellow-400" fill="currentColor" />
              <Star className="h-5 w-5 text-yellow-400" fill="currentColor" />
              <Star className="h-5 w-5 text-yellow-400" fill="currentColor" />
              <span className="ml-2 text-gray-600 dark:text-gray-400">
                App Rating Coming Soon
              </span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              onClick={() => handleComingSoon("User Reviews")}
              className="flex items-center gap-2 cursor-pointer"
            >
              <MessageSquare className="h-5 w-5 text-orange-500" />
              <span className="text-gray-600 dark:text-gray-400">
                Reviews Coming Soon
              </span>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Newsletter Signup */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            Stay Updated
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Be the first to know when our mobile app launches. Get exclusive
            access and updates.
          </p>
          <div className="max-w-md mx-auto">
            <div className="flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleComingSoon("Newsletter Signup")}
                className="px-6 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
              >
                Notify Me
              </motion.button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Kifuliiru Mobile App
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Preserving language, connecting culture.
              </p>
            </div>
            <div className="flex gap-6">
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={() => handleComingSoon("Social Media")}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <span className="sr-only">Facebook</span>
                <svg
                  className="w-6 h-6 text-gray-600 dark:text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm3 8h-1.35c-.538 0-.65.221-.65.778V10h2l-.209 2H13v7h-3v-7H8v-2h2V7.692C10 5.923 10.931 5 13.029 5H15v3z"></path>
                </svg>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={() => handleComingSoon("Social Media")}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <span className="sr-only">Twitter</span>
                <svg
                  className="w-6 h-6 text-gray-600 dark:text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"></path>
                </svg>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={() => handleComingSoon("Social Media")}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <span className="sr-only">Instagram</span>
                <svg
                  className="w-6 h-6 text-gray-600 dark:text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.897 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.897-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"></path>
                </svg>
              </motion.button>
            </div>
          </div>
          <div className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Kifuliiru. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Sonner Toast Container */}
      <Toaster />
    </div>
  );
}
