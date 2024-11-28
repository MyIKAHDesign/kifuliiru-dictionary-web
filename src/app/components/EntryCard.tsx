import { useState, useRef } from "react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  Volume2,
  Pencil,
  CheckCircle,
  Clock,
  AlertCircle,
  RotateCcw,
  VolumeX,
  LucideIcon,
} from "lucide-react";

interface AudioState {
  isPlaying: boolean;
  hasError: boolean;
  progress: number;
  duration: number;
}

interface StatusConfig {
  icon: LucideIcon;
  color: string;
  bgColor: string;
  label: string;
}

interface EntryCardProps {
  entry: {
    id: string;
    igambo: string;
    kifuliiru: string;
    status?: "pending" | "review" | "revision" | "approved";
    igambo_audio_url?: string;
    kifuliiru_definition_audio_url?: string;
    created_at: string;
  };
  onEdit?: (id: string) => void;
  showControls?: boolean;
}

export default function EntryCard({
  entry,
  onEdit,
  showControls = true,
}: EntryCardProps) {
  const supabase = createClientComponentClient();
  const [wordAudioState, setWordAudioState] = useState<AudioState>({
    isPlaying: false,
    hasError: false,
    progress: 0,
    duration: 0,
  });
  const [definitionAudioState, setDefinitionAudioState] = useState<AudioState>({
    isPlaying: false,
    hasError: false,
    progress: 0,
    duration: 0,
  });

  const wordAudioRef = useRef<HTMLAudioElement | null>(null);
  const definitionAudioRef = useRef<HTMLAudioElement | null>(null);

  const statusConfig: Record<string, StatusConfig> = {
    pending: {
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      label: "Pending",
    },
    review: {
      icon: RotateCcw,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      label: "In Review",
    },
    revision: {
      icon: AlertCircle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      label: "Needs Revision",
    },
    approved: {
      icon: CheckCircle,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      label: "Approved",
    },
  };

  const playAudio = async (
    storagePath: string | undefined,
    setAudioState: typeof setWordAudioState,
    audioRef: React.RefObject<HTMLAudioElement>
  ) => {
    if (!storagePath) {
      setAudioState((prev) => ({ ...prev, hasError: true }));
      return;
    }

    let objectUrl: string | null = null;

    try {
      const { data } = await supabase.storage
        .from("audio-recordings")
        .download(storagePath);

      if (!data) {
        throw new Error("Could not download audio");
      }

      objectUrl = URL.createObjectURL(data);

      if (audioRef.current) {
        audioRef.current.src = objectUrl;
        audioRef.current.play();
      }

      setAudioState((prev) => ({
        ...prev,
        isPlaying: true,
        hasError: false,
      }));
    } catch (error) {
      console.error("Error playing audio:", error);
      setAudioState((prev) => ({ ...prev, hasError: true }));
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    }
  };

  const handleTimeUpdate = (
    audioRef: HTMLAudioElement,
    setAudioState: typeof setWordAudioState
  ) => {
    const progress = (audioRef.currentTime / audioRef.duration) * 100;
    setAudioState((prev) => ({
      ...prev,
      progress,
      duration: audioRef.duration,
    }));
  };

  const handleAudioEnded = (
    setAudioState: typeof setWordAudioState,
    objectUrl?: string
  ) => {
    setAudioState((prev) => ({
      ...prev,
      isPlaying: false,
      progress: 0,
    }));
    if (objectUrl) URL.revokeObjectURL(objectUrl);
  };

  const renderAudioPlayer = (
    audioUrl: string | undefined,
    audioState: AudioState,
    setAudioState: typeof setWordAudioState,
    audioRef: React.RefObject<HTMLAudioElement>,
    label: string
  ) => (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => playAudio(audioUrl, setAudioState, audioRef)}
        disabled={wordAudioState.isPlaying || definitionAudioState.isPlaying}
        className={`relative ${
          audioState.hasError
            ? "text-red-500 hover:text-red-600"
            : audioState.isPlaying
            ? "text-blue-500"
            : "text-gray-500"
        }`}
        title={
          audioState.hasError
            ? "Audio unavailable"
            : audioState.isPlaying
            ? "Playing..."
            : `Play ${label} pronunciation`
        }
      >
        {audioState.hasError ? (
          <VolumeX className="h-4 w-4" />
        ) : (
          <Volume2
            className={`h-4 w-4 ${audioState.isPlaying ? "animate-pulse" : ""}`}
          />
        )}
      </Button>

      {audioState.isPlaying && (
        <div className="relative w-20 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-200"
            style={{ width: `${audioState.progress}%` }}
          />
        </div>
      )}

      <audio
        ref={audioRef}
        onTimeUpdate={(e) => handleTimeUpdate(e.currentTarget, setAudioState)}
        onEnded={() => handleAudioEnded(setAudioState)}
        onError={() => setAudioState((prev) => ({ ...prev, hasError: true }))}
        className="hidden"
      />
    </div>
  );

  const StatusIcon = entry.status ? statusConfig[entry.status].icon : null;

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {entry.igambo}
              </h3>
              {showControls &&
                entry.igambo_audio_url &&
                renderAudioPlayer(
                  entry.igambo_audio_url,
                  wordAudioState,
                  setWordAudioState,
                  wordAudioRef,
                  "word"
                )}
            </div>
          </div>

          <div className="flex-1">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              {entry.kifuliiru}
            </p>
            {showControls &&
              entry["kifuliiru_definition_audio_url"] &&
              renderAudioPlayer(
                entry["kifuliiru_definition_audio_url"],
                definitionAudioState,
                setDefinitionAudioState,
                definitionAudioRef,
                "definition"
              )}
          </div>
        </div>

        {showControls && onEdit && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(entry.id)}
            className="hover:text-blue-600"
            title="Edit entry"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </div>

      {entry.status && (
        <div className="flex justify-between items-center">
          <div
            className={`flex items-center gap-2 px-2 py-1 rounded-full ${
              statusConfig[entry.status].bgColor
            }`}
          >
            {StatusIcon && (
              <StatusIcon
                className={`h-4 w-4 ${statusConfig[entry.status].color}`}
              />
            )}
            <span
              className={`text-sm font-medium ${
                statusConfig[entry.status].color
              }`}
            >
              {statusConfig[entry.status].label}
            </span>
          </div>

          <span className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(entry.created_at).toLocaleDateString()}
          </span>
        </div>
      )}
    </Card>
  );
}
