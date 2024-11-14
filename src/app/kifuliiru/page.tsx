"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Book,
  GraduationCap,
  Languages,
  PlayCircle,
  Music,
  Heart,
  BookOpen,
  Lightbulb,
  Scroll,
  Palmtree,
} from "lucide-react";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <motion.h2
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="text-3xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
  >
    {children}
  </motion.h2>
);

const InfoCard = ({
  title,
  content,
  icon: Icon,
  delay = 0,
}: {
  title: string;
  content: string;
  icon: React.ElementType;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
    className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6 hover:shadow-xl transition-all duration-300"
  >
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
        <Icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        {title}
      </h3>
    </div>
    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
      {content}
    </p>
  </motion.div>
);

export default function KifuliiruPage() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = window.scrollY;
      setScrollProgress((currentProgress / totalScroll) * 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const languageFeatures = [
    {
      title: "Phonology",
      description:
        "Rich tonal system with high, low, and falling tones that distinguish meaning. Features unique consonant clusters and vowel harmony patterns.",
      icon: Languages,
      color: "from-blue-600 to-indigo-600",
    },
    {
      title: "Grammar Structure",
      description:
        "Complex noun class system with 15 classes, extensive verb conjugation patterns, and agglutinative morphology.",
      icon: Book,
      color: "from-teal-600 to-cyan-600",
    },
    {
      title: "Oral Literature",
      description:
        "Rich tradition of proverbs (Migani), riddles (Bibuuzo), folktales (Ngano), and praise poetry (Byembo).",
      icon: BookOpen,
      color: "from-purple-600 to-pink-600",
    },
    {
      title: "Modern Usage",
      description:
        "Growing digital presence with educational resources and online learning platforms.",
      icon: GraduationCap,
      color: "from-green-600 to-emerald-600",
    },
  ];

  const culturalExpressions = [
    {
      title: "Traditional Songs",
      icon: Music,
      examples: [
        "Lwimbo lwa Buhya (Wedding Songs)",
        "Bikuma bya Bayinga (Hunting Songs)",
        "Byembo bya Bana (Children's Songs)",
        "Ngano za Kare (Ancient Tales)",
      ],
    },
    {
      title: "Ceremonial Language",
      icon: Scroll,
      examples: [
        "Marriage Blessings",
        "Naming Ceremonies",
        "Harvest Rituals",
        "Sacred Prayers",
      ],
    },
    {
      title: "Nature Terms",
      icon: Palmtree,
      examples: [
        "Plant Names",
        "Weather Patterns",
        "Animal Behaviors",
        "Seasonal Changes",
      ],
    },
    {
      title: "Proverbs & Wisdom",
      icon: Lightbulb,
      examples: [
        "Life Lessons",
        "Moral Teachings",
        "Community Values",
        "Traditional Wisdom",
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 z-50 transition-all duration-300"
        style={{ width: `${scrollProgress}%` }}
      />

      <Header />

      {/* Hero Section */}
      <div className="relative h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30" />
        <Image
          src="/hero-library.jpg"
          alt="Kifuliiru language"
          fill
          className="object-cover"
          priority
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 flex items-center justify-center text-center"
        >
          <div className="max-w-3xl px-4">
            <h1 className="text-6xl font-bold text-white mb-6 drop-shadow-lg">
              Kifuliiru Language
            </h1>
            <p className="text-2xl text-gray-100 mb-4">
              A Living Bridge to Bafuliiru Heritage
            </p>
            <p className="text-xl text-gray-200 mb-8">
              Explore one of Africa&apos;s most fascinating Bantu languages
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/90 hover:bg-white text-gray-800 px-8 py-3 rounded-full 
                       font-medium flex items-center gap-2 mx-auto transition-colors"
            >
              Begin Learning <PlayCircle className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-12">
            <InfoCard
              title="Living Heritage"
              content="Kifuliiru is more than just a means of communication - it's a living repository of Bafuliiru wisdom, philosophy, and worldview. This Bantu language has evolved over centuries, developing sophisticated systems for expressing complex ideas, relationships, and cultural concepts."
              icon={Heart}
            />

            <div>
              <SectionTitle>Language Features</SectionTitle>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {languageFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -5 }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300"
                  >
                    <div
                      className={`p-3 bg-gradient-to-r ${feature.color} rounded-lg w-fit mb-4`}
                    >
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 text-lg">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            <div>
              <SectionTitle>Cultural Expressions</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {culturalExpressions.map((category, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -5 }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <category.icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                      <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                        {category.title}
                      </h3>
                    </div>
                    <ul className="space-y-2">
                      {category.examples.map((example, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-gray-600 dark:text-gray-400"
                        >
                          <div className="w-1.5 h-1.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
                          <span>{example}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sticky top-6"
            >
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6 pb-2 border-b dark:border-gray-700">
                Quick Facts
              </h3>
              <div className="space-y-4">
                {[
                  { label: "Language Family", value: "Bantu" },
                  { label: "Primary Region", value: "South Kivu, DRC" },
                  { label: "Speakers", value: "500,000+" },
                  { label: "Writing System", value: "Latin script" },
                ].map((fact, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ x: 5 }}
                    className="flex justify-between items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
                  >
                    <span className="text-gray-600 dark:text-gray-400">
                      {fact.label}
                    </span>
                    <span className="font-medium text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm">
                      {fact.value}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-md p-6 text-white"
            >
              <h3 className="text-xl font-semibold mb-4">
                Cultural Importance
              </h3>
              <p className="leading-relaxed opacity-90">
                Kifuliiru plays a vital role in preserving and transmitting
                cultural knowledge, traditions, and values within the Bafuliiru
                community. It is integral to ceremonies, storytelling, and daily
                life.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
