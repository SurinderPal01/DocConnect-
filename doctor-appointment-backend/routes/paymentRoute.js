const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

router.post("/create-order",paymentController.createOrder);
router.post("/verify",paymentController.verifyPayment);
router.post("/mark-failed", paymentController.markFailed);


module.exports = router;