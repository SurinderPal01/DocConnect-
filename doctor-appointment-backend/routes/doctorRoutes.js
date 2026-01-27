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
} = require("../controllers/doctorController");
const router = express.Router();

router.get("/public/all", getAllPublicDoctors);
router.get("/public/featured", getFeaturedDoctors);
router.get("/public/specializations", getSpecializations);
router.get("/public/:id", getPublicDoctor);

router.get("/",auth , searchDoctors);
router.post("/signup" , signupDoctor);
router.get("/profile",auth,getProfile);
router.get("/today-appointments",auth,getTodayAppointments);
router.get("/stats", auth, getDoctorStats);
router.get("/availability", auth, isDoctor, getAvailability);
router.put("/availability", auth, isDoctor, updateAvailability);
router.get("/:id",auth,getDoctor)
module.exports = router;
