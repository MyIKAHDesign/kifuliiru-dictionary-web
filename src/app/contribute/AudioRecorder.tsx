"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Pause, Play, StopCircle } from "lucide-react";

interface AudioRecorderProps {
  onRecordingComplete: (blob: Blob) => void;
  label: string;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onRecordingComplete,
  label,
}) => {
  const [isClient, setIsClient] = useState(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Use effect to mark when component is mounted on client
  useEffect(() => {
    setIsClient(true);
  }, []);

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

  // Don't render anything until we confirm we're on the client
  if (!isClient) {
    return null;
  }

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

export default AudioRecorder;
