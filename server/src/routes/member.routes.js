const express = require("express");
const {
  inviteMember,
  approveMember,
  updateMemberRole,
  removeMember,
  getMembers,
} = require("../controllers/member.controller");
const protect = require("../middleware/auth.middleware");

const router = express.Router({ mergeParams: true }); // needed to access :id from parent route

router.use(protect);

router.get("/", getMembers);
router.post("/invite", inviteMember);
router.put("/:userId/approve", approveMember);
router.put("/:userId/role", updateMemberRole);
router.delete("/:userId", removeMember);

module.exports = router;