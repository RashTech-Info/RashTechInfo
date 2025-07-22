const auth = require("../../../auth/adminauth");
let {
  Admin_register
} = require("../../controllers/admin/register");
let express = require("express");
let router = express.Router();


router.post("/adminRegister", Admin_register);

module.exports = router;
