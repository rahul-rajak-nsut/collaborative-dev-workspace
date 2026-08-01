const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("./models/User");

// projectId -> Map of socketId -> { userId, username }
const projectPresence = new Map();

function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  // Auth middleware for sockets — runs once per connection attempt
  io.use(async (socket, next) => {
    try {
      const cookieHeader = socket.handshake.headers.cookie;
      if (!cookieHeader) return next(new Error("No cookie"));

      const token = cookieHeader
        .split("; ")
        .find((c) => c.startsWith("token="))
        ?.split("=")[1];

      if (!token) return next(new Error("No token"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select("-password");
      if (!user) return next(new Error("User not found"));

      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Authentication failed"));
    }
  });

  io.on("connection", (socket) => {
    let currentProjectId = null;

    socket.on("project:join", (projectId) => {
      currentProjectId = projectId;
      socket.join(projectId);

      if (!projectPresence.has(projectId)) {
        projectPresence.set(projectId, new Map());
      }
      projectPresence.get(projectId).set(socket.id, {
        userId: socket.user._id.toString(),
        username: socket.user.username,
      });

      const activeUsers = Array.from(projectPresence.get(projectId).values());
      io.to(projectId).emit("presence:update", activeUsers);
    });

    socket.on("disconnect", () => {
      if (currentProjectId && projectPresence.has(currentProjectId)) {
        projectPresence.get(currentProjectId).delete(socket.id);

        const activeUsers = Array.from(projectPresence.get(currentProjectId).values());
        io.to(currentProjectId).emit("presence:update", activeUsers);

        if (activeUsers.length === 0) {
          projectPresence.delete(currentProjectId);
        }
      }
    });
  });

  return io;
}

module.exports = { initSocket };