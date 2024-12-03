// app/quiz/lib/constants.ts

import { Question } from "./types/quiz";

export const QUIZ_CONFIG = {
  TIME_PER_QUESTION: 45,
  PASS_THRESHOLD: 70,
  MAX_DAILY_ATTEMPTS: 3,
} as const;

export const QUESTIONS: Question[] = [
  {
    question: "What is the primary goal of the Kifuliiru project?",
    options: [
      "To create a social media platform",
      "To document and preserve the Kifuliiru language",
      "To teach English to Kifuliiru speakers",
      "To develop mobile games",
    ],
    correct: 1,
    explanation:
      "The Kifuliiru project's main goal is language preservation and documentation, ensuring that the cultural and linguistic heritage is maintained for future generations.",
  },
  {
    question: "Which of these is important when contributing to the project?",
    options: [
      "Using formal academic language only",
      "Adding as many words as possible quickly",
      "Ensuring accurate translations and cultural context",
      "Focusing only on modern terms",
    ],
    correct: 2,
    explanation:
      "Accuracy and cultural context are crucial for meaningful contributions. Quality over quantity ensures reliable documentation and respects the language's cultural significance.",
  },
  {
    question: "How should you handle uncertain translations?",
    options: [
      "Skip them entirely",
      "Make your best guess",
      "Copy from another language",
      "Mark them for review and consult native speakers",
    ],
    correct: 3,
    explanation:
      "When facing uncertain translations, it's essential to mark them for review and consult native speakers to ensure accuracy and prevent misinformation.",
  },
  {
    question: "What is the best approach when documenting cultural terms?",
    options: [
      "Only include modern interpretations",
      "Document both traditional and contemporary usage",
      "Skip complex cultural concepts",
      "Use English equivalents only",
    ],
    correct: 1,
    explanation:
      "Cultural terms should be documented with both their traditional and contemporary usage patterns to ensure comprehensive preservation.",
  },
  {
    question: "How should dialectal variations be handled?",
    options: [
      "Ignore minor variations",
      "Choose the most common version only",
      "Document all significant variations and their contexts",
      "Standardize to one dialect",
    ],
    correct: 2,
    explanation:
      "All significant dialectal variations should be documented with their specific contexts, including regional usage and pronunciation differences.",
  },
  {
    question: "What is the recommended process for adding new terms?",
    options: [
      "Add them immediately as you think of them",
      "Copy from similar languages",
      "Verify with multiple native speakers and document sources",
      "Use personal experience only",
    ],
    correct: 2,
    explanation:
      "New terms should be verified with multiple native speakers and properly documented with sources to ensure accuracy and cultural appropriateness.",
  },
  {
    question: "How should traditional proverbs and idioms be documented?",
    options: [
      "Literal translation only",
      "Skip them as they're too complex",
      "Include literal translation, meaning, and cultural context",
      "Modern equivalents only",
    ],
    correct: 2,
    explanation:
      "Proverbs and idioms require comprehensive documentation including literal translation, intended meaning, and cultural context.",
  },
  {
    question:
      "What is the best practice for handling grammatical documentation?",
    options: [
      "Focus on vocabulary only",
      "Document with examples and usage contexts",
      "Use English grammar rules",
      "Simplify all complex structures",
    ],
    correct: 1,
    explanation:
      "Grammar should be documented with clear examples and usage contexts while preserving the unique grammatical structures of Kifuliiru.",
  },
  {
    question: "How should you approach phonetic transcription?",
    options: [
      "Use English phonetics",
      "Skip pronunciation details",
      "Follow standard IPA conventions accurately",
      "Approximate sounds",
    ],
    correct: 2,
    explanation:
      "Phonetic transcription should follow standard IPA conventions accurately to ensure consistent and precise pronunciation documentation.",
  },
  {
    question: "What should you do if you find conflicting information?",
    options: [
      "Use the first version you found",
      "Ignore the conflicts",
      "Document all variants and seek consensus from native speakers",
      "Choose randomly",
    ],
    correct: 2,
    explanation:
      "When encountering conflicting information, all variants should be documented and consensus sought from native speakers.",
  },
];
