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

// Dictionary Interfaces
export interface DictionaryEntry {
  id: string;
  igambo: string;
  kifuliiru: string;
  kiswahili: string;
  kifaransa: string;
  kingereza: string;
  created_at: string;
  owner_id: string | null;
}

// Numbers Interface
export interface NumberEntry {
  id: number;
  created_at: string;
  muharuro: number;
  kifuliiru: string;
  kingereza: string;
  kifaransa: string;
  kiswahili: string;
}

// Dictionary Methods
export async function fetchDictionaryWords(): Promise<DictionaryEntry[]> {
  try {
    const { data, error } = await supabase
      .from("magambo")
      .select(
        "id, igambo, kifuliiru, kiswahili, kingereza, kifaransa, created_at, owner_id"
      )
      .order("igambo", { ascending: true });

    if (error) {
      console.error("Supabase error:", error.message);
      throw error;
    }

    return data || [];
  } catch (err) {
    console.error("Error fetching dictionary words:", err);
    return [];
  }
}

export async function searchDictionaryWords(
  query: string
): Promise<DictionaryEntry[]> {
  try {
    const { data, error } = await supabase
      .from("magambo")
      .select("*")
      .or(
        `igambo.ilike.%${query}%,kifuliiru.ilike.%${query}%,kiswahili.ilike.%${query}%,kingereza.ilike.%${query}%,kifaransa.ilike.%${query}%`
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error.message);
      throw error;
    }

    return data || [];
  } catch (err) {
    console.error("Error searching dictionary words:", err);
    return [];
  }
}

// Numbers Methods
export async function fetchNumbers(): Promise<NumberEntry[]> {
  try {
    const { data, error } = await supabase
      .from("kuharura")
      .select("*")
      .order("muharuro", { ascending: true });

    if (error) {
      console.error("Supabase error:", error.message);
      throw error;
    }

    return data || [];
  } catch (err) {
    console.error("Error fetching numbers:", err);
    return [];
  }
}

export async function searchNumbers(query: string): Promise<NumberEntry[]> {
  try {
    const { data, error } = await supabase
      .from("kuharura")
      .select("*")
      .or(
        `muharuro.ilike.%${query}%,
        kifuliiru.ilike.%${query}%,
        kingereza.ilike.%${query}%,
        kifaransa.ilike.%${query}%,
        kiswahili.ilike.%${query}%`
      )
      .order("muharuro", { ascending: true });

    if (error) {
      console.error("Error searching numbers:", error.message);
      throw error;
    }

    return data || [];
  } catch (err) {
    console.error("Error searching numbers:", err);
    return [];
  }
}
