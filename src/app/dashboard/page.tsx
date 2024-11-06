// src/app/dashboard/page.tsx

import ProtectedRoute from "@/app/components/ProtectedRoute";

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <div>
        <h1>Welcome to your Dashboard!</h1>
        {/* Dashboard content here */}
      </div>
    </ProtectedRoute>
  );
}
