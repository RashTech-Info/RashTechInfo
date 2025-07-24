const feedBack = require("../../model/feedback");
const nodemailer = require("nodemailer");
const axios = require("axios");

const SECRET = "6LeohI0rAAAAANNj4RnLMet6vyJ8xQmRl24b6_fQ"; // Your secret key for reCAPTCHA

// create feedback
exports.submitFeedback = async (req, res) => {
  try {
    const { name, frmName, title, email, message, rating, service, recaptchaValue } = req.body;
   const feedBackImage = req.files ? req.files.map(file => file.filename) : [];

    // Verify reCAPTCHA
    axios({
      url: `https://www.google.com/recaptcha/api/siteverify?secret=${SECRET}&response=${recaptchaValue}`,
      method: "POST",
    }).then(async ({ data }) => {
      if (data.success) {
        // Save feedback to MongoDB
        const newFeedback = new feedBack({
          name,
          frmName,
          title,
          email,
          message,
          rating,
          service,
          reviewImage: feedBackImage,
        });

        await newFeedback.save();

        // Email configuration
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "developerinfo1212@gmail.com",
            pass: "cocb txob mfpk zrar", // Use App Password
          },
        });

        // 📩 Email to Admin
        const adminMailOptions = {
          from: "developerinfo1212@gmail.com",
          to: "developerinfo1212@gmail.com",
          subject: "📝 New Feedback Received",
          html: `
            <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
              <h2 style="color: #2a9d8f;">New Feedback Submission</h2>
              <p>A new feedback has been submitted. Details are below:</p>
              <table style="width:100%; border-collapse: collapse;">
                <tr><td style="padding: 8px;"><strong>Name:</strong></td><td>${name}</td></tr>
                <tr><td style="padding: 8px;"><strong>Form Name:</strong></td><td>${frmName}</td></tr>
                <tr><td style="padding: 8px;"><strong>Title:</strong></td><td>${title}</td></tr>
                <tr><td style="padding: 8px;"><strong>Email:</strong></td><td>${email}</td></tr>
                <tr><td style="padding: 8px;"><strong>Service:</strong></td><td>${service}</td></tr>
                <tr><td style="padding: 8px;"><strong>Rating:</strong></td><td>${rating} ⭐</td></tr>
                <tr><td style="padding: 8px;"><strong>Message:</strong></td><td>${message}</td></tr>
                ${feedBackImage ? `<tr><td style="padding: 8px;"><strong>Review Image:</strong></td><td><img src="https://yourdomain.com/uploads/${feedBackImage}" width="100"/></td></tr>` : ""}
              </table>
              <p style="margin-top: 20px;">Check the admin panel for more details.</p>
              <p style="color: #888;">-- Automated Feedback System</p>
            </div>
          `,
        };

        // 📩 Confirmation Email to User
        const userMailOptions = {
          from: "developerinfo1212@gmail.com",
          to: email,
          subject: "🙏 Thank You for Your Feedback!",
          html: `
            <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
              <h2 style="color: #2a9d8f;">Hello ${name},</h2>
              <p>Thank you for submitting your feedback. We truly appreciate your time and input.</p>

              <h4>Your Submitted Feedback:</h4>
              <ul>
                <li><strong>Form Name:</strong> ${frmName}</li>
                <li><strong>Title:</strong> ${title}</li>
                <li><strong>Service:</strong> ${service}</li>
                <li><strong>Rating:</strong> ${rating} ⭐</li>
                <li><strong>Message:</strong> ${message}</li>
              </ul>
              ${feedBackImage ? `<p><strong>Attached Image:</strong><br/><img src="https://yourdomain.com/uploads/${feedBackImage}" width="100"/></p>` : ""}
              
              <p>If you have any further questions, feel free to reach us at <a href="mailto:rashtechinfo@gmail.com">rashtechinfo@gmail.com</a>.</p>
              <p style="margin-top: 30px;">Best regards,<br><strong>RashTech Info Team</strong></p>
            </div>
          `,
        };

        // Send emails
        await transporter.sendMail(adminMailOptions);
        await transporter.sendMail(userMailOptions);

        res.status(200).json({ message: "Feedback submitted and emails sent successfully." });
      } else {
        res.status(400).json({ message: "Recaptcha verification failed!" });
      }
    });
  } catch (error) {
    console.error("Error processing feedback:", error);
    res.status(500).json({ message: "Failed to process feedback." });
  }
};

// get all feedbacks
exports.getFeedback = async (req, res) => {
  try {
    const feedbacks = await feedBack.find().sort({ createdAt: -1 });
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({ message: "Failed to fetch feedback." });
  }
};

// update feedback approval status
exports.approveFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const approval = req.body.approved;

    const feedback = await feedBack.findByIdAndUpdate(id, { approved: approval }, { new: true });
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found." });
    }
    res.status(200).json({ message: "Feedback approved successfully.", feedback });
  } catch (error) {
    console.error("Error approving feedback:", error);
    res.status(500).json({ message: "Failed to approve feedback." });
  }
};

// get approved feedbacks
exports.getApprovedFeedback = async (req, res) => {
  try {
    const feedbacks = await feedBack.find({ approved: true }).sort({ createdAt: -1 });
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error("Error fetching approved feedback:", error);
    res.status(500).json({ message: "Failed to fetch approved feedback." });
  }
};

//delete feedback
exports.deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedFeedback = await feedBack.findByIdAndDelete(id);
    if (!deletedFeedback) {
      return res.status(404).json({ message: "Feedback not found." });
    }
    res.status(200).json({ message: "Feedback deleted successfully." });
  } catch (error) {
    console.error("Error deleting feedback:", error);
    res.status(500).json({ message: "Failed to delete feedback." });
  }
};