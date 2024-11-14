import { LucideIcon } from "lucide-react";

export interface TimelineEvent {
  year: string;
  event: string;
  description?: string;
}

export interface Fact {
  label: string;
  value: string;
  icon?: LucideIcon;
}

export interface CulturalFeature {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface GeographicFeature {
  title: string;
  description: string;
  icon: LucideIcon;
  location?: string;
}

export interface LanguageFeature {
  title: string;
  description: string;
  icon: LucideIcon;
  examples?: string[];
}
