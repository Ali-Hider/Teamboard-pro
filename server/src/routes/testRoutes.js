// src/routes/testRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

// Protected test route
router.get("/", authMiddleware, (req, res) => {
  res.json({
    message: "Protected route is working ✅",
    user: req.user, // JWT payload
  });
});

module.exports = router;