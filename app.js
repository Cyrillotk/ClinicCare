require("dotenv").config();

const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

const connectDB = require("./config/database");
const { attachUser } = require("./middleware/authMiddleware");

const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");

const app = express();

connectDB();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            maxAge: 1000 * 60 * 60
        }
    })
);

app.use(flash());
app.use((req, res, next) => {
    res.locals.messages = {
        success: req.flash("success"),
        error: req.flash("error")
    };
    next();
});

app.use(attachUser);

app.get("/", (req, res) => {
    res.render("pages/home");
});

app.use("/", authRoutes);
app.use("/patients", patientRoutes);
app.use("/doctors", doctorRoutes);
app.use("/appointments", appointmentRoutes);

app.use((req, res) => {
    res.status(404).render("errors/404");
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).render("errors/500");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});