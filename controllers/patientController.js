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

        const patients = await Patient.find(filter).sort({
            createdAt: -1
        });

        res.render("patients/index", {
            patients,
            search
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Unable to load patients.");
    }
};

exports.showCreateForm = (req, res) => {
    res.render("patients/new");
};

exports.createPatient = async (req, res) => {
    try {
        const {
            name,
            patientId,
            age,
            gender,
            phone,
            address
        } = req.body;

        if (
            !name ||
            !patientId ||
            age === undefined ||
            !gender ||
            !phone ||
            !address
        ) {
            return res.status(400).send("All patient fields are required.");
        }

        if (Number(age) < 0) {
            return res.status(400).send("Age cannot be negative.");
        }

        await Patient.create({
            name: name.trim(),
            patientId: patientId.trim(),
            age: Number(age),
            gender,
            phone: phone.trim(),
            address: address.trim()
        });

        res.redirect("/patients");

    } catch (error) {
        console.error(error);

        if (error.code === 11000) {
            return res.status(409).send("Patient ID already exists.");
        }

        res.status(500).send("Unable to create patient.");
    }
};

exports.showEditForm = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);

        if (!patient) {
            return res.status(404).send("Patient not found.");
        }

        res.render("patients/edit", {
            patient
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Unable to load patient.");
    }
};

exports.updatePatient = async (req, res) => {
    try {
        const {
            name,
            patientId,
            age,
            gender,
            phone,
            address
        } = req.body;

        if (
            !name ||
            !patientId ||
            age === undefined ||
            !gender ||
            !phone ||
            !address
        ) {
            return res.status(400).send("All patient fields are required.");
        }

        if (Number(age) < 0) {
            return res.status(400).send("Age cannot be negative.");
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
            {
                new: true,
                runValidators: true
            }
        );

        if (!patient) {
            return res.status(404).send("Patient not found.");
        }

        res.redirect("/patients");

    } catch (error) {
        console.error(error);

        if (error.code === 11000) {
            return res.status(409).send("Patient ID already exists.");
        }

        res.status(500).send("Unable to update patient.");
    }
};

exports.deletePatient = async (req, res) => {
    try {
        const patient = await Patient.findByIdAndDelete(req.params.id);

        if (!patient) {
            return res.status(404).send("Patient not found.");
        }

        res.redirect("/patients");

    } catch (error) {
        console.error(error);
        res.status(500).send("Unable to delete patient.");
    }
};