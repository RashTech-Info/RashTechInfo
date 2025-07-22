const mongoose = require("mongoose");

const projectCategorySchema = new mongoose.Schema({
  categoryName: { type: String, required: true },
});

module.exports = mongoose.model("projectCategory", projectCategorySchema);
