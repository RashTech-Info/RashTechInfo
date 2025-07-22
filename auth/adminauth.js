const jwt = require("jsonwebtoken");
const admin = require("../src/model/admin");

module.exports = async (req, res, next) => {
  try {
    const token = req.cookies.rashjwt;
    if (token) {
      // console.log("rashjwt Token received:", token);

      const { _id } = jwt.verify(token, "rtinfo");
      // console.log("Decoded user ID:", _id);

      const adminData = await admin.findOne({ _id });
      if (adminData) {
        // console.log("admin found:", adminData);
        req.user = adminData;
        return next();
      } else {
        console.error("admin not found in database");
        return res.status(401).json({ error: "Unauthorized: admin not found" });
      }
    } else {
      console.error("rashjwt Cookie missing");
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
