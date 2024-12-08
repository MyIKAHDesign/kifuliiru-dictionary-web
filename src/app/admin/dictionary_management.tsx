import React, { useState, useEffect } from "react";
import { Search, Edit2, Trash2, Eye } from "lucide-react";
import { supabase } from "../lib/supabase";

// Define the type for dictionary entries
type Entry = {
  id: number;
  word: string;
  kifuliiru: string;
  english: string;
  french: string;
  swahili: string;
  status: string;
  lastModified: string;
};

export default function DictionaryManagement() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 10;
  const [searchTerm, setSearchTerm] = useState("");
  const [newEntry, setNewEntry] = useState({
    word: "",
    kifuliiru: "",
    english: "",
    french: "",
    swahili: "",
  });
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null); // For editing
  const [selectedTranslations, setSelectedTranslations] =
    useState<Entry | null>(null);

  // Fetch data from Supabase
  useEffect(() => {
    const fetchEntries = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("magambo")
        .select(
          "id, igambo, kifuliiru, kingereza, kifaransa, kiswahili, status, updated_date"
        )
        .order("updated_date", { ascending: false });

      if (error) {
        console.error("Error fetching entries:", error);
      } else {
        const formattedData: Entry[] = data.map((item) => ({
          id: item.id,
          word: item.igambo,
          kifuliiru: item.kifuliiru,
          english: item.kingereza,
          french: item.kifaransa,
          swahili: item.kiswahili,
          status: item.status,
          lastModified: item.updated_date,
        }));
        setEntries(formattedData);
      }
      setIsLoading(false);
    };

    fetchEntries();
  }, []);

  // Handle Delete Entry
  const handleDeleteEntry = async (id: number) => {
    const { error } = await supabase.from("magambo").delete().eq("id", id);
    if (error) {
      console.error("Error deleting entry:", error);
    } else {
      setEntries((prevEntries) =>
        prevEntries.filter((entry) => entry.id !== id)
      );
    }
  };

  // Handle Add/Edit Entry
  const handleSaveEntry = async () => {
    if (
      !newEntry.word ||
      !newEntry.kifuliiru ||
      !newEntry.english ||
      !newEntry.french ||
      !newEntry.swahili
    ) {
      alert("Please fill out all fields.");
      return;
    }

    if (selectedEntry) {
      // Update existing entry
      const { error } = await supabase
        .from("magambo")
        .update({
          igambo: newEntry.word,
          kifuliiru: newEntry.kifuliiru,
          kingereza: newEntry.english,
          kifaransa: newEntry.french,
          kiswahili: newEntry.swahili,
        })
        .eq("id", selectedEntry.id);

      if (error) {
        console.error("Error updating entry:", error);
      } else {
        setEntries((prevEntries) =>
          prevEntries.map((entry) =>
            entry.id === selectedEntry.id ? { ...entry, ...newEntry } : entry
          )
        );
        setSelectedEntry(null);
        setNewEntry({
          word: "",
          kifuliiru: "",
          english: "",
          french: "",
          swahili: "",
        });
      }
    } else {
      // Add new entry
      const { data, error } = await supabase
        .from("magambo")
        .insert({
          igambo: newEntry.word,
          kifuliiru: newEntry.kifuliiru,
          kingereza: newEntry.english,
          kifaransa: newEntry.french,
          kiswahili: newEntry.swahili,
          status: "draft",
        })
        .select();

      if (error) {
        console.error("Error adding entry:", error);
      } else {
        setEntries([...(data || []), ...entries]);
        setNewEntry({
          word: "",
          kifuliiru: "",
          english: "",
          french: "",
          swahili: "",
        });
      }
    }
  };

  // Load data into form for editing
  const handleEditEntry = (entry: Entry) => {
    setSelectedEntry(entry);
    setNewEntry({
      word: entry.word,
      kifuliiru: entry.kifuliiru,
      english: entry.english,
      french: entry.french,
      swahili: entry.swahili,
    });
  };

  // Pagination
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = entries.slice(indexOfFirstEntry, indexOfLastEntry);

  const totalPages = Math.ceil(entries.length / entriesPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  return (
    <div className="h-full bg-gray-100 dark:bg-gray-900">
      {/* Header */}

      {/* Form for Adding/Editing Entry */}
      {/* Form for Adding/Editing Entry */}
      <div
        className="p-6 bg-white dark:bg-gray-800 shadow rounded-lg mb-6 mt-6"
        style={{ width: "97%", margin: "20px auto" }}
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          {selectedEntry ? "Edit Entry" : "Add New Entry"}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Word"
            value={newEntry.word}
            onChange={(e) => setNewEntry({ ...newEntry, word: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
          />
          <input
            type="text"
            placeholder="Kifuliiru"
            value={newEntry.kifuliiru}
            onChange={(e) =>
              setNewEntry({ ...newEntry, kifuliiru: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
          />
          <input
            type="text"
            placeholder="English"
            value={newEntry.english}
            onChange={(e) =>
              setNewEntry({ ...newEntry, english: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
          />
          <input
            type="text"
            placeholder="French"
            value={newEntry.french}
            onChange={(e) =>
              setNewEntry({ ...newEntry, french: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
          />
          <input
            type="text"
            placeholder="Swahili"
            value={newEntry.swahili}
            onChange={(e) =>
              setNewEntry({ ...newEntry, swahili: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
          />
        </div>
        <button
          onClick={handleSaveEntry}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          {selectedEntry ? "Save Changes" : "Add Entry"}
        </button>
      </div>

      {/* Search */}
      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-gray-800 
                       border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 
                       focus:border-transparent"
            />
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center text-gray-500 dark:text-gray-400">
            Loading...
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            {/* Entries Table */}
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Word
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Kifuliiru
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Translations
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Last Modified
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {currentEntries.map((entry) => (
                  <tr key={entry.id}>
                    <td className="px-6 py-4">{entry.word}</td>
                    <td className="px-6 py-4">
                      <div
                        className="text-sm text-gray-700 dark:text-gray-200 truncate max-w-xs"
                        title={entry.kifuliiru || "No Kifuliiru translation"}
                      >
                        {entry.kifuliiru && entry.kifuliiru.length > 30
                          ? `${entry.kifuliiru.slice(0, 30)}...`
                          : entry.kifuliiru || "No Kifuliiru translation"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedTranslations(entry)}
                        className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                    </td>
                    <td className="px-6 py-4">{entry.status}</td>
                    <td className="px-6 py-4">{entry.lastModified}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleEditEntry(entry)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit2 />
                      </button>
                      <button
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-gray-700 dark:text-gray-300">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* Enlarged Modal for Translations */}
      {selectedTranslations && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-10 rounded-lg shadow-lg w-1/2">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
              Translations
            </h2>
            <p className="mb-2">
              <strong>English:</strong> {selectedTranslations.english}
            </p>
            <p className="mb-2">
              <strong>French:</strong> {selectedTranslations.french}
            </p>
            <p className="mb-2">
              <strong>Swahili:</strong> {selectedTranslations.swahili}
            </p>
            <button
              onClick={() => setSelectedTranslations(null)}
              className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
