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

        console.log("Username:", username);

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            passwordHash: hashedPassword
        });

        await user.save();

        console.log("USER SAVED:", user);

        res.redirect("/login");

    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).send("Registration failed");
    }
};
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).send("Username and password are required.");
        }

        const user = await User.findOne({
            username: username.trim()
        });

        if (!user) {
            return res.status(401).send("Invalid username or password.");
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.passwordHash
        );

        if (!passwordMatch) {
            return res.status(401).send("Invalid username or password.");
        }

        req.session.userId = user._id.toString();
        req.session.username = user.username;

        res.redirect("/dashboard");

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).send("Login failed.");
    }
};

exports.logout = (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            console.error("Logout error:", error);
            return res.status(500).send("Logout failed.");
        }

        res.redirect("/login");
    });
};