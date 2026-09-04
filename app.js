require("dotenv").config();

const express = require("express");
const session = require("express-session");
const authRoutes = require("./routes/authRoutes");

const patientRoutes = require("./routes/patientRoutes");

const doctorRoutes = require("./routes/doctorRoutes");

const appointmentRoutes =
    require("./routes/appointmentRoutes");

const path = require("path");
const connectDB = require("./config/database");

const app = express();

connectDB();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Home route
app.get("/", (req, res) => {
    res.render("pages/home");
});

// Express Session
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false
    })
);

// Routes
app.use("/", authRoutes);

app.use("/", patientRoutes);

app.use("/", doctorRoutes);

app.use("/", appointmentRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).render("errors/404");
});

// 500 error handler
app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).render("errors/500");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});