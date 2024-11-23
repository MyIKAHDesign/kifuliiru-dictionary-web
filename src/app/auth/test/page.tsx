// app/auth/test/page.tsx
"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Loader2 } from "lucide-react";

export default function TestAuthPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const supabase = createClientComponentClient();

  const testSignUp = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: "testpassword123",
        options: {
          emailRedirectTo: `${window.location.origin}/auth/verify`,
        },
      });

      if (error) throw error;

      if (data.user) {
        setStatus(`
          Success! Check these details:
          - User ID: ${data.user.id}
          - Email confirmed: ${data.user.confirmed_at ? "Yes" : "No"}
          - Email: ${data.user.email}
          
          Check your Supabase dashboard:
          1. Go to Authentication → Users
          2. Find this email: ${email}
          3. Look for confirmation link
        `);
      }
    } catch (error) {
      setStatus(
        `Error: ${error instanceof Error ? error.message : String(error)}`
      );
    } finally {
      setLoading(false);
    }
  };

  const checkSession = async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error) {
      setStatus(`Session error: ${error.message}`);
      return;
    }
    if (session) {
      setStatus(`
        Current session:
        - User ID: ${session.user.id}
        - Email: ${session.user.email}
        - Email confirmed: ${session.user.email_confirmed_at ? "Yes" : "No"}
      `);
    } else {
      setStatus("No active session");
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md mx-auto space-y-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold mb-6">Auth Test Page</h1>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Test Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="test@example.com"
              />
            </div>

            <div className="space-x-4">
              <button
                onClick={testSignUp}
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center">
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Testing...
                  </span>
                ) : (
                  "Test Sign Up"
                )}
              </button>

              <button
                onClick={checkSession}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Check Session
              </button>
            </div>

            {status && (
              <pre className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded overflow-auto whitespace-pre-wrap">
                {status}
              </pre>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Debug Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Enter a test email address</li>
            <li>Click &quot;Test Sign Up&quot;</li>
            <li>Check the status message</li>
            <li>Go to your Supabase dashboard</li>
            <li>Look in Authentication → Users</li>
            <li>Find your test email</li>
            <li>Check the confirmation link</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
