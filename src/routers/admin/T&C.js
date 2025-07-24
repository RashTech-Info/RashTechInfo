// routes/termsRoutes.js
const express = require("express");
const router = express.Router();
const {
  deleteTerms,
  getAllTerms,
  getTermsByType,
  saveTerms,
  updateTerms
} = require("../../controllers/admin/T&C");

// POST or PUT - Create/Update Terms or Privacy
router.post("/addTerm&policy", saveTerms);

router.patch("/updateTerm&policy/:_id", updateTerms);
// GET by type (e.g., /api/terms/privacy or /api/terms/terms)
router.get("/activeTnC", getTermsByType);

// GET all (admin purpose)
router.get("/getAll", getAllTerms);

// DELETE by ID (if needed)
router.delete("/deleteT&C/:id", deleteTerms);

module.exports = router;
