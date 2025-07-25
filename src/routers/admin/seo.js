const express = require("express");
const router = express.Router();
const Seo = require("../../model/seo");
const Page = require("../../model/pages");

// Get all pages
router.get("/getPages", async (req, res) => {
  try {
    const pages = await Page.find({});
    res.json(pages.map((p) => p.name));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new page
router.post("/addPage", async (req, res) => {
  try {
    const { name } = req.body;
    const existing = await Page.findOne({ name });
    if (existing)
      return res.status(400).json({ message: "Page already exists" });

    const page = await Page.create({ name });
    res.json({ message: "Page added", page });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an existing page
router.put("/updatePage/:id", async (req, res) => {
  try {
    const { name } = req.body;
    const updated = await Page.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Page not found" });
    res.json({ message: "Page updated", page: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a page
router.delete("/deletePage/:id", async (req, res) => {
  try {
    const deleted = await Page.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Page not found" });
    res.json({ message: "Page deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET SEO by page
router.get("/getSeo", async (req, res) => {
  try {
    const { page } = req.body;
    const seoData = await Seo.findOne({ page });
    if (!seoData)
      return res.status(404).json({ message: "SEO data not found" });
    res.json(seoData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE or UPDATE SEO by page
router.post("/add&UpdateSeo", async (req, res) => {
  try {
    const { page, title, metaDescription, metaKeywords, canonicalUrl } =
      req.body;
    const seoData = await Seo.findOneAndUpdate(
      { page },
      { title, metaDescription, metaKeywords, canonicalUrl },
      { new: true, upsert: true }
    );
    res.json({ message: "SEO data saved", data: seoData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE SEO by page
router.delete("/deleteSeo", async (req, res) => {
  try {
    const { id } = req.body;
    const deleted = await Seo.findByIdAndDelete(id);
    if (!deleted)
      return res.status(404).json({ message: "SEO data not found" });
    res.json({ message: "SEO data deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
