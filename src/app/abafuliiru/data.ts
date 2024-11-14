import {
  History,
  Users,
  MapPin,
  Languages,
  Mountain,
  Waves,
  TreePine,
  Music,
  Book,
  Pen,
  Globe,
  Smartphone,
  Crown,
  Brush,
  BookOpen,
  Home,
} from "lucide-react";
import {
  CulturalFeature,
  Fact,
  GeographicFeature,
  LanguageFeature,
  TimelineEvent,
} from "./types";

export const sections = [
  {
    id: "history",
    title: "Historical Legacy",
    icon: History,
    description: "Exploring our rich past and cultural evolution",
  },
  {
    id: "culture",
    title: "Cultural Heritage",
    icon: Users,
    description: "Traditions, customs, and social practices",
  },
  {
    id: "geography",
    title: "Geographic Roots",
    icon: MapPin,
    description: "Our ancestral lands and natural environment",
  },
  {
    id: "language",
    title: "Kifuliiru Language",
    icon: Languages,
    description: "Preserving and promoting our mother tongue",
  },
];

export const historicalFacts: Fact[] = [
  { label: "Population", value: "500,000+", icon: Users },
  { label: "Region", value: "South Kivu, DRC", icon: MapPin },
  { label: "Primary Language", value: "Kifuliiru", icon: Languages },
  { label: "Major Centers", value: "Uvira, Lemera", icon: Home },
];

export const timeline: TimelineEvent[] = [
  {
    year: "Pre-1800s",
    event: "Early Settlement",
    description:
      "Establishment of the first Abafuliiru communities in South Kivu",
  },
  {
    year: "1800-1850",
    event: "Traditional Governance",
    description: "Development of traditional leadership structures",
  },
  {
    year: "1850-1900",
    event: "Cultural Foundations",
    description: "Establishment of key cultural practices and traditions",
  },
  {
    year: "1900-1960",
    event: "Colonial Period",
    description: "Preservation of culture during colonial times",
  },
  {
    year: "1960-Present",
    event: "Modern Era",
    description: "Cultural renaissance and adaptation to modern times",
  },
];

export const culturalFeatures: CulturalFeature[] = [
  {
    title: "Traditional Music",
    description: "Rich musical heritage with unique instruments and rhythms",
    icon: Music,
  },
  {
    title: "Ceremonies",
    description: "Important life-cycle and seasonal celebrations",
    icon: Crown,
  },
  {
    title: "Arts & Crafts",
    description: "Traditional craftsmanship and artistic expressions",
    icon: Brush,
  },
  {
    title: "Oral Traditions",
    description: "Stories, proverbs, and wisdom passed through generations",
    icon: BookOpen,
  },
];

export const geographicFeatures: GeographicFeature[] = [
  {
    title: "Mountain Ranges",
    description: "Sacred peaks and highland settlements",
    icon: Mountain,
    location: "Eastern Highlands",
  },
  {
    title: "River Systems",
    description: "Life-giving waterways and fishing traditions",
    icon: Waves,
    location: "Ruzizi Valley",
  },
  {
    title: "Forest Regions",
    description: "Ancient woodlands and traditional medicine",
    icon: TreePine,
    location: "Itombwe Forest",
  },
];

export const languageFeatures: LanguageFeature[] = [
  {
    title: "Oral Literature",
    description: "Rich traditions of storytelling and poetry",
    icon: Book,
    examples: ["Proverbs", "Folk tales", "Songs"],
  },
  {
    title: "Modern Literacy",
    description: "Contemporary written documentation and education",
    icon: Pen,
  },
  {
    title: "Dialects",
    description: "Regional variations and linguistic diversity",
    icon: Globe,
  },
  {
    title: "Digital Presence",
    description: "Language preservation through technology",
    icon: Smartphone,
  },
];
