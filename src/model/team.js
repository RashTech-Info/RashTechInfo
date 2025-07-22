const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  name: { type: String },
  description: { type: String },
  designation: { type: String },
  skill: { type: [String] },
  image: { type: String },
  toggle: { type: Boolean, default: null },
});

module.exports = mongoose.model("team", teamSchema);
