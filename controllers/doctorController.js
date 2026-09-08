const Doctor = require("../models/Doctor");

exports.listDoctors = async (req, res) => {
    try {
        const search = req.query.search || "";

        const filter = search
            ? {
                  $or: [
                      { name: { $regex: search, $options: "i" } },
                      { specialization: { $regex: search, $options: "i" } }
                  ]
              }
            : {};

        const doctors = await Doctor.find(filter).sort({ createdAt: -1 });

        res.render("doctors/index", {
            doctors,
            search
        });

    } catch (error) {
        console.error(error);
        req.flash("error", "Unable to load doctors.");
        res.redirect("/dashboard");
    }
};

exports.showCreateForm = (req, res) => {
    res.render("doctors/new");
};

exports.createDoctor = async (req, res) => {
    try {
        const { name, specialization, phone, availableDays } = req.body;

        if (!name || !specialization || !phone) {
            req.flash("error", "Name, specialization and phone are required.");
            return res.redirect("/doctors/new");
        }

        await Doctor.create({
            name: name.trim(),
            specialization: specialization.trim(),
            phone: phone.trim(),
            availableDays: parseDays(availableDays)
        });

        req.flash("success", "Doctor added successfully.");
        res.redirect("/doctors");

    } catch (error) {
        console.error(error);
        req.flash("error", "Unable to create doctor.");
        res.redirect("/doctors/new");
    }
};

exports.showEditForm = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);

        if (!doctor) {
            req.flash("error", "Doctor not found.");
            return res.redirect("/doctors");
        }

        res.render("doctors/edit", { doctor });

    } catch (error) {
        console.error(error);
        req.flash("error", "Unable to load doctor.");
        res.redirect("/doctors");
    }
};

exports.updateDoctor = async (req, res) => {
    try {
        const { name, specialization, phone, availableDays } = req.body;

        if (!name || !specialization || !phone) {
            req.flash("error", "Name, specialization and phone are required.");
            return res.redirect(`/doctors/${req.params.id}/edit`);
        }

        const doctor = await Doctor.findByIdAndUpdate(
            req.params.id,
            {
                name: name.trim(),
                specialization: specialization.trim(),
                phone: phone.trim(),
                availableDays: parseDays(availableDays)
            },
            { new: true, runValidators: true }
        );

        if (!doctor) {
            req.flash("error", "Doctor not found.");
            return res.redirect("/doctors");
        }

        req.flash("success", "Doctor updated successfully.");
        res.redirect("/doctors");

    } catch (error) {
        console.error(error);
        req.flash("error", "Unable to update doctor.");
        res.redirect("/doctors");
    }
};

exports.deleteDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndDelete(req.params.id);

        if (!doctor) {
            req.flash("error", "Doctor not found.");
            return res.redirect("/doctors");
        }

        req.flash("success", "Doctor deleted.");
        res.redirect("/doctors");

    } catch (error) {
        console.error(error);
        req.flash("error", "Unable to delete doctor.");
        res.redirect("/doctors");
    }
};

// availableDays comes in from a comma-separated text input (e.g. "Mon, Wed, Fri")
function parseDays(raw) {
    if (!raw) return [];
    return raw
        .split(",")
        .map((day) => day.trim())
        .filter(Boolean);
}
