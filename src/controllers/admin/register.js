let admin = require("../../model/admin");
let bcrypt = require("bcrypt");

exports.Admin_register = async (req, res) => {
  try {
    let {
      name,
      email,
      pass: password,
      mobile,
      address,
      city,
      state,
      gender,
      dateOfBirth,
      country,
    } = req.body;

    // Check if password is provided and not empty
    if (!password || password.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    let hashedPassword = await bcrypt.hash(password, 10);

    // Check if an admin already exists
    let Admin = await admin.findOne({ role: "Admin" });
    if (!Admin) {
      let rec = new admin({
        name,
        mobile,
        email,
        pass: hashedPassword,
        address,
        state,
        city,
        gender,
        dateOfBirth,
        country,
        role: "Admin",
        admin_image: "userImage.avif",
      });

      let saved_data = await rec.save();

      if (saved_data) {
        return res.status(200).json({
          message: "Admin registered successfully",
          data: saved_data,
          success: true,
        });
      } else {
        return res.status(500).json({
          success: false,
          message: "Admin registration failed",
        });
      }
    } else {
      return res.status(500).json({
        success: false,
        message: "Admin Already Registered",
      });
    }
  } catch (error) {
    console.error("Error in register API:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
