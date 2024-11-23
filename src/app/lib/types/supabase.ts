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
