// lib/firebase.ts
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  Timestamp,
  CollectionReference,
  Query,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Types
interface DictionaryEntry {
  id?: string;
  word: string;
  ipa: string;
  partOfSpeech: string;
  dialectVariations: string[];
  kifuliiru: {
    definition: string[];
    examples: string[];
  };
  translations: {
    kiswahili: string[];
    french: string[];
    english: string[];
  };
  culturalContext: {
    significance: string;
    usage: string;
    customs: string[];
  };
  multimedia: {
    audio: string[];
    images: string[];
    videos: string[];
  };
  status: "draft" | "review" | "published";
  contributor: string;
  createdAt: Date;
  updatedAt: Date;
}

// CRUD Operations
export const dictionaryService = {
  // Create new entry
  async createEntry(
    entry: Omit<DictionaryEntry, "id" | "createdAt" | "updatedAt">
  ): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, "dictionary"), {
        ...entry,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error creating dictionary entry:", error);
      throw error;
    }
  },

  // Get single entry
  async getEntry(id: string): Promise<DictionaryEntry | null> {
    try {
      const docRef = doc(db, "dictionary", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as DictionaryEntry;
      }
      return null;
    } catch (error) {
      console.error("Error fetching dictionary entry:", error);
      throw error;
    }
  },

  // Update entry
  async updateEntry(
    id: string,
    updates: Partial<DictionaryEntry>
  ): Promise<void> {
    try {
      const docRef = doc(db, "dictionary", id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error updating dictionary entry:", error);
      throw error;
    }
  },

  // Delete entry
  async deleteEntry(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, "dictionary", id));
    } catch (error) {
      console.error("Error deleting dictionary entry:", error);
      throw error;
    }
  },

  // List entries with optional filters
  async listEntries(filters?: {
    status?: "draft" | "review" | "published";
    contributor?: string;
  }): Promise<DictionaryEntry[]> {
    try {
      const collectionRef: CollectionReference = collection(db, "dictionary");
      let queryRef: Query = collectionRef;

      if (filters) {
        queryRef = Object.entries(filters).reduce((acc, [key, value]) => {
          return query(acc, where(key, "==", value));
        }, queryRef);
      }

      const querySnapshot = await getDocs(queryRef);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as DictionaryEntry[];
    } catch (error) {
      console.error("Error listing dictionary entries:", error);
      throw error;
    }
  },

  // Upload media files
  async uploadMedia(
    file: File,
    type: "audio" | "image" | "video"
  ): Promise<string> {
    try {
      const storageRef = ref(storage, `${type}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error("Error uploading media:", error);
      throw error;
    }
  },
};

export default dictionaryService;
