"use client";

import { useState, useEffect } from "react";
import { Loader2, Save, Trash2 } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/components/ui/alert-dialog";
import AudioRecorder from "./AudioRecorder";
import { useToast } from "@/app/components/ui/use-toast";
import useDebounce from "../hooks/useDebounce";

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

const initialFormData: FormData = {
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
};

export default function ContributeContent() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const debouncedFormData = useDebounce(formData, 1000);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    // Load autosaved data if it exists
    const savedData = localStorage.getItem("draftEntry");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(parsed);
        toast({
          title: "Draft Loaded",
          description: "Your previous draft has been restored.",
          duration: 3000,
        });
      } catch (e) {
        console.error("Error loading saved draft:", e);
      }
    }
  }, [toast]);

  // Autosave functionality
  useEffect(() => {
    if (isDirty) {
      const formDataToSave = {
        ...debouncedFormData,
        termAudio: null, // Don't save audio blobs
        definitionAudio: null,
      };
      localStorage.setItem("draftEntry", JSON.stringify(formDataToSave));
      toast({
        title: "Draft Saved",
        description: "Your changes have been automatically saved.",
        duration: 2000,
      });
    }
  }, [debouncedFormData, isDirty, toast]);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      // Submit logic here
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess(true);
      setFormData(initialFormData);
      setIsDirty(false);
      localStorage.removeItem("draftEntry");
      toast({
        title: "Success!",
        description: "Your entry has been submitted successfully.",
        duration: 5000,
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setFormData(initialFormData);
    setIsDirty(false);
    localStorage.removeItem("draftEntry");
    toast({
      title: "Form Cleared",
      description: "All form data has been cleared.",
      duration: 3000,
    });
  };

  const languageOrder = ["english", "french", "swahili"] as const;

  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-16rem)] bg-gray-50 dark:bg-gray-900">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Left Card: Basic Information */}
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
                    onChange={(e) => {
                      setFormData({ ...formData, term: e.target.value });
                      setIsDirty(true);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    required
                  />
                </div>

                <AudioRecorder
                  onRecordingComplete={(blob) => {
                    setFormData({ ...formData, termAudio: blob });
                    setIsDirty(true);
                  }}
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
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          partOfSpeech: e.target.value,
                        });
                        setIsDirty(true);
                      }}
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
                      onChange={(e) => {
                        setFormData({ ...formData, dialect: e.target.value });
                        setIsDirty(true);
                      }}
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
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        definitions: {
                          ...formData.definitions,
                          kifuliiru: e.target.value,
                        },
                      });
                      setIsDirty(true);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    rows={3}
                    required
                  />
                </div>

                <AudioRecorder
                  onRecordingComplete={(blob) => {
                    setFormData({ ...formData, definitionAudio: blob });
                    setIsDirty(true);
                  }}
                  label="Record Definition"
                />
              </div>
            </div>
          </div>

          {/* Right Card: Translations */}
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
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        definitions: {
                          ...formData.definitions,
                          [lang]: e.target.value,
                        },
                      });
                      setIsDirty(true);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    rows={3}
                    required
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons - Below both cards */}
        <div className="flex justify-between items-center pt-6">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Clear Form
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear Form?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will remove all entered data and cannot be undone. Your
                  draft will also be deleted.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={clearForm}>Clear</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 min-w-[150px] justify-center bg-indigo-600 hover:bg-indigo-700"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Submit Entry</span>
              </>
            )}
          </Button>
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
      </form>
    </div>
  );
}
