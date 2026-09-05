const express = require("express");

const router = express.Router();

// Appointments list
router.get("/appointments", (req, res) => {
    res.render("appointments/index", {
        appointments: []
    });
});

// New appointment page
router.get("/appointments/new", (req, res) => {
    res.render("appointments/new");
});

// Edit appointment page
router.get("/appointments/edit/:id", (req, res) => {
    res.render("appointments/edit", {
        id: req.params.id
    });
});

module.exports = router;