
let admin = require("../../model/admin");
let project = require("../../model/Project");

exports.projects = async (req, res) => {
  try {
    let projectData = await project.find({});
    if (projectData) {
      return res.status(200).json({
        success: true,
        message: "Project Data",
        data: projectData,
      });
    } else {
      return res.status(300).json({
        success: false,
        message: "No Project Data",
      });
    }
  } catch (error) {
    console.error("Error in projects API:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.projectDetails = async (req, res) => {
  try {
    let { _id } = req.query;
    let projectData = await project.findById(_id);
    if (projectData) {
      return res.status(200).json({
        success: true,
        message: "Project Details",
        data: projectData,
      });
    } else {
      return res.status(300).json({
        success: false,
        message: "No Project Details",
      });
    }
  } catch (error) {
    console.error("Error in projects details API:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
