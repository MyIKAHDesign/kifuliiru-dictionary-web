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
