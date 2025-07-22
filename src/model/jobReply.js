const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "career" }, // Reference to job post
  fullName: { type: String },
  email: { type: String },
  phone: { type: String },
  portfolio: { type: String },
  linkedIn: { type: String },
  resumeAttachment: { type: [String] },
  findWhere: { type: String },
  status: { type: String, default: "Pending" }, // Pending / Reviewed / Interview
  appliedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Jobreply", jobSchema);
