const express = require("express");
const sessions = require("express-session");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/database");

const app = express();

connectDB();

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
//middleware
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(path.join(__dirname,"public")));

app.get("/",(req, res) => {
    res.render("pages/home");
});

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized:false
    })
);

const PORT=process.env.PORT || 3000;

app.listen(3000,() => {
    console.log("server running on port 3000");
});