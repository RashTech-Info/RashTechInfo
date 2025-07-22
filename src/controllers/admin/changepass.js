let adminModel = require("../../model/admin");
let bcrypt = require("bcrypt");

exports.change_pass = async (req, res) => {
  try {
    let token = req.cookies.rashjwt;
    let newpass = req.body.newpass;
    let password = req.body.pass;

    let hashedPassword = await bcrypt.hash(newpass, 10);

    let adminData = await adminModel.findOne({ auth_key: token });
    let check = bcrypt.compareSync(password, adminData.pass);
    if (!check) {
      return res.status(404).json({
        message: "Password doesn't match",
        success: false,
      });
    }

    let passwordUpdate = await adminModel.findOneAndUpdate(
      { auth_key: token },
      { $set: { pass: hashedPassword } },
      { new: true } // Return updated document
    );

    if (!passwordUpdate) {
      return res.status(400).json({
        success: false,
        message: "Password update failed. User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
