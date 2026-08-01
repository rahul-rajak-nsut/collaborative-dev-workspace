import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import ProjectCard from "../components/ProjectCard";
import NewProjectModal from "../components/NewProjectModal";
import MembersModal from "../components/MembersModal";

function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [membersProjectId, setMembersProjectId] = useState(null);

  const fetchProjects = async () => {
    try {
      const res = await api.get("/api/projects");
      setProjects(res.data.projects);
    } catch (error) {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async (data) => {
    try {
      const res = await api.post("/api/projects", data);
      setProjects((prev) => [res.data.project, ...prev]);
      toast.success("Project created");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create project");
    }
  };

  const handleRename = async (id, name) => {
    try {
      const res = await api.put(`/api/projects/${id}`, { name });
      setProjects((prev) =>
        prev.map((p) => (p._id === id ? res.data.project : p)),
      );
      toast.success("Renamed");
    } catch (error) {
      toast.error("Failed to rename");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/projects/${id}`);
      setProjects((prev) => prev.filter((p) => p._id !== id));
      toast.success("Project deleted");
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      {/* Top bar */}
      <div className="border-b border-[var(--color-border)] px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-[var(--color-accent)] text-xs">
            // session active
          </p>
          <h1 className="text-lg font-medium">
            {user?.username}
            <span className="text-[var(--color-accent)] cursor-blink">_</span>
          </h1>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-danger)] transition"
        >
          run logout()
        </button>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm text-[var(--color-text-muted)]">
            <span className="text-[var(--color-accent)]">$</span> ls ./projects
          </h2>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-[var(--color-accent-warm)] hover:bg-[var(--color-accent-warm-hover)] rounded px-4 py-2 text-sm font-medium transition"
          >
            <Plus size={16} />
            new project
          </button>
        </div>

        {loading ? (
          <p className="text-[var(--color-text-muted)] text-sm">loading...</p>
        ) : projects.length === 0 ? (
          <div className="border border-dashed border-[var(--color-border)] rounded-lg py-16 text-center">
            <p className="text-[var(--color-text-muted)] text-sm mb-1">
              // no projects yet
            </p>
            <p className="text-[var(--color-text-muted)] text-xs">
              click "new project" to get started
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onRename={handleRename}
                onDelete={handleDelete}
                onOpenMembers={setMembersProjectId}
              />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <NewProjectModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreate}
        />
      )}
      {membersProjectId && (
        <MembersModal
          projectId={membersProjectId}
          onClose={() => setMembersProjectId(null)}
        />
      )}
    </div>
  );
}

export default DashboardPage;
