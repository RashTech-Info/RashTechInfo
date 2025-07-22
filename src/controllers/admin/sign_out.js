let admin = require("../../model/admin");

exports.Sign_Out = async (req, res) => {
  try {
    let token = req.cookies.rashjwt;
    // Clear the rashjwt cookie
    res.clearCookie("rashjwt", { httpOnly: true });

    let data = await admin.findOneAndUpdate(
      { auth_key: token },
      { auth_key: null }
    );
    res.status(200).json({
      message: "Logout successfully.",
      success: true,
      status: 200,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "An error occurred during logout.",
      success: false,
      status: 500,
    });
  }
};

