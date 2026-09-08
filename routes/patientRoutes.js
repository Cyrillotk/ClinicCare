const express = require("express");
const router = express.Router();

const patientController = require("../controllers/patientController");
const { requireAuth } = require("../middleware/authMiddleware");

router.use(requireAuth);

router.get("/", patientController.listPatients);
router.get("/new", patientController.showCreateForm);
router.post("/", patientController.createPatient);
router.get("/:id/edit", patientController.showEditForm);
router.post("/:id/update", patientController.updatePatient);
router.post("/:id/delete", patientController.deletePatient);

module.exports = router;
