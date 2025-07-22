const admin = require("../../model/admin"); // Adjust path if needed
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const SECRET = "6LdgvRwrAAAAAHTnETc9b0mIdT3RDI-H1NkjaNcZ"; // Your secret key for reCAPTCHA

exports.adminLogin = async (req, res) => {
  try {
    let email = req.body.email;
    let password = req.body.pass;
    // let recaptchaValue = req.body.recaptchaValue; // Assuming you are sending recaptcha value from client

    // console.log("Google Key :-------", recaptchaValue);

    // axios({
    //   url: `https://www.google.com/recaptcha/api/siteverify?secret=${SECRET}&response=${recaptchaValue}`,
    //   method: "POST",
    // })
    //   .then(async ({ data }) => {
    //     console.log(data);

    //     if (data.success) {
          let findData = await admin.findOne({ email });

          if (!findData) {
            return res.status(404).json({
              message: "Email not found",
              success: false,
            });
          }

          let check = bcrypt.compareSync(password, findData.pass);
          if (!check) {
            return res.status(400).json({
              message: "Password doesn't match",
              success: false,
            });
          }

          console.log("admin Logged in");
          console.log("ID is", findData._id);

          const token = jwt.sign({ _id: findData._id.toString() }, "rtinfo", {
            expiresIn: "1d",
          });
          await admin.findByIdAndUpdate(findData._id, { auth_key: token });

          res.cookie("rashjwt", token, {
            httpOnly: true,
          
          });
          return res.status(200).json({
            message: "Login successful",
            email: findData.email,
            data: findData,
            success: true,
            token,
          });
      //   } else {
      //     res.status(400).json({ message: "Recaptcha verification failed!" });
      //   }
      // })
      // .catch((error) => {
      //   console.log(error);
      //   res.status(400).json({ message: "Invalid Recaptcha" });
      // });
  } catch (error) {
    console.error("Login Page Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
