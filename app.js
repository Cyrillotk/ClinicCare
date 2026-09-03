const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
//middleware
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(path.join(__dirname,"public")));

app.get("/",(req, res) => {
    res.render("pages/home");
});

const PORT=process.env.PORT || 3000;

app.listen(3000,() => {
    console.log("server running on port 3000");
});