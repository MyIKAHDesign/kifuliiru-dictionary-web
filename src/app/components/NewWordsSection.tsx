import { useState } from "react";
import { Search, Calendar, User, ChevronRight } from "lucide-react";

interface Word {
  term: string;
  definition: string;
  date: string;
  contributor?: string;
}

interface NewWordsSectionProps {
  newWords: Word[];
}

export default function NewWordsSection({ newWords }: NewWordsSectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredWord, setHoveredWord] = useState<string | null>(null);

  // Filter words based on search term
  const filteredWords = newWords.filter((word) =>
    word.term.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="container mx-auto my-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6 text-center">
          New Words
        </h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {filteredWords.length} entries
        </span>
      </div>

      {/* Enhanced Search Bar */}
      <div className="relative mb-8 group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
        </div>
        <input
          type="text"
          placeholder="Search new words..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700
                   text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800
                   focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                   transition-all duration-300
                   placeholder-gray-400 dark:placeholder-gray-500"
        />
        <div
          className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 
                      transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300"
        />
      </div>

      {/* Words Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredWords.map((word, index) => (
          <div
            key={index}
            className="group relative"
            onMouseEnter={() => setHoveredWord(word.term)}
            onMouseLeave={() => setHoveredWord(null)}
          >
            {/* Hover Effect Background */}
            <div
              className={`
              absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 
              rounded-xl transition-opacity duration-300
              ${hoveredWord === word.term ? "opacity-100" : "opacity-0"}
            `}
            />

            <div
              className="relative p-6 bg-white dark:bg-gray-800 rounded-xl
                          border border-gray-100 dark:border-gray-700
                          transform transition-all duration-300
                          hover:shadow-xl hover:-translate-y-1
                          h-full"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {word.term}
                  </h3>
                  <ChevronRight
                    className={`h-5 w-5 text-indigo-500 transform transition-transform duration-300
                                        ${
                                          hoveredWord === word.term
                                            ? "translate-x-1 opacity-100"
                                            : "opacity-0"
                                        }`}
                  />
                </div>

                <p className="text-gray-600 dark:text-gray-300 leading-relaxed flex-grow">
                  {word.definition}
                </p>

                <div className="flex flex-col gap-2 pt-4 text-sm border-t border-gray-100 dark:border-gray-700 mt-4">
                  <div className="flex items-center text-gray-500 dark:text-gray-400">
                    <User className="h-4 w-4 mr-2" />
                    <span className="truncate">
                      {word.contributor || "Ayivugwe Kabemba and Team"}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-500 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{word.date}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredWords.length === 0 && (
          <div className="col-span-full text-center py-12">
            <div className="mb-4">
              <Search className="h-12 w-12 mx-auto text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No words found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your search terms
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
