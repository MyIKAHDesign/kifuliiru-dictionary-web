import ContributeContent from "../components/ContributeContent";
import ProtectedRoute from "../components/ProtectedRoute";
import { generateMetadata } from "../lib/metadata";

// app/contribute/page.tsx (Contribution Page)
export const metadata = generateMetadata({
  title: "Contribute",
  description:
    "Help expand and improve the Kifuliiru Dictionary by contributing your knowledge",
  keywords: ["contribute", "collaboration", "language preservation"],
});

export default function ContributePage() {
  return (
    <ProtectedRoute>
      <ContributeContent />
    </ProtectedRoute>
  );
}
