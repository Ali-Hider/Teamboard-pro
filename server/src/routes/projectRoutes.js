const express = require("express");
const router = express.Router();

const {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware"); // new file

// Protected routes
router.post("/", authMiddleware, roleMiddleware(["admin", "manager"]), createProject);
router.get("/", authMiddleware, getProjects);
// Update Project (Admin / Manager)
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin", "manager"]),
  updateProject
);

// Delete Project (Admin / Manager)
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin", "manager"]),
  deleteProject
);
module.exports = router;