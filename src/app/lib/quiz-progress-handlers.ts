import { SupabaseClient } from "@supabase/supabase-js";

interface QuizProgress {
  id: string; // Attempt ID, assumed to be a UUID
  user_id: string; // User ID, assumed to be a UUID
  quiz_type: string; // The type of quiz, e.g., "contributor"
  current_question: number; // Index of the current question
  answers: Record<string, string>; // Map of question ID (string) to answer ID (string)
  time_left: number; // Time left for the current question in seconds
  score: number; // Number of correct answers
  last_updated: string; // ISO timestamp of the last update
  is_complete: boolean; // Whether the quiz is completed
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
  // Change questionId and selectedOptionId to string since IDs are UUIDs.
  questionId: string;
  selectedOptionId: string;
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
    const { error } = await supabase
      .from("quiz_progress")
      .upsert(
        {
          id: progress.id, // or the attemptId if it serves as unique key
          user_id: progress.user_id,
          quiz_type: progress.quiz_type,
          current_question: progress.current_question,
          answers: progress.answers,
          time_left: progress.time_left,
          score: progress.score, // Include score field
          updated_at: new Date().toISOString(),
          is_complete: progress.is_complete,
        },
        {
          onConflict: "user_id, quiz_type", // specify the unique columns
        }
      )
      .single();

    if (error) throw error;
  } catch (error) {
    console.error("Error saving quiz progress:", JSON.stringify(error));
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
    console.error("Error saving quiz response:", JSON.stringify(error));
    throw error;
  }
}

// Complete quiz and update user status if passed
export async function completeQuizAttempt(
  supabase: SupabaseClient,
  params: CompleteQuizParams
): Promise<void> {
  try {
    // Calculate pass/fail status
    const passed = params.score >= (params.passingScore ?? 70); // Default passing score to 70 if undefined

    // Update the quiz attempt with the final score and completion details
    const { error: attemptError } = await supabase
      .from("quiz_attempts")
      .update({
        score: params.score, // Final calculated score
        is_passed: passed, // Pass/fail status
        completed_at: new Date().toISOString(), // Completion timestamp
        total_questions: params.totalQuestions, // Total number of questions
        passing_score: params.passingScore, // Passing score for the quiz
      })
      .eq("id", params.attemptId); // Match the specific attempt ID

    if (attemptError) {
      console.error("Error updating quiz attempt:", {
        attemptId: params.attemptId,
        score: params.score,
        passed,
        error: attemptError.message,
      });
      throw attemptError;
    }

    // If the user passed, update their profile to reflect the new role
    if (passed) {
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          role: "contributor", // Update user role to contributor
          quiz_completed: true, // Mark quiz as completed
          quiz_score: params.score, // Store the final score
          quiz_completed_at: new Date().toISOString(), // Timestamp for completion
        })
        .eq("id", params.userId); // Match the specific user ID

      if (profileError) {
        console.error("Error updating user profile:", {
          userId: params.userId,
          score: params.score,
          error: profileError.message,
        });
        throw profileError;
      }
    }

    console.log("Quiz attempt completed successfully:", {
      attemptId: params.attemptId,
      userId: params.userId,
      score: params.score,
      passed,
    });
  } catch (error) {
    console.error("Error completing quiz attempt:", {
      attemptId: params.attemptId,
      userId: params.userId,
      score: params.score,
      error: JSON.stringify(error),
    });
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

    if (!responses || responses.length === 0) return 0;

    const correctAnswers = responses.filter(
      (response) => response.is_correct
    ).length;
    const totalQuestions = responses.length;

    return Number(((correctAnswers / totalQuestions) * 100).toFixed(2));
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
  p0: string,
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
        percentage: 0,
        answers: {},
      })
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error("No data returned from quiz attempt creation");

    return data.id;
  } catch (error) {
    console.error("Error creating quiz attempt:", JSON.stringify(error));

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
