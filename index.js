const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { connectDB } = require("./db/dbconnection");
dotenv.config();

const app = express();
app.use(helmet());

// CORS Configuration
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

// ✅ Apply CORS to static file route too
app.use(
  "/uploads",
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
  express.static("uploads")
);
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve Static Files
app.use(express.static(path.join(__dirname, "/public")));
app.use("/uploads", express.static("public/uploads"));

// Connect to Database
connectDB();

// Import and Use Routes
const adminRoutes = [
  "addBlogs",
  "admin_login",
  "admin_profile_update",
  "admin_profile",
  "adminProject",
  "career",
  "caseStudy",
  "changepass",
  "feedback",
  "forgetPass",
  "inquiry",
  "lead",
  "project",
  "register",
  "sign_out",
  "seo",
  "T&C",
  "team",
];

// Load Admin Routes
adminRoutes.forEach((route) => {
  app.use("", require(`./src/routers/admin/${route}`));
});

// Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});

// Handle Server Errors
app.on("error", (error) => {
  console.error(`❌ Server startup error: ${error.message}`);
});
