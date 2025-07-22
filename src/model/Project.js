const mongoose = require("mongoose");
const tags = require("./tags");

const projectSchema = new mongoose.Schema({
  Project_title: {
    type: String,
    required: true,
  },
  projectCategory: {
    type: String,
    required: true,
  },
  tags: [String], // Array of strings for tags
  Project_description: {
    type: String,
    required: true,
  },
  projectLink: {
    type: String,
  },
  projectPurpose: {
    type: String,
  },

  projectImage: {
    type: String,
  },
  mobileViewImage: {
    type: String,
  },
});

const projectModel =
  mongoose.models.Project || mongoose.model("Project", projectSchema);

module.exports = projectModel;
