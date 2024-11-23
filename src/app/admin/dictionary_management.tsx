import React, { useState } from "react";
import { Search, Plus, Filter, Edit2, Trash2, Eye } from "lucide-react";

export default function DictionaryManagement() {
  const [entries] = useState([
    {
      id: 1,
      word: "akasiisa",
      kifuliiru: "A ceremonial dance performed during harvest festivals",
      english: "Traditional harvest dance",
      french: "Danse traditionnelle de récolte",
      swahili: "Ngoma ya jadi ya mavuno",
      status: "published",
      lastModified: "2024-03-15",
    },
    // Add more sample entries
  ]);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editForm, setEditForm] = useState({
    word: "",
    kifuliiru: "",
    english: "",
    french: "",
    swahili: "",
  });

  return (
    <div className="h-full bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Dictionary Entries
          </h1>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white 
                           rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 
                           focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-5 w-5" />
            Add New Entry
          </button>
        </div>
      </div>

      {/* Search and Filters */}
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
          <div className="flex gap-2">
            <button
              className="flex items-center gap-2 px-4 py-2 border rounded-lg 
                             bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200
                             hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <Filter className="h-5 w-5" />
              Filter
            </button>
            <select
              className="px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 
                             text-gray-700 dark:text-gray-200"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="review">Under Review</option>
            </select>
          </div>
        </div>

        {/* Entries Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Word
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
              {entries.map((entry) => (
                <tr key={entry.id}>
                  {isEditing === entry.id ? (
                    // Edit Mode
                    <td colSpan={5} className="px-6 py-4">
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Word
                            </label>
                            <input
                              type="text"
                              value={editForm.word}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  word: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border rounded-lg"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Kifuliiru Definition
                            </label>
                            <input
                              type="text"
                              value={editForm.kifuliiru}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  kifuliiru: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border rounded-lg"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              English
                            </label>
                            <input
                              type="text"
                              value={editForm.english}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  english: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border rounded-lg"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              French
                            </label>
                            <input
                              type="text"
                              value={editForm.french}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  french: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border rounded-lg"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Swahili
                            </label>
                            <input
                              type="text"
                              value={editForm.swahili}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  swahili: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border rounded-lg"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setIsEditing(null)}
                            className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              // Handle save logic
                              setIsEditing(null);
                            }}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    </td>
                  ) : (
                    // View Mode
                    <>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {entry.word}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {entry.english}, {entry.french}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${
                            entry.status === "published"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          }`}
                        >
                          {entry.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {entry.lastModified}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setIsEditing(entry.id);
                              setEditForm({
                                word: entry.word,
                                kifuliiru: entry.kifuliiru,
                                english: entry.english,
                                french: entry.french,
                                swahili: entry.swahili,
                              });
                            }}
                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 
                                     dark:hover:text-indigo-300"
                          >
                            <Edit2 className="h-5 w-5" />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900 dark:text-red-400 
                                           dark:hover:text-red-300"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                          <button
                            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 
                                           dark:hover:text-gray-300"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div
          className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 
                      border-t border-gray-200 dark:border-gray-700 mt-4 rounded-lg"
        >
          <div className="flex-1 flex justify-between items-center">
            <button
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 
                             text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 
                             bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Previous
            </button>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-center">
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 
                                 bg-white dark:bg-gray-800 text-sm font-medium text-indigo-600 
                                 dark:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  1
                </button>
                {/* Add more page numbers */}
              </nav>
            </div>
            <button
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 
                             text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 
                             bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
