const express = require("express");

const router = express.Router();

// Login page
router.get("/login", (req, res) => {
    console.log("LOGIN ROUTE HIT");
    res.render("auth/login");
});

// Register page
router.get("/register", (req, res) => {
    res.render("auth/register");
});

// Register form submission
router.post("/register", (req, res) => {
    const { username, password } = req.body;

    console.log("Username:", username);
    console.log("Password:", password);

    res.send(`Registration received for ${username}`);
});
// Dashboard
router.get("/dashboard", (req, res) => {
    res.render("pages/dashboard", {
        username: "ClinicCare User"
    });
});
// Patients
router.get("/patients", (req, res) => {
    const patients = [];

    res.render("patients/index", {
        patients: patients
    });
});

router.get("/patients/new", (req, res) => {
    res.render("patients/new");
});

router.get("/patients/edit/:id", (req, res) => {
    console.log("EDIT ROUTE HIT");
    console.log("Patient ID:", req.params.id);

    res.render("patients/edit", {
        id: req.params.id
    });
});

module.exports = router;