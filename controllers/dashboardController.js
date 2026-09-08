const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");

exports.showDashboard = async (req, res) => {
    try {
        const [patientCount, doctorCount, appointmentCount] = await Promise.all([
            Patient.countDocuments(),
            Doctor.countDocuments(),
            Appointment.countDocuments()
        ]);

        res.render("pages/dashboard", {
            username: req.session.username,
            patientCount,
            doctorCount,
            appointmentCount
        });

    } catch (error) {
        console.error(error);
        res.status(500).render("errors/500");
    }
};
