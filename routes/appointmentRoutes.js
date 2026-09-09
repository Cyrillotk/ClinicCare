const express = require("express");
const router = express.Router();

const appointmentController = require("../controllers/appointmentController");
const { requireAuth } = require("../middleware/authMiddleware");

router.use(requireAuth);

router.get("/", appointmentController.listAppointments);
router.get("/new", appointmentController.showCreateForm);
router.post("/", appointmentController.createAppointment);
router.get("/:id/edit", appointmentController.showEditForm);
router.post("/:id/update", appointmentController.updateAppointment);
router.post("/:id/delete", appointmentController.deleteAppointment);

module.exports = router;