const mongoose = require("mongoose");

const pageSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }
});

module.exports = mongoose.model("Page", pageSchema);
