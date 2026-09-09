const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const dashboardController = require("../controllers/dashboardController");
const { requireAuth } = require("../middleware/authMiddleware");

// Public auth pages
router.get("/login", authController.showLogin);
router.post("/login", authController.login);

router.get("/register", authController.showRegister);
router.post("/register", authController.register);

router.post("/logout", authController.logout);

// Dashboard (protected)
router.get("/dashboard", requireAuth, dashboardController.showDashboard);

module.exports = router;