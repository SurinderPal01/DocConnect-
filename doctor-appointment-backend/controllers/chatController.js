const Appointment = require("../models/Appointment");
const Chat = require("../models/Chat");
const { listeners } = require("../models/User");

exports.getChatAccess = async (req,res)=>{
    try{
const id = req.params.id;
// const role = req.user.role;
if(!id){
    return res.sattus(400).json({msg:"Id missing"})
}
const appointment = await Appointment.findById(id)

if (!appointment) {
  return res.status(404).json({ msg: "Appointment not found" });
}
//  HARD BLOCK — completed / cancelled / rejected
if (["completed", "cancelled", "rejected"].includes(appointment.status)) {
  return res.json({
    enabledStatus: "hidden",
    expiredStatus: true,
    msg: "Chat closed"
  });
}
//date checking 
const normalize = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.getTime();
};

const today = new Date();

const sameDay =
  normalize(appointment.date) === normalize(today);

if (!sameDay) {
    return res.json({enabledStatus:"hidden",msg:"Day doenst match"});
  // hide chat button
}

// const timeToMinutes = (t)=>{
//     const [h,m] = t.split(":").map(Number);
//     return h*60+m;
// }   

// const now = new Date(); 
// const hours = now.getHours().toString().padStart(2,"0");
// const minutes = now.getMinutes().toString().padStart(2,"0");
// const currentTime = `${hours}:${minutes}`;

// let enabledStatus ="";
// if (timeToMinutes(currentTime) < timeToMinutes(appointment.start) - 15) {
//   enabledStatus = "hidden";
// } 
// else if (
//   timeToMinutes(currentTime) >= timeToMinutes(appointment.start) - 15 &&
//   timeToMinutes(currentTime) > timeToMinutes(appointment.end)
// ) {
//   enabledStatus = "disabled";
// } 
// else if (
//   timeToMinutes(currentTime) >= timeToMinutes(appointment.start) &&
//   timeToMinutes(currentTime) < timeToMinutes(appointment.end)
// ) {
//   enabledStatus = "enabled";
// } 
// else {
//   enabledStatus = "hidden";
// }
// const timeExpired =timeToMinutes(currentTime)>=timeToMinutes(appointment.end);
// const expiredStatus = timeExpired || appointment.status === "completed";
//   // console.log("trying to save appointment ",appointment.status);
//   await appointment.save();
//   // console.log("status are",expiredStatus,enabledStatus)
// res.json({enabledStatus , expiredStatus});

      // Use stored Date fields directly so timezone handling is consistent.
      // Appointment.start and .end are absolute moments; we simply compare
      // with current server time, and the frontend renders them in the user's
      // local timezone.
      const start = new Date(appointment.start);
      const end = new Date(appointment.end);
      const now = new Date();

      let enabledStatus = "hidden";

      // show button up to 15 minutes before the appointment start
      if (now < new Date(start.getTime() - 15 * 60000)) {
        enabledStatus = "hidden";
      } else if (now >= start && now < end) {
        enabledStatus = "enabled";
      } else if (now >= end) {
        enabledStatus = "disabled";
      }

      const expiredStatus = now >= end || appointment.status ==="completed";
      res.json({ enabledStatus, expiredStatus });

    }catch(err){
        return res.status(500).json({msg:"Server Error"})
    }
}

// chatController.js
exports.sendMessage = async (req, res) => {
  try {
    const { appointmentId, receiver, message ,tempId} = req.body;
    const sender = req.user._id;
    const senderModel = req.user.role === "doctor" ? "Doctor" : "User";

    const chat = await Chat.create({
      appointment: appointmentId,
      sender,
      senderModel,
      receiver,
      message,
      type: "text",
    });

    const io = req.app.get("io"); 
    // console.log("req app",req.app);

    const msg ={
      _id: chat._id,
      appointment: appointmentId,
      sender,
      senderModel,
      receiver,
      message,
      type:chat.type,
      createdAt: chat.createdAt,
      tempId,
    }
    // io.to(appointmentId).emit("chat-warning",{
    //   minutesLeft: 5
    // })
    io.to(appointmentId).emit("receive-message", msg);

    res.json({ success: true, chat });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Send failed" });
  }
};

exports.getMessages = async (req,res)=>{
  try{
    // console.log("trying to get messages");
    const {id} = req.params;
    // console.log(id);
    const chat = await Chat.find({appointment:id});
    if(!chat){
      return res.status(400).json({msg:"chat not found"});
    }
    // console.log("chat",chat);
    res.json(chat);
  }catch(err){
    res.status.json({msg:"Server error",err});
  }
}

exports.uploadChatFile = async (req,res)=>{
  try{
    const {appointmentId , receiver} = req.body;
    const user = req.user;
    if(!req.file) return res.status(400).json({msg:"No file"});
    const fileUrl = req.file.path;// cloudinary path
    const fileType = req.file.mimetype.startsWith("image")?"image":"file";
    const chat = await Chat.create({
      appointment:appointmentId,
      sender:user._id,
      senderModel:user.role==="doctor"?"Doctor":"User",
      receiver:receiver,
      message:fileUrl,
      type:fileType,
    })
      const io = req.app.get("io");
    // console.log("req app",req.app);

    io.to(appointmentId).emit("receive-message", chat);
    res.json({ chat });
  }catch(err){
    console.log("err",err.message);
    return res.status(500).json({msg:"Server Error",Error:err.message});
  }
}