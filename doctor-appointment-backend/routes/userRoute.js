const express = require("express");
const auth = require("../middleware/auth");
const {
    signupUser,
    // loginDoctor,

} = require("../controllers/userController");
const router = express.Router();

router.post("/signup" , signupUser);
// router.post("/login",loginDoctor);
module.exports = router;
