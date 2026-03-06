const express = require("express");
const router = express.Router();
const {
  createTask,
  updateTaskStatus,
  getTasks, // ✅ add
} = require("../controllers/taskController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

// Admin/Manager can create tasks
router.post("/", authMiddleware, roleMiddleware(["admin", "manager"]), createTask);

// All authenticated users can view tasks in their company
router.get("/", authMiddleware, getTasks);

// Members can update their task status
router.patch("/status", authMiddleware, updateTaskStatus);

module.exports = router;
