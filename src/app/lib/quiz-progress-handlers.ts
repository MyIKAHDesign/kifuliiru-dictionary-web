import { SupabaseClient } from "@supabase/supabase-js";

interface QuizProgress {
  id: string;
  user_id: string;
  quiz_type: string;
  current_question: number;
  answers: Record<string, number>;
  time_left: number;
  last_updated: string;
  is_complete: boolean;
}

interface ProgressUpdateData {
  current_question?: number;
  answers?: Record<string, number>;
  time_left?: number;
  is_complete?: boolean;
}

interface SaveProgressResult {
  success: boolean;
  error?: string;
  data?: QuizProgress;
}

interface SaveQuizResponseParams {
  attemptId: string;
  questionId: number;
  selectedOptionId: number;
  isCorrect: boolean;
  timeSpent: number;
  responseOrder: number;
  userId: string;
}

interface CompleteQuizParams {
  attemptId: string;
  score: number;
  totalQuestions: number;
  userId: string;
  passingScore: number;
}

interface QuizAttempt {
  id: string;
  user_id: string;
  quiz_type: string;
  started_at: string;
  completed_at: string | null;
  current_question: number;
  score: number;
  is_passed: boolean;
  total_questions: number;
  answers: Record<string, number>;
  created_at: string;
  updated_at: string;
}

// Save current quiz progress
export async function saveQuizProgress(
  supabase: SupabaseClient,
  progress: QuizProgress
): Promise<void> {
  try {
    const { error } = await supabase.from("quiz_progress").upsert({
      id: progress.id,
      user_id: progress.user_id,
      current_question: progress.current_question,
      answers: progress.answers,
      time_left: progress.time_left,
      updated_at: new Date().toISOString(),
    });

    if (error) throw error;
  } catch (error) {
    console.error("Error saving quiz progress:", error);
    throw error;
  }
}

// Save individual question response
export async function saveQuizResponse(
  supabase: SupabaseClient,
  params: SaveQuizResponseParams
): Promise<void> {
  try {
    const { error } = await supabase.from("quiz_responses").insert({
      attempt_id: params.attemptId,
      user_id: params.userId,
      question_id: params.questionId,
      selected_option_id: params.selectedOptionId,
      is_correct: params.isCorrect,
      time_spent: params.timeSpent,
      response_order: params.responseOrder,
      created_at: new Date().toISOString(),
    });

    if (error) throw error;
  } catch (error) {
    console.error("Error saving quiz response:", error);
    throw error;
  }
}

// Complete quiz and update user status if passed
export async function completeQuizAttempt(
  supabase: SupabaseClient,
  params: CompleteQuizParams
): Promise<void> {
  const passed = params.score >= params.passingScore;

  try {
    // Update quiz attempt
    const { error: attemptError } = await supabase
      .from("quiz_attempts")
      .update({
        completed_at: new Date().toISOString(),
        score: params.score,
        is_passed: passed,
        total_questions: params.totalQuestions,
        passing_score: params.passingScore,
      })
      .eq("id", params.attemptId);

    if (attemptError) throw attemptError;

    // If passed, update user profile to contributor
    if (passed) {
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          role: "contributor",
          quiz_completed: true,
          quiz_score: params.score,
          quiz_completed_at: new Date().toISOString(),
        })
        .eq("id", params.userId);

      if (profileError) throw profileError;
    }
  } catch (error) {
    console.error("Error completing quiz attempt:", error);
    throw error;
  }
}

// Calculate final quiz score
export async function calculateQuizScore(
  supabase: SupabaseClient,
  attemptId: string
): Promise<number> {
  try {
    const { data: responses, error } = await supabase
      .from("quiz_responses")
      .select("is_correct")
      .eq("attempt_id", attemptId);

    if (error) throw error;

    if (!responses?.length) return 0;

    const correctAnswers = responses.filter((r) => r.is_correct).length;
    return Number(((correctAnswers / responses.length) * 100).toFixed(2));
  } catch (error) {
    console.error("Error calculating quiz score:", error);
    throw error;
  }
}

