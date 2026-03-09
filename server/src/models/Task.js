const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    // ✅ Soft delete flag
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);
taskSchema.index({ companyId: 1, isDeleted: 1 });
taskSchema.index({ projectId: 1 });
taskSchema.index({ assignedTo: 1 });
module.exports = mongoose.model("Task", taskSchema);
