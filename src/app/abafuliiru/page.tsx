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
import Header from "../components/Header";
import Footer from "../components/Footer";

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
            className="p-2 bg-indigo-50 rounded-lg"
          >
            <Icon className="h-6 w-6 text-indigo-600" />
          </motion.div>
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        </div>
        <p className="text-gray-600 leading-relaxed">{content}</p>
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
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
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
                className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50"
              >
                <span className="text-gray-600">{fact.title}</span>
                <span className="font-medium bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">
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
                <item.icon className="h-12 w-12 text-indigo-600 mb-4 transform transition-transform group-hover:scale-110" />
              </motion.div>
              <h3 className="text-lg font-semibold text-gray-800">
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
      desc: "Home to significant mountain ranges",
    },
    { title: "Rivers", icon: Waves, desc: "Major river systems" },
    { title: "Forests", icon: TreePine, desc: "Dense forest regions" },
  ];

  const languageFeatures: FeatureItem[] = [
    {
      title: "Oral Traditions",
      icon: Book,
      desc: "Rich storytelling heritage",
    },
    {
      title: "Writing System",
      icon: Pen,
      desc: "Modern transcription methods",
    },
    { title: "Regional Variations", icon: Globe, desc: "Dialectal diversity" },
    {
      title: "Modern Usage",
      icon: Smartphone,
      desc: "Contemporary applications",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 z-50 transition-all duration-300"
        style={{ width: `${scrollProgress}%` }}
      />

      <Header />

      {/* Enhanced Hero Section */}
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
          >
            <TabsList className="w-full justify-start mb-8">
              {[
                { value: "history", icon: History, label: "History" },
                { value: "culture", icon: Users, label: "Culture" },
                { value: "geography", icon: MapPin, label: "Geography" },
                { value: "language", icon: Languages, label: "Language" },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex items-center gap-2 transition-all duration-300"
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </motion.div>

          <TabsContent value="history">
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

          <TabsContent value="culture">
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

          <TabsContent value="geography">
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
                        <feature.icon className="h-8 w-8 text-indigo-600 mb-3" />
                      </motion.div>
                      <h3 className="font-semibold text-gray-800 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">{feature.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="language">
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
                        <feature.icon className="h-8 w-8 text-indigo-600 mb-3" />
                      </motion.div>
                      <h3 className="font-semibold text-gray-800 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">{feature.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default AbafuliiruPage;
