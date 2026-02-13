const express = require("express");
const auth = require("../middleware/auth");
const isDoctor = require("../middleware/isDoctor");
const {
    signupDoctor,
    searchDoctors,
    getProfile,
    getAvailability,
    updateAvailability,
    getDoctor,
    getTodayAppointments,
    getDoctorStats,
    getAllPublicDoctors,
    getPublicDoctor,
    getFeaturedDoctors,
    getSpecializations,
    updateDoctorProfile,
    uploadProfilePhoto,
} = require("../controllers/doctorController");
const upload = require("../middleware/upload");
const router = express.Router();

router.get("/public/all", getAllPublicDoctors);
router.get("/public/featured", getFeaturedDoctors);
router.get("/public/specializations", getSpecializations);
router.get("/public/:id", getPublicDoctor);

router.get("/",auth , searchDoctors);
router.post("/signup" , signupDoctor);
router.get("/profile",auth,getProfile);
router.post("/profile-photo", auth, (req, res, next) => {
    upload.single("file")(req, res, (err) => {
        if (err) {
            console.error("Upload Middleware Error:", err);
            return res.status(500).json({ msg: "Upload failed", error: err.message });
        }
        next();
    });
}, uploadProfilePhoto);
router.get("/today-appointments",auth,getTodayAppointments);
router.get("/stats", auth, getDoctorStats);
router.get("/availability", auth, isDoctor, getAvailability);
router.put("/availability", auth, isDoctor, updateAvailability);
router.put("/profile",auth,isDoctor,updateDoctorProfile);
router.get("/:id",auth,getDoctor)
module.exports = router;
