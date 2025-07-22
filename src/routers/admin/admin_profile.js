let express = require("express");
const { admin_profile } = require("../../controllers/admin/admin_profile");
let router = express.Router();
let auth = require("../../../auth/adminauth");

router.get("/adminprofile", auth, admin_profile);

module.exports = router;
