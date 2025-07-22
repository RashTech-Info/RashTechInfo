const projectModel = require("../../model/Project");
const projectCategoryModel = require("../../model/projectCategory");
const tagsModel = require("../../model/tags");

// category management for projects
exports.addProjectCategory = async (req, res) => {
  try {
    let categoryName = req.body.categoryName;
    const category = await projectCategoryModel.find({});
    if (!category.categoryName) {
      const newCategory = new projectCategoryModel({
        categoryName: categoryName,
      });
      await newCategory.save();
      res.status(200).json({
        message: "Category added successfully",
        category: newCategory,
      });
    } else {
      res.status(404).json({ message: "No categories found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateProjectCategory = async (req, res) => {
  try {
    let categoryName = req.body.categoryName;
    const categoryId = req.params.id;
    const category = await projectCategoryModel.findOne({ _id: categoryId });
    if (category) {
      category.categoryName = categoryName;
      await category.save();
      res.status(200).json({ message: "Category updated successfully" });
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteProjectCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await projectCategoryModel.findByIdAndDelete(categoryId);
    if (category) {
      res.status(200).json({ message: "Category deleted successfully" });
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllprojectCategories = async (req, res) => {
  const categories = await projectCategoryModel.find();
  res.status(200).json({ categories });
};

// tag management for projects
exports.addTag = async (req, res) => {
  try {
    const { tag } = req.body;

    if (!tag || tag.trim() === "") {
      return res.status(400).json({ message: "Tag is required" });
    }

    const trimmedTag = tag.trim();

    // Case-insensitive check: match any existing tag with the same letters
    const existingTag = await tagsModel.findOne({
      tag: { $regex: `^${trimmedTag}$`, $options: "i" },
    });

    if (existingTag) {
      return res.status(400).json({ message: "Tag already exists" });
    }

    const newTag = new tagsModel({ tag: trimmedTag });
    await newTag.save();

    res.status(201).json({ message: "Tag added successfully", data: newTag });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update tag with case-insensitive check
exports.updateTag = async (req, res) => {
  try {
    const { tag } = req.body;
    const tagId = req.params.id;

    if (!tag || tag.trim() === "") {
      return res.status(400).json({ message: "Tag is required" });
    }

    const trimmedTag = tag.trim();

    // Check for duplicate tag (case-insensitive), excluding current ID
    const duplicateTag = await tagsModel.findOne({
      _id: { $ne: tagId },
      tag: { $regex: `^${trimmedTag}$`, $options: "i" },
    });

    if (duplicateTag) {
      return res
        .status(400)
        .json({ message: "Tag with this name already exists" });
    }

    const existingTag = await tagsModel.findById(tagId);
    if (!existingTag) {
      return res.status(404).json({ message: "Tag not found" });
    }

    existingTag.tag = trimmedTag;
    await existingTag.save();

    res
      .status(200)
      .json({ message: "Tag updated successfully", data: existingTag });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a tag
exports.deleteTag = async (req, res) => {
  try {
    const tagId = req.params.id;
    const deletedTag = await tagsModel.findByIdAndDelete(tagId);
    if (deletedTag) {
      res.status(200).json({ message: "Tag deleted successfully" });
    } else {
      res.status(404).json({ message: "Tag not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getTag = async (req, res) => {
  const findTags = await tagsModel.find();
  res.status(200).json({ findTags });
};

// Add project with image
exports.addProject = async (req, res) => {
  try {
    const {
      Project_title,
      projectCategory,
      Project_description,
      projectLink,
      projectPurpose,
      tags,
    } = req.body;

    const projectImage = req.files?.projectImage?.[0]?.filename || null;
    const mobileViewImage = req.files?.mobileViewImage?.[0]?.filename || null;

    const newProject = new projectModel({
      Project_title,
      projectCategory,
      Project_description,
      projectLink,
      projectPurpose,
      projectImage,
      mobileViewImage,
      tags: Array.isArray(tags)
        ? tags
        : tags
          ? [tags]
          : [],
    });

    await newProject.save();
    res.status(201).json({ message: "Project added", data: newProject });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update project with optional new image
exports.updateProject = async (req, res) => {
  try {
    const updateData = { ...req.body };
    console.log("req.body------", req.body);

    if (updateData.tags) {
      updateData.tags = Array.isArray(updateData.tags)
        ? updateData.tags
        : [updateData.tags];
    }

    if (req.files?.projectImage?.[0]) {
      updateData.projectImage = req.files.projectImage[0].filename;
    }

    if (req.files?.mobileViewImage?.[0]) {
      updateData.mobileViewImage = req.files.mobileViewImage[0].filename;
    }

    const updated = await projectModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ message: "Project updated", data: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
// Delete a project
exports.deleteProject = async (req, res) => {
  try {
    const deleted = await projectModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Project not found" });
    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all projects
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await projectModel.find().populate("projectCategory");
    res
      .status(200)
      .json({ message: "Projects fetched successfully", data: projects });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get project by ID
exports.getProjectById = async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await projectModel.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res
      .status(200)
      .json({ message: "Project fetched successfully", data: project });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
