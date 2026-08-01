import { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";

function PresenceBar({ projectId }) {
  const { socket, connected } = useSocket();
  const [activeUsers, setActiveUsers] = useState([]);

  useEffect(() => {
    if (!socket || !connected) return;

    socket.emit("project:join", projectId);

    socket.on("presence:update", (users) => {
      setActiveUsers(users);
    });

    return () => {
      socket.off("presence:update");
    };
  }, [socket, connected, projectId]);

  if (activeUsers.length === 0) return null;

  return (
    <div className="flex items-center gap-2 px-4 py-1.5 border-b border-[var(--color-border)] bg-[var(--color-terminal)]">
      <span className="text-xs text-[var(--color-text-muted)]">
        <span className="text-[var(--color-accent)]">●</span> online:
      </span>
      {activeUsers.map((u, i) => (
        <span
          key={u.userId + i}
          className="text-xs px-2 py-0.5 rounded bg-[var(--color-panel)] text-[var(--color-text)]"
        >
          {u.username}
        </span>
      ))}
    </div>
  );
}

export default PresenceBar;