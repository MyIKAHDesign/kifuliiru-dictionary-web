export type Language = "kifuliiru" | "english" | "french" | "swahili";

export interface Translation {
  kifuliiru: string;
  english: string;
  french: string;
  swahili: string;
}

export interface BaseWord {
  term: string;
  date: string;
  audioTermUrl?: string;
  audioDefinitionUrl?: string;
  partOfSpeech?: string;
  dialect?: string;
}

export interface WordWithTranslations extends BaseWord {
  definition: Translation;
  examples?: Translation[];
}

export interface LanguageOption {
  id: Language;
  label: string;
  flag: string;
}

export type Word = {
  term: string;
  definition: string;
  date: string;
  audioTermUrl?: string;
  audioDefinitionUrl?: string;
  partOfSpeech?: string;
  examples?: string[];
  dialect?: string;
};
