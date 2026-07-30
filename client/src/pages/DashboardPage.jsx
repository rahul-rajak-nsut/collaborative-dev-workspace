import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <p className="text-[var(--color-accent)] text-sm mb-2">// session active</p>
        <h1 className="text-2xl font-semibold mb-1">
          {user?.username}<span className="text-[var(--color-accent)] cursor-blink">_</span>
        </h1>
        <p className="text-[var(--color-text-muted)] text-sm mb-8">{user?.email}</p>
        <button
          onClick={handleLogout}
          className="bg-[var(--color-panel)] border border-[var(--color-border)] hover:border-[var(--color-danger)] rounded px-4 py-2.5 text-sm text-[var(--color-text)] transition"
        >
          run logout()
        </button>
      </div>
    </div>
  );
}

export default DashboardPage;