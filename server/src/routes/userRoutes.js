const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

// Admin-only: Invite new user
router.post("/", authMiddleware, roleMiddleware(["admin"]), userController.addUser);

// Optional: User sets password from invite
router.post("/set-password", userController.setPassword);
// new route — all authenticated users can see team members
router.get("/", authMiddleware, userController.getUsers);

module.exports = router;
