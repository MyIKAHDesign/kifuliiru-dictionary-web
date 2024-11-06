import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, BarChart3, Book } from "lucide-react";
import { useScrollTo } from "../hooks/useScrollTo";
import Image from "next/image";

export default function HeroSection() {
  const scrollTo = useScrollTo();
  const parallaxRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    let animationFrameId: number;

    const handleScroll = () => {
      if (!ticking) {
        animationFrameId = requestAnimationFrame(() => {
          if (parallaxRef.current && overlayRef.current) {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = -0.15; // Reduced speed for subtlety

            // Smooth transform with cubic-bezier
            parallaxRef.current.style.transform = `translate3d(0, ${
              scrolled * parallaxSpeed
            }px, 0)`;
            overlayRef.current.style.transform = `translate3d(0, ${
              scrolled * parallaxSpeed * 0.5
            }px, 0)`;
          }
          ticking = false;
        });
      }
      ticking = true;
    };

    // Add passive scroll listener for better performance
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Apply initial styles
    if (parallaxRef.current && overlayRef.current) {
      parallaxRef.current.style.willChange = "transform";
      parallaxRef.current.style.transition =
        "transform 0.1s cubic-bezier(0.33, 1, 0.68, 1)";
      overlayRef.current.style.willChange = "transform";
      overlayRef.current.style.transition =
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
    <div className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <div ref={parallaxRef} className="absolute inset-0">
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

        {/* Overlay layers */}
        <div ref={overlayRef} className="absolute inset-0">
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 backdrop-blur-[2px]" />
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
              Kifuliiru Language
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
              Learn More
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

      {/* Scroll indicator */}
      <button
        onClick={() => scrollTo("stats")}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer
                 animate-bounce hover:opacity-90 transition-opacity duration-300 z-20"
        aria-label="Scroll to statistics"
      >
        <div
          className="w-8 h-14 rounded-full border-2 border-white/80 p-2 flex justify-center
                      backdrop-blur-sm bg-white/10 hover:bg-white/20
                      transition-all duration-300"
        >
          <div className="w-1 h-3 bg-white rounded-full animate-pulse" />
        </div>
      </button>
    </div>
  );
}
