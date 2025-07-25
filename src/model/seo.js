// models/Seo.js
const mongoose = require("mongoose");

const seoSchema = new mongoose.Schema({
  page: String, // e.g., 'home', 'about', etc.
  title: String,
  metaDescription: String,
  metaKeywords: String,
  canonicalUrl: String,
});

module.exports = mongoose.model("Seo", seoSchema);
