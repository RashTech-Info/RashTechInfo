// const mongoose = require("mongoose");

// const termsSchema = new mongoose.Schema(
//   {
//     headings: [
//       {
//         title: { type: String },
//         content: { type: String }, // WYSIWYG HTML content
//       },
//     ],
//     isActive: {
//       type: Boolean,
//       default: false,
//     },
//     type: {
//       type: String,
//       enum: ["terms", "privacy"],
//       required: true,
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("TermsAndConditions", termsSchema);

// second code -------------------------
const mongoose = require("mongoose");

const headingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String, // Will store WYSIWYG HTML content
      required: true,
    },
  },
  { _id: false } // Prevent automatic _id generation for each heading
);

const termsSchema = new mongoose.Schema(
  {
    headings: {
      type: [headingSchema],
      required: true,
      validate: {
        validator: function (val) {
          return val.length > 0;
        },
        message: "At least one heading is required.",
      },
    },
    isActive: {
      type: Boolean,
      default: true, // Optional: set default to true if you want them active by default
    },
    type: {
      type: String,
      enum: ["terms", "privacy"],
      required: true,
      unique: true, // Optional: only one document per type
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TermsAndConditions", termsSchema);
