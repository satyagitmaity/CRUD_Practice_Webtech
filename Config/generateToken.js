const userModel = require("../Models/userModel")
const jwt = require("jsonwebtoken");
const genToken = async(id) => {
    const token = await jwt.sign({ id: "5555555" }, process.env.JWT_SECRET_KEY, { expiresIn: "15 days" });
    console.log(token);
    const userVerification = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log(userVerification)
};
// genToken();


