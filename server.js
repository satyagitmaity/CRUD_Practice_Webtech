const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");
const database = require("./Config/dbConnect");
const userModel = require("./Models/userModel");
const userRoute = require("./Router/router");
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 5000;
database();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api", userRoute);

app.get("/", (req, res) => {
  res.send(`<h3>Welcome to CRUD operation...</h3>`);
});

app.listen(port, () => {
  console.log(`Application listening on port http://localhost:${port}`);
});
