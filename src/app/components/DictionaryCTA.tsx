import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Search,
  Sparkles,
  GraduationCap,
  BookOpenCheck,
  Languages,
} from "lucide-react";

export default function DictionaryCTA() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="w-full">
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Main content */}
          <div
            className={`
              relative rounded-2xl p-8
              bg-gradient-to-b from-white to-indigo-50/50
              dark:from-gray-900 dark:to-indigo-950/30
              border border-indigo-100 dark:border-indigo-900/50
              transition-all duration-500 ease-out overflow-hidden
              ${isHovered ? "shadow-2xl shadow-indigo-500/10" : "shadow-lg"}
            `}
          >
            {/* Animated gradient border */}
            <div
              className={`
                absolute inset-px rounded-2xl transition-opacity duration-500
                bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
                opacity-0
                ${isHovered ? "opacity-20" : ""}
              `}
            />

            <div className="relative space-y-8">
              {/* Icons Grid */}
              <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto">
                <div
                  className={`
                    p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/50
                    transform transition-all duration-500
                    ${isHovered ? "-translate-y-2 rotate-6" : ""}
                  `}
                >
                  <GraduationCap className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div
                  className={`
                    p-3 rounded-xl bg-purple-50 dark:bg-purple-950/50
                    transform transition-all duration-500 delay-75
                    ${isHovered ? "-translate-y-3" : ""}
                  `}
                >
                  <BookOpenCheck className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div
                  className={`
                    p-3 rounded-xl bg-pink-50 dark:bg-pink-950/50
                    transform transition-all duration-500 delay-150
                    ${isHovered ? "-translate-y-2 -rotate-6" : ""}
                  `}
                >
                  <Languages className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                </div>
              </div>

              {/* Text content */}
              <div className="space-y-4 text-center">
                <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50">
                  <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                    Discover More
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Ready to Explore{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                    Kifuliiru
                  </span>
                  ?
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Dive into our comprehensive collection of words, phrases, and
                  cultural expressions.
                </p>
              </div>

              {/* Interactive elements */}
              <div className="flex flex-col items-center gap-6">
                {/* CTA Button */}
                <Link
                  href="/dictionary"
                  className="group relative"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <div className="absolute -inset-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 blur transition duration-500 group-hover:opacity-15" />
                  <div
                    className={`
                      relative flex items-center gap-2 px-8 py-4
                      bg-gradient-to-r from-indigo-600 to-purple-600
                      hover:from-indigo-500 hover:to-purple-500
                      text-white rounded-xl shadow-lg
                      transition-all duration-300
                      ${
                        isHovered
                          ? "shadow-xl shadow-purple-500/20 translate-y-px"
                          : ""
                      }
                    `}
                  >
                    <span className="text-lg font-medium">
                      Explore the Dictionary
                    </span>
                    <ArrowRight
                      className={`
                      w-5 h-5 transform transition-all duration-300
                      ${isHovered ? "translate-x-1" : ""}
                    `}
                    />
                  </div>
                </Link>

                {/* Search preview */}
                <div
                  className={`
                    flex items-center w-full max-w-sm gap-3 px-4 py-3
                    bg-white dark:bg-gray-900
                    rounded-xl border border-gray-200 dark:border-gray-800
                    transform transition-all duration-500 ease-out
                    ${
                      isHovered
                        ? "translate-y-0 opacity-100 shadow-lg"
                        : "translate-y-4 opacity-0"
                    }
                  `}
                >
                  <Search className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-500 dark:text-gray-400 text-sm">
                    Search thousands of words...
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
