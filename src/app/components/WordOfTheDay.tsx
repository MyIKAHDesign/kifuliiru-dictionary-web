import React from "react";
import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  Volume2,
  Calendar,
  BookOpen,
  Share2,
  Heart,
  Languages,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";

interface WordOfTheDay {
  id: string;
  igambo: string;
  kifuliiru: string;
  kiswahili: string;
  kifaransa: string;
  kingereza: string;
  igambo_audio_url?: string;
  created_at: string;
  featured_date: string;
}

export default function WordOfTheDay() {
  const [word, setWord] = useState<WordOfTheDay | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchWordOfTheDay() {
      try {
        const today = new Date().toISOString().split("T")[0];
        const { data, error } = await supabase
          .from("word_of_the_day")
          .select("*")
          .eq("featured_date", today)
          .single();

        if (error) throw error;
        setWord(data);
      } catch (err) {
        console.error("Error fetching word of the day:", err);
        setError("Failed to load word of the day");
      } finally {
        setIsLoading(false);
      }
    }

    fetchWordOfTheDay();
  }, [supabase]);

  const handlePlayAudio = () => {
    if (!word?.igambo_audio_url) return;
    setIsPlaying(true);
    const audio = new Audio(word.igambo_audio_url);
    audio.onended = () => setIsPlaying(false);
    audio.play().catch((err) => {
      console.error("Error playing audio:", err);
      setIsPlaying(false);
    });
  };

  const handleShare = async () => {
    if (!word) return;
    try {
      await navigator.share({
        title: "Kifuliiru Word of the Day",
        text: `Learn "${word.igambo}" in Kifuliiru! It means "${word.kingereza}" in English.`,
        url: window.location.href,
      });
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !word) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6">
        <Sparkles className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          No Word of the Day Available
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Check back tomorrow for a new word!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className="text-sm">
            <Calendar className="h-4 w-4 mr-2" />
            Word of the Day
          </Badge>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsLiked(!isLiked)}
              className={`${
                isLiked
                  ? "text-red-500 hover:text-red-600"
                  : "text-gray-500 hover:text-gray-600"
              }`}
            >
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleShare}>
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            {/* Word Section */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {word.igambo}
                  </h1>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePlayAudio}
                      disabled={!word.igambo_audio_url || isPlaying}
                      className="relative"
                    >
                      <Volume2
                        className={`h-4 w-4 ${
                          isPlaying ? "animate-pulse" : ""
                        }`}
                      />
                      {isPlaying && (
                        <span className="absolute inset-0 rounded-full animate-ping bg-primary/20" />
                      )}
                    </Button>
                    <Badge variant="secondary">
                      <Languages className="h-4 w-4 mr-1" />
                      Kifuliiru
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Tabs defaultValue="kifuliiru">
                  <TabsList className="mb-4">
                    <TabsTrigger value="kifuliiru">Kifuliiru</TabsTrigger>
                    <TabsTrigger value="english">English</TabsTrigger>
                    <TabsTrigger value="french">Français</TabsTrigger>
                    <TabsTrigger value="swahili">Kiswahili</TabsTrigger>
                  </TabsList>

                  <TabsContent value="kifuliiru" className="mt-4">
                    <div className="prose dark:prose-invert">
                      <p className="text-lg">{word.kifuliiru}</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="english" className="mt-4">
                    <div className="prose dark:prose-invert">
                      <p className="text-lg">{word.kingereza}</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="french" className="mt-4">
                    <div className="prose dark:prose-invert">
                      <p className="text-lg">{word.kifaransa}</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="swahili" className="mt-4">
                    <div className="prose dark:prose-invert">
                      <p className="text-lg">{word.kiswahili}</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>

          {/* Additional Resources */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap gap-4">
              <Button variant="outline" className="group">
                <BookOpen className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                View in Dictionary
              </Button>
              <Button variant="outline" className="group">
                <Languages className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                More Translations
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Study Reminder */}
      <div className="mt-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    Learn Something New Every Day
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Come back tomorrow for another word!
                  </p>
                </div>
              </div>
              <Button>Enable Notifications</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
