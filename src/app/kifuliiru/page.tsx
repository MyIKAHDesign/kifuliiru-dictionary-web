"use client";

// pages/kifuliiru.tsx
import React from "react";
import Image from "next/image";
import { Book, GraduationCap, Languages, History } from "lucide-react";

// Components for reusability
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-2xl font-bold text-gray-800 mb-4">{children}</h2>
);

const InfoCard = ({
  title,
  content,
  icon: Icon,
}: {
  title: string;
  content: string;
  icon: React.ElementType;
}) => (
  <div className="bg-white rounded-xl shadow-md p-6 mb-6">
    <div className="flex items-center gap-3 mb-4">
      <Icon className="w-6 h-6 text-indigo-600" />
      <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
    </div>
    <p className="text-gray-600 leading-relaxed">{content}</p>
  </div>
);

export default function KifuliiruPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[400px] overflow-hidden">
        <Image
          src="/language-hero.jpg" // You should use a relevant image
          alt="Kifuliiru language"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div className="max-w-3xl px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Kifuliiru Language
            </h1>
            <p className="text-xl text-gray-200">
              Discover the rich linguistic heritage of the Bafuliiru people
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            <InfoCard
              title="About Kifuliiru"
              content="Kifuliiru is a Bantu language spoken by the Bafuliiru people in the South Kivu province of the Democratic Republic of the Congo. It serves as the primary means of cultural transmission and daily communication within the community."
              icon={Book}
            />

            <div>
              <SectionTitle>Language Features</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: "Pronunciation",
                    description:
                      "Distinctive tonal system with high and low tones",
                    icon: Languages,
                  },
                  {
                    title: "Grammar Structure",
                    description:
                      "Complex noun class system typical of Bantu languages",
                    icon: Book,
                  },
                  {
                    title: "Oral Tradition",
                    description: "Rich history of storytelling and proverbs",
                    icon: History,
                  },
                  {
                    title: "Modern Usage",
                    description: "Actively used in education and daily life",
                    icon: GraduationCap,
                  },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-6 shadow-sm"
                  >
                    <feature.icon className="w-6 h-6 text-indigo-600 mb-3" />
                    <h3 className="font-semibold text-gray-800 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <SectionTitle>Learning Resources</SectionTitle>
              <InfoCard
                title="Educational Materials"
                content="Access a variety of learning materials including dictionaries, grammar guides, and interactive lessons to help you learn and understand Kifuliiru."
                icon={GraduationCap}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Quick Facts
              </h3>
              <div className="space-y-3">
                {[
                  { label: "Language Family", value: "Bantu" },
                  { label: "Primary Region", value: "South Kivu, DRC" },
                  { label: "Speakers", value: "500,000+" },
                  { label: "Writing System", value: "Latin script" },
                ].map((fact, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-gray-600">{fact.label}</span>
                    <span className="font-medium text-gray-800">
                      {fact.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Cultural Importance
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Kifuliiru plays a vital role in preserving and transmitting
                cultural knowledge, traditions, and values within the Bafuliiru
                community. It is integral to ceremonies, storytelling, and daily
                life.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
