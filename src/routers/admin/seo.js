const express = require("express");
const router = express.Router();
const Seo = require("../../model/seo");
const Page = require("../../model/pages");

// Get all pages
router.get("/getPages", async (req, res) => {
  try {
    const pages = await Page.find({});
    res.json({ message: "Pages fetched", pages });
  } catch (err) {
    console.error("Error fetching pages:", err);
    res.status(500).json({ error: err.message });
  }
});

// Add a new page
router.post("/addPage", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Page name cannot be empty." });
    }

    const existing = await Page.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({ message: "Page already exists." });
    }

    const page = await Page.create({ name: name.trim() });
    res.status(201).json({ message: "Page added", page });
  } catch (err) {
    console.error("Error adding page:", err);
    res.status(500).json({ error: err.message });
  }
});

// Update an existing page
router.put("/updatePage/:id", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Page name cannot be empty." });
    }

    const existingWithName = await Page.findOne({ name: name.trim(), _id: { $ne: req.params.id } });
    if (existingWithName) {
      return res.status(400).json({ message: "Another page with this name already exists." });
    }

    const updated = await Page.findByIdAndUpdate(
      req.params.id,
      { name: name.trim() },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Page not found." });
    }
    res.json({ message: "Page updated", page: updated });
  } catch (err) {
    console.error("Error updating page:", err);
    res.status(500).json({ error: err.message });
  }
});

// Delete a page
router.delete("/deletePage/:id", async (req, res) => {
  try {
    const pageId = req.params.id;
    const deletedPage = await Page.findByIdAndDelete(pageId);
    if (!deletedPage) {
      return res.status(404).json({ message: "Page not found." });
    }

    // Delete associated SEO data when a page is deleted
    await Seo.deleteMany({ page: deletedPage._id }); // <--- CHANGED: Query by page _id

    res.json({ message: `Page '${deletedPage.name}' and its associated SEO data deleted.` });
  } catch (err) {
    console.error("Error deleting page:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET all SEO data (CORRECTED - using populate)
router.get("/getSeo", async (req, res) => {
  try {
    // Use populate('page') to get the full Page document reference
    // Then select the 'name' field from the populated 'page' document
    const allSeoData = await Seo.find({}).populate('page', 'name').exec();
    console.log("All SEO Data fetched:", allSeoData);

    if (!allSeoData || allSeoData.length === 0) {
      return res.status(200).json([]);
    }
    res.json(allSeoData);
  } catch (err) {
    console.error("Error fetching all SEO data:", err);
    res.status(500).json({ error: err.message });
  }
});

// CREATE or UPDATE SEO data by page (using pageName for lookup, then saving pageDoc._id)
router.post("/add&UpdateSeo", async (req, res) => {
  try {
    const { page, title, metaDescription, metaKeywords, canonicalUrl } = req.body;
    // 'page' in frontend payload is now 'pageName' from dropdown selection (e.g., "home")

    // Find the Page document by name
    const pageDoc = await Page.findOne({ name: page }); // 'page' here is the name from frontend
    if (!pageDoc) {
      return res.status(400).json({ message: `Page '${page}' does not exist in your defined pages.` });
    }

    // Create or update SEO by Page ID
    const seoData = await Seo.findOneAndUpdate(
      { page: pageDoc._id }, // Query by ObjectId
      {
        page: pageDoc._id, // Set the page field to the ObjectId
        title,
        metaDescription,
        metaKeywords,
        canonicalUrl,
      },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({ message: "SEO data saved", data: seoData });
  } catch (err) {
    console.error("Error saving SEO data:", err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE SEO by _id
router.delete("/deleteSeo/:id", async (req, res) => {
  try {
    const deleted = await Seo.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "SEO data not found." });
    }
    res.json({ message: "SEO data deleted." });
  } catch (err) {
    console.error("Error deleting SEO data:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;