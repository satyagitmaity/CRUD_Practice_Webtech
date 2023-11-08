const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { required: true, type: String },
  email: { required: true, type: String, unique: true },
  password: { required: true, type: String },
  age: { required: true, type: Number },
  token :{type :String}
});
const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
