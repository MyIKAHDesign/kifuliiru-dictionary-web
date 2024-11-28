// app/lib/types/contributions.ts
export interface MagamboEntry {
  id: string;
  igambo: string;
  kifuliiru: string;
  kiswahili: string;
  kifaransa: string;
  kingereza: string;
  igambo_audio_url?: string;
  kifuliiru_definition_audio_url?: string;
  status: "pending" | "approved" | "rejected";
  nayemera_consent: boolean;
  created_at?: string;
  updated_at?: string;
  owner_id?: string;
  publish_date?: string;
  unpublish_date?: string;
}

export interface ContributionFormData {
  igambo: string;
  kifuliiru: string;
  kiswahili: string;
  kifaransa: string;
  kingereza: string;
  termAudio: Blob | null;
  definitionAudio: Blob | null;
  nayemera_consent: boolean;
}
