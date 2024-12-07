import { SupabaseClient } from "@supabase/supabase-js";

interface QuizResponse {
  attempt_id: string;
  question_id: number;
  selected_option_id: number;
  time_spent: number;
  response_order: number;
}

interface StoredQuizResponse extends QuizResponse {
  id: string;
  user_id: string;
  is_correct: boolean;
  submitted_at: string;
}

interface OptionData {
  is_correct: boolean;
}

interface SaveResponseResult {
  success: boolean;
  error?: string;
  data?: StoredQuizResponse;
}

export class QuizResponseHandler {
  constructor(private supabase: SupabaseClient) {}

  async saveResponse(response: QuizResponse): Promise<SaveResponseResult> {
    try {
      // Validate input data
      this.validateResponse(response);

      // Get current user's session
      const {
        data: { session },
      } = await this.supabase.auth.getSession();
      if (!session?.user) {
        return {
          success: false,
          error: "No authenticated user found",
        };
      }

      // Check if the option exists and get its correctness
      const { data: optionData, error: optionError } = await this.supabase
        .from("quiz_options")
        .select("is_correct")
        .eq("id", response.selected_option_id)
        .eq("question_id", response.question_id)
        .single();

      if (optionError) {
        return {
          success: false,
          error: `Error validating option: ${optionError.message}`,
        };
      }

      const quizResponse: Omit<StoredQuizResponse, "id"> = {
        ...response,
        user_id: session.user.id,
        is_correct: (optionData as OptionData)?.is_correct || false,
        submitted_at: new Date().toISOString(),
      };

      // Save the response with correctness information
      const { data, error } = await this.supabase
        .from("quiz_responses")
        .insert(quizResponse)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: `Error saving response: ${error.message}`,
        };
      }

      // Update the attempt progress
      await this.updateAttemptProgress(
        response.attempt_id,
        response.response_order
      );

      return {
        success: true,
        data: data as StoredQuizResponse,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  private validateResponse(response: QuizResponse): void {
    if (!response.attempt_id) {
      throw new Error("Missing attempt_id");
    }
    if (!Number.isInteger(response.question_id)) {
      throw new Error("Invalid question_id");
    }
    if (!Number.isInteger(response.selected_option_id)) {
      throw new Error("Invalid selected_option_id");
    }
    if (!Number.isInteger(response.time_spent) || response.time_spent < 0) {
      throw new Error("Invalid time_spent");
    }
    if (
      !Number.isInteger(response.response_order) ||
      response.response_order < 0
    ) {
      throw new Error("Invalid response_order");
    }
  }

  private async updateAttemptProgress(
    attemptId: string,
    currentQuestion: number
  ): Promise<void> {
    try {
      const { error } = await this.supabase
        .from("quiz_attempts")
        .update({
          current_question: currentQuestion,
          last_response_at: new Date().toISOString(),
        })
        .eq("id", attemptId);

      if (error) throw error;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Error updating attempt progress:", errorMessage);
      // Don't throw here - this is a secondary operation
    }
  }

  async calculateScore(attemptId: string): Promise<number> {
    try {
      const { data, error } = await this.supabase
        .from("quiz_responses")
        .select("is_correct")
        .eq("attempt_id", attemptId);

      if (error) throw error;

      if (!data || data.length === 0) return 0;

      const correctAnswers = data.filter(
        (response) => response.is_correct
      ).length;
      return (correctAnswers / data.length) * 100;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Error calculating score:", errorMessage);
      throw error;
    }
  }
}

// Usage example with type-safe creation function
export const createQuizHandler = (
  supabase: SupabaseClient
): QuizResponseHandler => {
  return new QuizResponseHandler(supabase);
};
