const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");

exports.listAppointments = async (req, res) => {
    try {
        const { search, status } = req.query;

        const filter = {};

        if (status) {
            filter.status = status;
        }

        let appointments = await Appointment.find(filter)
            .populate("patient")
            .populate("doctor")
            .sort({ date: 1, time: 1 });

        // Search by patient name or doctor name (done after populate,
        // since those fields live on referenced documents).
        if (search) {
            const term = search.toLowerCase();
            appointments = appointments.filter((appt) => {
                const patientName = appt.patient?.name?.toLowerCase() || "";
                const doctorName = appt.doctor?.name?.toLowerCase() || "";
                return patientName.includes(term) || doctorName.includes(term);
            });
        }

        res.render("appointments/index", {
            appointments,
            search: search || "",
            status: status || ""
        });

    } catch (error) {
        console.error(error);
        req.flash("error", "Unable to load appointments.");
        res.redirect("/dashboard");
    }
};

exports.showCreateForm = async (req, res) => {
    try {
        const patients = await Patient.find().sort({ name: 1 });
        const doctors = await Doctor.find().sort({ name: 1 });

        res.render("appointments/new", { patients, doctors });

    } catch (error) {
        console.error(error);
        req.flash("error", "Unable to load appointment form.");
        res.redirect("/appointments");
    }
};

exports.createAppointment = async (req, res) => {
    try {
        const { patient, doctor, date, time, reason } = req.body;

        if (!patient || !doctor || !date || !time || !reason) {
            req.flash("error", "All appointment fields are required.");
            return res.redirect("/appointments/new");
        }

        // Business rule: a doctor cannot have two active appointments
        // at the same date and time.
        const existingAppointment = await Appointment.findOne({
            doctor,
            date: new Date(date),
            time,
            status: "Scheduled"
        });

        if (existingAppointment) {
            req.flash("error", "Time slot unavailable: this doctor already has an appointment then.");
            return res.redirect("/appointments/new");
        }

        await Appointment.create({
            patient,
            doctor,
            date: new Date(date),
            time,
            reason: reason.trim()
        });

        req.flash("success", "Appointment created successfully.");
        res.redirect("/appointments");

    } catch (error) {
        console.error(error);
        req.flash("error", "Unable to create appointment.");
        res.redirect("/appointments/new");
    }
};

exports.showEditForm = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            req.flash("error", "Appointment not found.");
            return res.redirect("/appointments");
        }

        const patients = await Patient.find().sort({ name: 1 });
        const doctors = await Doctor.find().sort({ name: 1 });

        res.render("appointments/edit", { appointment, patients, doctors });

    } catch (error) {
        console.error(error);
        req.flash("error", "Unable to load appointment.");
        res.redirect("/appointments");
    }
};

exports.updateAppointment = async (req, res) => {
    try {
        const { patient, doctor, date, time, reason, status } = req.body;

        if (!patient || !doctor || !date || !time || !reason || !status) {
            req.flash("error", "All appointment fields are required.");
            return res.redirect(`/appointments/${req.params.id}/edit`);
        }

        const existingAppointment = await Appointment.findOne({
            _id: { $ne: req.params.id },
            doctor,
            date: new Date(date),
            time,
            status: "Scheduled"
        });

        if (existingAppointment) {
            req.flash("error", "Time slot unavailable: this doctor already has an appointment then.");
            return res.redirect(`/appointments/${req.params.id}/edit`);
        }

        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            {
                patient,
                doctor,
                date: new Date(date),
                time,
                reason: reason.trim(),
                status
            },
            { new: true, runValidators: true }
        );

        if (!appointment) {
            req.flash("error", "Appointment not found.");
            return res.redirect("/appointments");
        }

        req.flash("success", "Appointment updated successfully.");
        res.redirect("/appointments");

    } catch (error) {
        console.error(error);
        req.flash("error", "Unable to update appointment.");
        res.redirect("/appointments");
    }
};

exports.deleteAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndDelete(req.params.id);

        if (!appointment) {
            req.flash("error", "Appointment not found.");
            return res.redirect("/appointments");
        }

        req.flash("success", "Appointment deleted.");
        res.redirect("/appointments");

    } catch (error) {
        console.error(error);
        req.flash("error", "Unable to delete appointment.");
        res.redirect("/appointments");
    }
};
