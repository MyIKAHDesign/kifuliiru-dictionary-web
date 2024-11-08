"use client";

import { useState } from "react";
import { ChevronRight, Globe, Type, Volume2 } from "lucide-react";
import { useTheme } from "next-themes";
import { Card, CardContent } from "../components/ui/card";
import { Alert } from "../components/ui/alert";
import { InputField } from "../components/contribution/InputField";
import { AudioRecorder } from "../components/contribution/AudioRecorder";
import { Button } from "../components/ui/button";
import Header from "../components/Header";
import Footer from "../components/Footer";

interface Translations {
  kifuliiru: string;
  kiswahili: string;
  french: string;
  english: string;
}

interface FormData {
  word: string;
  description: string;
  translations: Translations;
  audioFile: File | null;
}

export default function ContributePage() {
  const { theme } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const initialFormState: FormData = {
    word: "",
    description: "",
    translations: {
      kifuliiru: "",
      kiswahili: "",
      french: "",
      english: "",
    },
    audioFile: null,
  };

  const [formData, setFormData] = useState<FormData>(initialFormState);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      if (parent === "translations") {
        setFormData((prev: FormData) => ({
          ...prev,
          translations: {
            ...prev.translations,
            [child]: value,
          },
        }));
      }
    } else {
      setFormData((prev: FormData) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAudioChange = (file: File | null) => {
    setFormData((prev: FormData) => ({
      ...prev,
      audioFile: file,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      // Simulated API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setMessage({
        type: "success",
        text: "Entry submitted successfully! It will be reviewed before publication.",
      });

      // Reset form
      setFormData(initialFormState);
    } catch (err) {
      console.error("Error submitting form:", err);
      setMessage({
        type: "error",
        text: "Error submitting entry. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 ${theme}`}
    >
      <Header />
      <div className="container mx-auto max-w-6xl p-6">
        <Card className="overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
            <h1 className="text-3xl font-bold mb-2">
              Contribute to the Dictionary
            </h1>
            <p className="text-blue-100">
              Share your knowledge and help preserve our language
            </p>
          </div>

          <CardContent className="p-6">
            {message && (
              <Alert
                className={
                  message.type === "error" ? "bg-red-50" : "bg-green-50 mb-6"
                }
              >
                {message.text}
              </Alert>
            )}

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {/* Left Column */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-lg font-medium text-gray-800 dark:text-gray-200">
                    <Type className="h-5 w-5" />
                    Word Information
                  </div>

                  <div className="grid gap-4">
                    <InputField
                      label="Word in Kifuliiru"
                      name="word"
                      value={formData.word}
                      onChange={handleChange}
                      placeholder="Enter the word"
                      required
                    />

                    <InputField
                      label="Kifuliiru Translation "
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Add the Kifuliiru translation"
                      isTextarea
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-lg font-medium text-gray-800 dark:text-gray-200">
                    <Volume2 className="h-5 w-5" />
                    Pronunciation
                  </div>

                  <AudioRecorder onAudioChange={handleAudioChange} />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-lg font-medium text-gray-800 dark:text-gray-200">
                    <Globe className="h-5 w-5" />
                    Translations
                  </div>

                  <div className="grid gap-4">
                    <InputField
                      label="Kiswahili Translation"
                      name="translations.kiswahili"
                      value={formData.translations.kiswahili}
                      onChange={handleChange}
                      placeholder="Enter Kiswahili translation"
                      isTextarea
                    />
                    <InputField
                      label="French Translation"
                      name="translations.french"
                      value={formData.translations.french}
                      onChange={handleChange}
                      placeholder="Enter French translation"
                      isTextarea
                    />
                    <InputField
                      label="English Translation"
                      name="translations.english"
                      value={formData.translations.english}
                      onChange={handleChange}
                      placeholder="Enter English translation"
                      isTextarea
                    />
                  </div>
                </div>
              </div>

              {/* Full-width Submit Button */}
              <div className="md:col-span-2 mt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-lg py-6 text-white"
                >
                  <span>
                    {isSubmitting
                      ? "Submitting..."
                      : "Submit New Dictionary Entry"}
                  </span>
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
