"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Mail, Facebook } from "lucide-react";
import { useAuth } from "@/app/lib/firebase/auth";

const GoogleIcon = () => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M23.766 12.2764c0-.9175-.077-1.8018-.228-2.6513H12.24v5.0034h6.483c-.283 1.5037-.988 2.7745-2.111 3.6266v3.0142h3.42c2.001-1.8448 3.153-4.5657 3.153-7.7897l.581-1.2032z"
      fill="#4285F4"
    />
    <path
      d="M12.24 24c2.858 0 5.253-.9436 7.012-2.5508l-3.42-3.0142c-.949.6436-2.16 1.0176-3.592 1.0176-2.763 0-5.1-1.8645-5.934-4.3756H2.765v3.1142C4.517 21.2882 8.114 24 12.24 24z"
      fill="#34A853"
    />
    <path
      d="M6.306 15.0764c-.212-.6436-.334-1.3296-.334-2.0364 0-.7068.122-1.3928.334-2.0364V7.9094H2.765C2.028 9.4982 1.6 11.1926 1.6 12.96s.428 3.4618 1.165 4.9706l3.541-3.0142z"
      fill="#FBBC04"
    />
    <path
      d="M12.24 5.5236c1.557 0 2.953.5364 4.054 1.5876l3.036-3.0362C17.454 2.3744 15.059 1.44 12.24 1.44 8.114 1.44 4.517 4.1518 2.765 7.9094l3.541 3.0142c.834-2.511 3.171-4.3756 5.934-4.3756z"
      fill="#EA4335"
    />
  </svg>
);

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });
  const [loading, setLoading] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState<string | null>(
    null
  );

  const { signUp, signInWithGoogle, signInWithFacebook, error, user } =
    useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams?.get("redirect") || "/dashboard";

  useEffect(() => {
    if (user) {
      router.push(redirectPath);
    }
  }, [user, router, redirectPath]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setPasswordMatchError("Passwords do not match");
      return;
    }
    setPasswordMatchError(null);
    setLoading(true);

    try {
      await signUp(formData.email, formData.password, formData.name);
      router.push(redirectPath);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      router.push(redirectPath);
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    setLoading(true);
    try {
      await signInWithFacebook();
      router.push(redirectPath);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Join Kifuliiru Dictionary
          </h1>
          <p className="mt-2 text-gray-600">
            Create an account to contribute and access all features
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="••••••••"
                required
              />
            </div>

            {(passwordMatchError || error) && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">
                  {passwordMatchError || error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 rounded-md text-white font-medium flex items-center justify-center
                ${
                  loading
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Creating Account...
                </>
              ) : (
                <>
                  <Mail className="h-5 w-5 mr-2" />
                  Sign Up with Email
                </>
              )}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 flex items-center justify-center"
              >
                <GoogleIcon />
                <span className="ml-2">Google</span>
              </button>
              <button
                type="button"
                onClick={handleFacebookSignIn}
                disabled={loading}
                className="w-full py-2 px-4 border border-[#1877F2] rounded-md text-white bg-[#1877F2] hover:bg-[#166FE5] flex items-center justify-center"
              >
                <Facebook className="h-5 w-5" />
                <span className="ml-2">Facebook</span>
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href={`/auth/login?redirect=${redirectPath}`}
                className="text-indigo-600 hover:text-indigo-500"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
