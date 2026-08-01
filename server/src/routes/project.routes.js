const express = require("express");
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require("../controllers/project.controller");
const protect = require("../middleware/auth.middleware");
const memberRoutes = require("./member.routes");
const fileRoutes = require("./file.routes");

const router = express.Router();

router.use(protect);

router.post("/", createProject);
router.get("/", getProjects);
router.get("/:id", getProjectById);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

router.use("/:id/members", memberRoutes);
router.use("/:projectId/files", fileRoutes);

module.exports = router;