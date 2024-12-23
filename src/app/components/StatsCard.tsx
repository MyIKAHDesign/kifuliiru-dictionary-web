import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ColorType, StatsCardProps } from "../lib/types/stats.ts";

const colorClasses: Record<ColorType, string> = {
  indigo:
    "from-indigo-500/20 to-indigo-500/0 text-indigo-600 dark:text-indigo-400",
  purple:
    "from-purple-500/20 to-purple-500/0 text-purple-600 dark:text-purple-400",
  blue: "from-blue-500/20 to-blue-500/0 text-blue-600 dark:text-blue-400",
  teal: "from-teal-500/20 to-teal-500/0 text-teal-600 dark:text-teal-400",
};

export default function StatsCard({
  title,
  count,
  description,
  buttonLabel,
  buttonLink,
  color,
  icon: Icon,
  delay = 0,
}: StatsCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [displayedCount, setDisplayedCount] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const intersectionRef = useRef<IntersectionObserver>();
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    // Create intersection observer
    intersectionRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          intersectionRef.current?.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      intersectionRef.current.observe(cardRef.current);
    }

    return () => intersectionRef.current?.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const startTime = performance.now();
    const duration = 2000; // 2 seconds animation

    const animateCount = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      setDisplayedCount(Math.round(easeOutQuart * count));

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animateCount);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animateCount);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [count, isVisible]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M+`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k+`;
    return num.toLocaleString();
  };

  return (
    <div
      ref={cardRef}
      className={`
        relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 
        shadow-lg hover:shadow-xl transition-all duration-500
        before:absolute before:inset-0 before:bg-gradient-to-br ${
          colorClasses[color]
        } 
        before:opacity-20 before:transition-opacity hover:before:opacity-30
        transform ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }
      `}
      style={{
        transitionDelay: `${delay}ms`,
        transitionProperty: "all",
        transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h3>
          {Icon && (
            <div
              className={`
              p-2 rounded-lg bg-gradient-to-br ${colorClasses[color]} bg-opacity-10
              transform transition-transform duration-300 hover:scale-110 hover:rotate-12
            `}
            >
              <Icon className="h-6 w-6" />
            </div>
          )}
        </div>

        {/* Count and Description */}
        <div className="space-y-1">
          <p className={`text-3xl font-bold ${colorClasses[color]}`}>
            {formatNumber(displayedCount)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {description}
          </p>
        </div>

        {/* Action Button */}
        {buttonLabel && buttonLink && (
          <div className="mt-4">
            <Link
              href={buttonLink}
              className={`
                inline-flex items-center gap-2 text-sm font-medium ${colorClasses[color]}
                hover:underline transition-all duration-300
              `}
            >
              {buttonLabel}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
