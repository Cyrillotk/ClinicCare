const Patient = require("./models/Patient");

exports.listPatients = async (req, res) => {
    try {
        const patients = await Patient.find().sort({ createdAt: -1 });

        res.render("patients/index", {
            patients
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to load patients.");
    }
};

exports.showCreateForm = (req, res) => {
    res.render("patients/new");
};

//Creating a patient

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

        if (!name || !patientId || !age || !gender || !phone || !address) {
            return res.send("All patient fields are required.");
        }

        await Patient.create({
            name,
            patientId,
            age,
            gender,
            phone,
            address
        });

        res.redirect("/patients");

    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to create patient.");
    }
};
//Edit patient

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
        res.status(500).send("Failed to load patient.");
    }
};

//Updating a patient

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

        if (!name || !patientId || !age || !gender || !phone || !address) {
            return res.send("All patient fields are required.");
        }

        const patient = await Patient.findByIdAndUpdate(
            req.params.id,
            {
                name,
                patientId,
                age,
                gender,
                phone,
                address
            },
            { new: true, runValidators: true }
        );

        if (!patient) {
            return res.status(404).send("Patient not found.");
        }

        res.redirect("/patients");

    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to update patient.");
    }
};

//Deleting a patient

exports.deletePatient = async (req, res) => {
    try {
        const patient = await Patient.findByIdAndDelete(req.params.id);

        if (!patient) {
            return res.status(404).send("Patient not found.");
        }

        res.redirect("/patients");

    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to delete patient.");
    }
};