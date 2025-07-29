const CaseStudy = require("../../model/caseStudy");

// Create
exports.addCaseStudy = async (req, res) => {
  try {
    const {
      clientName,
      clientIndustry,
      clientIntro,
      challenge,
      projectBrief,
      solution,
      techStack,
      processSteps,
      resultsSummary,
      metrics,
      screenshots,
      testimonial,
      industryTags,
      serviceTags,
    } = req.body;

    const bannerImage = req.files?.bannerImage?.[0]?.filename || null;
    const authorImage = req.files?.authorImage?.[0]?.filename || null;
    const processImages =
      req.files?.processImages?.map((f) => f.filename) || [];
    const screenshotsArray =
      req.files?.screenshots?.map((f) => f.filename) || [];

    const finalProcessSteps = JSON.parse(processSteps || "[]").map(
      (step, index) => ({
        ...step,
        // If a new process image was uploaded for this index, use it. Otherwise, use step.image from parsed JSON (which can be existing filename or null from frontend)
        image: processImages[index] || step.image || null,
      })
    );

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
    console.error("Error adding case study:", err);
    res
      .status(400)
      .json({
        success: false,
        message: err.message || "Failed to add case study.",
      });
  }
};

// Get All
exports.getAllCaseStudies = async (req, res) => {
  try {
    const data = await CaseStudy.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Error fetching all case studies:", err);
    res
      .status(500)
      .json({
        success: false,
        message: err.message || "Failed to retrieve case studies.",
      });
  }
};

// Get by ID
exports.getCaseStudyById = async (req, res) => {
  try {
    const caseStudy = await CaseStudy.findById(req.params.id);
    if (!caseStudy)
      return res
        .status(404)
        .json({ success: false, message: "Case study not found" });
    res.status(200).json({ success: true, data: caseStudy });
  } catch (err) {
    console.error("Error fetching case study by ID:", err);
    res
      .status(500)
      .json({
        success: false,
        message: err.message || "Failed to retrieve case study.",
      });
  }
};

// Update
exports.updateCaseStudy = async (req, res) => {
  try {
    // Fetch the existing case study first to get current image filenames
    const existingCaseStudy = await CaseStudy.findById(req.params.id);
    if (!existingCaseStudy) {
      return res
        .status(404)
        .json({ success: false, message: "Case study not found" });
    }
    console.log("Updating Case Study:", req.params.id, req.body, req.files);

    // --- Handle bannerImage ---
    let bannerImageToSave = existingCaseStudy.bannerImage;
    if (req.files?.bannerImage?.[0]) {
      bannerImageToSave = req.files.bannerImage[0].filename; // New file uploaded
    } else if (req.body.bannerImage === "null") {
      bannerImageToSave = null; // Frontend explicitly sent "null" to remove
    }
    // If nothing was sent, it retains the old value by default from `bannerImageToSave` initialized above.

    // --- Handle authorImage ---
    let authorImageToSave = existingCaseStudy.testimonial?.authorImage;
    if (req.files?.authorImage?.[0]) {
      authorImageToSave = req.files.authorImage[0].filename; // New file uploaded
    } else if (req.body.authorImage === "null") {
      authorImageToSave = null; // Frontend explicitly sent "null" to remove
    }
    // If nothing was sent, it retains the old value.

    // --- Handle processImages ---
    const newProcessImageFilenames =
      req.files?.processImages?.map((f) => f.filename) || [];
    const parsedProcessSteps = req.body.processSteps
      ? JSON.parse(req.body.processSteps)
      : [];

    // Combine new process image filenames with existing ones, based on frontend intent
    const finalProcessSteps = parsedProcessSteps.map((step, index) => {
      return {
        title: step.title,
        description: step.description,
        // Prioritize new upload, then existing filename passed from frontend (which could be null), then original existing
        image: newProcessImageFilenames[index] || step.image, // step.image from parsedProcessSteps is already null or filename based on frontend's handleRemoveExistingImage
      };
    });

    // --- Handle screenshots ---
    let finalScreenshots = [];
    if (req.body.existingScreenshots) {
      try {
        // `existingScreenshots` from frontend contains only the filenames meant to be retained
        finalScreenshots = JSON.parse(req.body.existingScreenshots);
      } catch (parseError) {
        console.warn("Could not parse existingScreenshots:", parseError);
        // Fallback to current existing if parse fails, or empty array if not array
        finalScreenshots = Array.isArray(existingCaseStudy.screenshots)
          ? existingCaseStudy.screenshots
          : [];
      }
    } else {
      // If existingScreenshots was not sent by frontend, and no new files, clear them.
      // This happens if the user clears all screenshots but doesn't upload new ones.
      finalScreenshots = [];
    }

    const newUploadScreenshots =
      req.files?.screenshots?.map((f) => f.filename) || [];
    finalScreenshots = [...finalScreenshots, ...newUploadScreenshots];

    // Parse remaining JSON stringified body fields, using existing values as fallback
    const parsedTechStack = req.body.techStack
      ? JSON.parse(req.body.techStack)
      : existingCaseStudy.techStack;
    const parsedMetrics = req.body.metrics
      ? JSON.parse(req.body.metrics)
      : existingCaseStudy.metrics;
    const parsedIndustryTags = req.body.industryTags
      ? JSON.parse(req.body.industryTags)
      : existingCaseStudy.industryTags;
    const parsedServiceTags = req.body.serviceTags
      ? JSON.parse(req.body.serviceTags)
      : existingCaseStudy.serviceTags;
    const parsedTestimonial = req.body.testimonial
      ? JSON.parse(req.body.testimonial)
      : existingCaseStudy.testimonial;

    // Construct the updated object
    const updatedFields = {
      clientName: req.body.clientName || existingCaseStudy.clientName,
      clientIndustry:
        req.body.clientIndustry || existingCaseStudy.clientIndustry,
      clientIntro: req.body.clientIntro || existingCaseStudy.clientIntro,
      challenge: req.body.challenge || existingCaseStudy.challenge,
      projectBrief: req.body.projectBrief || existingCaseStudy.projectBrief,
      solution: req.body.solution || existingCaseStudy.solution,
      techStack: parsedTechStack,
      processSteps: finalProcessSteps,
      resultsSummary:
        req.body.resultsSummary || existingCaseStudy.resultsSummary,
      metrics: parsedMetrics,
      bannerImage: bannerImageToSave,
      screenshots: finalScreenshots,
      testimonial: {
        ...parsedTestimonial,
        authorImage: authorImageToSave,
      },
      industryTags: parsedIndustryTags,
      serviceTags: parsedServiceTags,
    };

    const updatedCase = await CaseStudy.findByIdAndUpdate(
      req.params.id,
      updatedFields,
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: updatedCase });
  } catch (err) {
    console.error("Error updating case study:", err);
    res
      .status(400)
      .json({
        success: false,
        message: err.message || "Failed to update case study.",
      });
  }
};

// Delete
exports.deleteCaseStudy = async (req, res) => {
  try {
    const deleted = await CaseStudy.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ success: false, message: "Not found" });
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    console.error("Error deleting case study:", err);
    res
      .status(500)
      .json({
        success: false,
        message: err.message || "Failed to delete case study.",
      });
  }
};
