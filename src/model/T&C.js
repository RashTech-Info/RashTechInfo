const mongoose = require("mongoose");

const termsSchema = new mongoose.Schema(
  {
    headings: [
      {
        title: { type: String },
        content: { type: String }, // WYSIWYG HTML content
      },
    ],
    isActive: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: ["terms", "privacy"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TermsAndConditions", termsSchema);
