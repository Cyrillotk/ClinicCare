const express = require("express");
const router = express.Router();

const doctorController = require("../controllers/doctorController");
const { requireAuth } = require("../middleware/authMiddleware");

router.use(requireAuth);

router.get("/", doctorController.listDoctors);
router.get("/new", doctorController.showCreateForm);
router.post("/", doctorController.createDoctor);
router.get("/:id/edit", doctorController.showEditForm);
router.post("/:id/update", doctorController.updateDoctor);
router.post("/:id/delete", doctorController.deleteDoctor);

module.exports = router;