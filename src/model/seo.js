// models/Seo.js
const mongoose = require("mongoose");
const { Schema } = mongoose;
const seoSchema = new mongoose.Schema({
  page: { type: Schema.Types.ObjectId, ref: "Page", required: true }, // e.g., 'home', 'about', etc.
  title: String,
  metaDescription: String,
  metaKeywords: String,
  canonicalUrl: String,
});

module.exports = mongoose.model("Seo", seoSchema);
