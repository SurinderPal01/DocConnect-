const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const isDoctor = require("../middleware/isDoctor");
const {
    createAppointment,
    getUserAppointment,
    getDoctorAppointment,
    getUserAppointmentById,
    acceptAppointment,
    rejectAppointment,
    cancelAppointment
} 

= require("../controllers/appointmentController");

router.post("/", auth, createAppointment);
router.get("/user", auth, getUserAppointment);
router.get("/doctor", auth, isDoctor, getDoctorAppointment);
router.get("/:id",auth,getUserAppointmentById)

router.put("/:id/accept", auth, isDoctor, acceptAppointment);
router.put("/:id/reject", auth, isDoctor, rejectAppointment);
router.put("/:id/cancel", auth, cancelAppointment);

module.exports = router;
