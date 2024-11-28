// app/lib/client/services/contributions.ts
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../supabase";

export type MagamboEntry = Database["public"]["Tables"]["magambo"]["Row"];
export type MagamboInsert = Database["public"]["Tables"]["magambo"]["Insert"];

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

export class ContributionService {
  private supabase;

  constructor() {
    this.supabase = createClientComponentClient<Database>();
  }

  async createContribution(
    data: ContributionFormData,
    userId: string
  ): Promise<MagamboEntry> {
    try {
      // Upload audio files if they exist
      const igamboAudioUrl = data.termAudio
        ? await this.uploadAudio(data.termAudio, "igambo")
        : null;
      const definitionAudioUrl = data.definitionAudio
        ? await this.uploadAudio(data.definitionAudio, "definition")
        : null;

      const insertData: MagamboInsert = {
        igambo: data.igambo,
        kifuliiru: data.kifuliiru,
        kiswahili: data.kiswahili,
        kifaransa: data.kifaransa,
        kingereza: data.kingereza,
        igambo_audio_url: igamboAudioUrl,
        kifuliiru_definition_audio_url: definitionAudioUrl,
        status: "pending",
        nayemera_consent: data.nayemera_consent,
        owner_id: userId,
        created_date: new Date().toISOString(),
      };

      const { data: contribution, error } = await this.supabase
        .from("magambo")
        .insert([insertData])
        .select()
        .single();

      if (error) throw error;
      return contribution;
    } catch (error) {
      console.error("Error creating contribution:", error);
      throw error;
    }
  }

  async getUserContributions(userId: string): Promise<MagamboEntry[]> {
    try {
      const { data, error } = await this.supabase
        .from("magambo")
        .select("*")
        .eq("owner_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching contributions:", error);
      throw error;
    }
  }

  async getContribution(id: string): Promise<MagamboEntry | null> {
    try {
      const { data, error } = await this.supabase
        .from("magambo")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching contribution:", error);
      throw error;
    }
  }

  async updateContribution(
    id: string,
    data: Partial<ContributionFormData>
  ): Promise<MagamboEntry> {
    try {
      const updates: Partial<MagamboEntry> = {
        igambo: data.igambo,
        kifuliiru: data.kifuliiru,
        kiswahili: data.kiswahili,
        kifaransa: data.kifaransa,
        kingereza: data.kingereza,
        nayemera_consent: data.nayemera_consent,
        updated_date: new Date().toISOString(),
      };

      // Handle audio updates if needed
      if (data.termAudio instanceof Blob) {
        updates.igambo_audio_url = await this.uploadAudio(
          data.termAudio,
          "igambo"
        );
      }

      if (data.definitionAudio instanceof Blob) {
        updates.kifuliiru_definition_audio_url = await this.uploadAudio(
          data.definitionAudio,
          "definition"
        );
      }

      const { data: updatedEntry, error } = await this.supabase
        .from("magambo")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return updatedEntry;
    } catch (error) {
      console.error("Error updating contribution:", error);
      throw error;
    }
  }

  async deleteContribution(id: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from("magambo")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error deleting contribution:", error);
      throw error;
    }
  }

  private async uploadAudio(
    audioBlob: Blob,
    type: "igambo" | "definition"
  ): Promise<string> {
    try {
      const fileName = `${type}_${Date.now()}.webm`;
      const filePath = `audio/${fileName}`;

      const { error: uploadError } = await this.supabase.storage
        .from("dictionary-audio")
        .upload(filePath, audioBlob);

      if (uploadError) throw uploadError;

      const { data: urlData } = await this.supabase.storage
        .from("dictionary-audio")
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error) {
      console.error("Error uploading audio:", error);
      throw error;
    }
  }
}

export const contributionService = new ContributionService();
