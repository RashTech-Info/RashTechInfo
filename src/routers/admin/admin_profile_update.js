let express = require("express");
let router = express.Router();
let auth = require("../../../auth/adminauth");
const multer = require("multer");
const {
 Update_admin,
 adminEdit_profile_view
} = require("../../controllers/admin/admin_profile_update");

let upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/uploads"); // ✅ Ensure this path exists
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  }),
});

router.get("/adminProfile", auth, adminEdit_profile_view);
router.put(
  "/update_profile",
  auth,
  upload.single("admin_image"),
  Update_admin
);
module.exports = router;
