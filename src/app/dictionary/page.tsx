// app/dictionary/page.tsx
import DictionaryContent from "./DictionaryContent";
import { createClient } from "@supabase/supabase-js";

export default async function DictionaryPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  try {
    const { data, error } = await supabase
      .from("magambo")
      .select("*")
      .order("igambo");

    if (error) {
      throw error;
    }

    return <DictionaryContent initialWords={data || []} />;
  } catch (error) {
    console.error("Error fetching dictionary words:", error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-600 dark:text-red-400 font-medium">
            Error loading dictionary data
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Please try refreshing the page
          </p>
        </div>
      </div>
    );
  }
}
