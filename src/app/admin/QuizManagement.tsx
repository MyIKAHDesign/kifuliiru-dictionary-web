"use client";

import React, { useState } from "react";

// Define types for the quiz structure
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

const QuizManagement: React.FC = () => {
  const [activeView, setActiveView] = useState<"list" | "form" | "results">(
    "list"
  );
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | undefined>(undefined);

  // Mock data for quizzes
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

  // Handle saving a quiz
  // const handleQuizSave = (quiz: Quiz) => {
  //   console.log("Saved Quiz:", quiz);
  //   setActiveView("list");
  // };

  // Handle editing a quiz
  const handleQuizEdit = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setActiveView("form");
  };

  // Handle viewing quiz results
  const handleQuizResults = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setActiveView("results");
  };

  return (
    <div className="p-6" id="quiz-management">
      {/* Quiz List View */}
      {activeView === "list" && (
        <>
          <button
            onClick={() => setActiveView("form")}
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
                      onClick={() => handleQuizEdit(quiz)}
                      className="mr-2 bg-yellow-500 text-white px-4 py-2 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleQuizResults(quiz)}
                      className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                      View Results
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* Quiz Form View */}
      {activeView === "form" && (
        <div>
          <h3 className="text-xl font-semibold mb-4">
            {selectedQuiz ? "Edit Quiz" : "Create New Quiz"}
          </h3>
          {/* Mock QuizForm */}
          <button
            onClick={() => setActiveView("list")}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Back to List
          </button>
        </div>
      )}

      {/* Quiz Results View */}
      {activeView === "results" && (
        <div>
          <h3 className="text-xl font-semibold mb-4">
            Results for {selectedQuiz?.name}
          </h3>
          {/* Mock QuizResults */}
          <button
            onClick={() => setActiveView("list")}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Back to List
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizManagement;
