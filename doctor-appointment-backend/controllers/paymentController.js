const crypto = require("crypto");
const razorpay = require("../config/razorpay");
const Appointment = require("../models/Appointment");

exports.createOrder = async (req,res)=>{
    try{
        const {appointmentId} = req.body;
        const appointment = await Appointment.findById(appointmentId);
        if(!appointment){
            return res.status(400).json({message:"Appointment Not Found"});
        }
        if(appointment.paymentStatus !== "PENDING"){
            return res.status(400).json({message:"Payment Not Allowed"});
        }
        if (appointment.paymentStatus === "PAID") {
            return res.status(400).json({ message: "Already Paid" });
        }
        const options = {
            amount : appointment.fee *100,
            currency:"INR",
            receipt: appointmentId,
            notes: {
                appointmentId,
            },
        }
        const order = await razorpay.orders.create(options);
        res.json(order);
    }catch(err){
        return res.status(500).json({message:"Server Error"})
    }
};

exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      appointmentId,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");
      // console.log("signature is",expectedSignature);

    if (expectedSignature !== razorpay_signature) {
      return res
        .status(400)
        .json({ message: "Invalid Payment Signature" });
    }

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    // Idempotency check
    if (appointment.paymentStatus === "PAID") {
      return res.json({ success: true });
    }

    appointment.paymentStatus = "PAID";
    appointment.razorpayOrderId = razorpay_order_id;
    appointment.razorpayPaymentId = razorpay_payment_id;

    appointment.statusHistory.push({
      status: "paid",
    });

    await appointment.save();

    res.json({ success: true });

  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
  }
};


exports.markFailed = async (req,res)=>{
     try {
    const { appointmentId } = req.body;
    await Appointment.findByIdAndUpdate(appointmentId, {
      paymentStatus: "FAILED",
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
}

exports.razorpayWebhook = async (req, res) => {
  try {
    const signature = req.headers["x-razorpay-signature"];
    // console.log("signature:",signature);
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(req.body)
      .digest("hex");

    if (signature !== expectedSignature) {
      return res.status(400).send("Invalid Signature");
    }

    const event = JSON.parse(req.body.toString());

    // -----------------------
    // REFUND SUCCESS
    // -----------------------
    // console.log("event",event);
    // console.log(event.event);
    if (event.event === "refund.processed") {
      const refund = event.payload.refund.entity;

      const appointment = await Appointment.findOne({
        razorpayPaymentId: refund.payment_id,
      });

      if (appointment && appointment.refundStatus !== "COMPLETED") {
        appointment.refundStatus = "COMPLETED";
        await appointment.save();
      }
    }

    // -----------------------
    // REFUND FAILED
    // -----------------------
    if (event.event === "refund.failed") {
      const refund = event.payload.refund.entity;

      await Appointment.findOneAndUpdate(
        { razorpayPaymentId: refund.payment_id },
        { refundStatus: "FAILED" }
      );
    }

    return res.status(200).json({ received: true });

  } catch (err) {
    return res.status(500).json({ message: "Webhook Error" });
  }
};
