const Lead = require("../../model/lead");

// Submit a new lead
exports.submitLead = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      address,
      country,
      state,
      city,
      zip,
      selectService,
      coreService,
      projectName,
      description,
      refrence,
    } = req.body;

    const attachment = req.files?.map((file) => file.filename) || [];

    const newLead = new Lead({
      name,
      phone,
      email,
      address,
      country,
      state,
      city,
      zip,
      selectService,
      coreService,
      projectName,
      description,
      refrence,
      attachment,
    });

    await newLead.save();

    res
      .status(201)
      .json({ message: "Lead submitted successfully", data: newLead });
  } catch (error) {
    console.error("Error submitting lead:", error);
    res.status(500).json({ message: "Failed to submit lead" });
  }
};

// Get all leads
exports.getAllLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res
      .status(200)
      .json({ message: "Leads fetched successfully", data: leads });
  } catch (error) {
    console.error("Error fetching leads:", error);
    res.status(500).json({ message: "Failed to fetch leads" });
  }
};

// Get a lead by ID
exports.getLeadById = async (req, res) => {
  try {
    const id = req.params._id;

    const lead = await Lead.findById(id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found." });
    }

    res.status(200).json({ message: "Lead fetched successfully", data: lead });
  } catch (error) {
    console.error("Error fetching lead:", error);
    res.status(500).json({ message: "Failed to fetch lead" });
  }
};

// update lead status
exports.updateLeadStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const id = req.params.id;
console.log("req.body data ----- ", req.body);

    const updatedLead = await Lead.findOneAndUpdate(
      { _id: id },
      { status },
      { new: true }
    );

    if (!updatedLead) {
      return res.status(404).json({ message: "Lead not found." });
    }

    res.status(200).json({
      message: "Lead status updated successfully",
      data: updatedLead,
    });
  } catch (error) {
    console.error("Error updating lead status:", error);
    res.status(500).json({ message: "Failed to update lead status" });
  }
};

// Delete a lead
exports.deleteLead = async (req, res) => {
  try {
    const id = req.params._id;

    const deletedLead = await Lead.findOneAndDelete({ _id: id });

    if (!deletedLead) {
      return res.status(404).json({ message: "Lead not found." });
    }

    res.status(200).json({ message: "Lead deleted successfully" });
  } catch (error) {
    console.error("Error deleting lead:", error);
    res.status(500).json({ message: "Failed to delete lead" });
  }
};
