// app/quiz/page.tsx
"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import ContributorQuiz from "./ContributorQuiz";

export default function QuizPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/auth/sign-in?redirect_url=/quiz");
        return;
      }

      // Check if user has already passed the quiz
      const { data: profile } = await supabase
        .from("profiles")
        .select("quiz_completed, quiz_score")
        .eq("id", session.user.id)
        .single();

      if (profile?.quiz_completed) {
        router.push("/contribute");
      }
    };

    checkAuth();
  }, [router, supabase]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <ContributorQuiz />
      </div>
    </div>
  );
}
