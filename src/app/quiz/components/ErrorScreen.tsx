// app/quiz/components/ErrorScreen.tsx
interface ErrorScreenProps {
  message: string;
  onRetry: () => void;
}

export function ErrorScreen({ message, onRetry }: ErrorScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md p-6 text-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Access Error
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 
                   rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
        >
          Return Home
        </button>
      </div>
    </div>
  );
}
