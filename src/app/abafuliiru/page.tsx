"use client";

import React from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
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

const InfoCard: React.FC<InfoCardProps> = ({ title, content, icon: Icon }) => (
  <Card className="mb-6 hover:shadow-lg transition-all duration-300">
    <CardContent className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <Icon className="h-6 w-6 text-indigo-600" />
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      </div>
      <p className="text-gray-600 leading-relaxed">{content}</p>
    </CardContent>
  </Card>
);

const KeyFacts: React.FC = () => {
  const facts: FactItem[] = [
    { title: "Population", value: "500,000+" },
    { title: "Region", value: "Eastern DRC" },
    { title: "Language", value: "Kifuliiru" },
    { title: "Major Cities", value: "Uvira, Lemera" },
  ];

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Key Facts</h3>
        <div className="space-y-3">
          {facts.map((fact, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-gray-600">{fact.title}</span>
              <span className="font-medium text-indigo-600">{fact.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
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
        <Card
          key={index}
          className="hover:shadow-lg transition-all duration-300"
        >
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <item.icon className="h-12 w-12 text-indigo-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-800">
              {item.title}
            </h3>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const AbafuliiruPage: React.FC = () => {
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <Header />
      <div className="bg-indigo-900 text-white">
        <div className="relative h-[300px] flex items-end justify-center pb-12 bg-gradient-to-b from-indigo-800 to-indigo-900">
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <Users className="w-32 h-32" />
          </div>
          <h1 className="text-4xl font-bold relative z-10">
            The Abafuliiru People
          </h1>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Tabs defaultValue="history" className="w-full">
          <TabsList className="w-full justify-start mb-8">
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              History
            </TabsTrigger>
            <TabsTrigger value="culture" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Culture
            </TabsTrigger>
            <TabsTrigger value="geography" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Geography
            </TabsTrigger>
            <TabsTrigger value="language" className="flex items-center gap-2">
              <Languages className="h-4 w-4" />
              Language
            </TabsTrigger>
          </TabsList>

          <TabsContent value="history">
            <InfoCard
              icon={History}
              title="Historical Background"
              content="The Abafuliiru people have a rich history dating back centuries, with a strong tradition of community leadership and cultural preservation. Their historical narrative is deeply intertwined with the development of the eastern regions of the Democratic Republic of Congo."
            />
            <KeyFacts />
            <InfoCard
              icon={Calendar}
              title="Timeline"
              content="Throughout their history, the Abafuliiru have maintained their cultural identity while adapting to changing times. Key historical events include their establishment in the current region, interactions with neighboring communities, and preservation of traditional governance systems."
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {geographyFeatures.map((feature, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <feature.icon className="h-8 w-8 text-indigo-600 mb-3" />
                    <h3 className="font-semibold text-gray-800 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.desc}</p>
                  </CardContent>
                </Card>
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
                <Card key={index}>
                  <CardContent className="p-6">
                    <feature.icon className="h-8 w-8 text-indigo-600 mb-3" />
                    <h3 className="font-semibold text-gray-800 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.desc}</p>
                  </CardContent>
                </Card>
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
