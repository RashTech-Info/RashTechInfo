const TermsAndConditions = require("../../model/T&C");

// Add new T&C
exports.addTerms = async (req, res) => {
  try {
    const { headings, type, isActive } = req.body;

    if (!type || !["terms", "privacy"].includes(type)) {
      return res.status(400).json({ message: "Invalid or missing type" });
    }

    if (!headings || !Array.isArray(headings) || headings.length === 0) {
      return res.status(400).json({ message: "Headings are required" });
    }

    const newTerms = new TermsAndConditions({
      headings,
      type,
      isActive: isActive || false, // optional in body
    });

    await newTerms.save();

    res.status(201).json({
      message: "Terms and Conditions saved successfully",
      data: newTerms,
    });
  } catch (error) {
    console.error("Error adding T&C:", error);
    res.status(500).json({ message: "Failed to add Terms and Conditions" });
  }
};

// Get latest active T&C
exports.activeTerms = async (req, res) => {
  try {
    const latest = await TermsAndConditions.findOne({ isActive: true }).sort({
      createdAt: -1,
    });

    if (!latest) {
      return res.status(404).json({ message: "No active Terms found." });
    }

    res.status(200).json(latest);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch Terms and Conditions" });
  }
};

// Update status of specific T&C
exports.updateTerms = async (req, res) => {
  try {
    let { headings, type, isActive } = req.body;
    let id = req.params._id;
    await TermsAndConditions.findOneAndUpdate(
      { _id: id },
      { isActive: isActive, headings: headings, type: type }
    );
    res.status(200).json({ message: "T&C updated successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to update Terms." });
  }
};

// Get all T&C
exports.getAllTerms = async (req, res) => {
  try {
    const terms = await TermsAndConditions.find({type:"terms"}).sort({
      createdAt: -1,
    });
    const privacy = await TermsAndConditions.find({type:"privacy"}).sort({
      createdAt: -1,
    });

    res.status(200).json({ terms, privacy });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch Terms and Conditions" });
  }
};

// Delete specific T&C
exports.deleteTerms = async (req, res) => {
  try {
    const id = req.params._id;

    const deletedTerms = await TermsAndConditions.findOneAndDelete({ _id: id });

    if (!deletedTerms) {
      return res.status(404).json({ message: "Terms not found." });
    }

    res.status(200).json({ message: "Terms deleted successfully" });
  } catch (error) {
    console.error("Error deleting terms:", error);
    res.status(500).json({ message: "Failed to delete terms" });
  }
};
