const bcrypt = require("bcrypt");
const User = require("../models/User");

exports.showRegister = (req, res) => {
    res.render("auth/register");
};

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.send("Username and password are required.");
        }

        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.send("Username already exists.");
        }

        const passwordHash = await bcrypt.hash(password, 10);

        await User.create({
            username,
            passwordHash
        });

        res.redirect("/login");

    } catch (error) {
        console.error(error);
        res.status(500).send("Registration failed.");
    }
};

exports.showLogin = (req, res) => {
    res.render("auth/login");
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });

        if (!user) {
            return res.send("Invalid username or password.");
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.passwordHash
        );

        if (!passwordMatch) {
            return res.send("Invalid username or password.");
        }

        req.session.userId = user._id;
        req.session.username = user.username;

        res.redirect("/dashboard");

    } catch (error) {
        console.error(error);
        res.status(500).send("Login failed.");
    }
};

exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
};