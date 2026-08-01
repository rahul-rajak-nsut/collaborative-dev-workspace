import { useState } from "react";
import { Folder, FolderOpen, File, Trash2, Pencil, Plus } from "lucide-react";

function FileTreeNode({ node, depth, onCreate, onRename, onDelete, onSelectFile }) {
  const [expanded, setExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(node.name);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [showCreateMenu, setShowCreateMenu] = useState(false);

  const isFolder = node.type === "folder";

  const handleSave = () => {
    if (name.trim() && name !== node.name) {
      onRename(node._id, name.trim());
    }
    setIsEditing(false);
  };

  const handleRowClick = () => {
    if (isFolder) {
      setExpanded((prev) => !prev);
    } else {
      onSelectFile(node);
    }
  };

  return (
    <div>
      <div
        className="flex items-center gap-1.5 py-1 px-2 rounded hover:bg-[var(--color-panel)] group cursor-pointer text-sm"
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={handleRowClick}
      >
        {isFolder ? (
          expanded ? (
            <FolderOpen size={14} className="text-[var(--color-accent)] shrink-0" />
          ) : (
            <Folder size={14} className="text-[var(--color-accent)] shrink-0" />
          )
        ) : (
          <File size={14} className="text-[var(--color-text-muted)] shrink-0" />
        )}

        {isEditing ? (
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            onBlur={handleSave}
            className="flex-1 bg-[var(--color-bg)] border border-[var(--color-accent)] rounded px-1 text-xs text-[var(--color-text)] focus:outline-none"
          />
        ) : (
          <span className="flex-1 text-[var(--color-text)] truncate">{node.name}</span>
        )}

        <div
          className="hidden group-hover:flex items-center gap-1.5"
          onClick={(e) => e.stopPropagation()}
        >
          {isFolder && (
            <button
              onClick={() => setShowCreateMenu((prev) => !prev)}
              className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)]"
              title="New"
            >
              <Plus size={12} />
            </button>
          )}
          <button
            onClick={() => setIsEditing(true)}
            className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)]"
            title="Rename"
          >
            <Pencil size={12} />
          </button>
          {confirmingDelete ? (
            <>
              <button
                onClick={() => onDelete(node._id)}
                className="text-[var(--color-danger)] text-xs"
              >
                ✓
              </button>
              <button
                onClick={() => setConfirmingDelete(false)}
                className="text-[var(--color-text-muted)] text-xs"
              >
                ✕
              </button>
            </>
          ) : (
            <button
              onClick={() => setConfirmingDelete(true)}
              className="text-[var(--color-text-muted)] hover:text-[var(--color-danger)]"
              title="Delete"
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
      </div>

      {isFolder && showCreateMenu && (
        <div
          className="flex items-center gap-2 text-xs py-1"
          style={{ paddingLeft: `${(depth + 1) * 16 + 8}px` }}
        >
          <button
            onClick={() => {
              onCreate(node._id, "file");
              setShowCreateMenu(false);
              setExpanded(true);
            }}
            className="text-[var(--color-accent)] hover:underline"
          >
            + file
          </button>
          <button
            onClick={() => {
              onCreate(node._id, "folder");
              setShowCreateMenu(false);
              setExpanded(true);
            }}
            className="text-[var(--color-accent)] hover:underline"
          >
            + folder
          </button>
        </div>
      )}

      {isFolder && expanded && (
        <div>
          {node.children.map((child) => (
            <FileTreeNode
              key={child._id}
              node={child}
              depth={depth + 1}
              onCreate={onCreate}
              onRename={onRename}
              onDelete={onDelete}
              onSelectFile={onSelectFile}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default FileTreeNode;