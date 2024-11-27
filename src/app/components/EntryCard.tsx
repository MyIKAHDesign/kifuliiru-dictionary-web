import { useState } from "react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import {
  Volume2,
  Pencil,
  CheckCircle,
  Clock,
  AlertCircle,
  RotateCcw,
} from "lucide-react";

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
  const [wordAudioState, setWordAudioState] = useState({
    isPlaying: false,
    hasError: false,
  });
  const [definitionAudioState, setDefinitionAudioState] = useState({
    isPlaying: false,
    hasError: false,
  });

  const statusConfig = {
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
    audioUrl: string | undefined,
    setAudioState: typeof setWordAudioState
  ) => {
    if (!audioUrl) {
      setAudioState({ isPlaying: false, hasError: true });
      return;
    }

    try {
      setAudioState({ isPlaying: true, hasError: false });
      const audio = new Audio(audioUrl);

      audio.addEventListener("ended", () => {
        setAudioState({ isPlaying: false, hasError: false });
      });

      audio.addEventListener("error", () => {
        setAudioState({ isPlaying: false, hasError: true });
      });

      await audio.play();
    } catch (error) {
      console.error("Error playing audio:", error);
      setAudioState({ isPlaying: false, hasError: true });
    }
  };

  const StatusIcon = entry.status ? statusConfig[entry.status].icon : null;

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {entry.igambo}
            </h3>
            {showControls && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  playAudio(entry.igambo_audio_url, setWordAudioState)
                }
                disabled={wordAudioState.isPlaying}
                className={`${
                  wordAudioState.hasError
                    ? "text-red-500 hover:text-red-600"
                    : ""
                }`}
                title={
                  wordAudioState.hasError
                    ? "Audio unavailable"
                    : "Play word pronunciation"
                }
              >
                <Volume2
                  className={`h-4 w-4 ${
                    wordAudioState.isPlaying ? "animate-pulse" : ""
                  }`}
                />
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {entry.kifuliiru}
            </p>
            {showControls && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  playAudio(
                    entry.kifuliiru_definition_audio_url,
                    setDefinitionAudioState
                  )
                }
                disabled={definitionAudioState.isPlaying}
                className={`${
                  definitionAudioState.hasError
                    ? "text-red-500 hover:text-red-600"
                    : ""
                }`}
                title={
                  definitionAudioState.hasError
                    ? "Audio unavailable"
                    : "Play definition pronunciation"
                }
              >
                <Volume2
                  className={`h-4 w-4 ${
                    definitionAudioState.isPlaying ? "animate-pulse" : ""
                  }`}
                />
              </Button>
            )}
          </div>
        </div>

        {showControls && onEdit && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(entry.id)}
            className="hover:text-blue-600"
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
