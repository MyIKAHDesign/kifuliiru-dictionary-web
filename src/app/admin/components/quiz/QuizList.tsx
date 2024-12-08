"use client";

import React from "react";
import { Quiz } from "../../lib/types";

interface QuizListProps {
  onAddNew: () => void;
  onEdit: (quiz: Quiz) => void;
  onViewResults: (quiz: Quiz) => void;
}

const mockQuizzes: Quiz[] = [
  {
    id: "1",
    name: "Kifuliiru Basics",
    questions: [{ id: "q1", text: "What is 'One' in Kifuliiru?" }],
    type: "General Purpose",
  },
  {
    id: "2",
    name: "Contributor Quiz",
    questions: [{ id: "q1", text: "Define 'Contributor'." }],
    type: "Contributor",
  },
];

const QuizList: React.FC<QuizListProps> = ({
  onAddNew,
  onEdit,
  onViewResults,
}) => {
  return (
    <div>
      <button
        onClick={onAddNew}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add New Quiz
      </button>
      <table className="min-w-full bg-white shadow rounded-lg">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-left">Quiz Name</th>
            <th className="py-2 px-4 border-b text-left">Type</th>
            <th className="py-2 px-4 border-b text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {mockQuizzes.map((quiz) => (
            <tr key={quiz.id}>
              <td className="py-2 px-4 border-b">{quiz.name}</td>
              <td className="py-2 px-4 border-b">{quiz.type}</td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => onEdit(quiz)}
                  className="mr-2 bg-yellow-500 text-white px-4 py-2 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => onViewResults(quiz)}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  View Results
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuizList;
