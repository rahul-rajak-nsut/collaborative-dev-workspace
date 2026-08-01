import { useState } from "react";
import { Trash2, Pencil, Check, X, Users } from "lucide-react";

function ProjectCard({ project, onRename, onDelete, onOpenMembers }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(project.name);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const handleSave = () => {
    if (name.trim() && name !== project.name) {
      onRename(project._id, name.trim());
    }
    setIsEditing(false);
  };

  return (
    <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg overflow-hidden hover:border-[var(--color-accent)] transition group">
      {/* Fake window chrome */}
      <div className="flex items-center gap-1.5 px-3 py-2 bg-[#2A2932] border-b border-[var(--color-border)]">
        <span className="w-2.5 h-2.5 rounded-full bg-[#C77B6B]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#D4B483]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#8FA37E]" />
      </div>

      <div className="p-4">
        {isEditing ? (
          <div className="flex items-center gap-2 mb-2">
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              className="flex-1 bg-[var(--color-bg)] border border-[var(--color-accent)] rounded px-2 py-1 text-sm text-[var(--color-text)] focus:outline-none"
            />
            <button onClick={handleSave} className="text-[var(--color-accent)]">
              <Check size={16} />
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="text-[var(--color-text-muted)]"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <h3 className="text-[var(--color-text)] font-medium mb-1 truncate">
            {project.name}
          </h3>
        )}

        <p className="text-[var(--color-text-muted)] text-xs mb-4 line-clamp-2 min-h-[2rem]">
          {project.description || "// no description"}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-[var(--color-text-muted)] text-xs">
            {new Date(project.createdAt).toLocaleDateString()}
          </span>

          <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)]"
              >
                <Pencil size={14} />
              </button>
            )}

            <button
              onClick={() => onOpenMembers(project._id)}
              className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)]"
              title="Members"
            >
              <Users size={14} />
            </button>

            {confirmingDelete ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onDelete(project._id)}
                  className="text-[var(--color-danger)] text-xs font-medium"
                >
                  confirm
                </button>
                <button
                  onClick={() => setConfirmingDelete(false)}
                  className="text-[var(--color-text-muted)] text-xs"
                >
                  cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmingDelete(true)}
                className="text-[var(--color-text-muted)] hover:text-[var(--color-danger)]"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
