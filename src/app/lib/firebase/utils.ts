// lib/firebase/utils.ts
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  QueryConstraint,
  Timestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./config";
import { DictionaryEntry } from "../types/dictionary";

// Type for new entries (without id and timestamps)
type NewDictionaryEntry = Omit<
  DictionaryEntry,
  "id" | "createdAt" | "updatedAt"
>;

export const dictionaryOperations = {
  // Add new entry
  async addEntry(entry: NewDictionaryEntry) {
    try {
      const docRef = await addDoc(collection(db, "entries"), {
        ...entry,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error adding entry:", error);
      throw error;
    }
  },

  // Get entry by ID
  async getEntry(id: string): Promise<DictionaryEntry | null> {
    try {
      const docRef = doc(db, "entries", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as DictionaryEntry;
      }
      return null;
    } catch (error) {
      console.error("Error getting entry:", error);
      throw error;
    }
  },

  // Update entry
  async updateEntry(id: string, updates: Partial<DictionaryEntry>) {
    try {
      const docRef = doc(db, "entries", id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error updating entry:", error);
      throw error;
    }
  },

  // Delete entry
  async deleteEntry(id: string) {
    try {
      await deleteDoc(doc(db, "entries", id));
    } catch (error) {
      console.error("Error deleting entry:", error);
      throw error;
    }
  },

  // Query entries
  async queryEntries(
    constraints: QueryConstraint[]
  ): Promise<DictionaryEntry[]> {
    try {
      const q = query(collection(db, "entries"), ...constraints);
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as DictionaryEntry[];
    } catch (error) {
      console.error("Error querying entries:", error);
      throw error;
    }
  },
};

// Media upload operations
export const mediaOperations = {
  async uploadMedia(file: File, path: string): Promise<string> {
    try {
      const storageRef = ref(storage, path);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      return url;
    } catch (error) {
      console.error("Error uploading media:", error);
      throw error;
    }
  },
};
