// lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL");
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export interface DictionaryEntry {
  id: string;
  created_at: string;
  status: string;
  igambo: string;
  kifuliiru: string;
  kiswahili: string;
  kifaransa: string;
  kingereza: string;
  igambo_audio_url?: string;
  kifuliiru_definition_audio_url?: string;
}

// Modified fetch function with better error handling and logging
export async function fetchDictionaryWords(): Promise<DictionaryEntry[]> {
  try {
    console.log("Fetching dictionary words...");

    const { data, error } = await supabase
      .from("magambo")
      .select("*") // Remove any filters for now
      .order("igambo");

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    console.log("Fetched data:", data); // Let's see what we're getting
    return data || [];
  } catch (err) {
    console.error("Error in fetchDictionaryWords:", err);
    return [];
  }
}

// Modified search function with better error handling and logging
export async function searchDictionaryWords(
  query: string
): Promise<DictionaryEntry[]> {
  try {
    console.log(`Searching for words matching: "${query}"`);

    const { data, error } = await supabase
      .from("magambo")
      .select("*")
      .eq("status", "PUBLISHED") // Only search published words
      .or(
        `igambo.ilike.%${query}%,
        kifuliiru.ilike.%${query}%,
        kiswahili.ilike.%${query}%,
        kingereza.ilike.%${query}%,
        kifaransa.ilike.%${query}%`
      )
      .order("igambo", { ascending: true });

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.log(`No results found for query: "${query}"`);
      return [];
    }

    console.log(`Found ${data.length} matching words`);
    return data;
  } catch (err) {
    console.error("Error in searchDictionaryWords:", err);
    throw err;
  }
}
