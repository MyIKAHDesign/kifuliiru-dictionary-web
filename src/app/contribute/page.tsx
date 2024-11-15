import ContributeContent from "./ContributeContent";
import ProtectedRoute from "../components/ProtectedRoute";
import { generateMetadata } from "../lib/metadata";
import Footer from "../components/Footer";

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
      <Footer />
    </ProtectedRoute>
  );
}
