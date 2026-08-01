import { useState, useEffect } from "react";
import { X, Check, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function MembersModal({ projectId, onClose }) {
  const { user } = useAuth();
  const [owner, setOwner] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("editor");
  const [inviting, setInviting] = useState(false);

  const fetchMembers = async () => {
    try {
      const res = await api.get(`/api/projects/${projectId}/members`);
      setOwner(res.data.owner);
      setMembers(res.data.members);
    } catch (error) {
      toast.error("Failed to load members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [projectId]);

  const isOwner = owner?._id === user?.id;

  const handleInvite = async (e) => {
    e.preventDefault();
    setInviting(true);
    try {
      await api.post(`/api/projects/${projectId}/members/invite`, { email, role });
      toast.success(isOwner ? "Member added" : "Invite sent for approval");
      setEmail("");
      fetchMembers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to invite");
    } finally {
      setInviting(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      await api.put(`/api/projects/${projectId}/members/${userId}/approve`);
      toast.success("Member approved");
      fetchMembers();
    } catch (error) {
      toast.error("Failed to approve");
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/api/projects/${projectId}/members/${userId}/role`, { role: newRole });
      toast.success("Role updated");
      fetchMembers();
    } catch (error) {
      toast.error("Failed to update role");
    }
  };

  const handleRemove = async (userId) => {
    try {
      await api.delete(`/api/projects/${projectId}/members/${userId}`);
      toast.success("Member removed");
      fetchMembers();
    } catch (error) {
      toast.error("Failed to remove");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg w-full max-w-lg max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
          <p className="text-[var(--color-text)] text-sm">
            <span className="text-[var(--color-accent)]">$</span> members
            <span className="text-[var(--color-accent)] cursor-blink">_</span>
          </p>
          <button onClick={onClose} className="text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto p-5 flex-1">
          {loading ? (
            <p className="text-[var(--color-text-muted)] text-sm">loading...</p>
          ) : (
            <>
              {owner && (
                <div className="flex items-center justify-between py-2.5 border-b border-[var(--color-border)]">
                  <div>
                    <p className="text-sm text-[var(--color-text)]">{owner.username}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{owner.email}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-[var(--color-accent-warm)] text-[var(--color-text)]">
                    owner
                  </span>
                </div>
              )}

              {members.map((m) => (
                <div
                  key={m.user._id}
                  className="flex items-center justify-between py-2.5 border-b border-[var(--color-border)]"
                >
                  <div>
                    <p className="text-sm text-[var(--color-text)]">{m.user.username}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{m.user.email}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {m.status === "pending" && (
                      <span className="text-xs px-2 py-1 rounded border border-dashed border-[var(--color-text-muted)] text-[var(--color-text-muted)]">
                        pending
                      </span>
                    )}

                    {isOwner ? (
                      <select
                        value={m.role}
                        onChange={(e) => handleRoleChange(m.user._id, e.target.value)}
                        className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded text-xs px-2 py-1 text-[var(--color-text)] focus:outline-none"
                      >
                        <option value="editor">editor</option>
                        <option value="viewer">viewer</option>
                      </select>
                    ) : (
                      <span className="text-xs px-2 py-1 rounded bg-[var(--color-bg)] text-[var(--color-text-muted)]">
                        {m.role}
                      </span>
                    )}

                    {isOwner && m.status === "pending" && (
                      <button
                        onClick={() => handleApprove(m.user._id)}
                        className="text-[var(--color-accent)] hover:opacity-80"
                        title="Approve"
                      >
                        <Check size={16} />
                      </button>
                    )}

                    {isOwner && (
                      <button
                        onClick={() => handleRemove(m.user._id)}
                        className="text-[var(--color-text-muted)] hover:text-[var(--color-danger)]"
                        title="Remove"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {members.length === 0 && (
                <p className="text-[var(--color-text-muted)] text-sm py-4">// no members yet</p>
              )}
            </>
          )}
        </div>

        <form
          onSubmit={handleInvite}
          className="border-t border-[var(--color-border)] p-5 flex items-center gap-2"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="teammate@email.com"
            className="flex-1 bg-[var(--color-bg)] border border-[var(--color-border)] rounded px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded px-2 py-2 text-sm text-[var(--color-text)] focus:outline-none"
          >
            <option value="editor">editor</option>
            <option value="viewer">viewer</option>
          </select>
          <button
            type="submit"
            disabled={inviting}
            className="bg-[var(--color-accent-warm)] hover:bg-[var(--color-accent-warm-hover)] disabled:opacity-50 rounded px-4 py-2 text-sm font-medium text-[var(--color-text)] transition"
          >
            {inviting ? "..." : "invite"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default MembersModal;