// lib/types/supabase.ts

// lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

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
      quiz_progress: {
        Row: {
          id: string;
          user_id: string;
          quiz_type: string;
          current_question: number;
          answers: Json;
          time_left: number;
          start_time: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          quiz_type: string;
          current_question: number;
          answers: Json;
          time_left: number;
          start_time: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          quiz_type?: string;
          current_question?: number;
          answers?: Json;
          time_left?: number;
          start_time?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      quiz_attempts: {
        Row: {
          id: number;
          user_id: string;
          started_at: string;
          completed_at: string | null;
          score: number | null;
          total_questions: number;
          quiz_type: string;
          current_question: number;
          answers: Json;
          time_left: number;
        };
        Insert: {
          id?: number;
          user_id: string;
          started_at?: string;
          completed_at?: string | null;
          score?: number | null;
          total_questions: number;
          quiz_type: string;
          current_question?: number;
          answers?: Json;
          time_left?: number;
        };
        Update: {
          id?: number;
          user_id?: string;
          started_at?: string;
          completed_at?: string | null;
          score?: number | null;
          total_questions?: number;
          quiz_type?: string;
          current_question?: number;
          answers?: Json;
          time_left?: number;
        };
      };
      quiz_responses: {
        Row: {
          id: string;
          attempt_id: string;
          question_id: string;
          selected_option_id: string;
          is_correct: boolean;
          time_spent: number;
          created_at: string;
          response_order: number;
        };
        Insert: {
          id?: string;
          attempt_id: string;
          question_id: string;
          selected_option_id: string;
          is_correct: boolean;
          time_spent: number;
          created_at?: string;
          response_order: number;
        };
        Update: {
          id?: string;
          attempt_id?: string;
          question_id?: string;
          selected_option_id?: string;
          is_correct?: boolean;
          time_spent?: number;
          created_at?: string;
          response_order?: number;
        };
      };
      quiz_questions: {
        Row: {
          id: number;
          question_text: string;
          explanation: string;
          created_at: string;
          updated_at: string;
          quiz_type: string;
          order_number: number;
        };
        Insert: {
          id?: number;
          question_text: string;
          explanation: string;
          created_at?: string;
          updated_at?: string;
          quiz_type: string;
          order_number: number;
        };
        Update: {
          id?: number;
          question_text?: string;
          explanation?: string;
          created_at?: string;
          updated_at?: string;
          quiz_type?: string;
          order_number?: number;
        };
      };
      quiz_options: {
        Row: {
          id: number;
          question_id: number;
          option_text: string;
          is_correct: boolean;
          option_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          question_id: number;
          option_text: string;
          is_correct: boolean;
          option_order: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          question_id?: number;
          option_text?: string;
          is_correct?: boolean;
          option_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          email: string;
          role: "super_admin" | "admin" | "editor" | "viewer";
          quiz_completed: boolean;
          quiz_score: number | null;
          quiz_attempts: number | null;
          last_quiz_attempt: string | null;
        };
        Insert: {
          id: string;
          created_at?: string;
          updated_at?: string;
          email: string;
          role?: "super_admin" | "admin" | "editor" | "viewer";
          quiz_completed?: boolean;
          quiz_score?: number | null;
          quiz_attempts?: number | null;
          last_quiz_attempt?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          email?: string;
          role?: "super_admin" | "admin" | "editor" | "viewer";
          quiz_completed?: boolean;
          quiz_score?: number | null;
          quiz_attempts?: number | null;
          last_quiz_attempt?: string | null;
        };
      };
      numbers: {
        Row: {
          id: string;
          number: string;
          value: string | number;
        };
        Insert: {
          number: string;
          value: string | number;
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

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T];

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL");
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

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

// Numbers Methods

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
