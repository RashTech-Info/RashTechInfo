const express = require("express");
const router = express.Router();
const {
  addTeamMember,
  deleteTeamMember,
  getAllTeamMembers,
  updateTeamMember,
} = require("../../controllers/admin/team");
const auth = require("../../../auth/adminauth");
const multer = require("multer");

let upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/uploads"); // ✅ Ensure this path exists
    },
    filename: function (req, file, cb) {
      const uniqueName = Date.now() + "-" + file.originalname;
      cb(null, uniqueName);
    },
  }),
});

router.post("/team", auth, upload.single("image"), addTeamMember);
router.get("/team", getAllTeamMembers);
// router.get("/team/:id", getTeamMember);
router.put("/team/:id", auth, upload.single("image"), updateTeamMember);
router.delete("/team/:id", auth, deleteTeamMember);

module.exports = router;
