const express = require("express");
const {
  userRegisterController,
  userLoginController,
  updateUserController,
  deleteUserController,
  logoutUserController,
  loginDetailsController,
  getcookies,
} = require("../Controllers/userController");
const router = express.Router();

// router.route('/create').post(userController)
router.post("/create", userRegisterController);
router.post("/login", userLoginController);
router.put("/update/:id", updateUserController);
router.delete("/delete/:id", deleteUserController);
router.post("/logout", logoutUserController);
router.get("/loginDetails", loginDetailsController);
router.get("/getCookies", getcookies);
module.exports = router;
