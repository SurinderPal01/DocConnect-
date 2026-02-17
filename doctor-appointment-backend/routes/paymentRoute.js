const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

router.post("/create-order",paymentController.createOrder);
router.post("/verify",paymentController.verifyPayment);
router.post("/mark-failed", paymentController.markFailed);
// Webhook route
router.post(
  "/razorpay/webhook",
  express.raw({ type: "application/json" }),
  paymentController.razorpayWebhook
);

module.exports = router;