"use client";

import React from "react";

interface QuizResultsProps {
  quiz: Quiz | null;
}

const mockResults = [
  { id: "1", user: "Alice", score: 8, percentage: 80, hasPassed: true },
  { id: "2", user: "Bob", score: 6, percentage: 60, hasPassed: false },
];

const QuizResults: React.FC<QuizResultsProps> = ({ quiz }) => {
  if (!quiz) {
    return <p>No quiz selected.</p>;
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Results for: {quiz.name}</h3>
      <table className="min-w-full bg-white shadow rounded-lg">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-left">User</th>
            <th className="py-2 px-4 border-b text-left">Score</th>
            <th className="py-2 px-4 border-b text-left">Percentage</th>
            <th className="py-2 px-4 border-b text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {mockResults.map((result) => (
            <tr key={result.id}>
              <td className="py-2 px-4 border-b">{result.user}</td>
              <td className="py-2 px-4 border-b">{result.score}</td>
              <td className="py-2 px-4 border-b">{result.percentage}%</td>
              <td
                className={`py-2 px-4 border-b ${
                  result.hasPassed ? "text-green-600" : "text-red-600"
                }`}
              >
                {result.hasPassed ? "Passed" : "Failed"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuizResults;
