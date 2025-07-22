const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  name: { type: String },
  frmName: { type: String,},
  title: { type: String },
  email: { type: String, required: true },
  message: { type: String, required: true },
  rating: { type: Number, required: true },
  service: { type: String },
  reviewImage: { type: String },
  createdAt: { type: Date, default: Date.now },
  approved: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("feedback", feedbackSchema);
