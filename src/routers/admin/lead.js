let express = require("express");
const { deleteLead,getAllLeads,getLeadById,submitLead,updateLeadStatus } = require("../../controllers/admin/lead");
let router = express.Router();
let auth = require("../../../auth/adminauth");

router.post("/create-lead", submitLead);
router.get("/getAllLeads", auth, getAllLeads);
router.get("/getLeadById/:_id", auth, getLeadById);
router.patch("/updateLeadStatus/:id", auth, updateLeadStatus);
router.delete("/deleteLead/:_id", auth, deleteLead);

module.exports = router;
