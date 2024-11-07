"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  MapPin,
  Mountain,
  Cloud,
  Trees,
  Home,
  Flag,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <motion.h2
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="text-3xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
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
    className="bg-white rounded-xl shadow-md p-6 mb-6 hover:shadow-xl transition-shadow duration-300"
  >
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 bg-indigo-50 rounded-lg">
        <Icon className="w-6 h-6 text-indigo-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
    </div>
    <p className="text-gray-600 leading-relaxed">{content}</p>
  </motion.div>
);

export default function IbufuliiruPage() {
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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      {/* Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 z-50 transition-all duration-300"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Hero Section */}
      <div className="relative h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-black/30" />
        <Image
          src="/hero-library.jpg"
          alt="Ibufuliiru landscape"
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
              Ibufuliiru
            </h1>
            <p className="text-2xl text-gray-100 mb-8">
              The ancestral homeland of the Bafuliiru people
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/90 hover:bg-white text-gray-800 px-8 py-3 rounded-full 
                       font-medium flex items-center gap-2 mx-auto transition-colors"
            >
              Explore More <ChevronRight className="w-4 h-4" />
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
              title="Overview"
              content="Ibufuliiru is located in the South Kivu province of the Democratic Republic of the Congo, characterized by its beautiful landscapes, fertile soil, and rich cultural heritage."
              icon={Home}
            />

            <div>
              <SectionTitle>Geographical Features</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    title: "Mountains",
                    description:
                      "Majestic mountain ranges providing natural boundaries",
                    icon: Mountain,
                    color: "from-blue-600 to-indigo-600",
                  },
                  {
                    title: "Climate",
                    description: "Tropical climate with distinct seasons",
                    icon: Cloud,
                    color: "from-teal-600 to-cyan-600",
                  },
                  {
                    title: "Forests",
                    description: "Dense forests with diverse flora and fauna",
                    icon: Trees,
                    color: "from-green-600 to-emerald-600",
                  },
                  {
                    title: "Sacred Sites",
                    description:
                      "Traditional and culturally significant locations",
                    icon: Flag,
                    color: "from-purple-600 to-pink-600",
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300"
                  >
                    <div
                      className={`p-3 bg-gradient-to-r ${feature.color} rounded-lg w-fit mb-4`}
                    >
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2 text-lg">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <SectionTitle>Major Cities and Regions</SectionTitle>
              <InfoCard
                title="Key Settlements"
                content="The region includes important cities such as Uvira, Lemera, and other significant cultural and economic centers that form the backbone of Bafuliiru society."
                icon={MapPin}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-md p-6 sticky top-6"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b">
                Quick Facts
              </h3>
              <div className="space-y-4">
                {[
                  { label: "Location", value: "South Kivu, DRC" },
                  { label: "Major City", value: "Uvira" },
                  { label: "Climate", value: "Tropical" },
                  { label: "Elevation", value: "1000-2000m" },
                ].map((fact, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <span className="text-gray-600">{fact.label}</span>
                    <span className="font-medium text-gray-800 bg-gray-100 px-3 py-1 rounded-full text-sm">
                      {fact.value}
                    </span>
                  </div>
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
                Cultural Significance
              </h3>
              <p className="leading-relaxed opacity-90">
                Ibufuliiru is more than just a geographical location; it is the
                heart of Bafuliiru culture, traditions, and identity. The land
                has been home to generations of Bafuliiru people and continues
                to play a vital role in their cultural practices and daily life.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
