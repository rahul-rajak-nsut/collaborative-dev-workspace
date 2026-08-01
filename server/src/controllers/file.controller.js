const FileNode = require("../models/FileNode");

// @route POST /api/projects/:projectId/files
const createFile = async (req, res) => {
  try {
    const { name, type, parent } = req.body;

    if (!["file", "folder"].includes(type)) {
      return res.status(400).json({ message: "Type must be file or folder" });
    }

    const node = await FileNode.create({
      name,
      type,
      parent: parent || null,
      project: req.params.projectId,
      createdBy: req.user._id,
    });

    res.status(201).json({ node });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @route GET /api/projects/:projectId/files
const getFiles = async (req, res) => {
  try {
    const nodes = await FileNode.find({ project: req.params.projectId }).sort({
      type: 1, // folders (alphabetically before "file") tend to list first — refined further on frontend
      name: 1,
    });
    res.status(200).json({ nodes });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @route PUT /api/projects/:projectId/files/:id
const updateFile = async (req, res) => {
  try {
    const { name, parent } = req.body;

    const node = await FileNode.findOne({ _id: req.params.id, project: req.params.projectId });
    if (!node) return res.status(404).json({ message: "Not found" });

    if (name !== undefined) node.name = name;
    if (parent !== undefined) node.parent = parent;

    await node.save();
    res.status(200).json({ node });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @route DELETE /api/projects/:projectId/files/:id
const deleteFile = async (req, res) => {
  try {
    const node = await FileNode.findOne({ _id: req.params.id, project: req.params.projectId });
    if (!node) return res.status(404).json({ message: "Not found" });

    // Recursively delete all descendants if this is a folder
    const deleteRecursive = async (nodeId) => {
      const children = await FileNode.find({ parent: nodeId });
      for (const child of children) {
        await deleteRecursive(child._id);
      }
      await FileNode.findByIdAndDelete(nodeId);
    };

    await deleteRecursive(node._id);

    res.status(200).json({ message: "Deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { createFile, getFiles, updateFile, deleteFile };