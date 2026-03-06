const Task = require("../models/Task");
const Project = require("../models/Project");
const User = require("../models/User");
const Joi = require("joi");

const taskSchema = Joi.object({
  title: Joi.string().min(3).required(),
  description: Joi.string().allow(""),
  projectId: Joi.string().required(),
  assignedTo: Joi.string().required(),
});

exports.createTask = async (req, res, next) => {
  try {

    const { error } = taskSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { title, description, projectId, assignedTo } = req.body;

    const project = await Project.findOne({
      _id: projectId,
      companyId: req.user.companyId,
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found in your company" });
    }

    const user = await User.findOne({
      _id: assignedTo,
      companyId: req.user.companyId,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found in your company" });
    }

    const task = await Task.create({
      title,
      description,
      projectId,
      assignedTo,
      companyId: req.user.companyId,
    });

    res.status(201).json({ task });

  } catch (error) {
    next(error);
  }
};

// ============================
// Get all tasks with pagination
// ============================
exports.getTasks = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const tasks = await Task.find({
       companyId: req.user.companyId,
       isDeleted: false,
       })
      .populate("assignedTo", "name email role")
      .populate("projectId", "name status")
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Task.countDocuments({ companyId: req.user.companyId });

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateTaskStatus = async (req, res, next) => {
  try {

    const { taskId, status } = req.body;

    const task = await Task.findOne({
      _id: taskId,
      companyId: req.user.companyId,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (
      req.user.role === "member" &&
      task.assignedTo.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    task.status = status;
    await task.save();

    res.json({ task });

  } catch (error) {
    next(error);
  }
};