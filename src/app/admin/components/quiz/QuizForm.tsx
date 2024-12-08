"use client";

import React, { useState } from "react";

type Question = {
  id: string;
  text: string;
};

type Quiz = {
  id: string;
  name: string;
  questions: Question[];
  type: "General Purpose" | "Contributor";
};

interface QuizFormProps {
  initialQuiz?: Quiz | null;
  onSave: (quiz: Quiz) => void;
}

const QuizForm: React.FC<QuizFormProps> = ({ initialQuiz, onSave }) => {
  const [name, setName] = useState(initialQuiz?.name || "");
  const [type, setType] = useState<"General Purpose" | "Contributor">(
    initialQuiz?.type || "General Purpose"
  );
  const [questions, setQuestions] = useState<Question[]>(
    initialQuiz?.questions || [{ id: "1", text: "" }]
  );

  const handleAddQuestion = () => {
    const newQuestion: Question = { id: `${Date.now()}`, text: "" };
    setQuestions([...questions, newQuestion]);
  };

  const handleSave = () => {
    const quiz: Quiz = {
      id: initialQuiz?.id || `${Date.now()}`,
      name,
      type, // Explicitly typed as "General Purpose" | "Contributor"
      questions,
    };
    onSave(quiz);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">
        {initialQuiz ? "Edit Quiz" : "Create Quiz"}
      </h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Quiz Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full border rounded-md p-2"
          placeholder="Enter quiz name"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Quiz Type
        </label>
        <select
          value={type}
          onChange={(e) =>
            setType(e.target.value as "General Purpose" | "Contributor")
          } // Ensure proper typing here
          className="mt-1 block w-full border rounded-md p-2"
        >
          <option value="General Purpose">General Purpose</option>
          <option value="Contributor">Contributor</option>
        </select>
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">Questions</h3>
        {questions.map((question, index) => (
          <div key={question.id} className="mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Question {index + 1}
            </label>
            <input
              type="text"
              value={question.text}
              onChange={(e) => {
                const updatedQuestions = [...questions];
                updatedQuestions[index].text = e.target.value;
                setQuestions(updatedQuestions);
              }}
              className="mt-1 block w-full border rounded-md p-2"
              placeholder={`Enter question ${index + 1}`}
            />
          </div>
        ))}
        <button
          onClick={handleAddQuestion}
          className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Question
        </button>
      </div>
      <button
        onClick={handleSave}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Save Quiz
      </button>
    </div>
  );
};

export default QuizForm;
