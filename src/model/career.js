const mongoose = require("mongoose");

const careerSchema = new mongoose.Schema(
  {
    title: String, // e.g., "React Developer"
    department: String, // e.g., "Frontend Team"
    jobType: String, // e.g., "Full-Time", "Internship"
    location: String, // e.g., "Remote", "Alwar, Rajasthan"
    experience: String, // e.g., "1-3 years"
    responsibilities: [String], // Bulleted points
    requirements: [String], // Must-have skills/traits
    postedDate: { type: Date, default: Date.now },
    status: { type: String, default: "Open" }, // Open / Closed
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("career", careerSchema);
