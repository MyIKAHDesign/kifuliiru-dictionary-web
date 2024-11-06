import { Users, Book, Languages, Globe } from "lucide-react";
import StatsCard from "./StatsCard";

export default function StatsSection() {
  const stats = [
    {
      title: "Dictionary Entries",
      count: 1200,
      description: "Words and phrases",
      color: "indigo" as const,
      icon: <Book className="w-6 h-6" />,
    },
    {
      title: "Languages",
      count: 4,
      description: "Translations available",
      color: "purple" as const,
      icon: <Languages className="w-6 h-6" />,
    },
    {
      title: "Total Translations",
      count: 4800,
      description: "Across all languages",
      color: "blue" as const,
      icon: <Globe className="w-6 h-6" />,
    },
    {
      title: "Contributors",
      count: 35,
      description: "Active community members",
      buttonLabel: "Become a Contributor",
      buttonLink: "/contribute",
      color: "teal" as const,
      icon: <Users className="w-6 h-6" />,
    },
  ];

  return (
    <section className="py-12 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Growing Language Resource
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Join our community in preserving and sharing the richness of the
            Kifuliiru language.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatsCard
              key={stat.title}
              {...stat}
              delay={index * 100} // Stagger the animations
            />
          ))}
        </div>
      </div>
    </section>
  );
}
