const mongoose = require("mongoose");

const leadsSchema = new mongoose.Schema(
  {
    name: { type: String },
    phone: { type: String },
    email: { type: String },
    address: { type: String },
    country: { type: String },
    state: { type: String },
    city: { type: String },
    zip: { type: String },
    selectService: { type: String },
    coreService: { type: String },
    projectName: { type: String },
    description: { type: String },
    refrence: { type: String },
    attachment: { type: [String] },
    status: {
      type: String,
      default: "New",
      enum: ["New", "Ongoing", "Done", "rejected"],
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("lead", leadsSchema);
