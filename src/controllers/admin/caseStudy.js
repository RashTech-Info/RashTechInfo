const CaseStudy = require("../../model/caseStudy");

// Create
exports.addCaseStudy = async (req, res) => {
  try {
    const {
      clientName, clientIndustry, clientIntro,
      challenge, projectBrief,
      solution, techStack,
      processSteps, resultsSummary, metrics,
      screenshots, testimonial, industryTags, serviceTags
    } = req.body;

    const bannerImage = req.files?.bannerImage?.[0]?.filename || null;
    const authorImage = req.files?.authorImage?.[0]?.filename || null;
    const processImages = req.files?.processImages?.map(f => f.filename) || [];
    const screenshotsArray = req.files?.screenshots?.map(f => f.filename) || [];

    const finalProcessSteps = JSON.parse(processSteps || "[]").map((step, index) => ({
      ...step,
      image: processImages[index] || null,
    }));

    const newCase = await CaseStudy.create({
      clientName,
      clientIndustry,
      clientIntro,
      challenge,
      projectBrief,
      solution,
      techStack: JSON.parse(techStack || "[]"),
      processSteps: finalProcessSteps,
      resultsSummary,
      metrics: JSON.parse(metrics || "[]"),
      bannerImage,
      screenshots: screenshotsArray,
      testimonial: {
        ...JSON.parse(testimonial || "{}"),
        authorImage,
      },
      industryTags: JSON.parse(industryTags || "[]"),
      serviceTags: JSON.parse(serviceTags || "[]"),
    });

    res.status(201).json({ success: true, data: newCase });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Get All
exports.getAllCaseStudies = async (req, res) => {
  try {
    const data = await CaseStudy.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get by ID
exports.getCaseStudyById = async (req, res) => {
  try {
    const caseStudy = await CaseStudy.findById(req.params.id);
    if (!caseStudy) return res.status(404).json({ success: false, message: "Not found" });
    res.status(200).json({ success: true, data: caseStudy });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update
exports.updateCaseStudy = async (req, res) => {
  try {
    const updates = req.body;
    const caseStudy = await CaseStudy.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!caseStudy) return res.status(404).json({ success: false, message: "Not found" });
    res.status(200).json({ success: true, data: caseStudy });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Delete
exports.deleteCaseStudy = async (req, res) => {
  try {
    const deleted = await CaseStudy.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Not found" });
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
