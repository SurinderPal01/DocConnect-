const express = require("express");
const auth = require("../middleware/auth");
const notificationController = require("../controllers/notificationController");
const router = express.Router();

router.get("/", auth ,notificationController.getMyNotifications);
router.put("/:id" , auth , notificationController.markAsRead)
module.exports = router;