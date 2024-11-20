"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import AudioRecorder from "./AudioRecorder";

interface FormData {
  term: string;
  termAudio: Blob | null;
  partOfSpeech: string;
  dialect: string;
  definitions: {
    kifuliiru: string;
    english: string;
    french: string;
    swahili: string;
  };
  definitionAudio: Blob | null;
}

const ContributeContent: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const [formData, setFormData] = useState<FormData>({
    term: "",
    termAudio: null,
    partOfSpeech: "noun",
    dialect: "Central Kifuliiru",
    definitions: {
      kifuliiru: "",
      english: "",
      french: "",
      swahili: "",
    },
    definitionAudio: null,
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess(true);
      setFormData({
        term: "",
        termAudio: null,
        partOfSpeech: "noun",
        dialect: "Central Kifuliiru",
        definitions: {
          kifuliiru: "",
          english: "",
          french: "",
          swahili: "",
        },
        definitionAudio: null,
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  const languageOrder = ["english", "french", "swahili"] as const;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-12 max-w-7xl">
        {!isClient ? (
          <div className="flex items-center justify-center min-h-[600px]">
            <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <div className="space-y-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Basic Information
                </h2>

                <div className="space-y-4">
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
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      required
                    />
                  </div>
                  <AudioRecorder
                    onRecordingComplete={(blob) =>
                      setFormData({ ...formData, termAudio: blob })
                    }
                    label="Record Word"
                  />

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
                          setFormData({
                            ...formData,
                            partOfSpeech: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                                 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
                                 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      >
                        <option value="Central Kifuliiru">
                          Central Kifuliiru
                        </option>
                        <option value="Northern Kifuliiru">
                          Northern Kifuliiru
                        </option>
                        <option value="Southern Kifuliiru">
                          Southern Kifuliiru
                        </option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="def-kifuliiru"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Kifuliiru Definition
                    </label>
                    <textarea
                      id="def-kifuliiru"
                      value={formData.definitions.kifuliiru}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          definitions: {
                            ...formData.definitions,
                            kifuliiru: e.target.value,
                          },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      rows={3}
                      required
                    />
                  </div>
                  <AudioRecorder
                    onRecordingComplete={(blob) =>
                      setFormData({ ...formData, definitionAudio: blob })
                    }
                    label="Record Definition"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Translations
                </h2>

                {languageOrder.map((lang) => (
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
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      rows={3}
                      required
                    />
                  </div>
                ))}
              </div>

              {(error || success) && (
                <div
                  className={`text-sm text-center ${
                    error ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {error || "Word successfully submitted!"}
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700
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
            </div>
          </form>
        )}
      </main>
    </div>
  );
};

export default ContributeContent;
