"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import {
  History,
  Users,
  MapPin,
  Languages,
  Mountain,
  Waves,
  TreePine,
  Music,
  Book,
  Pen,
  Globe,
  Smartphone,
  Crown,
  Calendar,
  Brush,
  BookOpen,
} from "lucide-react";

// Interfaces
interface InfoCardProps {
  title: string;
  content: string;
  icon: LucideIcon;
  delay?: number;
}

interface FactItem {
  title: string;
  value: string;
}

interface CultureItem {
  title: string;
  icon: LucideIcon;
}

interface FeatureItem {
  title: string;
  icon: LucideIcon;
  desc: string;
}

// Components
const InfoCard: React.FC<InfoCardProps> = ({
  title,
  content,
  icon: Icon,
  delay = 0,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
  >
    <Card className="mb-6 hover:shadow-lg transition-all duration-300 overflow-hidden group">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            initial={{ rotate: 0 }}
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg"
          >
            <Icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </motion.div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            {title}
          </h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          {content}
        </p>
      </CardContent>
    </Card>
  </motion.div>
);

const KeyFacts: React.FC = () => {
  const facts: FactItem[] = [
    { title: "Population", value: "500,000+" },
    { title: "Region", value: "Eastern DRC" },
    { title: "Language", value: "Kifuliiru" },
    { title: "Major Cities", value: "Uvira, Lemera" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <Card className="mb-6 overflow-hidden">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Key Facts
          </h3>
          <div className="space-y-3">
            {facts.map((fact, index) => (
              <motion.div
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: 5 }}
                className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <span className="text-gray-600 dark:text-gray-400">
                  {fact.title}
                </span>
                <span className="font-medium bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full">
                  {fact.value}
                </span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const CultureGrid: React.FC = () => {
  const items: CultureItem[] = [
    { title: "Traditional Dance", icon: Music },
    { title: "Ceremonies", icon: Crown },
    { title: "Crafts", icon: Brush },
    { title: "Storytelling", icon: BookOpen },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -5 }}
        >
          <Card className="hover:shadow-lg transition-all duration-300 overflow-hidden group">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <item.icon className="h-12 w-12 text-indigo-600 dark:text-indigo-400 mb-4 transform transition-transform group-hover:scale-110" />
              </motion.div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {item.title}
              </h3>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

const AbafuliiruPage: React.FC = () => {
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

  const geographyFeatures: FeatureItem[] = [
    {
      title: "Mountains",
      icon: Mountain,
      desc: "Sacred peaks including Mount Mitumba",
    },
    {
      title: "Rivers",
      icon: Waves,
      desc: "Life-giving Ruzizi River and tributaries",
    },
    {
      title: "Forests",
      icon: TreePine,
      desc: "Ancient medicinal forest groves",
    },
  ];

  const languageFeatures: FeatureItem[] = [
    {
      title: "Oral Traditions",
      icon: Book,
      desc: "Centuries of stories and wisdom",
    },
    {
      title: "Writing System",
      icon: Pen,
      desc: "Modern Kifuliiru transcription",
    },
    {
      title: "Regional Variations",
      icon: Globe,
      desc: "Rich dialectal heritage",
    },
    {
      title: "Modern Usage",
      icon: Smartphone,
      desc: "Digital language preservation",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 z-50 transition-all duration-300"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Hero Section */}
      <div className="bg-indigo-900 text-white relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative h-[400px] flex items-end justify-center pb-12 
                     bg-gradient-to-b from-indigo-800 to-indigo-900"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 10, repeat: Infinity }}
              className="opacity-10"
            >
              <Users className="w-64 h-64" />
            </motion.div>
          </div>
          <div className="text-center z-10">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-5xl font-bold mb-4"
            >
              The Abafuliiru People
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-indigo-200"
            >
              Discover our rich cultural heritage and traditions
            </motion.p>
          </div>
        </motion.div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Tabs defaultValue="history" className="w-full">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="sticky top-4 z-40 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-xl shadow-lg p-2 mb-8"
          >
            <TabsList className="w-full flex justify-start gap-2 p-1 bg-gray-100/50 dark:bg-gray-800/50 rounded-lg">
              {[
                { value: "history", icon: History, label: "History" },
                { value: "culture", icon: Users, label: "Culture" },
                { value: "geography", icon: MapPin, label: "Geography" },
                { value: "language", icon: Languages, label: "Language" },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className={`
            flex items-center gap-2 px-4 py-2.5 rounded-lg flex-1
            font-medium text-sm
            transition-all duration-300 ease-in-out
            data-[state=inactive]:bg-transparent
            data-[state=inactive]:text-gray-600
            data-[state=inactive]:dark:text-gray-400
            data-[state=inactive]:hover:bg-white/60
            data-[state=inactive]:dark:hover:bg-gray-800/60
            data-[state=inactive]:hover:text-gray-900
            data-[state=inactive]:dark:hover:text-gray-200
            data-[state=active]:bg-white
            data-[state=active]:dark:bg-gray-800
            data-[state=active]:text-indigo-600
            data-[state=active]:dark:text-indigo-400
            data-[state=active]:shadow-sm
            data-[state=active]:scale-[1.02]
            hover:scale-[1.02]
            active:scale-[0.98]
            outline-none
            ring-offset-2
            ring-offset-white
            dark:ring-offset-gray-900
            focus-visible:ring-2
            focus-visible:ring-indigo-500
            dark:focus-visible:ring-indigo-400
          `}
                >
                  <tab.icon className="h-4 w-4 flex-shrink-0 transition-transform group-hover:scale-110" />
                  <span className="truncate">{tab.label}</span>

                  <span className="ml-auto flex h-2 w-2">
                    <span
                      className={`
              animate-pulse h-full w-full rounded-full
              data-[state=active]:bg-indigo-600/50
              dark:data-[state=active]:bg-indigo-400/50
            `}
                    />
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </motion.div>

          <TabsContent
            value="history"
            className="space-y-6 animate-in slide-in-from-bottom duration-300 ease-in-out"
          >
            <InfoCard
              icon={History}
              title="Historical Background"
              content="The Abafuliiru people have a rich history dating back centuries, with a strong tradition of community leadership and cultural preservation. Their historical narrative is deeply intertwined with the development of the eastern regions of the Democratic Republic of Congo."
              delay={0.1}
            />
            <KeyFacts />
            <InfoCard
              icon={Calendar}
              title="Timeline"
              content="Throughout their history, the Abafuliiru have maintained their cultural identity while adapting to changing times. Key historical events include their establishment in the current region, interactions with neighboring communities, and preservation of traditional governance systems."
              delay={0.2}
            />
          </TabsContent>

          <TabsContent
            value="culture"
            className="space-y-6 animate-in slide-in-from-bottom duration-300 ease-in-out"
          >
            <InfoCard
              icon={Users}
              title="Cultural Heritage"
              content="The Abafuliiru people maintain strong cultural traditions that have been passed down through generations. Their culture is characterized by rich oral traditions, ceremonial practices, and community-centered values."
            />
            <CultureGrid />
            <InfoCard
              icon={Crown}
              title="Traditions"
              content="Important ceremonies and celebrations mark significant life events and seasonal changes in Abafuliiru culture. These include harvest festivals, initiation ceremonies, and community gatherings that strengthen social bonds."
            />
          </TabsContent>

          <TabsContent
            value="geography"
            className="space-y-6 animate-in slide-in-from-bottom duration-300 ease-in-out"
          >
            <InfoCard
              icon={MapPin}
              title="Location"
              content="The Abafuliiru people primarily inhabit the eastern regions of the Democratic Republic of Congo, particularly in and around the South Kivu province. Their traditional lands include mountainous areas and fertile valleys."
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {geographyFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <feature.icon className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mb-3" />
                      </motion.div>
                      <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {feature.desc}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent
            value="language"
            className="space-y-6 animate-in slide-in-from-bottom duration-300 ease-in-out"
          >
            <InfoCard
              icon={Languages}
              title="Linguistics"
              content="The Kifuliiru language, spoken by the Abafuliiru people, belongs to the Bantu language family. It features a rich vocabulary and complex grammatical structure that reflects the community's cultural depth."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {languageFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <feature.icon className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mb-3" />
                      </motion.div>
                      <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {feature.desc}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Community Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 p-8 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Join Our Community
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Connect with others interested in Abafuliiru culture and
              contribute to preserving our heritage for future generations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Learn Kifuliiru",
                desc: "Access language learning resources and connect with native speakers",
                icon: Book,
              },
              {
                title: "Cultural Events",
                desc: "Participate in traditional ceremonies and community gatherings",
                icon: Users,
              },
              {
                title: "Digital Archive",
                desc: "Contribute to our growing collection of cultural documentation",
                icon: Globe,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              >
                <item.icon className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-indigo-900 text-white py-16 mt-12"
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Help Preserve Our Heritage
          </h2>
          <p className="text-indigo-200 mb-8 max-w-2xl mx-auto">
            Join us in documenting and preserving the rich cultural heritage of
            the Abafuliiru people for future generations.
          </p>
          <button className="bg-white text-indigo-900 px-8 py-3 rounded-full font-semibold hover:bg-indigo-50 transition-colors duration-300">
            Get Involved
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AbafuliiruPage;
