import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { X, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";
import FileExplorer from "../components/FileExplorer";

// Maps file extensions to Monaco's language identifiers
const getLanguage = (filename) => {
  const ext = filename.split(".").pop();
  const map = {
    js: "javascript",
    jsx: "javascript",
    ts: "typescript",
    tsx: "typescript",
    json: "json",
    css: "css",
    html: "html",
    md: "markdown",
    py: "python",
  };
  return map[ext] || "plaintext";
};

function ProjectDetailPage() {
  const { id: projectId } = useParams();
  const navigate = useNavigate();

  const [openTabs, setOpenTabs] = useState([]); // [{ node, content, dirty }]
  const [activeTabId, setActiveTabId] = useState(null);
  const editorRef = useRef(null);

  const activeTab = openTabs.find((t) => t.node._id === activeTabId);

  const handleSelectFile = async (node) => {
    // If already open, just switch to it
    const existing = openTabs.find((t) => t.node._id === node._id);
    if (existing) {
      setActiveTabId(node._id);
      return;
    }

    try {
      const res = await api.get(`/api/projects/${projectId}/files/${node._id}/content`);
      setOpenTabs((prev) => [
        ...prev,
        { node, content: res.data.content, savedContent: res.data.content, dirty: false },
      ]);
      setActiveTabId(node._id);
    } catch (error) {
      toast.error("Failed to open file");
    }
  };

  const handleCloseTab = (id, e) => {
    e.stopPropagation();
    setOpenTabs((prev) => prev.filter((t) => t.node._id !== id));
    if (activeTabId === id) {
      const remaining = openTabs.filter((t) => t.node._id !== id);
      setActiveTabId(remaining.length ? remaining[remaining.length - 1].node._id : null);
    }
  };

  const handleEditorChange = (value) => {
    setOpenTabs((prev) =>
      prev.map((t) =>
        t.node._id === activeTabId
          ? { ...t, content: value, dirty: value !== t.savedContent }
          : t
      )
    );
  };

  const handleSave = async () => {
    if (!activeTab) return;
    try {
      await api.put(`/api/projects/${projectId}/files/${activeTab.node._id}/content`, {
        content: activeTab.content,
      });
      setOpenTabs((prev) =>
        prev.map((t) =>
          t.node._id === activeTabId
            ? { ...t, savedContent: t.content, dirty: false }
            : t
        )
      );
      toast.success("Saved");
    } catch (error) {
      toast.error("Failed to save");
    }
  };

  // Ctrl+S keyboard shortcut
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activeTab]);

  return (
    <div className="h-screen flex flex-col bg-[var(--color-bg)]">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-[var(--color-border)]">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
        >
          <ArrowLeft size={16} />
        </button>
        <p className="text-sm text-[var(--color-text-muted)]">
          <span className="text-[var(--color-accent)]">$</span> editing project
        </p>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <FileExplorer projectId={projectId} onSelectFile={handleSelectFile} />

        <div className="flex-1 flex flex-col">
          {/* Tabs */}
          {openTabs.length > 0 && (
            <div className="flex items-center border-b border-[var(--color-border)] bg-[var(--color-terminal)] overflow-x-auto">
              {openTabs.map((tab) => (
                <div
                  key={tab.node._id}
                  onClick={() => setActiveTabId(tab.node._id)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm border-r border-[var(--color-border)] cursor-pointer whitespace-nowrap ${
                    activeTabId === tab.node._id
                      ? "bg-[var(--color-bg)] text-[var(--color-text)]"
                      : "text-[var(--color-text-muted)] hover:bg-[var(--color-panel)]"
                  }`}
                >
                  <span>
                    {tab.node.name}
                    {tab.dirty && <span className="text-[var(--color-accent)]"> ●</span>}
                  </span>
                  <button onClick={(e) => handleCloseTab(tab.node._id, e)}>
                    <X size={12} className="hover:text-[var(--color-danger)]" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Editor */}
          <div className="flex-1">
            {activeTab ? (
              <Editor
                key={activeTab.node._id}
                height="100%"
                language={getLanguage(activeTab.node.name)}
                value={activeTab.content}
                onChange={handleEditorChange}
                theme="vs-dark"
                onMount={(editor) => (editorRef.current = editor)}
                options={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: 14,
                  minimap: { enabled: false },
                }}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-[var(--color-text-muted)] text-sm">
                // select a file to start editing
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetailPage;