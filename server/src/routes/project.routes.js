const express = require("express");
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require("../controllers/project.controller");
const protect = require("../middleware/auth.middleware");

const router = express.Router();

router.use(protect); // every route below requires login

router.post("/", createProject);
router.get("/", getProjects);
router.get("/:id", getProjectById);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

module.exports = router;