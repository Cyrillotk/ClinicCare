const express = require("express");

const router = express.Router();

// Login
router.get("/login", (req, res) => {
    res.render("pages/login");
});

// Register
router.get("/register", (req, res) => {
    res.render("pages/register");
});

// Dashboard
router.get("/dashboard", (req, res) => {
    res.render("pages/dashboard");
});

// Appointments list
router.get("/appointments", (req, res) => {
    res.render("pages/index");
});

// New appointment
router.get("/appointments/new", (req, res) => {
    res.render("pages/new");
});

// Edit appointment
router.get("/appointments/edit/:id", (req, res) => {
    res.render("pages/edit");
});

module.exports = router;