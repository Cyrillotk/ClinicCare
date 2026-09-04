const express = require("express");

const router = express.Router();

// Login page
router.get("/login", (req, res) => {
    res.render("auth/login");
});

// Register page
router.get("/register", (req, res) => {
    res.render("auth/register");
});

// Dashboard
router.get("/dashboard", (req, res) => {
    res.render("pages/dashboard");
});

// Patients
router.get("/patients", (req, res) => {
    res.render("patients/index");
});

router.get("/patients/new", (req, res) => {
    res.render("patients/new");
});

router.get("/patients/edit/:id", (req, res) => {
    res.render("patients/edit", {
        id: req.params.id
    });
});

module.exports = router;