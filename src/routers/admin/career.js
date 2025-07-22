let express = require("express");
const {
  addCareer,
  deleteCareer,
  getAllCareers,
  getCareerById,
  getOpenCareers,
  updateCareer,
  applyForJob,
  getJobApplications
} = require("../../controllers/admin/career");
let router = express.Router();
let auth = require("../../../auth/adminauth");

const multer = require("multer");

let upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/uploads/resume"); // ✅ Ensure this path exists
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  }),
});

router.post("/adminAdd_Career", auth, addCareer);
router.delete("/adminDelete_Career/:_id", auth, deleteCareer);
router.get("/adminGetAll_Careers", auth, getAllCareers);
router.get("/adminGet_Career/:_id",  getCareerById);
router.get("/GetOpen_Careers", getOpenCareers);
router.put("/adminUpdate_Career/:_id", auth, updateCareer);
router.post("/applyForJob", upload.single("resumeAttachment"), applyForJob);
router.get("/adminGetJobApplications/:jobId", auth, getJobApplications);

module.exports = router;
