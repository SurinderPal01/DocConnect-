const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");

exports.signupDoctor = async (req, res) => {
  try {
    const { firstName, lastName, age, phone, password, email, specialization } =
      req.body;

    const exists = await Doctor.findOne({ email });
    if (exists) {
      return res.status(400).json({ msg: "User Alraeady exists" });
    }
    const hashed = await bcrypt.hash(password, 10);
    const doctor = await Doctor.create({
      firstName,
      lastName,
      age,
      phone,
      password: hashed,
      email,
      profilePhoto: null,
      specialization,
    });
    res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ msg: "Server Error", err });
  }
};

exports.loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await Doctor.findOne({ email });
    if (!doctor) return res.json({ message: "Invalid email" });
    const match = await bcrypt.compare(password, doctor.password);
    if (!match) return res.json({ message: "Invalid password" });
    const token = jwt.sign({ id: doctor._id ,
      role: doctor.role
    }, process.env.JWT_SECRET,
  { expiresIn: "7d" });

    // Send token in cookies
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    const doctor_data = {
        firstName : doctor.firstName,
        lastName : doctor.lastName,
        email : doctor.email,
        profilePhoto : doctor.profilePhoto,
        specialization : doctor.specialization,
        phone : doctor.phone,
        age : doctor.age
    }
    res.json({ message: "Login success", sucess:true ,doctor:doctor_data });
  } catch (err) {
    return res.status(500).json({ msg: "Server Error" });
  }
};


exports.searchDoctors = async (req, res) =>{
  try{
    const {category} = req.query;
    // console.log("category",category);
    if(!category){
      return res.status(400).json({
        success:false,
        msg:"Category is required"
      });
    }
    const doctors = await Doctor.find({
      specialization: category,
  }).select("-password");
  res.json(doctors);
  }catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
exports.getProfile = async (req, res) => {
  try {

    // req.user already contains doctor
    const doctorId = req.user._id;

    if (!doctorId) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const doctor = await Doctor.findById(doctorId).select("-password");

    if (!doctor) {
      return res.status(404).json({ msg: "Doctor not found" });
    }

    res.json(doctor);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: "Internal Server Error",
      error: err.message,
    });
  }
};

exports.getDoctor = async (req,res)=>{
  try{
    const doctorId = req.params.id;
    if(!doctorId){
      return res.status(400).json({msg:"Doctor Id Missing"})
    }
    const doctor = await Doctor.findById(doctorId).select("-password");
    if(!doctor){
      return res.status(400).json({msg:"Doctor Not Found"})
    }
    res.json(doctor)
  }catch(err){
    return res.status(500).json({msg:"Server Error",error:err.message})
  }
}

exports.getAvailability = async(req , res)=>{
  try{
    const doctor = await Doctor.findById(req.user._id).select("availability");
    if(!doctor){
      return res.status(400).json({msg:"Doctor not found"});
    }
    res.json(doctor.availability || []);
  }catch(err){
    res.status(500).json({msg:"Server Error"});
  }
}

exports.updateAvailability = async (req, res) => {
  try {
    const { availability } = req.body;
    const toMinutes = (t)=>{
    const [h,m] = t.split(":").map(Number);
    return h*60+m;
    }  
    if (!Array.isArray(availability)) {
      return res.status(400).json({ message: "Invalid availability data" });
    }
      for (const day of availability) {
          if (!Array.isArray(day.slots)) {
        return res.status(400).json({
          success: false,
          message: `Slots missing or invalid for ${day.day}`,
        });
      }


       for (const slot of day.slots) {
    if (!slot?.start || !slot?.end) {
      return res.status(400).json({
        success: false,
        message: `Slot start/end missing on ${day.day}`,
      });
    }
  }

        const slots = [...day.slots].sort(
          (a, b) => toMinutes(a.start) - toMinutes(b.start)
        );
        for (let i = 0; i < slots.length; i++) {

          const startMin = toMinutes(slots[i].start);
          const endMin = toMinutes(slots[i].end);

          if (!slots[i].start || !slots[i].end || startMin >= endMin) {
            return res.status(400).json({
              success: false,
              message: `Invalid slot on ${day.day}`,
            }); 
          }

          if (
            i < slots.length - 1 &&
            endMin > toMinutes(slots[i + 1].start)
          ) {
            return res.status(400).json({
              success: false,
              message: `Overlapping slots on ${day.day}`,
            });
          }
        }
      }
      const doctor = await Doctor.findByIdAndUpdate(
        req.user._id,
        { availability },
        { new: true }
      );
      if (!doctor) {
        return res.status(400).json({ message: "Doctor not found" });
      }
      res.json(doctor.availability);
    } catch (err) {
      res.status(500).json({ message: "Server Error" });
    }
  };


