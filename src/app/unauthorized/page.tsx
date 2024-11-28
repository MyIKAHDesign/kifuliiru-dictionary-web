import { useRouter } from "next/navigation";
import { ArrowLeft, ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full px-6 py-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
            <ShieldAlert className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Unauthorized Access
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mb-8">
            You don&apos;t have permission to access this page. Please contact
            an administrator if you believe this is an error.
          </p>

          <div className="flex flex-col gap-4">
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

            <button
              onClick={() => router.push("/")}
              className="px-4 py-2 text-sm font-medium text-white
                       bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600
                       rounded-lg transition-colors duration-200"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
