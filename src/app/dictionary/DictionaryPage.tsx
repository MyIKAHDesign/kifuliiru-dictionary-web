import React from "react";
import { Suspense } from "react";
import DictionaryContent from "./DictionaryContent";
import { Loader2 } from "lucide-react";
import { fetchDictionaryWords } from "@/app/lib/supabase";

// Loading component
function DictionaryLoading() {
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

// Main page component that handles initial data fetching
async function DictionaryPage() {
  // Fetch initial dictionary data
  const initialWords = await fetchDictionaryWords();

  return (
    <Suspense fallback={<DictionaryLoading />}>
      <DictionaryContent initialWords={initialWords} />
    </Suspense>
  );
}

export default DictionaryPage;
