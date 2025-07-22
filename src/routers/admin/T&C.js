const express = require("express");
const router = express.Router();
const {addTerms,getAllTerms,activeTerms,updateTerms,deleteTerms} = require("../../controllers/admin/T&C");
const auth = require("../../../auth/adminauth");

router.post("/add-terms", auth, addTerms);
router.get("/active-terms", activeTerms);
router.patch("/update-terms/:_id", auth, updateTerms);
router.get("/all-terms", auth, getAllTerms);
router.delete("/delete-terms/:_id", auth, deleteTerms);

module.exports = router;
