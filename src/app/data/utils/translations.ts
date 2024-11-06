// src/app/utils/translations.ts
import { Language, Word, WordWithTranslations } from "../types/dictionary";

export function getTranslatedWord(
  word: WordWithTranslations,
  language: Language
): Word {
  return {
    ...word,
    definition: word.definition[language],
    examples: word.examples?.map((ex) => ex[language]),
  };
}

export function getPlaceholderText(lang: Language): string {
  switch (lang) {
    case "kifuliiru":
      return "Shaka igambo mu Kifuliiru...";
    case "english":
      return "Search for words...";
    case "french":
      return "Rechercher des mots...";
    case "swahili":
      return "Tafuta maneno...";
    default:
      return "Search for words...";
  }
}

export function getTitle(lang: Language): string {
  switch (lang) {
    case "kifuliiru":
      return "Ikitabu kyamagambo ga Kifuliiru";
    default:
      return "Kifuliiru Dictionary";
  }
}

export function getDescription(lang: Language): string {
  switch (lang) {
    case "kifuliiru":
      return "Menya amagambo gaꞌBafuliiru mu ndeto yabo";
    default:
      return "Discover the richness of Kifuliiru language through our comprehensive digital dictionary";
  }
}
