const Doctor = require("../models/Doctor");

exports.listDoctors = async (req, res) => {
    try {
        const search = req.query.search || "";

        const filter = search
            ? {
                  $or: [
                      { name: { $regex: search, $options: "i" } },
                      {
                          specialization: {
                              $regex: search,
                              $options: "i"
                          }
                      }
                  ]
              }
            : {};

        const doctors = await Doctor.find(filter).sort({
            createdAt: -1
        });

        res.render("doctors/index", {
            doctors,
            search
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Unable to load doctors.");
    }
};

exports.showCreateForm = (req, res) => {
    res.render("doctors/new");
};

exports.createDoctor = async (req, res) => {
    try {
        const {
            name,
            specialization,
            phone
        } = req.body;

        if (!name || !specialization || !phone) {
            return res.status(400).send("All doctor fields are required.");
        }

        await Doctor.create({
            name: name.trim(),
            specialization: specialization.trim(),
            phone: phone.trim()
        });

        res.redirect("/doctors");

    } catch (error) {
        console.error(error);
        res.status(500).send("Unable to create doctor.");
    }
};

exports.showEditForm = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);

        if (!doctor) {
            return res.status(404).send("Doctor not found.");
        }

        res.render("doctors/edit", {
            doctor
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Unable to load doctor.");
    }
};

exports.updateDoctor = async (req, res) => {
    try {
        const {
            name,
            specialization,
            phone
        } = req.body;

        if (!name || !specialization || !phone) {
            return res.status(400).send("All doctor fields are required.");
        }

        const doctor = await Doctor.findByIdAndUpdate(
            req.params.id,
            {
                name: name.trim(),
                specialization: specialization.trim(),
                phone: phone.trim()
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!doctor) {
            return res.status(404).send("Doctor not found.");
        }

        res.redirect("/doctors");

    } catch (error) {
        console.error(error);
        res.status(500).send("Unable to update doctor.");
    }
};

exports.deleteDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndDelete(req.params.id);

        if (!doctor) {
            return res.status(404).send("Doctor not found.");
        }

        res.redirect("/doctors");

    } catch (error) {
        console.error(error);
        res.status(500).send("Unable to delete doctor.");
    }
};