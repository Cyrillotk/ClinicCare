const express = require("express");

const router = express.Router();


// Authentication Pages

router.get("/login", (req, res) => {
    res.render("auth/login");
});

router.get("/register", (req, res) => {
    res.render("auth/register");
});

// Temporary registration handler
router.post("/register", (req, res) => {
    const { username, password } = req.body;

    console.log("Username:", username);

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
        patients
    });
});

router.get("/patients/new", (req, res) => {
    res.render("patients/new");
});

router.get("/patients/edit/:id", (req, res) => {
    console.log("Patient ID:", req.params.id);

    res.render("patients/edit", {
        id: req.params.id
    });
});

module.exports = router;