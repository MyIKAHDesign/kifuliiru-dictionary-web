// src/app/components/WordList.tsx

interface Word {
  term: string;
  definition: string;
  date: string;
}

interface WordListProps {
  words: Word[];
}

export default function WordList({ words }: WordListProps) {
  return (
    <ul className="space-y-4">
      {words.map((word, index) => (
        <li
          key={index}
          className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-indigo-700">{word.term}</h3>
              <p className="text-gray-600">{word.definition}</p>
            </div>
            <span className="text-sm text-gray-500">
              Published: {word.date}
            </span>
          </div>
        </li>
      ))}
      {words.length === 0 && (
        <p className="text-gray-600 text-center p-4">No words found.</p>
      )}
    </ul>
  );
}
