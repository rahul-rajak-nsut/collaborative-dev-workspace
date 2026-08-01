const Project = require("../models/Project");

// Attaches req.project and req.projectRole; call this before any project-scoped route
const loadProjectAndRole = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const isOwner = project.owner.toString() === req.user._id.toString();
    const member = project.members.find(
      (m) => m.user.toString() === req.user._id.toString() && m.status === "active"
    );

    if (!isOwner && !member) {
      return res.status(403).json({ message: "Not a member of this project" });
    }

    req.project = project;
    req.projectRole = isOwner ? "owner" : member.role;
    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Use after loadProjectAndRole — blocks viewers from write actions
const requireEditRights = (req, res, next) => {
  if (req.projectRole === "viewer") {
    return res.status(403).json({ message: "Viewers cannot make changes" });
  }
  next();
};

module.exports = { loadProjectAndRole, requireEditRights };