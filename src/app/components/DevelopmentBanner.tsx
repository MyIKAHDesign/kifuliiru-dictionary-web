import React, { useState, useEffect } from "react";
import { X, Sparkles, Wrench, Rocket } from "lucide-react";

export default function DevelopmentBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [currentMessage, setCurrentMessage] = useState(0);

  const messages = [
    {
      icon: <Wrench className="w-4 h-4 text-amber-800 dark:text-amber-200" />,
      text: "Website under development!",
    },
    {
      icon: <Sparkles className="w-4 h-4 text-amber-800 dark:text-amber-200" />,
      text: "New features coming soon!",
    },
    {
      icon: <Rocket className="w-4 h-4 text-amber-800 dark:text-amber-200" />,
      text: "Building something amazing!",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [messages.length]);

  if (!isVisible) return null;

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-gray-800 dark:to-gray-900 border-b border-amber-200 dark:border-gray-700">
      <div className="absolute inset-0 opacity-50">
        <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-700" />
      </div>

      <div className="container mx-auto px-4">
        <div className="relative flex items-center justify-between py-3">
          <div className="flex-1 flex justify-center items-center space-x-4">
            <div className="animate-bounce">
              {messages[currentMessage].icon}
            </div>

            <p className="text-sm md:text-base font-medium text-amber-800 dark:text-amber-200 transition-all duration-500 ease-in-out transform">
              <span className="inline-block animate-fade-in">
                {messages[currentMessage].text}
              </span>
            </p>

            <div className="hidden md:flex items-center space-x-2">
              <span className="animate-pulse h-2 w-2 rounded-full bg-amber-400 dark:bg-amber-600" />
              <span className="animate-pulse delay-100 h-2 w-2 rounded-full bg-amber-400 dark:bg-amber-600" />
              <span className="animate-pulse delay-200 h-2 w-2 rounded-full bg-amber-400 dark:bg-amber-600" />
            </div>
          </div>

          <button
            onClick={() => setIsVisible(false)}
            className="ml-4 p-1 rounded-full hover:bg-amber-200 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-amber-600"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4 text-amber-800 dark:text-amber-200" />
          </button>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-300 dark:via-amber-700 to-transparent" />
    </div>
  );
}
