const express = require("express");
const auth = require("../middleware/auth");
const authController = require("../controllers/authController")
const router = express.Router();

router.get("/check",auth,authController.checkUser);
router.post("/login",authController.login);
router.post("/logout",authController.logoutUser);
module.exports = router;