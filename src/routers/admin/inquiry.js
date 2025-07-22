let express = require("express");
const {
  deleteInquiry,
  getAllInquiries,
  submitInquiry,
  updateInquiryStatus,
} = require("../../controllers/admin/inquiry");
let router = express.Router();
let auth = require("../../../auth/adminauth");

router.get("/inquiries", auth, getAllInquiries);
router.post("/inquiries",  submitInquiry);
router.put("/inquiries/:_id", auth, updateInquiryStatus);
router.delete("/inquiries/:_id", auth, deleteInquiry);

module.exports = router;
