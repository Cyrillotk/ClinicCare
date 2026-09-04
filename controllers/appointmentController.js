const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");
const Doctor = require("./models/Doctor");

exports.listAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .populate("patient")
            .populate("doctor")
            .sort({
                date: 1,
                time: 1
            });

        res.render("appointments/index", {
            appointments
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Unable to load appointments.");
    }
};

exports.showCreateForm = async (req, res) => {
    try {
        const patients = await Patient.find().sort({ name: 1 });
        const doctors = await Doctor.find().sort({ name: 1 });

        res.render("appointments/new", {
            patients,
            doctors
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Unable to load appointment form.");
    }
};

exports.createAppointment = async (req, res) => {
    try {
        const {
            patient,
            doctor,
            date,
            time,
            reason
        } = req.body;

        if (!patient || !doctor || !date || !time || !reason) {
            return res.status(400).send(
                "All appointment fields are required."
            );
        }

        // Business rule:
        // A doctor cannot have two scheduled appointments
        // at the same date and time.

        const existingAppointment = await Appointment.findOne({
            doctor,
            date: new Date(date),
            time,
            status: "Scheduled"
        });

        if (existingAppointment) {
            return res.status(409).send(
                "This doctor already has an appointment at that date and time."
            );
        }

        await Appointment.create({
            patient,
            doctor,
            date: new Date(date),
            time,
            reason: reason.trim()
        });

        res.redirect("/appointments");

    } catch (error) {
        console.error(error);
        res.status(500).send("Unable to create appointment.");
    }
};

exports.showEditForm = async (req, res) => {
    try {
        const appointment = await Appointment.findById(
            req.params.id
        );

        if (!appointment) {
            return res.status(404).send("Appointment not found.");
        }

        const patients = await Patient.find().sort({ name: 1 });
        const doctors = await Doctor.find().sort({ name: 1 });

        res.render("appointments/edit", {
            appointment,
            patients,
            doctors
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Unable to load appointment.");
    }
};

exports.updateAppointment = async (req, res) => {
    try {
        const {
            patient,
            doctor,
            date,
            time,
            reason,
            status
        } = req.body;

        if (
            !patient ||
            !doctor ||
            !date ||
            !time ||
            !reason ||
            !status
        ) {
            return res.status(400).send(
                "All appointment fields are required."
            );
        }

        const existingAppointment = await Appointment.findOne({
            _id: { $ne: req.params.id },
            doctor,
            date: new Date(date),
            time,
            status: "Scheduled"
        });

        if (existingAppointment) {
            return res.status(409).send(
                "This doctor already has an appointment at that date and time."
            );
        }

        const appointment =
            await Appointment.findByIdAndUpdate(
                req.params.id,
                {
                    patient,
                    doctor,
                    date: new Date(date),
                    time,
                    reason: reason.trim(),
                    status
                },
                {
                    new: true,
                    runValidators: true
                }
            );

        if (!appointment) {
            return res.status(404).send(
                "Appointment not found."
            );
        }

        res.redirect("/appointments");

    } catch (error) {
        console.error(error);
        res.status(500).send("Unable to update appointment.");
    }
};

exports.deleteAppointment = async (req, res) => {
    try {
        const appointment =
            await Appointment.findByIdAndDelete(
                req.params.id
            );

        if (!appointment) {
            return res.status(404).send(
                "Appointment not found."
            );
        }

        res.redirect("/appointments");

    } catch (error) {
        console.error(error);
        res.status(500).send(
            "Unable to delete appointment."
        );
    }
};