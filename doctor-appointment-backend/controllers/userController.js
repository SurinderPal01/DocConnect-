const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");


exports.signupUser = async (req, res) => {
  try {
    console.log("trying to signup user");
    const { firstName, lastName,  password ,email} =req.body;
    console.log("data is",firstName, lastName,  password)
    const exists = await User.findOne({ email });
    // console.log("exixts",exists);
    if (exists) {
      return res.status(400).json({ msg: "User Alraeady exists" });
    }
    const hashed = await bcrypt.hash(password, 10);
    console.log("hashed password", hashed);
    const user = await User.create({
      firstName,
      lastName,
      password: hashed,
      email,
      profilePhoto: null,
    });
    console.log("user", user);
    res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ msg: "Server Error", err });
  }
};