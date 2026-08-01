const Project = require("../models/Project");

// @route POST /api/projects
const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    const project = await Project.create({
      name,
      description,
      owner: req.user._id,
    });

    res.status(201).json({ project });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @route GET /api/projects
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { owner: req.user._id },
        { members: { $elemMatch: { user: req.user._id, status: "active" } } },
      ],
    }).sort({ createdAt: -1 });

    res.status(200).json({ projects });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @route GET /api/projects/:id
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const isOwner = project.owner.toString() === req.user._id.toString();
    const isActiveMember = project.members.some(
      (m) => m.user.toString() === req.user._id.toString() && m.status === "active"
    );

    if (!isOwner && !isActiveMember) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({ project });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @route PUT /api/projects/:id
const updateProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    const project = await Project.findOne({ _id: req.params.id, owner: req.user._id });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (name !== undefined) project.name = name;
    if (description !== undefined) project.description = description;

    await project.save();

    res.status(200).json({ project });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @route DELETE /api/projects/:id
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, owner: req.user._id });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({ message: "Project deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { createProject, getProjects, getProjectById, updateProject, deleteProject };