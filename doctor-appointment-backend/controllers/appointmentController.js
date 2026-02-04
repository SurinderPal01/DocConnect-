const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
const Chat = require("../models/Chat");
const notificationService = require("../services/notoficationService");

exports.createAppointment = async (req, res) => {
  try {
    console.log("creating appointment");
    const { doctorId, date, slotId } = req.body;
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ msg: "Doctor not found" });
    }
    const bookingDate =  new Date(date);
    const normalize = (d)=>{
      const x = new Date(d);
      x.setHours(0,0,0,0);
      return x.getTime();
    }
    const dateAvailability = doctor.availability.find(
      // a=> new Date(a.date).getTime()=== new Date(bookingDate).getTime());
      a=> normalize(a.date)=== normalize(bookingDate));

    if (!dateAvailability) {
      return res.status(400).json({ msg: "Doctor not available on this day" });
    }
    const slot = dateAvailability.slots.id(slotId);

    if (!slot) {
      return res.status(400).json({ msg: "Slot not found" });
    }

    if (slot.isAvailable === false) {
      return res.status(400).json({ msg: "Slot already booked" });
    }

    // check if user has booked slot on the same day
    const checkAppointment = await Appointment.find({
      user:req.user ,
      status:"accepted"
      // normalize(date): normalize(date)
    })
    const checkDate = checkAppointment.map(m=>
      normalize(m.date) === normalize(date) ? m :null
    )
    const ifFalse = checkDate.some(d=>d===true);
    if(ifFalse){
      return res.status(400).json({msg:"Slot already booked for this date"})
    }



    // book slot
    slot.isAvailable = false;
    doctor.markModified("availability");

    await doctor.save();
    const appointment = await Appointment.create({
      doctor: doctorId,
      user: req.user._id,
      date:bookingDate,
      slotId: slot._id,
      start: slot.start,
      end: slot.end,
      status: "pending"
    });
    appointment.statusHistory.push({status:"pending"});
    await appointment.save();
    await notificationService.createNotification({
      recipient:doctorId,
      recipientModel:"Doctor",
      appointment:appointment._id,
      doctor: doctor._id,
      title:"New Appointment Request",
      message:"A user has requested an appointment",
      link:`/doctor/appointment/${appointment._id}`
    })
    res.status(201).json({ success: true, appointment });

  } catch (err) {
    console.error("CREATE APPOINTMENT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};


exports.getUserAppointment = async (req,res)=>{
    try{
        const appointment = await Appointment.find({
            user:req.user._id
        }).populate("doctor","firstName lastName specialization")
        .sort({createdAt:-1});
        res.json(appointment)
    }catch(err){
        return res.status(500).json({message:"Server Error"})
    }
};

exports.getDoctorAppointment = async (req,res)=>{
    try{
        const appointment = await Appointment.find({
            doctor:req.user._id
        }).populate("user" , "firstName lastName email")
        .sort({createdAt:-1});
        res.json(appointment)
    }catch(err){
        res.status(500).json({msg:"Server Error"});
    }
};

exports.acceptAppointment = async (req,res)=>{
    try{
        const appointment = await Appointment.findById(req.params.id);
        if(!appointment){
            return res.status(400).json({message:"Appointment Not Found"})
        }
        if (appointment.status === "accepted") {
          return res.status(400).json({ msg: "Already accepted" });
        }
        appointment.status="accepted";
        appointment.statusHistory.push({status:"accepted"});
        await appointment.save();

        //send the notification
        await notificationService.createNotification({
          recipient:appointment.user,
          recipientModel:"User",
          appointment:appointment._id,
          doctor:appointment.doctor,
          title:"Appointment Update",
          message: `Your Appointment has been ${appointment.status}`,
          link:`/appointment/${appointment._id}`
        });

        res.json({success:true,appointment});
    }catch(err){
        res.status(500).json({msg:"Server Error"})
    }
};

exports.rejectAppointment = async (req,res)=>{
    try{
        const appointment = await Appointment.findById(req.params.id);
        if(!appointment){
            return res.status(400).json({msg:"Appointment Not Found"})
        }
        if (appointment.status === "rejected") {
        return res.status(400).json({ msg: "Already rejected" });
      }
        appointment.status="rejected";
        appointment.statusHistory.push({status:"rejected"});
        //  free the slots
        const doctor = await Doctor.findById(appointment.doctor);

        const bookingDate = new Date(appointment.date);
        bookingDate.setHours(0,0,0,0);

        const dateAvailability = doctor.availability.find(
          d=> new Date(d.date).getTime() === new Date(bookingDate).getTime());

         const slot = dateAvailability?.slots.id(appointment.slotId);
         if(slot) slot.isAvailable=true;

         await doctor.save();
         await appointment.save();

        //  send notification
        await notificationService.createNotification({
          recipient:appointment.user,
          recipientModel:"User",
          appointment:appointment._id,
          doctor:appointment.doctor,
          title:"Appointment Update",
          message:`Your Appointment is ${appointment.status}`,
          link:`/apointment/${appointment._id}`
        })
         res.json({success:true})
    }catch(err){
        res.status(500).json({msg:"Server Error"})
    }
};

exports.cancelAppointment = async (req, res) => {
  try {
    // console.log("trying to cancel",req.body.reason);
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    if (appointment.status === "cancelled") {
      return res.status(400).json({ msg: "Already cancelled" });
    }

    appointment.status = "cancelled";
    appointment.cancelReason =req.body.reason;
    appointment.statusHistory.push({status:"cancel"})
    // console.log("appoi.",appointment.statusHistory)
    const doctor = await Doctor.findById(appointment.doctor);

    const bookingDate = new Date(appointment.date);
    bookingDate.setHours(0,0,0,0);
    const dateAvailability = doctor.availability.find(
      d=>new Date(d.date).getTime() === new Date(bookingDate).getTime());

    const slot = dateAvailability?.slots.id(appointment.slotId);

    if (slot) slot.isAvailable = true;

    await doctor.save();
    await appointment.save();
    // console.log("appointment reason",appointment.cancelReason);
    
       //  send notification
        await notificationService.createNotification({
          recipient:appointment.user,
          recipientModel:"User",
          appointment:appointment._id,
          doctor:appointment.doctor,
          title:"Appointment Update",
          message:`Your Appointment is ${appointment.status}`,
          link:`/apointment/${appointment._id}`
        })
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUserAppointmentById = async (req , res)=>{
  try{
    // console.log("trying to get appointment");
    const user = req.user;
    // console.log("user role",user.role);
    const Id = req.params.id;
    // console.log("data ",user,Id);
    let appointment ={};
    if(user.role==="user"){
    const appointments = await Appointment.findById({_id:Id}).populate("doctor" ,"firstName lastName phone");
    appointment=appointments;
    // console.log(appointment)
    }else if(user.role === "doctor"){
    const appointments = await Appointment.findById({_id:Id}).populate("user","firstName lastName");
    appointment=appointments;
      // console.log(appointment);
    }
    // console.log("app.",appointment);
    if(!appointment){
      return res.status(400).json("Appointment Not Found")
    }
    res.json(appointment);
  }catch(err){
    console.log("error-",err);
    return res.status(500).json(err)
  }
}

