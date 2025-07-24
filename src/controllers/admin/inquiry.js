const Inquiry = require("../../model/inquiryModel");
const nodemailer = require("nodemailer");
const axios = require("axios");

const SECRET = "6LeohI0rAAAAANNj4RnLMet6vyJ8xQmRl24b6_fQ"; // Your secret key for reCAPTCHA

exports.submitInquiry = async (req, res) => {
  try {
    const {
      fullName,
      frmName,
      projectName,
      email,
      phone,
      lookingFor,
      message,
    } = req.body;

    let recaptchaValue = req.body.recaptchaValue; // Assuming you are sending recaptcha value from client

    axios({
      url: `https://www.google.com/recaptcha/api/siteverify?secret=${SECRET}&response=${recaptchaValue}`,
      method: "POST",
    }).then(async ({ data }) => {
      console.log(data);

      if (data.success) {
        // Save inquiry to MongoDB
        const newInquiry = new Inquiry({
          fullName,
          frmName,
          projectName,
          email,
          phone,
          lookingFor,
          message,
          status: "New", // Default status
        });

        await newInquiry.save();

        // Nodemailer transporter setup
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "developerinfo1212@gmail.com", // Replace with your Gmail
            pass: "cocb txob mfpk zrar", // Use App Password if 2FA is enabled
          },
        });

        // 📩 Email to Admin
        const adminMailOptions = {
          from: "developerinfo1212@gmail.com",
          to: "hs459190@gmail.com", // Replace with admin's email
          subject: "📥 New Event Inquiry Received",
          html: `
              <h2 style="color:#444;">New Event Inquiry</h2>
              <p>A new event inquiry has been submitted. Here are the details:</p>
              <table style="border-collapse: collapse; width: 100%;">
                <tr><td><strong>Name:</strong></td><td>${fullName}</td></tr>
                <tr><td><strong>Form Name:</strong></td><td>${frmName}</td></tr>
                <tr><td><strong>Project Name:</strong></td><td>${projectName}</td></tr>
                <tr><td><strong>Email:</strong></td><td>${email}</td></tr>
                <tr><td><strong>Phone:</strong></td><td>${phone}</td></tr>
                <tr><td><strong>Looking For:</strong></td><td>${lookingFor}</td></tr>
                <tr><td><strong>Message:</strong></td><td>${message}</td></tr>
              </table>
              <p style="margin-top:20px;">Please reach out to the client as soon as possible to confirm details.</p>
              <p style="color:#888;">-- Automated Notification from Inquiry System</p>
            `,
        };

        // 📩 Confirmation Email to User
        const userMailOptions = {
          from: "developerinfo1212@gmail.com",
          to: email,
          subject: "🎉 Thank You for Your Inquiry!",
          html: `
              <div style="font-family:Arial, sans-serif; color:#333;">
                <h2 style="color:#2a9d8f;">Thank You, ${fullName}!</h2>
                <p>We’ve received your inquiry for an upcoming <strong>${lookingFor}</strong>. Our team will get in touch with you shortly to discuss the details.</p>
                
                <h4>Your Submitted Details:</h4>
                <ul>
                  <li><strong>Full Name:</strong> ${fullName}</li>
                  <li><strong>Form Name:</strong> ${frmName}</li>
                  <li><strong>Project Name:</strong> ${projectName}</li>
                  <li><strong>Email:</strong> ${email}</li>
                  <li><strong>Phone:</strong> ${phone}</li>
                    <li><strong>Looking For:</strong> ${lookingFor}</li>
                    <li><strong>Message:</strong> ${message}</li>
                </ul>
          
                <p>If you have any urgent queries, feel free to contact us directly at <a href="mailto:rashtechinfo@gmail.com">rashtechinfo@gmail.com</a>.</p>
          
                <p style="margin-top: 30px;">Warm regards,<br><strong>Event Management Team</strong></p>
              </div>
            `,
        };

        // Send both emails
        await transporter.sendMail(adminMailOptions);
        await transporter.sendMail(userMailOptions);

        res.status(200).json({ message: "Inquiry submitted and emails sent." });
      } 
      else {
        res.status(400).json({ message: "Recaptcha verification failed!" });
      }
    });
  } catch (error) {
    console.error("Error processing inquiry:", error);
    res.status(500).json({ message: "Failed to process inquiry." });
  }
};

//update inquiry status
exports.updateInquiryStatus = async (req, res) => {
  try {
    const { _id } = req.params;
    const { status } = req.body;

    if (!_id || !status) {
      return res
        .status(400)
        .json({ message: "Inquiry ID and status are required." });
    }

    const updatedInquiry = await Inquiry.findByIdAndUpdate(
      _id,
      { status },
      { new: true }
    );

    if (!updatedInquiry) {
      return res.status(404).json({ message: "Inquiry not found." });
    }

    res.status(200).json({
      message: "Inquiry status updated successfully.",
      inquiry: updatedInquiry,
    });
  } catch (error) {
    console.error("Error updating inquiry status:", error);
    res.status(500).json({ message: "Failed to update inquiry status." });
  }
};

// delete inquiry
exports.deleteInquiry = async (req, res) => {
  try {
    const { _id } = req.params;

    if (!_id) {
      return res.status(400).json({ message: "Inquiry ID is required." });
    }

    const deletedInquiry = await Inquiry.findByIdAndDelete(_id);

    if (!deletedInquiry) {
      return res.status(404).json({ message: "Inquiry not found." });
    }

    res.status(200).json({ message: "Inquiry deleted successfully." });
  } catch (error) {
    console.error("Error deleting inquiry:", error);
    res.status(500).json({ message: "Failed to delete inquiry." });
  }
};

// Get all inquiries
exports.getAllInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    const newInquiries = inquiries.filter(
      (inquiry) => inquiry.status === "New"
    );

    const ongoingInquiries = inquiries.filter(
      (inquiry) => inquiry.status === "Ongoing"
    );

    const doneInquiries = inquiries.filter(
      (inquiry) => inquiry.status === "Done"
    );

    const rejectedInquiries = inquiries.filter(
      (inquiry) => inquiry.status === "Rejected"
    );

    res.status(200).json({
      message: "Inquiries fetched successfully.",
      data: inquiries,
      newInquiries: newInquiries,
      ongoingInquiries: ongoingInquiries,
      doneInquiries: doneInquiries,
      rejectedInquiries: rejectedInquiries,
    });
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    res.status(500).json({ message: "Failed to fetch inquiries." });
  }
};
