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

export interface NumberEntry {
  id: number;
  created_at: string;
  muharuro: number;
  kifuliiru: string;
  kingereza: string;
  kifaransa: string;
  kiswahili: string;
}

// Helper function to fetch numbers
export async function fetchNumbers(): Promise<NumberEntry[]> {
  try {
    const { data, error } = await supabase
      .from("kuharura") // Updated table name
      .select("*")
      .order("muharuro", { ascending: true });

    if (error) {
      console.error("Supabase error:", error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Error fetching numbers:", err);
    return [];
  }
}

// Helper function to search numbers
export async function searchNumbers(query: string): Promise<NumberEntry[]> {
  const { data, error } = await supabase
    .from("kuharura") // Updated table name
    .select("*")
    .or(
      `
      muharuro.ilike.%${query}%,
      kifuliiru.ilike.%${query}%,
      kingereza.ilike.%${query}%,
      kifaransa.ilike.%${query}%,
      kiswahili.ilike.%${query}%
    `
    )
    .order("muharuro", { ascending: true });

  if (error) {
    console.error("Error searching numbers:", error);
    return [];
  }

  return data || [];
}
