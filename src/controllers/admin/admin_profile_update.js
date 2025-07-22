let admin = require("../../model/admin");

exports.adminEdit_profile_view = async (req, res) => {
  let token = req.cookies.rashjwt;
  let data = await admin.findOne({ auth_key: token });

  if (data) {
    return res.status(200).json({
      data: data,
      success: true,
      message: "admin find....",
    });
  } else {
    return res.status(300).json({
      success: false,
      message: "no admin found",
    });
  }
};

exports.Update_admin = async (req, res) => {
  let name = req.body.name;
  let mobile = req.body.mobile;
  let dateOfBirth = req.body.dateOfBirth;
  let address = req.body.address;
  let state = req.body.state;
  let gender = req.body.gender;
  let city = req.body.city;
  let token = req.cookies.rashjwt;

  // Handle file upload (only update if a new file is uploaded)
  let new_image = req.file ? req.file.filename : null;

  // Fetch the current (admin) to check existing image
  let existing_user = await admin.findOne({ auth_key: token });

  if (!existing_user) {
    return res.status(404).json({
      data: [],
      success: false,
      status: 404,
      message: "Not found",
    });
  }

  // Keep the existing image if no new one is uploaded
  let admin_image = new_image ? new_image : existing_user.admin_image;

  let update_data = await admin.findOneAndUpdate(
    { auth_key: token },
    {
      name: name,
      mobile: mobile,
      address: address,
      admin_image: admin_image,
      dateOfBirth: dateOfBirth,
      state: state,
      city: city,
      gender:gender,
    },
    { new: true } // return the updated document
  );

  console.log("Admin", update_data);

  if (update_data) {
    return res.status(200).json({
      data: update_data,
      success: true,
      message: "Admin details updated",
      status: 200,
    });
  } else {
    return res.status(300).json({
      data: [],
      success: false,
      status: 300,
      message: "Admin can't update",
    });
  }
};
