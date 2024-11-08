// app/contribute/page.tsx
"use client";

import ProtectedRoute from "../components/ProtectedRoute";
import ContributeContent from "../components/ContributeContent"; // Your actual contribute page content

export default function ContributePage() {
  return (
    <ProtectedRoute>
      <ContributeContent />
    </ProtectedRoute>
  );
}
