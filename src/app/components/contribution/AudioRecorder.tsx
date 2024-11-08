import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Mic,
  Play,
  Pause,
  Trash2,
  StopCircle,
  Square,
  CircleDot,
} from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";

interface AudioRecorderProps {
  onAudioChange: (file: File | null) => void;
}

export function AudioRecorder({ onAudioChange }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number>();

  useEffect(() => {
    return () => {
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [audioURL]);

  const RecordingWaves = () => (
    <div className="absolute inset-0 flex items-center justify-center gap-1">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="w-1 bg-indigo-600 dark:bg-indigo-400"
          initial={{ height: 4 }}
          animate={{
            height: [4, 16, 4],
          }}
          transition={{
            repeat: Infinity,
            duration: 1,
            delay: i * 0.2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );

  const handleTimeUpdate = () => {
    if (audioElementRef.current) {
      setCurrentTime(audioElementRef.current.currentTime || 0);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioElementRef.current && !isNaN(audioElementRef.current.duration)) {
      setDuration(audioElementRef.current.duration);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/wav" });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        onAudioChange(
          new File([audioBlob], "recording.wav", { type: "audio/wav" })
        );
        setCurrentTime(0);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setIsPaused(false);
      setCurrentTime(0);
      timerRef.current = window.setInterval(() => {
        setCurrentTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current?.state === "paused") {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      timerRef.current = window.setInterval(() => {
        setCurrentTime((prev) => prev + 1);
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current?.state === "recording" ||
      mediaRecorderRef.current?.state === "paused"
    ) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      setIsRecording(false);
      setIsPaused(false);
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    }
  };

  const togglePlayback = () => {
    if (audioElementRef.current) {
      if (isPlaying) {
        audioElementRef.current.pause();
      } else {
        audioElementRef.current.play().catch(console.error);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const deleteRecording = () => {
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
      setAudioURL(null);
      onAudioChange(null);
      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(false);
    }
  };

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds) || !isFinite(timeInSeconds)) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const getRecordingIcon = () => {
    if (!isRecording) {
      return <Mic className="h-6 w-6" />;
    }
    return isPaused ? (
      <CircleDot className="h-6 w-6" />
    ) : (
      <Square className="h-6 w-6" />
    );
  };

  const getProgressWidth = () => {
    if (!audioURL) {
      // Recording progress
      return `${(currentTime % 60) * 1.67}%`;
    }
    // Playback progress
    if (duration <= 0 || isNaN(duration)) return "0%";
    const progress = (currentTime / duration) * 100;
    return `${isNaN(progress) ? 0 : Math.min(100, Math.max(0, progress))}%`;
  };

  return (
    <Card className="bg-gray-50 dark:bg-gray-800">
      <CardContent className="p-6 text-center">
        {!audioURL ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-4">
              <motion.button
                type="button"
                onClick={
                  isRecording
                    ? isPaused
                      ? resumeRecording
                      : pauseRecording
                    : startRecording
                }
                className={`p-4 rounded-full ${
                  isRecording
                    ? isPaused
                      ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400"
                      : "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400"
                    : "bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {getRecordingIcon()}
              </motion.button>
              {isRecording && (
                <motion.button
                  type="button"
                  onClick={stopRecording}
                  className="p-4 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <StopCircle className="h-6 w-6" />
                </motion.button>
              )}
            </div>
            {isRecording && (
              <div className="space-y-2">
                <div className="relative w-full bg-gray-200 dark:bg-gray-700 h-8 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-indigo-600/20 dark:bg-indigo-400/20"
                    style={{ width: getProgressWidth() }}
                    transition={{ type: "spring", bounce: 0 }}
                  />
                  {!isPaused && <RecordingWaves />}
                </div>
                <p className="text-sm font-mono text-gray-600 dark:text-gray-400">
                  {formatTime(currentTime)}
                </p>
              </div>
            )}
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isRecording
                ? isPaused
                  ? "Recording paused... Click to resume"
                  : "Recording... Click to pause"
                : "Click to start recording"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-4">
              <Button variant="outline" size="icon" onClick={togglePlayback}>
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                onClick={deleteRecording}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              <div className="relative w-full bg-gray-200 dark:bg-gray-700 h-8 rounded-full overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-indigo-600/20 dark:bg-indigo-400/20"
                  style={{ width: getProgressWidth() }}
                  transition={{ type: "spring", bounce: 0 }}
                />
                {isPlaying && <RecordingWaves />}
              </div>
              <div className="flex justify-between text-sm font-mono text-gray-600 dark:text-gray-400">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
            <audio
              ref={audioElementRef}
              src={audioURL}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={() => {
                setIsPlaying(false);
                setCurrentTime(0);
              }}
              className="hidden"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
