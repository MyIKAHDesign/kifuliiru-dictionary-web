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
  created_at: string;
  status: "pending" | "review" | "revision" | "approved";
  igambo: string;
  kifuliiru: string;
  kiswahili: string;
  kifaransa: string;
  kingereza: string;
  kishushanyo?: string;
  holidesirwi?: string;
  created_date?: string;
  updated_date?: string;
  owner_id: string;
  publish_date?: string;
  unpublish_date?: string;
  nayemera_consent?: boolean;
  igambo_audio_url?: string;
  kifuliiru_definition_audio_url?: string;
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
      .select("*")
      .in("status", ["approved", "review"])
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error("Error fetching dictionary words:", err);
    return [];
  }
}

export async function searchDictionaryWords(
  searchQuery: string
): Promise<DictionaryEntry[]> {
  try {
    const sanitizedQuery = searchQuery.replace(/[%_]/g, "\\$&");

    const { data, error } = await supabase
      .from("magambo")
      .select("*")
      .in("status", ["approved", "review"])
      .or(
        `igambo.ilike.%${sanitizedQuery}%,
         kifuliiru.ilike.%${sanitizedQuery}%,
         kiswahili.ilike.%${sanitizedQuery}%,
         kingereza.ilike.%${sanitizedQuery}%,
         kifaransa.ilike.%${sanitizedQuery}%`
      )
      .order("created_at", { ascending: false });

    if (error) throw error;
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

// app/lib/types/supabase.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          email: string;
          role: "super_admin" | "admin" | "editor" | "viewer";
          quiz_completed: boolean;
          quiz_score?: number;
          quiz_attempts?: number;
          last_quiz_attempt?: string;
        };
        Insert: {
          id: string;
          created_at?: string;
          updated_at?: string;
          email: string;
          role?: "super_admin" | "admin" | "editor" | "viewer";
          quiz_completed?: boolean;
          quiz_score?: number;
          quiz_attempts?: number;
          last_quiz_attempt?: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          email?: string;
          role?: "super_admin" | "admin" | "editor" | "viewer";
          quiz_completed?: boolean;
          quiz_score?: number;
          quiz_attempts?: number;
          last_quiz_attempt?: string;
        };
      };
      magambo: {
        Row: {
          id: string;
          created_at?: string | null;
          status?: string | null;
          submission_time?: string | null;
          nayemera_consent?: boolean | null;
          igambo: string;
          kifuliiru: string;
          kiswahili?: string | null;
          kifaransa?: string | null;
          kingereza: string;
          kishushanyo?: string | null;
          holidesirwi?: string | null;
          created_date?: string | null;
          updated_date?: string | null;
          owner_id?: string | null;
          publish_date?: string | null;
          unpublish_date?: string | null;
          igambo_audio_url?: string | null;
          kifuliiru_definition_audio_url?: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string | null;
          status?: string | null;
          submission_time?: string | null;
          nayemera_consent?: boolean | null;
          igambo: string;
          kifuliiru: string;
          kiswahili?: string | null;
          kifaransa?: string | null;
          kingereza: string;
          kishushanyo?: string | null;
          holidesirwi?: string | null;
          created_date?: string | null;
          updated_date?: string | null;
          owner_id?: string | null;
          publish_date?: string | null;
          unpublish_date?: string | null;
          igambo_audio_url?: string | null;
          kifuliiru_definition_audio_url?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string | null;
          status?: string | null;
          submission_time?: string | null;
          nayemera_consent?: boolean | null;
          igambo?: string;
          kifuliiru?: string;
          kiswahili?: string | null;
          kifaransa?: string | null;
          kingereza?: string;
          kishushanyo?: string | null;
          holidesirwi?: string | null;
          created_date?: string | null;
          updated_date?: string | null;
          owner_id?: string | null;
          publish_date?: string | null;
          unpublish_date?: string | null;
          igambo_audio_url?: string | null;
          kifuliiru_definition_audio_url?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
