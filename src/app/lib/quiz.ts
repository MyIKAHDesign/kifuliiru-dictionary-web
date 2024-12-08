// lib/quiz.ts
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { QuizQuestion } from "./types/quiz";
import { QuizAttempt, QuizResponse } from "../quiz/lib/types/quiz";

export async function fetchQuizQuestions(
  quizType: string = "contributor"
): Promise<QuizQuestion[]> {
  const supabase = createClientComponentClient();

  const { data: questions, error: questionsError } = await supabase
    .from("quiz_questions")
    .select(
      `
      *,
      options:quiz_options(*)
    `
    )
    .eq("quiz_type", quizType)
    .order("order_number");

  if (questionsError) throw questionsError;
  return questions || [];
}

export async function startQuizAttempt(
  quizType: string = "contributor"
): Promise<QuizAttempt> {
  const supabase = createClientComponentClient();

  const { data, error } = await supabase
    .from("quiz_attempts")
    .insert({
      quiz_type: quizType,
      current_question: 0,
      answers: {},
      time_left: 45,
      total_questions: 10,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function saveQuizProgress(
  attemptId: string,
  currentQuestion: number,
  answers: Record<string, string>,
  timeLeft: number
): Promise<void> {
  const supabase = createClientComponentClient();

  const { error } = await supabase
    .from("quiz_attempts")
    .update({
      current_question: currentQuestion,
      answers,
      time_left: timeLeft,
      updated_at: new Date().toISOString(),
    })
    .eq("id", attemptId);

  if (error) throw error;
}

export async function submitQuizResponse(
  response: Omit<QuizResponse, "id">
): Promise<void> {
  const supabase = createClientComponentClient();

  const { error } = await supabase.from("quiz_responses").insert(response);

  if (error) throw error;
}

export async function completeQuizAttempt(
  attemptId: string,
  score: number,
  responses: Omit<QuizResponse, "id">[]
): Promise<void> {
  const supabase = createClientComponentClient();

  // Start a transaction
  const { error: updateError } = await supabase
    .from("quiz_attempts")
    .update({
      completed_at: new Date().toISOString(),
      score,
      status: "completed",
    })
    .eq("id", attemptId);

  if (updateError) throw updateError;

  // Insert all responses
  const { error: responsesError } = await supabase
    .from("quiz_responses")
    .insert(responses);

  if (responsesError) throw responsesError;
}
