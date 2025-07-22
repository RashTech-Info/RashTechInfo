const express = require("express");
const router = express.Router();
const {
  addCaseStudy,
  deleteCaseStudy,
  getAllCaseStudies,
  getCaseStudyById,
  updateCaseStudy,
} = require("../../controllers/admin/caseStudy");
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

// Upload multiple images: banner, testimonial image, process step images, and screenshots
const multiUpload = upload.fields([
  { name: "bannerImage", maxCount: 1 },
  { name: "authorImage", maxCount: 1 },
  { name: "processImages", maxCount: 10 },
  { name: "screenshots", maxCount: 10 },
]);

router.post("/casestudy", multiUpload, addCaseStudy);
router.get("/casestudy", getAllCaseStudies);
router.get("/casestudy/:id", getCaseStudyById);
router.patch("/updateCasestudy/:id", updateCaseStudy);
router.delete("/deleteCasestudy/:id", deleteCaseStudy);

module.exports = router;
