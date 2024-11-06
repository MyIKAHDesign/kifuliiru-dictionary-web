"use client";
import { useState } from "react";

interface FormData {
  word: string;
  translationKifuliiru: string;
  translationKiswahili: string;
  translationFrench: string;
  translationEnglish: string;
  file: File | null;
}

export default function Contribute() {
  const [formData, setFormData] = useState<FormData>({
    word: "",
    translationKifuliiru: "",
    translationKiswahili: "",
    translationFrench: "",
    translationEnglish: "",
    file: null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFormData((prevData) => ({
      ...prevData,
      file,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here (e.g., send data to the backend or API)
    alert("Your contribution has been submitted for review.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10">
      <div className="container mx-auto max-w-2xl p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-indigo-700 mb-6 text-center">
          Contribute to the Kifuliiru Dictionary
        </h1>
        <p className="text-gray-600 mb-8 text-center">
          Help us expand the dictionary by submitting new words, translations,
          or media content. Your contributions will go through a validation
          process before being added.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Word Field */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Word</label>
            <input
              type="text"
              name="word"
              value={formData.word}
              onChange={handleChange}
              placeholder="Enter the word"
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Translation Fields */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Translation in Kifuliiru
            </label>
            <input
              type="text"
              name="translationKifuliiru"
              value={formData.translationKifuliiru}
              onChange={handleChange}
              placeholder="Translation in Kifuliiru"
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Translation in Kiswahili
            </label>
            <input
              type="text"
              name="translationKiswahili"
              value={formData.translationKiswahili}
              onChange={handleChange}
              placeholder="Translation in Kiswahili"
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Translation in French
            </label>
            <input
              type="text"
              name="translationFrench"
              value={formData.translationFrench}
              onChange={handleChange}
              placeholder="Translation in French"
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Translation in English
            </label>
            <input
              type="text"
              name="translationEnglish"
              value={formData.translationEnglish}
              onChange={handleChange}
              placeholder="Translation in English"
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Upload Audio/Video
            </label>
            <input
              type="file"
              name="file"
              accept="audio/*,video/*"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition-colors"
          >
            Submit Contribution
          </button>
        </form>
      </div>
    </div>
  );
}
