const userModel = require("../Models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const env = require("dotenv").config();
const { app } = require("../server");
// const { genToken } = require("../Config/generateToken");

// class userController{
//     static async registerUser(req,res){
//         const existingUser =
//     }
// }


exports.userRegisterController = async (req, res) => {
  try {
    const { name, email, password, age } = req.body;
    if (!name || !email) {
      res.send("Name & email is required");
    }
    const isExistingUser = await userModel.findOne({ email });
    if (isExistingUser) {
      res.status(200).json({ msg: "User already exists" });
    }
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);
    if (!isExistingUser) {
      const user = await userModel.create({
        name,
        email,
        password: hashPassword,
        age,
      });
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "5h",
      });
      user.token = token;
      user.password = undefined;
      res.status(200).json({ user, token });
    }

    // if (user) {
    //   res.status(200).json({
    //     _id: user._id,
    //     name: user.name,
    //     email: user.email,
    //     password: user.password,
    //     age: user.age,
    //     token: genToken(user._id),
    //   });
    // }
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.userLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const isUser = await userModel.findOne({ email });
    if (!isUser) {
      return res.status(404).json({ msg: "User not found" });
    }
    const isMatch = bcrypt.compareSync(password, isUser.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Password mismatch", token: null });
    }
    if (req.cookies.token) {
      return res.status(401).json({ msg: "Someone already looged in..." })
    }

    if (isUser && isMatch) {
      const loginToken = jwt.sign({ id: isUser._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "15d",
      });
      isUser.token = loginToken;
      await isUser.save();
      // isUser.password = undefined;
      //   Cookie Section :
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      res.status(200).cookie("token", loginToken, options).json({
        msg: "User logged in successfully...",
        loginToken,
        isUser,
        auth: true,
      });
    }
  } catch (error) {
    // res
    //   .status(200)
    //   .json({
    //     msg: "User logged in successfully...",
    //     token: genToken(isUser._id),
    //   });
    res.status(500).json({ msg: "Error: " + error });
  }
};

exports.updateUserController = async (req, res) => {
  try {
    const userid = req.params.id;
    const userInfo = req.body;
    console.log("req.body", req.body);
    const updatedData = await userModel.findOne({ _id: userid });
    updatedData.name = userInfo.name;
    updatedData.email = userInfo.email;
    updatedData.password = userInfo.password;
    updatedData.age = userInfo.age;
    const data = await updatedData.save();
    console.log("data", data);
    res
      .status(200)
      .json({ info: data, msg: "User Profile updated successfully..." });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

exports.deleteUserController = async (req, res) => {
  try {
    const uid = req.params.id;
    const deldata = await userModel.deleteOne({ _id: uid });
    res
      .status(200)
      .json({ data: deldata, msg: "user deleted successfully..." });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

exports.logoutUserController = async (req, res) => {
  try {
    // req.logout();
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    user.token = null;
    await user.save()
    res
      .status(200)
      .cookie("token", null, { expires: new Date(Date.now()) })
      .json({ success: true, msg: "User logged out successfully", user });
    await user.save();

    // res.redirect("/");
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

exports.loginDetailsController = async (req, res) => {
  try {
    // const user = await userModel.find({ email });

    const userdata = await userModel.find();
    // for (let i = 0; i < userdata.length; i++) {
    //   if (userdata[i].token !== null) {
    //     // return userdata[i]
    //     console.log(userdata[i])
    //   }
    // }
    let newdata = userdata.filter((el) => {
      return (el.token!== (null) && el.token !== undefined)
    })
    console.log(newdata);
    res.send(newdata);
      
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
exports.getcookies = async (req, res) => { 
  try {
    res.send(req.cookies.token)
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
}
