let { adminLogin } = require("../../controllers/admin/admin_login");
let express = require("express");
let router = express.Router();
let auth = require("../../../auth/adminauth");

router.post("/adminLogin", adminLogin);

module.exports = router;
