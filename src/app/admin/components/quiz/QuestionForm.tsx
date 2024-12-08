import React, { useState } from "react";

type QuizOption = {
  id?: number;
  option_text: string;
  is_correct: boolean;
};

type QuestionFormProps = {
  onSave: (question: {
    question_text: string;
    explanation: string | null;
    quiz_type: string;
    options: QuizOption[];
  }) => void;
};

const QuestionForm: React.FC<QuestionFormProps> = ({ onSave }) => {
  const [formState, setFormState] = useState<{
    question_text: string;
    explanation: string | null;
    quiz_type: string;
  }>({
    question_text: "",
    explanation: "",
    quiz_type: "",
  });

  const [options, setOptions] = useState<QuizOption[]>([]); // Explicit typing

  const addOption = () => {
    setOptions((prev) => [...prev, { option_text: "", is_correct: false }]);
  };

  const updateOption = (
    index: number,
    field: keyof QuizOption,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.question_text || !formState.quiz_type) {
      alert("Please fill in the required fields.");
      return;
    }
    onSave({
      ...formState,
      options,
    });
    setFormState({
      question_text: "",
      explanation: "",
      quiz_type: "",
    });
    setOptions([]);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">
        Add New Question
      </h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Question Text */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Question Text
          </label>
          <textarea
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            rows={3}
            value={formState.question_text}
            onChange={(e) =>
              setFormState((prev) => ({
                ...prev,
                question_text: e.target.value,
              }))
            }
            required
          ></textarea>
        </div>

        {/* Explanation */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Explanation (Optional)
          </label>
          <textarea
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            rows={2}
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
            value={formState.quiz_type}
            onChange={(e) =>
              setFormState((prev) => ({
                ...prev,
                quiz_type: e.target.value,
              }))
            }
            required
          >
            <option value="">Select Quiz Type</option>
            <option value="General">General</option>
            <option value="Contributor">Contributor</option>
          </select>
        </div>

        {/* Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Options
          </label>
          <div className="space-y-4">
            {options.map((option, index) => (
              <div key={index} className="flex items-center space-x-4 pb-4">
                {/* Option Text */}
                <textarea
                  className="block w-full h-12 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm resize-none"
                  placeholder={`Option ${index + 1}`}
                  value={option.option_text}
                  onChange={(e) =>
                    updateOption(index, "option_text", e.target.value)
                  }
                  required
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
            onClick={addOption}
          >
            Add Option
          </button>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save Question
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuestionForm;
