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

exports.verifyPayment = async (req,res)=>{
    try{
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            appointmentId,
        } = req.body;
        
        const body = razorpay_order_id +"|" +razorpay_payment_id;

        const expectedSignature = crypto
        .createHmac("sha256",process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest("hex");

        if(expectedSignature !== razorpay_signature){
            return res.status(400).json({message:"Invalid Payment Signature"})
        }

        await Appointment.findByIdAndUpdate(appointmentId,{
            paymentStatus:"PAID"
        })
        res.json({success:true});
    }catch(err){
        return res.status(500).json({message:"Server Error"})
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