// Get quiz attempt details with proper typing
export async function getQuizAttempt(
  supabase: SupabaseClient,
  attemptId: string
): Promise<QuizAttempt | null> {
  try {
    const { data, error } = await supabase
      .from("quiz_attempts")
      .select("*")
      .eq("id", attemptId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching quiz attempt:", error);
    throw error;
  }
}

// Create new quiz attempt
export async function createQuizAttempt(
  supabase: SupabaseClient,
  userId: string,
  totalQuestions: number
): Promise<string> {
  try {
    const { data, error } = await supabase
      .from("quiz_attempts")
      .insert({
        user_id: userId,
        quiz_type: "contributor",
        started_at: new Date().toISOString(),
        total_questions: totalQuestions,
        current_question: 0,
        score: 0,
        answers: {},
      })
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error("No data returned from quiz attempt creation");

    return data.id;
  } catch (error) {
    console.error("Error creating quiz attempt:", error);
    throw error;
  }
}

export class QuizProgressHandler {
  constructor(private supabase: SupabaseClient) {}

  async initializeProgress(
    attemptId: string,
    quizType: string
  ): Promise<SaveProgressResult> {
    try {
      const {
        data: { session },
      } = await this.supabase.auth.getSession();
      if (!session?.user) {
        return {
          success: false,
          error: "No authenticated user found",
        };
      }

      const initialProgress = {
        id: attemptId,
        user_id: session.user.id,
        quiz_type: quizType,
        current_question: 0,
        answers: {},
        time_left: 45, // Default time per question
        last_updated: new Date().toISOString(),
        is_complete: false,
      };

      const { data, error } = await this.supabase
        .from("quiz_progress")
        .insert(initialProgress)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: `Error initializing progress: ${error.message}`,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  async updateProgress(
    attemptId: string,
    updates: ProgressUpdateData
  ): Promise<SaveProgressResult> {
    try {
      const updateData = {
        ...updates,
        last_updated: new Date().toISOString(),
      };

      const { data, error } = await this.supabase
        .from("quiz_progress")
        .update(updateData)
        .eq("id", attemptId)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: `Error updating progress: ${error.message}`,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  async getProgress(attemptId: string): Promise<SaveProgressResult> {
    try {
      const { data, error } = await this.supabase
        .from("quiz_progress")
        .select("*")
        .eq("id", attemptId)
        .single();

      if (error) {
        return {
          success: false,
          error: `Error fetching progress: ${error.message}`,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  async resumeQuiz(attemptId: string): Promise<SaveProgressResult> {
    try {
      // Get current progress
      const result = await this.getProgress(attemptId);
      if (!result.success || !result.data) {
        return result;
      }

      // Verify the quiz can be resumed
      if (result.data.is_complete) {
        return {
          success: false,
          error: "Quiz is already complete",
        };
      }

      // Update last_updated timestamp
      const updateResult = await this.updateProgress(attemptId, {
        //last_updated: new Date().toISOString(),
      });

      return updateResult;
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  async completeQuiz(
    attemptId: string,
    finalScore: number
  ): Promise<SaveProgressResult> {
    try {
      const {
        data: { session },
      } = await this.supabase.auth.getSession();
      if (!session?.user) {
        return {
          success: false,
          error: "No authenticated user found",
        };
      }

      // Update progress as complete
      const progressResult = await this.updateProgress(attemptId, {
        is_complete: true,
      });

      if (!progressResult.success) {
        return progressResult;
      }

      // Update the quiz attempt
      const { error: attemptError } = await this.supabase
        .from("quiz_attempts")
        .update({
          completed_at: new Date().toISOString(),
          score: finalScore,
          status: "completed",
        })
        .eq("id", attemptId);

      if (attemptError) {
        return {
          success: false,
          error: `Error updating attempt: ${attemptError.message}`,
        };
      }

      return progressResult;
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  async cleanupProgress(attemptId: string): Promise<void> {
    try {
      await this.supabase.from("quiz_progress").delete().eq("id", attemptId);
    } catch (error) {
      console.error("Error cleaning up progress:", error);
    }
  }
}

// Export the creation method
export const createQuizProgressHandler = (
  supabase: SupabaseClient
): QuizProgressHandler => {
  return new QuizProgressHandler(supabase);
};
