// types/dictionary.ts

// Core dictionary entry types
export type PartOfSpeech =
  | "noun"
  | "verb"
  | "adjective"
  | "adverb"
  | "pronoun"
  | "preposition"
  | "conjunction"
  | "interjection"
  | "prefix"
  | "suffix";

export type EntryStatus =
  | "draft"
  | "review"
  | "published"
  | "archived"
  | "rejected";

export type MultimediaType = "audio" | "images" | "videos";

export interface KifuliiruContent {
  definition: string[];
  examples: string[];
}

export interface Translations {
  kiswahili: string[];
  french: string[];
  english: string[];
}

export interface CulturalContext {
  significance: string;
  usage: string;
  customs: string[];
}

export interface Multimedia {
  audio: string[];
  images: string[];
  videos: string[];
}

// Main dictionary entry interface
export interface DictionaryEntry {
  id: string;
  created_at: string;
  igambo: string;
  kifuliiru: string;
  kiswahili: string;
  kifaransa: string;
  kingereza: string;
  kishushanyo?: string;
  holidesirwi?: string;
  created_date?: string;
  updated_date?: string;
  owner_id: string;
  publish_date?: string;
  unpublish_date?: string;
  nayemera_consent?: boolean;
  igambo_audio_url?: string;
  kifuliiru_definition_audio_url?: string;
  status?: string;
}

// Form data interface (extends DictionaryEntry with form-specific fields)
export interface DictionaryFormData
  extends Omit<DictionaryEntry, "id" | "metadata"> {
  isDirty?: boolean;
  lastSaved?: Date;
  validationErrors?: ValidationErrors;
}

// Metadata for tracking and administration
export interface EntryMetadata {
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  lastModifiedBy: string;
  reviewedBy?: string;
  reviewedAt?: Date;
  publishedBy?: string;
  publishedAt?: Date;
  version: number;
  contributors: string[];
  revisionHistory: RevisionRecord[];
}

// Revision history tracking
export interface RevisionRecord {
  timestamp: Date;
  userId: string;
  changes: RevisionChange[];
  comment?: string;
}

export interface RevisionChange {
  field: string;
  oldValue: unknown;
  newValue: unknown;
}

// Validation types
export interface ValidationErrors {
  word?: string[];
  ipa?: string[];
  partOfSpeech?: string[];
  dialectVariations?: string[];
  kifuliiru?: {
    definition?: string[];
    examples?: string[];
  };
  translations?: {
    kiswahili?: string[];
    french?: string[];
    english?: string[];
  };
  culturalContext?: {
    significance?: string[];
    usage?: string[];
    customs?: string[];
  };
  multimedia?: {
    audio?: string[];
    images?: string[];
    videos?: string[];
  };
  [key: string]: unknown;
}

// Form update types
export type UpdateFormDataFunction = <T>(path: string, value: T) => void;

export type FormStepProps = {
  formData: DictionaryFormData;
  updateFormData: UpdateFormDataFunction;
  errors?: ValidationErrors;
};

// Search and filter types
export interface SearchFilters {
  status?: EntryStatus[];
  partOfSpeech?: PartOfSpeech[];
  hasAudio?: boolean;
  hasImages?: boolean;
  hasVideos?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface SearchOptions {
  filters?: SearchFilters;
  sort?: {
    field: keyof DictionaryEntry;
    direction: "asc" | "desc";
  };
  pagination?: {
    page: number;
    limit: number;
  };
}

// Firebase-specific types
export interface FirestoreEntry extends Omit<DictionaryEntry, "id"> {
  _id?: string;
  _searchKeywords?: string[];
  _normalizedWord?: string;
}

// Export type utilities
export type DictionaryPath = string;
export type PathValue<T, P extends string> = P extends keyof T
  ? T[P]
  : P extends `${infer K}.${infer R}`
  ? K extends keyof T
    ? PathValue<T[K], R>
    : never
  : never;

// Export form helper types
export type FormStep = {
  title: string;
  description?: string;
  isOptional?: boolean;
  validateStep?: (data: DictionaryFormData) => ValidationErrors | null;
};

export type FormMode = "create" | "edit" | "review" | "view";

// Batch operation types
export type BatchOperation = {
  type: "create" | "update" | "delete";
  entry: DictionaryEntry;
  metadata?: Partial<EntryMetadata>;
};

export type BatchResult = {
  success: boolean;
  operation: BatchOperation;
  error?: Error;
};

// Export constants
export const SUPPORTED_LANGUAGES = [
  "kifuliiru",
  "kiswahili",
  "french",
  "english",
] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const MAX_FILE_SIZES = {
  audio: 5, // MB
  images: 2, // MB
  videos: 20, // MB
} as const;

export const VALID_FILE_TYPES = {
  audio: ["audio/mpeg", "audio/wav", "audio/ogg"],
  images: ["image/jpeg", "image/png", "image/webp"],
  videos: ["video/mp4", "video/webm"],
} as const;

// types/dictionary.ts

export interface EntryWithStatus extends DictionaryEntry {
  submissionStatus: "pending" | "review" | "revision" | "approved";
}
