const express = require("express");
const auth = require("../middleware/auth");
const {
    signupUser,
    UpdateUserProfile,
    uploadProfilePhoto,
} = require("../controllers/userController");
const upload = require("../middleware/upload");
const router = express.Router();

router.post("/signup" , signupUser);
router.put("/update",auth,UpdateUserProfile);
router.post("/profile-photo", auth, (req, res, next) => {
    upload.single("file")(req, res, (err) => {
        if (err) {
            console.error("Upload Middleware Error:", err);
            return res.status(500).json({ msg: "Upload failed", error: err.message });
        }
        next();
    });
}, uploadProfilePhoto);

module.exports = router;
