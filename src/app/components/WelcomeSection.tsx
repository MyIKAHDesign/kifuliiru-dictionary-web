import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, BarChart3, Book } from "lucide-react";
import { useScrollTo } from "../hooks/useScrollTo";
import Image from "next/image";

export default function HeroSection() {
  const scrollTo = useScrollTo();
  const parallaxRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);

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

  return (
    <div
      ref={heroRef}
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background Container with Parallax */}
      <div className="absolute inset-0 z-0">
        {/* Image Container with Parallax */}
        <div
          ref={parallaxRef}
          className="absolute inset-0 transform-gpu"
          style={{ transformStyle: "preserve-3d" }}
        >
          <Image
            src="/hero-library.jpg"
            alt="Library background"
            fill
            priority
            className="object-cover object-center scale-110"
            style={{
              transformOrigin: "center",
              backfaceVisibility: "hidden",
            }}
          />
        </div>

        {/* Fixed Overlay Container */}
        <div
          className="absolute inset-0"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Blur overlay */}
          <div
            className="absolute inset-0 backdrop-blur-[2px]"
            style={{
              backfaceVisibility: "hidden",
              transform: "translateZ(0)",
            }}
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 via-gray-900/40 to-gray-900/60" />
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-6xl mx-auto text-center flex flex-col items-center justify-center">
          {/* Hero text with enhanced contrast */}
          <h1 className="font-playfair mb-8 relative">
            <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-white block mb-4 drop-shadow-lg">
              Discover the Beauty of
            </span>
            <span
              className="text-5xl sm:text-6xl md:text-7xl font-bold text-transparent bg-clip-text 
                           bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-50 drop-shadow-lg"
            >
              the Kifuliiru Language
            </span>
          </h1>

          <p
            className="text-xl md:text-2xl text-gray-100 font-sans max-w-2xl mx-auto leading-relaxed mb-12 
                       drop-shadow-lg backdrop-blur-sm py-4"
          >
            Explore an extensive collection of words, meanings, and cultural
            insights in Kifuliiru, Kiswahili, French, and English.
          </p>

          {/* CTA buttons with glass effect */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <button
              onClick={() => scrollTo("stats")}
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 
                       bg-white/90 backdrop-blur-sm text-gray-900 rounded-full font-sans font-medium text-lg
                       hover:bg-white transition-all duration-500 ease-in-out cursor-pointer
                       transform hover:-translate-y-1 hover:shadow-lg hover:shadow-white/20"
            >
              <BarChart3 className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
              Learn More Here
              <ArrowRight className="w-4 h-4 transition-all duration-300 group-hover:translate-x-1" />
            </button>

            <Link
              href="/dictionary"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 
                       bg-transparent backdrop-blur-sm border-2 border-white/80 text-white rounded-full 
                       font-sans font-medium text-lg hover:bg-white/10
                       transition-all duration-500 ease-in-out cursor-pointer
                       transform hover:-translate-y-1 hover:shadow-lg hover:shadow-white/20"
            >
              <Book className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
              Explore Dictionary
              <ArrowRight className="w-4 h-4 transition-all duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Improved scroll indicator */}
      {showScrollButton && (
        <button
          onClick={() => scrollTo("stats")}
          className="fixed md:absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 
                   cursor-pointer transition-all duration-300 z-20
                   opacity-90 hover:opacity-100 focus:outline-none focus:ring-2 
                   focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent"
          aria-label="Scroll to statistics"
        >
          <div
            className="w-10 h-12 md:w-8 md:h-14 rounded-full border-2 border-white/80 
                    backdrop-blur-sm bg-white/10 hover:bg-white/20
                    transition-all duration-300 flex items-center justify-center"
          >
            <div className="w-1.5 md:w-1 h-4 md:h-3 bg-white rounded-full animate-pulse" />
          </div>
        </button>
      )}
    </div>
  );
}
