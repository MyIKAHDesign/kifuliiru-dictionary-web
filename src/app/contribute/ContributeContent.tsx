"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Loader2, Info } from "lucide-react";
import AudioRecorder from "./AudioRecorder";
import { Alert, AlertDescription } from "@/app/components/ui/alert";

interface FormData {
  igambo: string;
  igamboAudio: Blob | null;
  partOfSpeech: string;
  dialect: string;
  kifuliiru: string;
  kiswahili: string;
  kifaransa: string;
  kingereza: string;
  kifuliiruDefinitionAudio: Blob | null;
  nayemeraConsent: boolean;
  status: "draft" | "pending" | "published";
}

const ContributeContent: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const supabase = createClientComponentClient();

  const [formData, setFormData] = useState<FormData>({
    igambo: "",
    igamboAudio: null,
    partOfSpeech: "noun",
    dialect: "Central",
    kifuliiru: "",
    kiswahili: "",
    kifaransa: "",
    kingereza: "",
    kifuliiruDefinitionAudio: null,
    nayemeraConsent: false,
    status: "draft",
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
      if (!formData.nayemeraConsent) {
        throw new Error("Please accept the consent to submit.");
      }

      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError)
        throw new Error("Authentication error: " + userError.message);
      if (!user) throw new Error("Please sign in to submit words");

      // Upload word pronunciation audio if exists
      let wordAudioUrl = null;
      if (formData.igamboAudio) {
        const fileName = `word-audio/${Date.now()}.webm`;
        const { error: audioError } = await supabase.storage
          .from("audio-recordings")
          .upload(fileName, formData.igamboAudio);

        if (audioError)
          throw new Error("Failed to upload word audio: " + audioError.message);
        wordAudioUrl = fileName;
      }

      // Upload definition audio if exists
      let definitionAudioUrl = null;
      if (formData.kifuliiruDefinitionAudio) {
        const fileName = `definition-audio/${Date.now()}.webm`;
        const { error: audioError } = await supabase.storage
          .from("audio-recordings")
          .upload(fileName, formData.kifuliiruDefinitionAudio);

        if (audioError)
          throw new Error(
            "Failed to upload definition audio: " + audioError.message
          );
        definitionAudioUrl = fileName;
      }

      // Create database entry with audio URLs if available
      const dbEntry = {
        igambo: formData.igambo,
        kifuliiru: formData.kifuliiru,
        kiswahili: formData.kiswahili,
        kifaransa: formData.kifaransa,
        kingereza: formData.kingereza,
        status: "pending",
        nayemera_consent: formData.nayemeraConsent,
        owner_id: user.id,
        created_date: new Date().toISOString(),
        igambo_audio_url: wordAudioUrl,
        kifuliiru_definition_audio_url: definitionAudioUrl,
      };

      const { error: insertError } = await supabase
        .from("magambo")
        .insert(dbEntry);

      if (insertError) {
        console.error("Database insertion error:", insertError);
        throw new Error("Failed to save word entry: " + insertError.message);
      }

      setSuccess(true);
      // Reset form
      setFormData({
        igambo: "",
        igamboAudio: null,
        partOfSpeech: "noun",
        dialect: "Central",
        kifuliiru: "",
        kiswahili: "",
        kifaransa: "",
        kingereza: "",
        kifuliiruDefinitionAudio: null,
        nayemeraConsent: false,
        status: "draft",
      });
    } catch (error) {
      console.error("Submission error:", error);
      setError(error instanceof Error ? error.message : "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <Loader2 className="animate-spin h-8 w-8 text-orange-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Add a new word/sentence
          </h1>
        </div>

        {(error || success) && (
          <Alert
            className={`mb-6 ${
              error
                ? "bg-red-50 dark:bg-red-900/10"
                : "bg-green-50 dark:bg-green-900/10"
            }`}
          >
            <Info
              className={`h-4 w-4 ${error ? "text-red-600" : "text-green-600"}`}
            />
            <AlertDescription
              className={error ? "text-red-600" : "text-green-600"}
            >
              {error ||
                "Word successfully submitted! Thank you for your contribution."}
            </AlertDescription>
          </Alert>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <div className="space-y-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Word Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="igambo"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Kifuliiru Word/Phrase
                  </label>
                  <input
                    type="text"
                    id="igambo"
                    value={formData.igambo}
                    onChange={(e) =>
                      setFormData({ ...formData, igambo: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    required
                  />
                </div>

                <AudioRecorder
                  onRecordingComplete={(blob) =>
                    setFormData({ ...formData, igamboAudio: blob })
                  }
                  label="Record Word Pronunciation"
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
                      <option value="Central">Central Kifuliiru</option>
                      <option value="Northern">Northern Kifuliiru</option>
                      <option value="Southern">Southern Kifuliiru</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="kifuliiru"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Kifuliiru Definition
                  </label>
                  <textarea
                    id="kifuliiru"
                    value={formData.kifuliiru}
                    onChange={(e) =>
                      setFormData({ ...formData, kifuliiru: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    rows={3}
                    required
                  />
                </div>

                <AudioRecorder
                  onRecordingComplete={(blob) =>
                    setFormData({ ...formData, kifuliiruDefinitionAudio: blob })
                  }
                  label="Record Definition Explanation"
                />
              </div>
            </div>
          </div>

          <div className="space-y-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Translations
              </h2>

              <div>
                <label
                  htmlFor="kiswahili"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Kiswahili Translation
                </label>
                <textarea
                  id="kiswahili"
                  value={formData.kiswahili}
                  onChange={(e) =>
                    setFormData({ ...formData, kiswahili: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="kifaransa"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  French Translation
                </label>
                <textarea
                  id="kifaransa"
                  value={formData.kifaransa}
                  onChange={(e) =>
                    setFormData({ ...formData, kifaransa: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="kingereza"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  English Translation
                </label>
                <textarea
                  id="kingereza"
                  value={formData.kingereza}
                  onChange={(e) =>
                    setFormData({ ...formData, kingereza: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  rows={3}
                  required
                />
              </div>

              <div className="flex items-center space-x-2 mt-6">
                <input
                  type="checkbox"
                  id="consent"
                  checked={formData.nayemeraConsent}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      nayemeraConsent: e.target.checked,
                    })
                  }
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="consent"
                  className="text-sm text-gray-700 dark:text-gray-300"
                >
                  I confirm this contribution is accurate and I agree to share
                  it under our open license
                </label>
              </div>

              <div className="flex justify-end pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700
                           flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
          </div>
        </form>
      </main>
    </div>
  );
};

export default ContributeContent;
