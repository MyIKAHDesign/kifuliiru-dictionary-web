// app/dictionary/page.tsx
"use client";

import { useEffect, useState } from "react";
import { fetchDictionaryWords } from "@/app/lib/supabase";
import type { DictionaryEntry } from "@/app/lib/supabase";
import DictionaryContent from "./DictionaryContent";
import { Loader2 } from "lucide-react";

export default function DictionaryPage() {
  const [initialWords, setInitialWords] = useState<DictionaryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInitialData() {
      try {
        const data = await fetchDictionaryWords();
        setInitialWords(data);
      } catch (error) {
        console.error("Error loading dictionary words:", error);
      } finally {
        setLoading(false);
      }
    }

    loadInitialData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
          <p className="text-gray-600 dark:text-gray-300">
            Loading dictionary...
          </p>
        </div>
      </div>
    );
  }

  return <DictionaryContent initialWords={initialWords} />;
}
