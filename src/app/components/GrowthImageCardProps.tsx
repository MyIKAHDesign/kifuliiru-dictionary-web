import Image from "next/image";
import { ChartLine, ArrowRight } from "lucide-react";
import Link from "next/link";

interface GrowthImageCardProps {
  delay?: number;
}

export default function GrowthImageCard({ delay = 0 }: GrowthImageCardProps) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 
        shadow-lg hover:shadow-xl transition-all duration-500
        transform hover:scale-[1.02]"
      style={{
        transitionDelay: `${delay}ms`,
      }}
    >
      {/* Gradient Overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/0 
        opacity-20 transition-opacity hover:opacity-30"
      />

      {/* Content Container */}
      <div className="relative z-10 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Project Growth
          </h3>
          <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20">
            <ChartLine className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </div>
        </div>

        {/* Image Container */}
        <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
          <Image
            src="/hero-library.jpg"
            alt="Dictionary growth visualization"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <p className="text-gray-600 dark:text-gray-400">
            Track our progress in documenting and preserving the Kifuliiru
            language
          </p>
          <Link
            href="/statistics"
            className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 
              dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
          >
            View detailed statistics
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
