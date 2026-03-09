const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "completed", "on-hold"],
      default: "active",
    },
    // ✅ Soft delete flag
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);
projectSchema.index({ companyId: 1, isDeleted: 1 });

module.exports = mongoose.model("Project", projectSchema);