import ContributeContent from "../components/ContributeContent";
import ProtectedRoute from "../components/ProtectedRoute";

export default function ContributePage() {
  return (
    <ProtectedRoute>
      <ContributeContent />
    </ProtectedRoute>
  );
}
