const express = require("express");
const {
  createFile,
  getFiles,
  updateFile,
  deleteFile,
  getFileContent,
  saveFileContent,
} = require("../controllers/file.controller");
const protect = require("../middleware/auth.middleware");
const { loadProjectAndRole, requireEditRights } = require("../middleware/project.middleware");

const router = express.Router({ mergeParams: true });

router.use(protect);
router.use(loadProjectAndRole);

router.get("/", getFiles);
router.post("/", requireEditRights, createFile);
router.put("/:id", requireEditRights, updateFile);
router.delete("/:id", requireEditRights, deleteFile);
router.get("/:id/content", getFileContent);
router.put("/:id/content", requireEditRights, saveFileContent);

module.exports = router;