exports.getTodayAppointments = async(req,res)=>{
  try{
    const doctorId = req.user._id;
    const today = new Date();
    today.setHours(0,0,0,0);
    const appointments = await Appointment.find({
      doctor:doctorId,
      date:today
    }).populate("user","firstName lastName");
    res.json(appointments);
  }catch(err){
    return res.status(500).json({msg:"Server Error"});
  }
}

//get doctor stats
exports.getDoctorStats = async(req,res)=>{
  try{
    const doctorId = req.user._id;
     const totalPatients = await Appointment.distinct("user", {
      doctor: doctorId
    });
    const todayCount = await Appointment.countDocuments({
      doctor: doctorId,
      status: "booked"
    });
    const earningsAgg = await Appointment.aggregate([
      { $match: { doctor: doctorId, status: "booked" } },
      { $group: { _id: null, total: { $sum: "$fee" } } }
    ]);
     res.json({
      totalPatients: totalPatients.length,
      totalAppointments: todayCount,
      totalEarnings: earningsAgg[0]?.total || 0
    });
  }catch(err){
    return res.status(500).json({msg:"Server Error"});
  }
}

exports.getAllPublicDoctors = async (req, res) => {
  try {
    const { specialization, limit = 20, page = 1 } = req.query;
    const query = { approved: true };
    
    if (specialization) {
      query.specialization = specialization;
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const doctors = await Doctor.find(query)
      .select("-password -availability")
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Doctor.countDocuments(query);

    res.json({
      doctors,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (err) {
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};

exports.getPublicDoctor = async (req, res) => {
  try {
    const doctorId = req.params.id;
    if (!doctorId) {
      return res.status(400).json({ msg: "Doctor Id Missing" });
    }
    
    const doctor = await Doctor.findById(doctorId)
      .select("-password -availability");
    
    if (!doctor) {
      return res.status(404).json({ msg: "Doctor Not Found" });
    }

    if (!doctor.approved) {
      return res.status(403).json({ msg: "Doctor not approved" });
    }

    res.json(doctor);
  } catch (err) {
    return res.status(500).json({ msg: "Server Error", error: err.message });
  }
};

exports.getFeaturedDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ approved: true })
      .select("-password -availability")
      .limit(6)
      .sort({ createdAt: -1 });

    res.json(doctors);
  } catch (err) {
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};

exports.getSpecializations = async (req, res) => {
  try {
    const specializations = await Doctor.distinct("specialization", { approved: true });
    res.json(specializations);
  } catch (err) {
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};

exports.updateDoctorProfile = async (req,res)=>{
  try{
    const doctorId = req.user.id;

    const allowedFields =[
      "firstName",
      "lastName",
      "phone",
      "specialization",
      "experience",
      "consultationFee",
    ]

    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });
    //  kuch bhi update karne ko nahi mila
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ msg: "No valid fields to update" });
    }

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      doctorId,
      updates,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedDoctor) {
      return res.status(404).json({ msg: "Doctor not found" });
    }

    res.json({
      success: true,
      doctor: updatedDoctor,
    });

  }catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    const doctorId = req.user.id;
    const profilePhoto = req.file.path; // Cloudinary URL

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      doctorId,
      { profilePhoto },
      { new: true }
    ).select("-password");

    if (!updatedDoctor) {
      return res.status(404).json({ msg: "Doctor not found" });
    }

    res.json({
      success: true,
      profilePhoto: updatedDoctor.profilePhoto,
      msg: "Profile photo updated successfully"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};

exports.okStatus=async (req,res)=>{
  try{
    return res.status(200).json("ok");
  }catch(err){
    res.status(500).json({message:"server error"})
  }
}