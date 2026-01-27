const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Doctor = require("../models/Doctor");

module.exports = async (req, res, next) => {
  try {
    // console.log("trying to check user");
    const token = req.cookies.token||req.header("Authorization")?.replace("Bearer ", "");
    // const token = req.header("Authorization")?.replace("Bearer ", "");
    // console.log("token is-",token);
    if (!token) return res.status(401).json({ message: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if(user){
      req.user = user;
    // console.log("user",user);
     return next();
    }
    const doctor = await Doctor.findById(decoded.id);
    if(doctor){
       req.user= doctor;
    // console.log("doctor",doctor);

     return next();
    }
    if (!user || !doctor) {
    res.status(404).json({ message: "User not found" });
    }
    // req.user = user;   // fix here
    // console.log("user is",user)

    // next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
