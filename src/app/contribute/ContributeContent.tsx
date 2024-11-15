"use client";

import { useState, useRef } from "react";
import { Loader2, Mic, Pause, Play, StopCircle } from "lucide-react";

interface AudioRecorderProps {
  onRecordingComplete: (blob: Blob) => void;
  label: string;
}

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
  examples: {
    kifuliiru: string;
    english: string;
    french: string;
    swahili: string;
  };
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onRecordingComplete,
  label,
}) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async (): Promise<void> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (e: BlobEvent) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        setAudioBlob(blob);
        onRecordingComplete(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Could not access microphone", err);
    }
  };

  const pauseRecording = (): void => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.pause();
      if (timerRef.current) clearInterval(timerRef.current);
      setIsPaused(true);
    }
  };

  const resumeRecording = (): void => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.resume();
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
      setIsPaused(false);
    }
  };

  const stopRecording = (): void => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      if (timerRef.current) clearInterval(timerRef.current);
      setIsRecording(false);
      setIsPaused(false);
      setRecordingTime(0);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </p>
      <div className="flex items-center space-x-2">
        {!isRecording ? (
          <button
            type="button"
            onClick={startRecording}
            className="flex items-center space-x-2 px-3 py-1.5 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
          >
            <Mic className="h-4 w-4" />
            <span>Record</span>
          </button>
        ) : (
          <>
            {isPaused ? (
              <button
                type="button"
                onClick={resumeRecording}
                className="flex items-center space-x-2 px-3 py-1.5 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
              >
                <Play className="h-4 w-4" />
                <span>Continue</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={pauseRecording}
                className="flex items-center space-x-2 px-3 py-1.5 bg-yellow-600 text-white text-sm rounded-md hover:bg-yellow-700"
              >
                <Pause className="h-4 w-4" />
                <span>Pause</span>
              </button>
            )}
            <button
              type="button"
              onClick={stopRecording}
              className="flex items-center space-x-2 px-3 py-1.5 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
            >
              <StopCircle className="h-4 w-4" />
              <span>Stop</span>
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {formatTime(recordingTime)}
            </span>
          </>
        )}
      </div>
      {isRecording && (
        <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-red-600 rounded-full transition-all duration-200"
            style={{ width: `${(recordingTime % 60) * 1.67}%` }}
          />
        </div>
      )}
      {audioBlob && (
        <audio controls className="w-full mt-2" style={{ height: "30px" }}>
          <source src={URL.createObjectURL(audioBlob)} type="audio/webm" />
        </audio>
      )}
    </div>
  );
};

const ContributeContent: React.FC = () => {
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
    examples: {
      kifuliiru: "",
      english: "",
      french: "",
      swahili: "",
    },
  });

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

  const languageOrder = ["english", "french", "swahili"] as const;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Contribute to the Dictionary
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Help expand the Kifuliiru dictionary by adding new words and
            translations
          </p>
        </div>

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
                Translations & Examples
              </h2>

              {languageOrder.map((lang) => (
                <div key={lang} className="space-y-4">
                  <div>
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

                  <div>
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
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
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
      </main>
    </div>
  );
};

export default ContributeContent;
