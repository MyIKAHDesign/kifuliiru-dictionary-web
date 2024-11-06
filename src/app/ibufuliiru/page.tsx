"use client";
// pages/ibufuliiru.tsx
import React from "react";
import Image from "next/image";
import { MapPin, Mountain, Cloud, Trees, Home, Flag } from "lucide-react";

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

export default function IbufuliiruPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[400px] overflow-hidden">
        <Image
          src="/homeland-hero-section.jpg" // Use a relevant landscape image
          alt="Ibufuliiru landscape"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div className="max-w-3xl px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Ibufuliiru
            </h1>
            <p className="text-xl text-gray-200">
              The ancestral homeland of the Bafuliiru people
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
              title="Overview"
              content="Ibufuliiru is located in the South Kivu province of the Democratic Republic of the Congo, characterized by its beautiful landscapes, fertile soil, and rich cultural heritage."
              icon={Home}
            />

            <div>
              <SectionTitle>Geographical Features</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: "Mountains",
                    description:
                      "Majestic mountain ranges providing natural boundaries",
                    icon: Mountain,
                  },
                  {
                    title: "Climate",
                    description: "Tropical climate with distinct seasons",
                    icon: Cloud,
                  },
                  {
                    title: "Forests",
                    description: "Dense forests with diverse flora and fauna",
                    icon: Trees,
                  },
                  {
                    title: "Sacred Sites",
                    description:
                      "Traditional and culturally significant locations",
                    icon: Flag,
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
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Quick Facts
              </h3>
              <div className="space-y-3">
                {[
                  { label: "Location", value: "South Kivu, DRC" },
                  { label: "Major City", value: "Uvira" },
                  { label: "Climate", value: "Tropical" },
                  { label: "Elevation", value: "1000-2000m" },
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
                Cultural Significance
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Ibufuliiru is more than just a geographical location; it is the
                heart of Bafuliiru culture, traditions, and identity. The land
                has been home to generations of Bafuliiru people and continues
                to play a vital role in their cultural practices and daily life.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
