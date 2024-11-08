"use client";

import { auth } from "./config";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User,
  onAuthStateChanged,
  AuthError,
} from "firebase/auth";
import { useRouter } from "next/router";

// Define custom error type
interface AuthErrorWithCode extends Error {
  code?: string;
}

interface AuthContextType {
  user: User | null | undefined;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signUp: (
    email: string,
    password: string,
    displayName?: string
  ) => Promise<void>;
  logOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (displayName?: string, photoURL?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        document.cookie = `session=${token}; path=/; max-age=${
          60 * 60 * 24 * 7
        }; secure; samesite=lax`;
        setUser(user);
      } else {
        document.cookie =
          "session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleError = (error: AuthError | AuthErrorWithCode) => {
    console.error("Auth error:", error);
    const errorMessage = error.message || "An authentication error occurred";
    setError(errorMessage);
    throw error;
  };

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      handleError(error as AuthError);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      provider.addScope("email");
      provider.addScope("profile");
      await signInWithPopup(auth, provider);
    } catch (error) {
      handleError(error as AuthError);
    }
  };

  const signInWithFacebook = async () => {
    try {
      setError(null);
      const provider = new FacebookAuthProvider();
      provider.addScope("email");
      provider.addScope("public_profile");
      await signInWithPopup(auth, provider);
    } catch (error) {
      handleError(error as AuthError);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    displayName?: string
  ) => {
    try {
      setError(null);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (displayName) {
        await updateProfile(userCredential.user, { displayName });
      }
    } catch (error) {
      handleError(error as AuthError);
    }
  };

  const logOut = async () => {
    try {
      setError(null);
      await signOut(auth);
      document.cookie =
        "session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    } catch (error) {
      handleError(error as AuthError);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      handleError(error as AuthError);
    }
  };

  const updateUserProfile = async (displayName?: string, photoURL?: string) => {
    try {
      setError(null);
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: displayName || auth.currentUser.displayName,
          photoURL: photoURL || auth.currentUser.photoURL,
        });
        setUser({ ...auth.currentUser });
      }
    } catch (error) {
      handleError(error as AuthError);
    }
  };

  const value = {
    user,
    loading,
    error,
    signIn,
    signInWithGoogle,
    signInWithFacebook,
    signUp,
    logOut,
    resetPassword,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : null}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const useRequireAuth = (redirectUrl = "/auth/login") => {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (auth.user === null) {
      router.push(redirectUrl);
    }
  }, [auth.user, router, redirectUrl]);

  return auth;
};
