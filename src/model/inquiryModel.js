const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema({
  fullName: { type: String },
  email: { type: String },
  phone: { type: String },
  lookingFor: { type: String },
  message: { type: String },
  status: {
    type: String,
    default: "New",
    enum: ["New", "Ongoing", "Done", "Rejected"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("inquiry", inquirySchema);
