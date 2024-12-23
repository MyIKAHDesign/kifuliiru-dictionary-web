// types/stats.ts
import { LucideIcon } from "lucide-react";

export type ColorType = "indigo" | "purple" | "blue" | "teal";

export interface StatData {
  title: string;
  count: number;
  description: string;
  buttonLabel?: string;
  buttonLink?: string;
  color: ColorType;
  icon: LucideIcon;
}

export interface StatsCardProps extends StatData {
  delay?: number;
}

export interface DatabaseStats {
  entries: number;
  languages: number;
  translations: number;
  contributors: number;
}
