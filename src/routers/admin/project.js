const {
  addProjectCategory,
  deleteProjectCategory,
  updateProjectCategory,
  getAllprojectCategories,
  addProject,
  deleteProject,
  updateProject,
  getAllProjects,
  addTag,
  updateTag,
  deleteTag,
  getTag,
  getProjectById,
} = require("../../controllers/admin/project");

let express = require("express");
let router = express.Router();
let auth = require("../../../auth/adminauth");
let multer = require("multer");

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

// In your route file
const projectImage = upload.fields([
  { name: "projectImage", maxCount: 1 },
  { name: "mobileViewImage", maxCount: 1 },
]);

router.post("/addProjectCategory", addProjectCategory);
router.put("/updateProjectCategory/:id", auth, updateProjectCategory);
router.delete("/deleteProjectCategory/:id", auth, deleteProjectCategory);
router.get("/getAllProjectCategories", getAllprojectCategories);

// tags
router.post("/addTag", addTag);
router.get("/getTags", getTag);
router.put("/updateTag/:id", updateTag);
router.delete("/deleteTag/:id", auth, deleteTag);

// add project
router.post("/addProject", auth, projectImage, addProject);
router.put("/updateProject/:id", auth, projectImage, updateProject);
router.delete("/deleteProject/:id", auth, deleteProject);
router.get("/getAllProjects", getAllProjects);
router.get("/getProjectById/:id", getProjectById);
module.exports = router;
