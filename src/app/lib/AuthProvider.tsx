// lib/AuthProvider.tsx
"use client";

import { createContext, useContext, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { SupabaseClient } from "@supabase/auth-helpers-nextjs";

type AuthContextType = {
  supabase: SupabaseClient;
};

const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [supabase] = useState(() => createClientComponentClient());

  return (
    <AuthContext.Provider value={{ supabase }}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
