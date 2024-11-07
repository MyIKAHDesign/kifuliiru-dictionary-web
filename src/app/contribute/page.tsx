"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Mic, Play, Pause, Trash2, ChevronRight } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import Header from "../components/Header";
import Footer from "../components/Footer";

interface FormData {
  word: string;
  translationKifuliiru: string;
  translationKiswahili: string;
  translationFrench: string;
  translationEnglish: string;
  file: File | null;
  description?: string;
}

interface AudioRecorderProps {
  onSave: (blob: Blob) => void;
}

const InputField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  placeholder: string;
  required?: boolean;
}) => (
  <div className="mb-4">
    <label className="block text-gray-700 font-medium mb-2">{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  </div>
);

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onSave }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLevel, setAudioLevel] = useState<number[]>(Array(30).fill(0));

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const animationFrameRef = useRef<number>();
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
    };
  }, [audioURL]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 64;

      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        onSave(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);

      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime((t) => t + 1);
      }, 1000);

      const updateAudioLevel = () => {
        if (analyserRef.current && isRecording) {
          const dataArray = new Uint8Array(
            analyserRef.current.frequencyBinCount
          );
          analyserRef.current.getByteFrequencyData(dataArray);
          const average =
            dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
          const normalized = Math.min(average / 128, 1);
          setAudioLevel((prev) => [...prev.slice(1), normalized]);
          animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
        }
      };
      updateAudioLevel();
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const handlePlayPause = () => {
    if (audioElementRef.current) {
      if (isPlaying) {
        audioElementRef.current.pause();
      } else {
        audioElementRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleDelete = () => {
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
      setAudioURL(null);
      setRecordingTime(0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {!audioURL ? (
            <>
              <div className="text-center">
                <motion.div
                  animate={
                    isRecording
                      ? {
                          scale: [1, 1.2, 1],
                          transition: { repeat: Infinity, duration: 1.5 },
                        }
                      : {}
                  }
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-full 
                             ${isRecording ? "bg-red-100" : "bg-gray-100"}`}
                >
                  <Mic
                    className={`h-8 w-8 ${
                      isRecording ? "text-red-500" : "text-gray-400"
                    }`}
                  />
                </motion.div>
              </div>

              {isRecording && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-center items-end h-12 gap-0.5"
                >
                  {audioLevel.map((level, i) => (
                    <motion.div
                      key={i}
                      className="w-1 bg-indigo-500 rounded-t"
                      initial={{ height: 0 }}
                      animate={{ height: `${level * 100}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  ))}
                </motion.div>
              )}

              <div className="text-center">
                <p className="text-gray-500 mb-2">
                  {isRecording ? formatTime(recordingTime) : "Ready to record"}
                </p>
                <motion.button
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`px-4 py-2 rounded-full font-medium
                             ${
                               isRecording
                                 ? "bg-red-500 text-white hover:bg-red-600"
                                 : "bg-indigo-500 text-white hover:bg-indigo-600"
                             }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isRecording ? "Stop Recording" : "Start Recording"}
                </motion.button>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handlePlayPause}
                  className="p-2 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleDelete}
                  className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                >
                  <Trash2 size={20} />
                </motion.button>
              </div>

              <audio
                ref={audioElementRef}
                src={audioURL}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              />

              <div className="text-center text-sm text-gray-500">
                Recording saved ({formatTime(recordingTime)})
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default function Contribute() {
  const [formData, setFormData] = useState<FormData>({
    word: "",
    translationKifuliiru: "",
    translationKiswahili: "",
    translationFrench: "",
    translationEnglish: "",
    file: null,
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAudioSave = (audioBlob: Blob) => {
    setFormData((prev) => ({
      ...prev,
      file: new File([audioBlob], "recording.wav", { type: "audio/wav" }),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add your submission logic here
    console.log("Form submitted:", formData);
    alert("Your contribution has been submitted for review.");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />

      <div className="flex-1 container mx-auto max-w-6xl p-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 bg-indigo-600 text-white">
            <h1 className="text-3xl font-bold mb-2">
              Contribute to the Kifuliiru Dictionary
            </h1>
            <p className="text-indigo-100">
              Help us preserve and expand our language. Your contribution
              matters!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  Word Information
                </h2>
                <InputField
                  label="Word"
                  name="word"
                  value={formData.word}
                  onChange={handleChange}
                  placeholder="Enter the word"
                  required
                />
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Add a detailed description"
                    className="w-full p-3 rounded-lg border border-gray-300 
                             focus:outline-none focus:ring-2 focus:ring-indigo-500
                             min-h-[120px]"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  Translations
                </h2>
                <InputField
                  label="Kifuliiru Translation"
                  name="translationKifuliiru"
                  value={formData.translationKifuliiru}
                  onChange={handleChange}
                  placeholder="Translation in Kifuliiru"
                  required
                />
                <InputField
                  label="Kiswahili Translation"
                  name="translationKiswahili"
                  value={formData.translationKiswahili}
                  onChange={handleChange}
                  placeholder="Translation in Kiswahili"
                />
                <InputField
                  label="French Translation"
                  name="translationFrench"
                  value={formData.translationFrench}
                  onChange={handleChange}
                  placeholder="Translation in French"
                />
                <InputField
                  label="English Translation"
                  name="translationEnglish"
                  value={formData.translationEnglish}
                  onChange={handleChange}
                  placeholder="Translation in English"
                />
              </div>
            </div>

            {/* Audio Recording Section */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Audio Recording
              </h2>
              <AudioRecorder onSave={handleAudioSave} />
            </div>

            {/* Submit Button */}
            <div className="mt-8">
              <motion.button
                type="submit"
                className="w-full py-3 bg-indigo-600 text-white rounded-lg 
                         hover:bg-indigo-700 transition-colors flex items-center 
                         justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Submit Contribution
                <ChevronRight size={20} />
              </motion.button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
