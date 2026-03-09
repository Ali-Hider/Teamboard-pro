const Project = require("../models/Project");

const Task = require("../models/Task");
const Joi = require("joi");

const projectSchema = Joi.object({
  name: Joi.string().min(3).required(),
  description: Joi.string().allow(""),
});

exports.createProject = async (req, res, next) => {
  try {

    const { error } = projectSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { name, description } = req.body;

    const project = await Project.create({
      name,
      description,
      companyId: req.user.companyId,
      createdBy: req.user.id,
    });

    res.status(201).json({ project });

  } catch (error) {
    next(error);
  }
};

// ============================
// Get all projects in company with pagination
// ============================
exports.getProjects = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const projects = await Project.find({ companyId: req.user.companyId,   isDeleted: false, })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Project.countDocuments({ companyId: req.user.companyId, isDeleted: false });

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      projects,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProject = async (req, res, next) => {
  try {

    const { error } = projectSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { id } = req.params;

    const project = await Project.findOneAndUpdate(
      { _id: id, companyId: req.user.companyId },
      req.body,
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ project });

  } catch (error) {
    next(error);
  }
};

exports.deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;

    const project = await Project.findOne({ _id: id, companyId: req.user.companyId });

    if (!project || project.isDeleted) {
      return res.status(404).json({ message: "Project not found" });
    }

    // ✅ Soft delete the project
    project.isDeleted = true;
    await project.save();

    // ✅ Soft delete all tasks under this project
    await Task.updateMany(
      { projectId: project._id },
      { isDeleted: true }
    );

    res.json({ message: "Project and related tasks deleted successfully" });
  } catch (error) {
    next(error);
  }
};