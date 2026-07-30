import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      // ProtectedRoute.jsx loading state
<div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center text-[var(--color-text-muted)] font-mono">
  loading<span className="cursor-blink">...</span>
</div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;