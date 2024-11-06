import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface StatsCardProps {
  title: string;
  count: number;
  description?: string;
  buttonLabel?: string;
  buttonLink?: string;
  color?: "indigo" | "purple" | "blue" | "teal";
  icon?: React.ReactNode;
  delay?: number;
}

const colorClasses = {
  indigo:
    "from-indigo-500/20 to-indigo-500/0 text-indigo-600 dark:text-indigo-400",
  purple:
    "from-purple-500/20 to-purple-500/0 text-purple-600 dark:text-purple-400",
  blue: "from-blue-500/20 to-blue-500/0 text-blue-600 dark:text-blue-400",
  teal: "from-teal-500/20 to-teal-500/0 text-teal-600 dark:text-teal-400",
};

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export default function StatsCard({
  title,
  count,
  description,
  buttonLabel,
  buttonLink,
  color = "indigo",
  icon: Icon,
  delay = 0,
}: StatsCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [displayedCount, setDisplayedCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    const duration = 2000; // 2 seconds for count animation

    function animate(currentTime: number) {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easedProgress = easeOutExpo(progress);
      setDisplayedCount(Math.round(easedProgress * count));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }, [count, isVisible]);

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k+`;
    }
    return num.toString();
  };

  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 
        shadow-lg hover:shadow-xl transition-all duration-500
        before:absolute before:inset-0 before:bg-gradient-to-br ${
          colorClasses[color]
        } 
        before:opacity-20 before:transition-opacity hover:before:opacity-30
        transform ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
        }
        hover:scale-105
      `}
      style={{
        transitionDelay: `${delay}ms`,
        transitionProperty: "all",
        transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <div className="relative z-10">
        {/* Header with slide-in animation */}
        <div className="flex items-center justify-between mb-4">
          <h3
            className={`
              text-lg font-semibold text-gray-800 dark:text-gray-200
              transform transition-all duration-500 delay-100
              ${
                isVisible
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-8 opacity-0"
              }
            `}
            style={{ transitionDelay: `${delay + 100}ms` }}
          >
            {title}
          </h3>
          {Icon && (
            <div
              className={`
                w-10 h-10 rounded-full bg-gradient-to-br ${colorClasses[color]} 
                bg-opacity-10 flex items-center justify-center
                transform transition-all duration-500
                hover:rotate-12 hover:scale-110
                ${isVisible ? "rotate-0 opacity-100" : "rotate-45 opacity-0"}
              `}
              style={{ transitionDelay: `${delay + 200}ms` }}
            >
              {Icon}
            </div>
          )}
        </div>

        {/* Count with bounce animation */}
        <div className="mb-4">
          <p
            className={`
              text-4xl font-bold ${colorClasses[color]}
              transform transition-all duration-500
              ${isVisible ? "scale-100 opacity-100" : "scale-50 opacity-0"}
            `}
            style={{ transitionDelay: `${delay + 300}ms` }}
          >
            {formatNumber(displayedCount)}
          </p>
          {description && (
            <p
              className={`
                mt-1 text-sm text-gray-600 dark:text-gray-400
                transform transition-all duration-500
                ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0"
                }
              `}
              style={{ transitionDelay: `${delay + 400}ms` }}
            >
              {description}
            </p>
          )}
        </div>

        {/* Button with fade-in animation */}
        {buttonLabel && buttonLink && (
          <div
            className={`
              transform transition-all duration-500
              ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }
            `}
            style={{ transitionDelay: `${delay + 500}ms` }}
          >
            <Link
              href={buttonLink}
              className={`
                group inline-flex items-center gap-2 text-sm ${colorClasses[color]} 
                hover:underline
              `}
            >
              {buttonLabel}
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
