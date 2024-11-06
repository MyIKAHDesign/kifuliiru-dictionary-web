"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import {
  Search,
  Book,
  Plus,
  Volume2,
  ArrowRight,
  Sparkles,
  Users,
  Calendar,
} from "lucide-react";

interface FeaturedWord {
  word: string;
  phonetic: string;
  meaning: string;
  description: string;
  type: string;
  usageCount: number;
}

interface QuickAction {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  color: string;
}

const DictionaryHome = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const quickActions: QuickAction[] = [
    {
      title: "Browse Dictionary",
      description:
        "Access over 5,000+ words with detailed translations and cultural context",
      icon: Book,
      href: "/browse",
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
    },
    {
      title: "Add New Entry",
      description:
        "Contribute to preserving Kifuliiru language by adding new words and meanings",
      icon: Plus,
      href: "/entry/new",
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
    },
    {
      title: "Listen & Learn",
      description:
        "Explore native pronunciations and audio recordings in different dialects",
      icon: Volume2,
      href: "/audio",
      color: "bg-gradient-to-br from-emerald-500 to-emerald-600",
    },
  ];

  const featuredWords: FeaturedWord[] = [
    {
      word: "akasiisa",
      phonetic: "/akasiːsa/",
      meaning: "traditional dance",
      description: "A ceremonial dance performed during harvest festivals",
      type: "Cultural",
      usageCount: 1234,
    },
    {
      word: "umuganho",
      phonetic: "/umugaɲo/",
      meaning: "community gathering",
      description:
        "A formal gathering of community members for important discussions",
      type: "Social",
      usageCount: 856,
    },
    {
      word: "ubuzima",
      phonetic: "/ubuzima/",
      meaning: "life/health",
      description: "Used in greetings and well-wishes",
      type: "Common",
      usageCount: 2341,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 pb-32 pt-16">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-indigo-600/90" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Kifuliiru Dictionary
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-200">
              Explore and preserve the richness of the Kifuliiru language and
              culture through our comprehensive digital dictionary
            </p>

            {/* Search Bar */}
            <div className="mt-10">
              <div className="relative flex max-w-xl mx-auto">
                <div className="relative flex-grow">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search in Kifuliiru, English, French, or Kiswahili..."
                    className="block w-full rounded-lg border-0 py-6 pl-10 text-gray-900 shadow-xl placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-white/20"
                  />
                </div>
                <Button className="ml-3 px-8 h-auto bg-white text-blue-600 hover:bg-gray-100 rounded-lg">
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 -mt-32 mx-auto max-w-7xl px-6 lg:px-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {quickActions.map((action, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl transition-all duration-300 bg-white backdrop-blur-xl bg-white/50 border-0 overflow-hidden"
            >
              <CardContent className="p-8">
                <div
                  className={`${action.color} w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <action.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {action.title}
                </h3>
                <p className="text-gray-600 mb-6 line-clamp-2">
                  {action.description}
                </p>
                <Button
                  variant="link"
                  className="p-0 text-blue-600 group-hover:text-blue-700 flex items-center gap-2"
                >
                  Learn more <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured Words */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-blue-600" />
                Featured Words
              </h2>
              <p className="text-gray-600 mt-1">
                Discover commonly used and culturally significant words
              </p>
            </div>
            <Button
              variant="outline"
              className="hidden sm:flex items-center gap-2"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredWords.map((word, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 bg-white overflow-hidden"
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {word.word}
                      </h3>
                      <p className="text-sm text-gray-500 font-mono">
                        {word.phonetic}
                      </p>
                    </div>
                    <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium">
                      {word.type}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{word.meaning}</p>
                  <p className="text-sm text-gray-500">{word.description}</p>
                  <div className="mt-4 pt-4 border-t text-sm text-gray-500 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {word.usageCount.toLocaleString()} uses
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 md:p-12 shadow-xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                value: "5,234+",
                label: "Dictionary Entries",
                icon: Book,
                description: "Comprehensive word collection",
              },
              {
                value: "1,890+",
                label: "Audio Recordings",
                icon: Volume2,
                description: "Native pronunciations",
              },
              {
                value: "456",
                label: "Contributors",
                icon: Users,
                description: "Active community members",
              },
              {
                value: "12.5K+",
                label: "Monthly Searches",
                icon: Calendar,
                description: "Growing user engagement",
              },
            ].map((stat, index) => (
              <div key={index} className="text-white">
                <div className="flex items-center gap-2 text-blue-200 mb-2">
                  <stat.icon className="h-5 w-5" />
                  {stat.label}
                </div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-blue-200">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DictionaryHome;
