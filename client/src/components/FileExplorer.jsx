import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";
import { buildFileTree } from "../utils/buildFileTree";
import FileTreeNode from "./FileTreeNode";

function FileExplorer({ projectId, onSelectFile }) {
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRootCreateMenu, setShowRootCreateMenu] = useState(false);

  const fetchNodes = async () => {
    try {
      const res = await api.get(`/api/projects/${projectId}/files`);
      setNodes(res.data.nodes);
    } catch (error) {
      toast.error("Failed to load files");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNodes();
  }, [projectId]);

  const handleCreate = async (parentId, type) => {
    const name = type === "folder" ? "new-folder" : "new-file.js";
    try {
      await api.post(`/api/projects/${projectId}/files`, { name, type, parent: parentId });
      fetchNodes();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create");
    }
  };

  const handleRename = async (id, name) => {
    try {
      await api.put(`/api/projects/${projectId}/files/${id}`, { name });
      fetchNodes();
    } catch (error) {
      toast.error("Failed to rename");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/projects/${projectId}/files/${id}`);
      toast.success("Deleted");
      fetchNodes();
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  const tree = buildFileTree(nodes);

  return (
    <div className="bg-[var(--color-terminal)] border-r border-[var(--color-border)] h-full w-64 flex flex-col">
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-[var(--color-border)]">
        <p className="text-xs text-[var(--color-text-muted)]">
          <span className="text-[var(--color-accent)]">$</span> ls -la
        </p>
        <button
          onClick={() => setShowRootCreateMenu((prev) => !prev)}
          className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)]"
        >
          <Plus size={14} />
        </button>
      </div>

      {showRootCreateMenu && (
        <div className="flex items-center gap-3 text-xs px-3 py-2 border-b border-[var(--color-border)]">
          <button
            onClick={() => {
              handleCreate(null, "file");
              setShowRootCreateMenu(false);
            }}
            className="text-[var(--color-accent)] hover:underline"
          >
            + file
          </button>
          <button
            onClick={() => {
              handleCreate(null, "folder");
              setShowRootCreateMenu(false);
            }}
            className="text-[var(--color-accent)] hover:underline"
          >
            + folder
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto py-2">
        {loading ? (
          <p className="text-xs text-[var(--color-text-muted)] px-3">loading...</p>
        ) : tree.length === 0 ? (
          <p className="text-xs text-[var(--color-text-muted)] px-3">// empty</p>
        ) : (
          tree.map((node) => (
            <FileTreeNode
              key={node._id}
              node={node}
              depth={0}
              onCreate={handleCreate}
              onRename={handleRename}
              onDelete={handleDelete}
              onSelectFile={onSelectFile}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default FileExplorer;