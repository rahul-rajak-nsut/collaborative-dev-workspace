const Project = require("../models/Project");
const User = require("../models/User");

// Helper: find the requester's role within a project (owner counts as "owner")
const getRole = (project, userId) => {
  if (project.owner.toString() === userId.toString()) return "owner";
  const member = project.members.find(
    (m) => m.user.toString() === userId.toString() && m.status === "active"
  );
  return member ? member.role : null;
};

// @route POST /api/projects/:id/invite
const inviteMember = async (req, res) => {
  try {
    const { email, role } = req.body;

    if (!["editor", "viewer"].includes(role)) {
      return res.status(400).json({ message: "Role must be editor or viewer" });
    }

    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const requesterRole = getRole(project, req.user._id);
    if (requesterRole !== "owner" && requesterRole !== "editor") {
      return res.status(403).json({ message: "Not authorized to invite members" });
    }

    const invitedUser = await User.findOne({ email });
    if (!invitedUser) {
      return res.status(404).json({ message: "No user found with that email" });
    }

    if (invitedUser._id.toString() === project.owner.toString()) {
      return res.status(409).json({ message: "This user is already the owner" });
    }

    const alreadyMember = project.members.some(
      (m) => m.user.toString() === invitedUser._id.toString()
    );
    if (alreadyMember) {
      return res.status(409).json({ message: "This user is already a member or pending" });
    }

    // Owner invites → active immediately. Editor invites → pending, needs approval.
    const status = requesterRole === "owner" ? "active" : "pending";

    project.members.push({
      user: invitedUser._id,
      role,
      status,
      invitedBy: req.user._id,
    });

    await project.save();

    res.status(201).json({ project });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @route PUT /api/projects/:id/members/:userId/approve
const approveMember = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the owner can approve members" });
    }

    const member = project.members.find(
      (m) => m.user.toString() === req.params.userId && m.status === "pending"
    );
    if (!member) return res.status(404).json({ message: "No pending invite found" });

    member.status = "active";
    await project.save();

    res.status(200).json({ project });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @route PUT /api/projects/:id/members/:userId/role
const updateMemberRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!["editor", "viewer"].includes(role)) {
      return res.status(400).json({ message: "Role must be editor or viewer" });
    }

    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the owner can change roles" });
    }

    const member = project.members.find((m) => m.user.toString() === req.params.userId);
    if (!member) return res.status(404).json({ message: "Member not found" });

    member.role = role;
    await project.save();

    res.status(200).json({ project });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @route DELETE /api/projects/:id/members/:userId
const removeMember = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the owner can remove members" });
    }

    project.members = project.members.filter(
      (m) => m.user.toString() !== req.params.userId
    );

    await project.save();

    res.status(200).json({ project });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @route GET /api/projects/:id/members
const getMembers = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      "members.user",
      "username email"
    ).populate("owner", "username email");

    if (!project) return res.status(404).json({ message: "Project not found" });

    const role = getRole(project, req.user._id);
    if (!role) return res.status(403).json({ message: "Not a member of this project" });

    res.status(200).json({ owner: project.owner, members: project.members });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { inviteMember, approveMember, updateMemberRole, removeMember, getMembers };