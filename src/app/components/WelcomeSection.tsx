import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search, Globe2, ArrowRight, Book } from "lucide-react";
import { useScrollTo } from "../hooks/useScrollTo";

const CIRCLES = [
  { width: 180, height: 180, left: 70, top: 85 },
  { width: 150, height: 150, left: 20, top: 70 },
  { width: 200, height: 200, left: 40, top: 15 },
  { width: 160, height: 160, left: 85, top: 90 },
];

export default function HeroSection() {
  const scrollTo = useScrollTo();
  const parallaxRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let ticking = false;
    let animationFrameId: number;

    const handleScroll = () => {
      if (!ticking) {
        animationFrameId = requestAnimationFrame(() => {
          if (parallaxRef.current) {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = -0.15;

            parallaxRef.current.style.transform = `translate3d(0, ${
              scrolled * parallaxSpeed
            }px, 0)`;
          }

          if (heroRef.current) {
            const heroHeight = heroRef.current.offsetHeight;
            const scrollPosition = window.scrollY;
            setShowScrollButton(scrollPosition < heroHeight * 0.8);
          }

          ticking = false;
        });
      }
      ticking = true;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    if (parallaxRef.current) {
      parallaxRef.current.style.willChange = "transform";
      parallaxRef.current.style.transition =
        "transform 0.1s cubic-bezier(0.33, 1, 0.68, 1)";
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  const languages = [
    { code: "kf", name: "KIFULIIRU" },
    { code: "en", name: "ENGLISH" },
    { code: "fr", name: "FRANÇAIS" },
    { code: "sw", name: "KISWAHILI" },
  ];

  return (
    <div
      ref={heroRef}
      className="relative min-h-screen flex items-center overflow-hidden bg-lightBackground dark:bg-darkBackground"
    >
      {/* Background Container with Parallax */}
      <div className="absolute inset-0 z-0">
        <div
          ref={parallaxRef}
          className="absolute inset-0 transform-gpu"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Floating Background Shapes */}
          {mounted && (
            <div className="absolute inset-0 overflow-hidden">
              {CIRCLES.map((circle, i) => (
                <div
                  key={i}
                  className="absolute rounded-full animate-float-slow"
                  style={{
                    width: `${circle.width}px`,
                    height: `${circle.height}px`,
                    left: `${circle.left}%`,
                    top: `${circle.top}%`,
                    animationDelay: circle.delay,
                    animationDuration: circle.duration,
                    background: `radial-gradient(circle at center, 
                      rgba(14, 165, 233, ${circle.opacity}) 0%,
                      rgba(14, 165, 233, ${circle.opacity / 2}) 70%,
                      transparent 100%)`,
                  }}
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-radial from-primary-300/20 via-primary-400/10 to-transparent dark:from-primary-400/20 dark:via-primary-500/10" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-6xl mx-auto text-center">
          {/* Language Pills */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {languages.map((lang) => (
              <button
                key={lang.code}
                className="px-6 py-2 rounded-full bg-mutedWhite dark:bg-darkMuted
                         text-primary-600 dark:text-primary-300 text-sm font-medium
                         hover:bg-primary-50 dark:hover:bg-darkMuted/80 transition-all duration-300
                         transform hover:-translate-y-0.5 animate-fade-in"
                style={{ animationDelay: `${languages.indexOf(lang) * 0.1}s` }}
              >
                {lang.name}
              </button>
            ))}
          </div>

          {/* Hero Text */}
          <h1 className="font-playfair mb-8">
            <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary-600 dark:text-primary-400 block mb-4 animate-fade-in">
              Discover the Language
            </span>
            <span className="text-5xl sm:text-6xl md:text-7xl font-bold text-lightText dark:text-darkText animate-slide-up">
              of Bafuliiru People
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-lightText/80 dark:text-darkText/80 font-sans max-w-2xl mx-auto leading-relaxed mb-12 animate-fade-in">
            Explore an extensive collection of words, meanings, and cultural
            insights in Kifuliiru, Kiswahili, French, and English.
          </p>

          {/* Search Box */}
          <div className="relative max-w-2xl mx-auto mb-12 animate-slide-up">
            <div className="relative">
              <input
                type="text"
                placeholder="Type a word in any language to begin..."
                className="w-full px-6 py-4 pl-12 rounded-full bg-mutedWhite dark:bg-darkMuted
                         text-lightText dark:text-darkText placeholder-lightText/50 dark:placeholder-darkText/50
                         shadow-soft hover:shadow-lg transition-all duration-300
                         focus:outline-none focus:ring-2 focus:ring-primary-500/50"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-lightText/50 dark:text-darkText/50 h-5 w-5" />
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16 animate-slide-up">
            <button
              onClick={() => scrollTo("stats")}
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 
                       bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600
                       text-white rounded-full font-medium text-lg
                       transition-all duration-300 transform hover:-translate-y-1 
                       hover:shadow-lg shadow-primary-500/25"
            >
              <Book className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
              Start Learning
              <ArrowRight className="w-4 h-4 transition-all duration-300 group-hover:translate-x-1" />
            </button>

            <Link
              href="/dictionary"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 
                       bg-mutedWhite dark:bg-darkMuted border-2 border-primary-600 dark:border-primary-400
                       text-primary-600 dark:text-primary-400 rounded-full font-medium text-lg 
                       hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all duration-300
                       transform hover:-translate-y-1 hover:shadow-lg"
            >
              <Globe2 className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
              Explore Dictionary
              <ArrowRight className="w-4 h-4 transition-all duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      {showScrollButton && (
        <button
          onClick={() => scrollTo("stats")}
          className="fixed md:absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 
                   cursor-pointer transition-all duration-300 z-20
                   opacity-90 hover:opacity-100 focus:outline-none focus:ring-2 
                   focus:ring-primary-500/50 focus:ring-offset-2 focus:ring-offset-transparent
                   animate-fade-in"
          aria-label="Scroll to statistics"
        >
          <div
            className="w-10 h-12 md:w-8 md:h-14 rounded-full border-2 
                       border-primary-500 dark:border-primary-400
                       bg-mutedWhite dark:bg-darkMuted hover:bg-primary-50 dark:hover:bg-primary-900/10
                       transition-all duration-300 flex items-center justify-center"
          >
            <div className="w-1.5 md:w-1 h-4 md:h-3 bg-primary-500 dark:bg-primary-400 rounded-full animate-bounce" />
          </div>
        </button>
      )}
    </div>
  );
}
