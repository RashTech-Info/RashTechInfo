const mongoose = require("mongoose");
const caseStudySchema = new mongoose.Schema({
  // 1. Client Info
  clientName: { type: String },
  clientIndustry: { type: String }, // e.g. Fintech, eCommerce
  clientIntro: { type: String }, // short overview of who the client is

  // 2. Challenge / Project Brief
  challenge: { type: String }, // problem context & pain points :contentReference[oaicite:2]{index=2}
  projectBrief: { type: String }, // optional extended brief from IndiaNIC style :contentReference[oaicite:3]{index=3}

  // 3. Our Strategy / Solution
  solution: { type: String }, // approach, tools, methodology :contentReference[oaicite:4]{index=4}
  techStack: [String], // array of technologies used :contentReference[oaicite:5]{index=5}

  // 4. Process
  processSteps: [
    {
      title: String, // e.g. "Wireframing", "QA & Testing"
      description: String, // detail of step :contentReference[oaicite:6]{index=6}
      image: String, // optional image (wireframes, flow charts)
    },
  ],

  // 5. Results & Metrics
  resultsSummary: { type: String }, // qualitative outcome
  metrics: [
    {
      label: String, // e.g. "Load time", "Conversion uplift"
      value: String, // e.g. "23% faster", "70% increase" :contentReference[oaicite:7]{index=7}
    },
  ],

  // 6. Visuals / Assets
  bannerImage: String, // hero image
  screenshots: [String], // before/after visuals

  // 7. Testimonial
  testimonial: {
    quote: String, // client feedback :contentReference[oaicite:8]{index=8}
    author: String, // name & role
    authorImage: String, // photo of client person
  },

  // 9. Metadata
  industryTags: [String], // e.g. ["eCommerce", "SaaS"]
  serviceTags: [String], // e.g. ["UI/UX", "Cloud Migration"]
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("casestudy", caseStudySchema);
