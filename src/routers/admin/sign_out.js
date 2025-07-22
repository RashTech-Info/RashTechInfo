let express = require("express");
let router = express.Router();
let auth = require("../../../auth/adminauth");
const { Sign_Out } = require("../../controllers/admin/sign_out");

router.get("/adminSignOut", auth, Sign_Out);

module.exports = router;
