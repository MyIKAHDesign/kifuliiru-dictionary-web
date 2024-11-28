"use client";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";

export default function ErrorPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full px-6 py-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/30 mb-4">
            <AlertCircle className="w-8 h-8 text-orange-600 dark:text-orange-400" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Something Went Wrong
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mb-8">
            We encountered an error while processing your request. Please try
            again or contact support if the problem persists.
          </p>

          <div className="flex flex-col gap-4">
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 
                       text-white font-medium bg-orange-600 hover:bg-orange-700 
                       dark:bg-orange-500 dark:hover:bg-orange-600
                       rounded-lg transition-colors duration-200"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>

            <button
              onClick={() => router.back()}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 
                       text-sm font-medium text-gray-700 dark:text-gray-200
                       bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 
                       rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750
                       transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
