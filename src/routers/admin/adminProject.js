let express = require("express");
const {
projectDetails,
projects
} = require("../../controllers/admin/adminProject");
let router = express.Router();
let auth = require("../../../auth/adminauth");

router.get("/projects", auth, projects);
router.get("/projectDetails", auth, projectDetails);


module.exports = router;
