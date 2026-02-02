const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Doctor = require("../models/Doctor");
const User = require("../models/User");
exports.checkUser = async(req , res)=>{
    try{
        let user;
        console.log("trying to check user");
        if(req.user.role=="doctor"){
            user = await Doctor.findById(req.user.id).select("-password");
        }
        if(req.user.role=="user"){
            user = await User.findById(req.user.id).select("-password");
        }
        if(!user){
            return res.status(400).json({success:false})
        }
        res.json({
            success:true,
            user,
        });
    }catch(err){
        return res.status(500).json({
            msg:"Server Error",err
        })
    }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const isProduction = process.env.NODE_ENV === "production";
    const doctor = await Doctor.findOne({ email:email.toLowerCase() });
    if(doctor){
        const match = await bcrypt.compare(password, doctor.password);
    if (!match) return res.json({ message: "Invalid password" });
    const token = jwt.sign({ id: doctor._id ,
      role: doctor.role
    }, process.env.JWT_SECRET,
  { expiresIn: "7d" });

    // Send token in cookies
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    const doctor_data = {
        firstName : doctor.firstName,
        lastName : doctor.lastName,
        role:doctor.role,
        email : doctor.email,
        profilePhoto : doctor.profilePhoto,
        specialization : doctor.specialization,
        phone : doctor.phone,
        age : doctor.age
    }
   return res.json({ message: "Login success", sucess:true ,user:doctor_data }  
  );
}

const user = await User.findOne({email:email.toLowerCase()});
if(user){
    const match = await bcrypt.compare(password, user.password);
    if(!match) return res.json({msg:"Invalid Password"});
    const token = jwt.sign({ id: user._id ,
      role: user.role
    }, process.env.JWT_SECRET,
  { expiresIn: "7d" });
      res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax", 
    });
   return res.json({
        msg:"Login Success",
        success:true,
        user:user
    })
}

  if (!doctor || !user) return res.json({ message: "Invalid email" });

  } catch (err) {
    return res.status(500).json({ msg: "Server Error" });
  }
};

exports.logoutUser = async (req, res) => {
  console.log("callled")
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,        // only HTTPS
      sameSite: "none",    // cross-site cookies
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ message: "Server error" });
  }
};