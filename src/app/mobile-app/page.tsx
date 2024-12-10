"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

export default function EnhancedMobileAppPage() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % screenshots.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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
    { value: "4.8", label: "App Store Rating" },
    { value: "2K+", label: "Active Users" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          className="absolute inset-0 bg-grid-white/[0.1]"
        />

        <div className="relative container mx-auto px-4 py-24">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex-1 text-white text-center lg:text-left"
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Kifuliiru in
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-white to-orange-200">
                  Your Pocket
                </span>
              </h1>

              <p className="text-xl md:text-2xl mb-8 text-orange-50">
                Explore, learn, and contribute to the Kifuliiru language
                anywhere, anytime.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group inline-flex items-center justify-center gap-2 bg-white text-orange-600 px-8 py-4 rounded-xl font-medium hover:bg-orange-50 transition-colors"
                >
                  <AppleIcon className="h-5 w-5" />
                  <span>App Store</span>
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group inline-flex items-center justify-center gap-2 bg-white text-orange-600 px-8 py-4 rounded-xl font-medium hover:bg-orange-50 transition-colors"
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
                    <div className="text-3xl font-bold mb-1">{stat.value}</div>
                    <div className="text-sm text-orange-100">{stat.label}</div>
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
              <div className="relative mx-auto w-[280px] h-[580px] bg-gray-900 rounded-[3rem] ring-1 ring-gray-900/10 shadow-2xl">
                <div className="absolute top-[0.8125rem] left-1/2 w-[9.75rem] h-[0.875rem] -translate-x-1/2 rounded-full bg-gray-800"></div>
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

              {/* Screenshot Caption */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-center text-white"
              >
                <h3 className="font-medium mb-1">
                  {screenshots[activeFeature].title}
                </h3>
                <p className="text-sm text-orange-100">
                  {screenshots[activeFeature].description}
                </p>
              </motion.div>
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
              className={`p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300`}
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
            Join thousands of users learning and preserving the Kifuliiru
            language with our mobile app.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white px-8 py-4 rounded-xl font-medium hover:from-orange-700 hover:to-orange-600 transition-all duration-300"
            >
              <AppleIcon className="h-5 w-5" />
              <span>Download for iOS</span>
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white px-8 py-4 rounded-xl font-medium hover:from-orange-700 hover:to-orange-600 transition-all duration-300"
            >
              <Download className="h-5 w-5" />
              <span>Download for Android</span>
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </motion.button>
          </div>

          {/* Testimonials/Ratings */}
          <div className="mt-16 flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-400" fill="currentColor" />
              <Star className="h-5 w-5 text-yellow-400" fill="currentColor" />
              <Star className="h-5 w-5 text-yellow-400" fill="currentColor" />
              <Star className="h-5 w-5 text-yellow-400" fill="currentColor" />
              <Star className="h-5 w-5 text-yellow-400" fill="currentColor" />
              <span className="ml-2 text-gray-600 dark:text-gray-400">
                4.8 on App Store
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-orange-500" />
              <span className="text-gray-600 dark:text-gray-400">
                2,000+ User Reviews
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
