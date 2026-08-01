const express = require("express");
const { createFile, getFiles, updateFile, deleteFile } = require("../controllers/file.controller");
const protect = require("../middleware/auth.middleware");
const { loadProjectAndRole, requireEditRights } = require("../middleware/project.middleware");

const router = express.Router({ mergeParams: true });

router.use(protect);
router.use(loadProjectAndRole);

router.get("/", getFiles);
router.post("/", requireEditRights, createFile);
router.put("/:id", requireEditRights, updateFile);
router.delete("/:id", requireEditRights, deleteFile);

module.exports = router;