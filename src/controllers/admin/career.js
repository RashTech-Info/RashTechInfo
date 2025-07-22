const Career = require("../../model/career");
const JobReply = require("../../model/jobReply");
const nodemailer = require("nodemailer");

// Add a new career opportunity
exports.addCareer = async (req, res) => {
  try {
    const {
      title,
      department,
      jobType,
      location,
      experience,
      responsibilities,
      requirements,
      status,
    } = req.body;

    const newJob = new Career({
      title,
      department,
      jobType,
      location,
      experience,
      responsibilities,
      requirements,
      status,
    });

    await newJob.save();

    res.status(201).json({
      message: "Career opportunity added successfully",
      data: newJob,
    });
  } catch (error) {
    console.error("Error adding job:", error);
    res.status(500).json({ message: "Failed to add job" });
  }
};

// Fetch all career opportunities
exports.getAllCareers = async (req, res) => {
  try {
    const careers = await Career.find().sort({ postedDate: -1 });
    res.status(200).json({
      message: "All career opportunities fetched successfully",
      data: careers,
    });
  } catch (error) {
    console.error("Error fetching careers:", error);
    res.status(500).json({ message: "Failed to fetch careers" });
  }
};

// Fetch a career opportunity by ID
exports.getCareerById = async (req, res) => {
  try {
    const { _id } = req.params;
    const career = await Career.findById(_id);

    if (!career) {
      return res.status(404).json({ message: "Career opportunity not found" });
    }

    res.status(200).json({
      message: "Career opportunity fetched successfully",
      data: career,
    });
  } catch (error) {
    console.error("Error fetching career by ID:", error);
    res.status(500).json({ message: "Failed to fetch career" });
  }
};

// Update a career opportunity
exports.updateCareer = async (req, res) => {
  try {
    const { _id } = req.params;
    const updatedData = req.body;

    const updatedCareer = await Career.findByIdAndUpdate(
      _id,
      { $set: updatedData },
      { new: true }
    );

    if (!updatedCareer) {
      return res.status(404).json({ message: "Career opportunity not found" });
    }

    res.status(200).json({
      message: "Career opportunity updated successfully",
      data: updatedCareer,
    });
  } catch (error) {
    console.error("Error updating career:", error);
    res.status(500).json({ message: "Failed to update career" });
  }
};

// Delete a career opportunity
exports.deleteCareer = async (req, res) => {
  try {
    const { _id } = req.params;

    const deletedCareer = await Career.findByIdAndDelete(_id);

    if (!deletedCareer) {
      return res.status(404).json({ message: "Career opportunity not found" });
    }

    res.status(200).json({
      message: "Career opportunity deleted successfully",
      data: deletedCareer,
    });
  } catch (error) {
    console.error("Error deleting career:", error);
    res.status(500).json({ message: "Failed to delete career" });
  }
};

// Fetch all open career opportunities
exports.getOpenCareers = async (req, res) => {
  try {
    const openCareers = await Career.find({ status: "Open" }).sort({
      postedDate: -1,
    });
    res.status(200).json({
      message: "Open career opportunities fetched successfully",
      data: openCareers,
    });
  } catch (error) {
    console.error("Error fetching open careers:", error);
    res.status(500).json({ message: "Failed to fetch open careers" });
  }
};

// job reply controller
exports.applyForJob = async (req, res) => {
  try {
    const { jobId, fullName, email, phone, portfolio, linkedIn, findWhere } =
      req.body;

    const resumeAttachment = req.files
      ? req.files.map((file) => file.filename)
      : [];

    const newJobReply = new JobReply({
      jobId,
      fullName,
      email,
      phone,
      portfolio,
      linkedIn,
      resumeAttachment,
      findWhere,
    });

    await newJobReply.save();

    // ✅ Send Thank You Email to Applicant
    const transporter = nodemailer.createTransport({
      service: "gmail", // or use your SMTP server
      auth: {
        user: "developerinfo1212@gmail.com",
        pass: "cocb txob mfpk zrar",
      },
    });

    const mailOptions = {
      from: `<developerinfo1212@gmail.com>`,
      to: email,
      subject: "Thank You for Applying",
      html: `
        <h2>Dear ${fullName},</h2>
        <p>Thank you for applying for the position. We have received your application and our team will review your details.</p>
        <p><strong>Details Submitted:</strong></p>
        <ul>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Phone:</strong> ${phone}</li>
          <li><strong>Found Where:</strong> ${findWhere}</li>
          <li><strong>Portfolio:</strong> <a href="${portfolio}" target="_blank">${portfolio}</a></li>
          <li><strong>LinkedIn:</strong> <a href="${linkedIn}" target="_blank">${linkedIn}</a></li>
        </ul>
        <p>If your profile is shortlisted, our HR team will reach out to you shortly.</p>
        <br />
        <p>Best Regards,<br/>Recruitment Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      message: "Job application submitted successfully",
      data: newJobReply,
    });
  } catch (error) {
    console.error("Error applying for job:", error);
    res.status(500).json({ message: "Failed to apply for job" });
  }
};

// Fetch all job applications for a specific job
exports.getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;

    const jobApplications = await JobReply.find({ jobId });

    res.status(200).json({
      message: "Job applications fetched successfully",
      data: jobApplications,
    });
  } catch (error) {
    console.error("Error fetching job applications:", error);
    res.status(500).json({ message: "Failed to fetch job applications" });
  }
};
