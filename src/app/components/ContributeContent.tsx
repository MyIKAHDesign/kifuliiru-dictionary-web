// components/ContributeContent.tsx
"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function ContributeContent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    term: "",
    partOfSpeech: "noun",
    dialect: "Central Kifuliiru",
    definitions: {
      kifuliiru: "",
      english: "",
      french: "",
      swahili: "",
    },
    examples: {
      kifuliiru: "",
      english: "",
      french: "",
      swahili: "",
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      // TODO: Add your submission logic here
      // For now, we'll just simulate a submission
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess(true);
      setFormData({
        term: "",
        partOfSpeech: "noun",
        dialect: "Central Kifuliiru",
        definitions: {
          kifuliiru: "",
          english: "",
          french: "",
          swahili: "",
        },
        examples: {
          kifuliiru: "",
          english: "",
          french: "",
          swahili: "",
        },
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Contribute to the Dictionary
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Help expand the Kifuliiru dictionary by adding new words and
            translations
          </p>
        </div>

        {/* Contribution Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"
        >
          {/* Basic Word Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Basic Information
            </h2>

            <div>
              <label
                htmlFor="term"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Kifuliiru Word/Phrase
              </label>
              <input
                type="text"
                id="term"
                value={formData.term}
                onChange={(e) =>
                  setFormData({ ...formData, term: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                         focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="partOfSpeech"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Part of Speech
                </label>
                <select
                  id="partOfSpeech"
                  value={formData.partOfSpeech}
                  onChange={(e) =>
                    setFormData({ ...formData, partOfSpeech: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                           focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="noun">Noun</option>
                  <option value="verb">Verb</option>
                  <option value="adjective">Adjective</option>
                  <option value="phrase">Phrase</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="dialect"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Dialect
                </label>
                <select
                  id="dialect"
                  value={formData.dialect}
                  onChange={(e) =>
                    setFormData({ ...formData, dialect: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                           focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="Central Kifuliiru">Central Kifuliiru</option>
                  <option value="Northern Kifuliiru">Northern Kifuliiru</option>
                  <option value="Southern Kifuliiru">Southern Kifuliiru</option>
                </select>
              </div>
            </div>
          </div>

          {/* Definitions */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Definitions
            </h2>

            {(["kifuliiru", "english", "french", "swahili"] as const).map(
              (lang) => (
                <div key={lang}>
                  <label
                    htmlFor={`def-${lang}`}
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 capitalize"
                  >
                    {lang} Definition
                  </label>
                  <textarea
                    id={`def-${lang}`}
                    value={formData.definitions[lang]}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        definitions: {
                          ...formData.definitions,
                          [lang]: e.target.value,
                        },
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                           focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    rows={3}
                    required
                  />
                </div>
              )
            )}
          </div>

          {/* Examples */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Usage Examples
            </h2>

            {(["kifuliiru", "english", "french", "swahili"] as const).map(
              (lang) => (
                <div key={lang}>
                  <label
                    htmlFor={`example-${lang}`}
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 capitalize"
                  >
                    {lang} Example
                  </label>
                  <input
                    type="text"
                    id={`example-${lang}`}
                    value={formData.examples[lang]}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        examples: {
                          ...formData.examples,
                          [lang]: e.target.value,
                        },
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                           focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              )
            )}
          </div>

          {/* Error and Success Messages */}
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          {success && (
            <div className="text-green-500 text-sm text-center">
              Word successfully submitted!
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                       flex items-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5" />
                  <span>Submitting...</span>
                </>
              ) : (
                <span>Submit Word</span>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
