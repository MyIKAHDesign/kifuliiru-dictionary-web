// app/api/auth/session/route.ts
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "firebase-admin";
import { initAdmin } from "@/app/lib/firebase/admin";

// Initialize Firebase Admin if it hasn't been already
initAdmin();

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    // Verify the ID token and get user information
    const decodedToken = await auth().verifyIdToken(idToken);
    if (!decodedToken.uid) {
      throw new Error("Invalid token");
    }

    // Create a session cookie with user information
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await auth().createSessionCookie(idToken, {
      expiresIn,
    });

    // Set the cookie with user information
    (
      await // Set the cookie with user information
      cookies()
    ).set("session", sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    // Return user information in the response
    return NextResponse.json(
      {
        status: "success",
        user: {
          uid: decodedToken.uid,
          email: decodedToken.email,
          emailVerified: decodedToken.email_verified,
          displayName: decodedToken.name,
          // Add any other user information you need
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Session creation error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    // Clear the session cookie
    (
      await // Clear the session cookie
      cookies()
    ).delete("session");

    return NextResponse.json({ status: "success" }, { status: 200 });
  } catch (error) {
    console.error("Session deletion error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Add a GET method to verify session
export async function GET() {
  try {
    const sessionCookie = (await cookies()).get("session")?.value;

    if (!sessionCookie) {
      return NextResponse.json({ isLoggedIn: false }, { status: 401 });
    }

    // Verify the session cookie
    const decodedClaims = await auth().verifySessionCookie(sessionCookie, true);

    return NextResponse.json(
      {
        isLoggedIn: true,
        user: {
          uid: decodedClaims.uid,
          email: decodedClaims.email,
          emailVerified: decodedClaims.email_verified,
          displayName: decodedClaims.name,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Session verification error:", error);
    return NextResponse.json({ isLoggedIn: false }, { status: 401 });
  }
}
