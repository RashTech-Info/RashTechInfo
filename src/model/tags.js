const mongoose = require("mongoose");

const tagsSchema = new mongoose.Schema({
  tag: { type: String },
});

module.exports = mongoose.model("tags", tagsSchema);
