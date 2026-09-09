const bcrypt = require("bcrypt");
const User = require("../models/User");

exports.showLogin = (req, res) => {
    res.render("auth/login");
};

exports.showRegister = (req, res) => {
    res.render("auth/register");
};

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            req.flash("error", "Username and password are required.");
            return res.redirect("/register");
        }

        const existing = await User.findOne({ username: username.trim() });

        if (existing) {
            req.flash("error", "That username is already taken.");
            return res.redirect("/register");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            username: username.trim(),
            passwordHash: hashedPassword
        });

        req.flash("success", "Account created. Please log in.");
        res.redirect("/login");

    } catch (error) {
        console.error("Registration error:", error);
        req.flash("error", "Registration failed. Please try again.");
        res.redirect("/register");
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            req.flash("error", "Username and password are required.");
            return res.redirect("/login");
        }

        const user = await User.findOne({ username: username.trim() });

        if (!user) {
            req.flash("error", "Invalid username or password.");
            return res.redirect("/login");
        }

        const passwordMatch = await bcrypt.compare(password, user.passwordHash);

        if (!passwordMatch) {
            req.flash("error", "Invalid username or password.");
            return res.redirect("/login");
        }

        req.session.userId = user._id.toString();
        req.session.username = user.username;

        res.redirect("/dashboard");

    } catch (error) {
        console.error("Login error:", error);
        req.flash("error", "Login failed. Please try again.");
        res.redirect("/login");
    }
};

exports.logout = (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            console.error("Logout error:", error);
            return res.redirect("/dashboard");
        }

        res.redirect("/login");
    });
};