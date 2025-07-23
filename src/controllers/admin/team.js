const Team = require("../../model/team");

exports.addTeamMember = async (req, res) => {
  try {
    const { name, description, designation, skill, toggle } = req.body;
    const image = req.file ? req.file.filename : null;

    const newMember = await Team.create({
      name,
      description,
      designation,
      skill: JSON.parse(skill), // if coming as string from form-data
      image,
      toggle,
    });

    res.status(201).json({ success: true, data: newMember });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateTeamMember = async (req, res) => {
  try {
    // 1. Fetch the existing team member
    const existing = await Team.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Team member not found" });
    }

    // 2. Prepare update object
    const updates = { ...req.body };

    // 3. Handle image: use new file if uploaded, otherwise keep old
    updates.image = req.file ? req.file.filename : existing.image;

    // 4. Handle skill field if it's a string
    if (updates.skill && typeof updates.skill === "string") {
      updates.skill = JSON.parse(updates.skill);
    }

    // 5. Update in DB
    const updated = await Team.findByIdAndUpdate(req.params.id, updates, { new: true });

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


exports.getAllTeamMembers = async (req, res) => {
  try {
    const members = await Team.find();
    res.status(200).json({ success: true, data: members });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getActiveTeamMembers = async (req, res) => {
  try {
    const activeMembers = await Team.find({ toggle: true });
    res.status(200).json({ success: true, data: activeMembers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete team member
exports.deleteTeamMember = async (req, res) => {
  try {
    const deletedMember = await Team.findByIdAndDelete(req.params.id);
    if (!deletedMember) return res.status(404).json({ success: false, message: "Team member not found" });
    res.status(200).json({ success: true, message: "Team member deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};