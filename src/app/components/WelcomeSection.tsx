import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Sparkles, Globe2, ArrowRight, Book } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { useScrollTo } from "@/app/hooks/useScrollTo";
const ModernHero = () => {
  const router = useRouter();
  const scrollTo = useScrollTo();
  const parallaxRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Handle initial mounting effects
  useEffect(() => {
    const timeout = setTimeout(() => {
      const shapes = document.querySelectorAll(".floating-shape");
      shapes.forEach((shape) => {
        (shape as HTMLElement).style.opacity = "1";
      });
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  // Handle parallax scroll effect
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

  const handleStartLearning = () => {
    router.push("/numbers");
  };

  return (
    <div className="relative overflow-hidden" ref={heroRef}>
      {/* Enhanced Background with Parallax */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 
                    dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
      >
        <div
          ref={parallaxRef}
          className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,rgba(255,125,0,0.1),transparent)] 
                      dark:bg-[radial-gradient(circle_500px_at_50%_200px,rgba(255,125,0,0.05),transparent)]"
        />
        <div className="absolute inset-0 bg-grid-slate-100/[0.05] dark:bg-grid-slate-700/[0.05]" />
      </div>

      {/* Main Content */}
      <div className="relative min-h-[90vh] flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Language Selector */}

            {/* Main Title Section */}
            <div className="text-center mb-16">
              <div
                className="inline-flex items-center space-x-2 bg-orange-100 dark:bg-orange-900/30 
                            text-orange-600 rounded-full px-4 py-1 mb-6 animate-fade-in"
              >
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">
                  5,000+ Words & Phrases
                </span>
              </div>

              <h1
                className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent 
                           bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600"
              >
                Discover the Language of Bafuliiru People
              </h1>

              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Explore an extensive collection of words, meanings, and cultural
                insights in Kifuliiru, Kiswahili, French, and English
              </p>
            </div>

            {/* Enhanced Search Section */}
            <div className="relative max-w-3xl mx-auto mb-12">
              <form onSubmit={handleSearch} className="relative group">
                <div
                  className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-amber-500 
                              rounded-xl blur-lg opacity-25 group-hover:opacity-40 transition-all 
                              duration-300"
                />
                <div className="relative flex items-center">
                  <Search className="absolute left-4 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search for words in Kifuliiru..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-20 py-5 rounded-xl border-2 border-orange-200/50 
                             dark:border-orange-900/20 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm
                             focus:ring-2 focus:ring-orange-500 focus:border-transparent
                             text-lg shadow-xl transition-all duration-300
                             dark:placeholder-gray-400 dark:text-gray-100"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="absolute right-4 h-10 w-10 bg-orange-600 hover:bg-orange-700 
                             text-white rounded-full shadow-lg"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </form>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-12">
                <button
                  onClick={handleStartLearning}
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 
                           bg-orange-600 hover:bg-orange-700 text-white rounded-full font-medium text-lg
                           transition-all duration-300 transform hover:-translate-y-1 
                           hover:shadow-lg shadow-orange-500/25"
                >
                  <Book className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                  Start Learning
                  <ArrowRight className="w-4 h-4 transition-all duration-300 group-hover:translate-x-1" />
                </button>

                <Link
                  href="/dictionary"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 
                           bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 border-2 border-orange-600 
                           dark:border-orange-400 text-orange-600 dark:text-orange-400 rounded-full 
                           font-medium text-lg hover:bg-orange-50 dark:hover:bg-orange-900/10 
                           transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                >
                  <Globe2 className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                  Explore Dictionary
                  <ArrowRight className="w-4 h-4 transition-all duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Button */}
      {showScrollButton && (
        <button
          onClick={() => scrollTo("stats")}
          className="fixed md:absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 
                   cursor-pointer transition-all duration-300 z-20
                   opacity-90 hover:opacity-100 focus:outline-none focus:ring-2 
                   focus:ring-orange-500/50 focus:ring-offset-2 focus:ring-offset-transparent
                   animate-bounce"
          aria-label="Scroll to statistics"
        >
          <div
            className="w-10 h-12 md:w-8 md:h-14 rounded-full border-2 border-orange-500 
                       dark:border-orange-400 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 
                       hover:bg-orange-50 dark:hover:bg-orange-900/10
                       transition-all duration-300 flex items-center justify-center"
          >
            <div className="w-1.5 md:w-1 h-4 md:h-3 bg-orange-500 dark:bg-orange-400 rounded-full" />
          </div>
        </button>
      )}
    </div>
  );
};

export default ModernHero;
