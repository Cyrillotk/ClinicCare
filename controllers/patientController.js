const Patient = require("../models/Patient");

exports.listPatients = async (req, res) => {
    try {
        const search = req.query.search || "";

        const filter = search
            ? {
                  $or: [
                      { name: { $regex: search, $options: "i" } },
                      { patientId: { $regex: search, $options: "i" } },
                      { phone: { $regex: search, $options: "i" } }
                  ]
              }
            : {};

        const patients = await Patient.find(filter).sort({ createdAt: -1 });

        res.render("patients/index", {
            patients,
            search
        });

    } catch (error) {
        console.error(error);
        req.flash("error", "Unable to load patients.");
        res.redirect("/dashboard");
    }
};

exports.showCreateForm = (req, res) => {
    res.render("patients/new");
};

exports.createPatient = async (req, res) => {
    try {
        const { name, patientId, age, gender, phone, address } = req.body;

        if (!name || !patientId || age === undefined || age === "" || !gender || !phone || !address) {
            req.flash("error", "All patient fields are required.");
            return res.redirect("/patients/new");
        }

        if (Number(age) < 0) {
            req.flash("error", "Age cannot be negative.");
            return res.redirect("/patients/new");
        }

        await Patient.create({
            name: name.trim(),
            patientId: patientId.trim(),
            age: Number(age),
            gender,
            phone: phone.trim(),
            address: address.trim()
        });

        req.flash("success", "Patient registered successfully.");
        res.redirect("/patients");

    } catch (error) {
        console.error(error);

        if (error.code === 11000) {
            req.flash("error", "That Patient ID already exists.");
            return res.redirect("/patients/new");
        }

        req.flash("error", "Unable to create patient.");
        res.redirect("/patients/new");
    }
};

exports.showEditForm = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);

        if (!patient) {
            req.flash("error", "Patient not found.");
            return res.redirect("/patients");
        }

        res.render("patients/edit", { patient });

    } catch (error) {
        console.error(error);
        req.flash("error", "Unable to load patient.");
        res.redirect("/patients");
    }
};

exports.updatePatient = async (req, res) => {
    try {
        const { name, patientId, age, gender, phone, address } = req.body;

        if (!name || !patientId || age === undefined || age === "" || !gender || !phone || !address) {
            req.flash("error", "All patient fields are required.");
            return res.redirect(`/patients/${req.params.id}/edit`);
        }

        if (Number(age) < 0) {
            req.flash("error", "Age cannot be negative.");
            return res.redirect(`/patients/${req.params.id}/edit`);
        }

        const patient = await Patient.findByIdAndUpdate(
            req.params.id,
            {
                name: name.trim(),
                patientId: patientId.trim(),
                age: Number(age),
                gender,
                phone: phone.trim(),
                address: address.trim()
            },
            { new: true, runValidators: true }
        );

        if (!patient) {
            req.flash("error", "Patient not found.");
            return res.redirect("/patients");
        }

        req.flash("success", "Patient updated successfully.");
        res.redirect("/patients");

    } catch (error) {
        console.error(error);

        if (error.code === 11000) {
            req.flash("error", "That Patient ID already exists.");
            return res.redirect(`/patients/${req.params.id}/edit`);
        }

        req.flash("error", "Unable to update patient.");
        res.redirect("/patients");
    }
};

exports.deletePatient = async (req, res) => {
    try {
        const patient = await Patient.findByIdAndDelete(req.params.id);

        if (!patient) {
            req.flash("error", "Patient not found.");
            return res.redirect("/patients");
        }

        req.flash("success", "Patient deleted.");
        res.redirect("/patients");

    } catch (error) {
        console.error(error);
        req.flash("error", "Unable to delete patient.");
        res.redirect("/patients");
    }
};
