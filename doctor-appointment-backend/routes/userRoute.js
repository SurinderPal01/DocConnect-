const express = require("express");
const auth = require("../middleware/auth");
const {
    signupUser,
    // loginDoctor,
    UpdateUserProfile

} = require("../controllers/userController");
const router = express.Router();

router.post("/signup" , signupUser);
router.put("/update",auth,UpdateUserProfile);
// router.post("/login",loginDoctor);
module.exports = router;
