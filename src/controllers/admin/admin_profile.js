let admin = require("../../model/admin");

exports.admin_profile = async (req, res) => {
  let token = req.cookies.rashjwt;

  let data = await admin.findOne({ auth_key: token });
  if (data) {
    return res.status(200).json({
      data: data,
      message: "Admin Profile View",
      success: true,
      status: 200,
    });
  } else {
    return res.status(300).json({
      data: [],
      message: "Can't view admin profile",
      success: true,
      status: 300,
    });
  }
};
