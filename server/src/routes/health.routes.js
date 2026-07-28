const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

router.get("/", (req, res) => {
  const dbState = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  res.status(200).json({ status: "ok", db: dbState });
});

module.exports = router;