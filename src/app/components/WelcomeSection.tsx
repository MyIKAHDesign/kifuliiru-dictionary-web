import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Globe2, ArrowRight, Book } from "lucide-react";
import { useScrollTo } from "../hooks/useScrollTo";

const SHAPES = [
  {
    path: "M0,50 Q15,40 30,50 T60,50",
    width: 200,
    height: 160,
    left: 8,
    top: 18,
    delay: "0s",
    duration: "18s",
    opacity: 0.12,
    rotation: 35,
    scale: 0.9,
  },
  {
    path: "M40,10 Q50,0 60,10 L55,40 L40,10",
    width: 180,
    height: 180,
    left: 75,
    top: 12,
    delay: "0.7s",
    duration: "22s",
    opacity: 0.08,
    rotation: -25,
    scale: 1,
  },
  {
    path: "M20,50 Q40,20 60,50 Q40,80 20,50",
    width: 170,
    height: 170,
    left: 45,
    top: 28,
    delay: "1.2s",
    duration: "20s",
    opacity: 0.1,
    rotation: 85,
    scale: 0.95,
  },
  {
    path: "M50,0 Q70,30 50,60 Q30,30 50,0",
    width: 190,
    height: 190,
    left: 25,
    top: 8,
    delay: "0.5s",
    duration: "24s",
    opacity: 0.15,
    rotation: -45,
    scale: 0.85,
  },
  {
    path: "M40,20 L60,20 L60,40 L40,40 Z",
    width: 160,
    height: 160,
    left: 65,
    top: 32,
    delay: "0.9s",
    duration: "21s",
    opacity: 0.09,
    rotation: 15,
    scale: 0.8,
  },
  {
    path: "M50,30 C60,30 65,40 65,50 C65,60 60,70 50,70 C40,70 35,60 35,50 C35,40 40,30 50,30",
    width: 150,
    height: 150,
    left: 85,
    top: 15,
    delay: "1.5s",
    duration: "19s",
    opacity: 0.11,
    rotation: -30,
    scale: 0.75,
  },
];

export default function HeroSection() {
  const router = useRouter();
  const scrollTo = useScrollTo();
  const parallaxRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleStartLearning = () => {
    router.push("/numbers");
  };

  useEffect(() => {
    setMounted(true);
    const timeout = setTimeout(() => {
      const shapes = document.querySelectorAll(".floating-shape");
      shapes.forEach((shape) => {
        (shape as HTMLElement).style.opacity = "1";
      });
    }, 100);

    return () => clearTimeout(timeout);
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

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/dictionary?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  const languages = [
    { code: "kf", name: "KIFULIIRU" },
    { code: "en", name: "ENGLISH" },
    { code: "fr", name: "FRANÇAIS" },
    { code: "sw", name: "KISWAHILI" },
  ];

  return (
    <div
      ref={heroRef}
      className="relative min-h-[90vh] flex items-center overflow-hidden bg-lightBackground dark:bg-darkBackground"
    >
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div
          ref={parallaxRef}
          className="absolute inset-0 transform-gpu"
          style={{ transformStyle: "preserve-3d" }}
        >
          {mounted && (
            <div className="absolute inset-0">
              {SHAPES.map((shape, i) => (
                <div
                  key={i}
                  className="absolute floating-shape"
                  style={{
                    width: `${shape.width}px`,
                    height: `${shape.height}px`,
                    left: `${shape.left}%`,
                    top: `${shape.top}%`,
                    transform: `rotate(${shape.rotation}deg) scale(${shape.scale})`,
                    transition: "opacity 0.8s ease-in-out",
                    willChange: "transform",
                  }}
                >
                  <div
                    className="w-full h-full animate-float-complex"
                    style={{
                      animationDelay: shape.delay,
                      animationDuration: shape.duration,
                    }}
                  >
                    <svg
                      viewBox="0 0 100 100"
                      className="w-full h-full"
                      style={{
                        filter: "blur(1px)",
                        transform: `scale(${shape.scale})`,
                      }}
                    >
                      <path
                        d={shape.path}
                        className="shape-path"
                        style={{
                          fill: `url(#gradient-${i})`,
                        }}
                      />
                      <defs>
                        <linearGradient
                          id={`gradient-${i}`}
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop
                            offset="0%"
                            style={{
                              stopColor: "rgb(14, 165, 233)",
                              stopOpacity: shape.opacity,
                            }}
                          />
                          <stop
                            offset="100%"
                            style={{
                              stopColor: "rgb(56, 189, 248)",
                              stopOpacity: shape.opacity * 0.6,
                            }}
                          />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {languages.map((lang) => (
              <button
                key={lang.code}
                className="px-6 py-2 rounded-full bg-mutedWhite/80 backdrop-blur-sm dark:bg-darkMuted/80
                         text-primary-600 dark:text-primary-300 text-sm font-medium
                         hover:bg-primary-50 dark:hover:bg-darkMuted/60 transition-all duration-300
                         transform hover:-translate-y-0.5 animate-fade-in"
                style={{ animationDelay: `${languages.indexOf(lang) * 0.1}s` }}
              >
                {lang.name}
              </button>
            ))}
          </div>

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

          <form
            onSubmit={handleSearch}
            className="relative max-w-2xl mx-auto mb-12 animate-slide-up"
          >
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a word in any language to begin..."
                className="w-full px-6 py-4 pl-12 rounded-full bg-mutedWhite/80 backdrop-blur-sm dark:bg-darkMuted/80
                         text-lightText dark:text-darkText placeholder-lightText/50 dark:placeholder-darkText/50
                         shadow-soft hover:shadow-lg transition-all duration-300
                         focus:outline-none focus:ring-2 focus:ring-primary-500/50"
              />
              <button
                type="submit"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 
                         bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600
                         text-white rounded-full p-2
                         transition-all duration-300 hover:scale-105"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
          </form>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16 animate-slide-up">
            <button
              onClick={handleStartLearning}
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
                       bg-mutedWhite/80 backdrop-blur-sm dark:bg-darkMuted/80 border-2 border-primary-600 dark:border-primary-400
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

      {showScrollButton && (
        <button
          onClick={() => scrollTo("stats")}
          className="fixed md:absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 
               cursor-pointer transition-all duration-300 z-20
               opacity-90 hover:opacity-100 focus:outline-none focus:ring-2 
               focus:ring-primary-500/50 focus:ring-offset-2 focus:ring-offset-transparent
               animate-bounce"
          aria-label="Scroll to statistics"
        >
          <div
            className="w-10 h-12 md:w-8 md:h-14 rounded-full border-2 
                 border-primary-500 dark:border-primary-400
                 bg-mutedWhite/80 backdrop-blur-sm dark:bg-darkMuted/80 
                 hover:bg-primary-50 dark:hover:bg-primary-900/10
                 transition-all duration-300 flex items-center justify-center"
          >
            <div className="w-1.5 md:w-1 h-4 md:h-3 bg-primary-500 dark:bg-primary-400 rounded-full" />
          </div>
        </button>
      )}
    </div>
  );
}
