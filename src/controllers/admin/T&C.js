// controllers/termsController.js
const TermsAndConditions = require("../../model/T&C");
// Create or Update Terms/Privacy Policy
exports.saveTerms = async (req, res) => {
  try {
    const { type, headings, isActive } = req.body;

    if (!type || !headings || headings.length === 0) {
      return res.status(400).json({ error: "Type and headings are required." });
    }

    let document = await TermsAndConditions.findOne({ type });

    if (document) {
      // Update
      document.headings = headings;
      document.isActive = isActive ?? document.isActive;
      await document.save();
      return res
        .status(200)
        .json({ message: "Updated successfully", data: document });
    } else {
      // Create
      const newDoc = await TermsAndConditions.create({
        type,
        headings,
        isActive,
      });
      return res
        .status(201)
        .json({ message: "Created successfully", data: newDoc });
    }
  } catch (error) {
    console.error("Error in saveTerms:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateTerms = async (req, res) => {
  try {
    const { _id } = req.params;
    const { headings, isActive } = req.body;

    const updatedDoc = await TermsAndConditions.findByIdAndUpdate(
      _id,
      { headings, isActive },
      { new: true }
    );

    if (!updatedDoc) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.status(200).json({ message: "Updated successfully", data: updatedDoc });
  } catch (error) {
    console.error("Error in updateTerms:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
// Get Terms or Privacy by Type
exports.getTermsByType = async (req, res) => {
  try {
    const privacy = await TermsAndConditions.find({
      type: "privacy",
      isActive: true,
    });
    const terms = await TermsAndConditions.find({
      type: "terms",
      isActive: true,
    });

    if (!privacy && !terms) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.status(200).json({ data: { privacy, terms } });
  } catch (error) {
    console.error("Error in getTermsByType:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all (Admin Purpose)
exports.getAllTerms = async (req, res) => {
  try {
    const docs = await TermsAndConditions.find().sort({ createdAt: -1 });
    res.status(200).json({ data: docs });
  } catch (error) {
    console.error("Error in getAllTerms:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteTerms = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedDoc = await TermsAndConditions.findByIdAndDelete(id);

    if (!deletedDoc) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.status(200).json({ message: "Deleted successfully", data: deletedDoc });
  } catch (error) {
    console.error("Error in deleteTerms:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
