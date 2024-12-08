"use client";

import React, { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../lib/supabase";
import QuestionForm from "./components/quiz/QuestionForm";

type Question = {
  id: number;
  question_text: string;
  explanation: string | null;
  quiz_type: string;
  options: {
    id: number; // ID of the option
    option_text: string; // Text of the option
    is_correct: boolean; // Whether the option is correct
  }[];
};

type QuizOption = {
  id?: number; // Optional for new options not yet saved in the database
  option_text: string;
  is_correct: boolean;
};

const PAGE_SIZE = 10; // Number of questions per page

const QuestionsManagement: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [questionToEdit, setQuestionToEdit] = useState<Question | null>(null);
  const [formState, setFormState] = useState<Partial<Question>>({});
  const [options, setOptions] = useState<Question["options"]>([]);

  const supabase = createClientComponentClient<Database>();

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError(null);

      const start = (currentPage - 1) * PAGE_SIZE;
      const end = start + PAGE_SIZE - 1;

      const { data, count, error } = await supabase
        .from("quiz_questions")
        .select(
          `
          id,
          question_text,
          explanation,
          quiz_type,
          quiz_options (
            id,
            option_text,
            is_correct
          )
        `,
          { count: "exact" }
        )
        .range(start, end);

      if (error) {
        setError("Failed to fetch questions.");
        console.error(error);
        return;
      }

      setQuestions(
        data.map((question) => ({
          id: question.id,
          question_text: question.question_text,
          explanation: question.explanation,
          quiz_type: question.quiz_type,
          options: question.quiz_options,
        }))
      );

      setTotalQuestions(count || 0);
    } catch (err) {
      setError("An unexpected error occurred.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (question: Question) => {
    setQuestionToEdit(question);
    setFormState(question);
    setOptions(question.options); // Load options into the state
    setEditModalOpen(true);
  };

  const handleAddNewQuestion = async (newQuestion: {
    question_text: string;
    explanation: string | null;
    quiz_type: string;
    options: QuizOption[];
  }) => {
    try {
      const { data, error } = await supabase
        .from("quiz_questions")
        .insert({
          question_text: newQuestion.question_text,
          explanation: newQuestion.explanation,
          quiz_type: newQuestion.quiz_type,
        })
        .select(); // Ensure the inserted data is returned

      if (error) {
        console.error("Failed to add the question:", error);
        alert("Failed to add the question.");
        return;
      }

      if (!data || data.length === 0) {
        console.error("No question ID returned from the database.");
        alert("Failed to retrieve the inserted question.");
        return;
      }

      const questionId = data[0]?.id; // Safely access the ID
      if (!questionId) {
        console.error("Invalid question ID.");
        alert("Failed to retrieve the inserted question ID.");
        return;
      }

      // Insert the options for the question
      const optionInserts = newQuestion.options.map((option) => ({
        question_id: questionId,
        option_text: option.option_text,
        is_correct: option.is_correct,
      }));

      const { error: optionError } = await supabase
        .from("quiz_options")
        .insert(optionInserts);

      if (optionError) {
        console.error("Failed to add options:", optionError);
        alert("Failed to add options for the question.");
        return;
      }

      fetchQuestions(); // Refresh the list of questions after adding
    } catch (err) {
      console.error("Unexpected error while adding a question:", err);
    }
  };

  const handleSaveEdit = async () => {
    try {
      if (!formState || !formState.id) return;

      // Update question details
      const { error } = await supabase
        .from("quiz_questions")
        .update({
          question_text: formState.question_text,
          explanation: formState.explanation,
          quiz_type: formState.quiz_type,
        })
        .eq("id", formState.id);

      if (error) {
        alert("Failed to update the question.");
        console.error(error);
        return;
      }

      // Update options
      for (const option of options) {
        if (option.id) {
          // Update existing options
          await supabase
            .from("quiz_options")
            .update({
              option_text: option.option_text,
              is_correct: option.is_correct,
            })
            .eq("id", option.id);
        } else {
          // Insert new options
          await supabase.from("quiz_options").insert({
            question_id: formState.id,
            option_text: option.option_text,
            is_correct: option.is_correct,
          });
        }
      }

      setEditModalOpen(false);
      fetchQuestions(); // Refresh the list after saving
    } catch (err) {
      console.error("Error saving edited question:", err);
    }
  };

  const addNewOption = () => {
    setOptions((prev) => [
      ...prev,
      { id: Date.now(), option_text: "", is_correct: false },
    ]);
  };

  const updateOption = (
    index: number,
    field: "option_text" | "is_correct",
    value: string | boolean
  ) => {
    setOptions((prev) =>
      prev.map((option, i) =>
        i === index ? { ...option, [field]: value } : option
      )
    );
  };

  const deleteOption = (index: number) => {
    setOptions((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    fetchQuestions();
  }, [currentPage]);

  const totalPages = Math.ceil(totalQuestions / PAGE_SIZE);

  return (
    <div className="p-6">
      {loading && <p>Loading questions...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <>
          <QuestionForm
            onSave={(newQuestion) => {
              handleAddNewQuestion(newQuestion);
            }}
          />

          <table className="min-w-full bg-white shadow rounded-lg">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">#</th>
                <th className="py-2 px-4 border-b text-left">Question</th>
                <th className="py-2 px-4 border-b text-left">Quiz Type</th>
                <th className="py-2 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((question, index) => (
                <tr key={question.id}>
                  <td className="py-2 px-4 border-b">
                    {(currentPage - 1) * PAGE_SIZE + index + 1}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {question.question_text}
                  </td>
                  <td className="py-2 px-4 border-b">{question.quiz_type}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleEdit(question)}
                      className="mr-2 bg-yellow-500 text-white px-4 py-2 rounded"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Edit Modal */}
      {editModalOpen && questionToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-3/4 max-w-4xl p-8 overflow-auto">
            <h3 className="text-2xl font-bold mb-6 text-gray-900">
              Edit Question
            </h3>
            <form className="space-y-6">
              {/* Question Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Question Text
                </label>
                <textarea
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  rows={3}
                  value={formState.question_text || ""}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      question_text: e.target.value,
                    }))
                  }
                ></textarea>
              </div>

              {/* Explanation */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Explanation (Optional)
                </label>
                <textarea
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  rows={3}
                  value={formState.explanation || ""}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      explanation: e.target.value,
                    }))
                  }
                ></textarea>
              </div>

              {/* Quiz Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quiz Type
                </label>
                <select
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formState.quiz_type || ""}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      quiz_type: e.target.value,
                    }))
                  }
                >
                  <option value="">Select Quiz Type</option>
                  <option value="General">General</option>
                  <option value="Contributor">Contributor</option>
                </select>
              </div>

              {/* Options */}
              {/* Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Options
                </label>
                <div className="space-y-4">
                  {options.map((option, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 pb-4"
                    >
                      {/* Option Text */}
                      <textarea
                        placeholder={`Option ${index + 1}`}
                        className="block w-full h-12 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm resize-none"
                        value={option.option_text}
                        onChange={(e) =>
                          updateOption(index, "option_text", e.target.value)
                        }
                      ></textarea>
                      {/* Is Correct Checkbox */}
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          className="rounded text-indigo-600 border-gray-300 focus:ring-indigo-500"
                          checked={option.is_correct}
                          onChange={(e) =>
                            updateOption(index, "is_correct", e.target.checked)
                          }
                        />
                        <span className="text-sm text-gray-700">Correct</span>
                      </label>
                      {/* Delete Option */}
                      <button
                        type="button"
                        className="text-red-600 hover:text-red-800"
                        onClick={() => deleteOption(index)}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="mt-2 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={addNewOption}
                >
                  Add Option
                </button>
              </div>
            </form>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-end space-x-4">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => setEditModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={handleSaveEdit}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionsManagement;
