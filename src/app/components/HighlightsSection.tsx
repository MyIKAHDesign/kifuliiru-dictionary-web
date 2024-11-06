import { useState, useEffect } from "react";
import {
  Star,
  TrendingUp,
  ArrowRight,
  Sparkles,
  LucideIcon,
} from "lucide-react";

interface HighlightItem {
  id: string;
  title: string;
  content: string;
  translation?: string;
  example?: string;
  icon: LucideIcon;
  gradientFrom: string;
  gradientTo: string;
}

export default function HighlightsSection() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const highlights: HighlightItem[] = [
    {
      id: "word-of-day",
      title: "Word of the Day",
      content: "Karisimbi",
      translation: "Mountain of the gods",
      example: "Karisimbi yaliha bwenêne",
      icon: Star,
      gradientFrom: "from-purple-500",
      gradientTo: "to-indigo-600",
    },
    {
      id: "popular",
      title: "Popular Category",
      content: "Common Phrases",
      example: "Explore everyday expressions",
      icon: TrendingUp,
      gradientFrom: "from-amber-500",
      gradientTo: "to-orange-600",
    },
  ];

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <div
          className={`
            text-center mb-12 transform transition-all duration-700 ease-out
            ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }
          `}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-amber-500" />
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
              Daily Highlights
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover new words and expressions in Kifuliiru every day
          </p>
        </div>

        {/* Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {highlights.map((item, index) => {
            const Icon = item.icon;
            const isHovered = hoveredCard === item.id;

            return (
              <div
                key={item.id}
                className="relative group h-full"
                onMouseEnter={() => setHoveredCard(item.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  transitionDelay: `${index * 100}ms`,
                }}
              >
                {/* Card */}
                <div
                  className={`
                    relative overflow-hidden rounded-2xl transition-all duration-500 h-full
                    ${
                      isVisible
                        ? "translate-y-0 opacity-100"
                        : "translate-y-16 opacity-0"
                    }
                  `}
                >
                  <div
                    className={`
                    absolute inset-0 bg-gradient-to-br ${item.gradientFrom} ${
                      item.gradientTo
                    }
                    opacity-10 transition-opacity duration-300
                    ${isHovered ? "opacity-20" : ""}
                  `}
                  />

                  <div className="relative p-8 h-full flex flex-col">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6">
                      <div
                        className={`
                          p-3 rounded-xl bg-gradient-to-br ${
                            item.gradientFrom
                          } ${item.gradientTo}
                          transform transition-all duration-300
                          ${isHovered ? "scale-110 rotate-6" : ""}
                        `}
                      >
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h3
                        className={`
                        text-xl font-semibold text-gray-900 dark:text-white
                        transform transition-transform duration-300
                        ${isHovered ? "translate-x-2" : ""}
                      `}
                      >
                        {item.title}
                      </h3>
                    </div>

                    {/* Content */}
                    <div className="space-y-4 flex-grow">
                      <div className="space-y-2">
                        <p className="text-2xl font-bold text-gray-800 dark:text-white">
                          {item.content}
                        </p>
                        {item.translation && (
                          <p className="text-gray-600 dark:text-gray-300 italic">
                            {item.translation}
                          </p>
                        )}
                      </div>
                      {item.example && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {item.example}
                        </p>
                      )}
                    </div>

                    {/* Action Button */}
                    <div
                      className={`
                      mt-6 transform transition-all duration-300
                      ${
                        isHovered
                          ? "translate-x-2 opacity-100"
                          : "translate-x-0 opacity-0"
                      }
                    `}
                    >
                      <button
                        className={`
                        flex items-center gap-2 text-sm font-medium
                        text-gray-900 dark:text-white hover:gap-3 transition-all
                      `}
                      >
                        Learn more <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Bottom Gradient Line */}
                    <div
                      className={`
                        absolute bottom-0 left-0 right-0 h-1
                        bg-gradient-to-r ${item.gradientFrom} ${item.gradientTo}
                        transform transition-transform duration-300 ease-out
                        ${isHovered ? "scale-x-100" : "scale-x-0"}
                      `}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
