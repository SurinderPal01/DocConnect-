const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");


exports.signupUser = async (req, res) => {
  try {
    const { firstName, lastName,  password ,email} =req.body;
    const exists = await User.findOne({ email });
    // console.log("exixts",exists);
    if (exists) {
      return res.status(400).json({ msg: "User Alraeady exists" });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      password: hashed,
      email,
      profilePhoto: null,
    });
    res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ msg: "Server Error", err });
  }
};

exports.UpdateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, age, phone } = req.body.data;

    // only allowed fields
    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (age) updateData.age = age;
    if (phone) updateData.phone = phone;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    const userId = req.user.id;
    const profilePhoto = req.file.path; // Cloudinary URL

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePhoto },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({
      success: true,
      profilePhoto: updatedUser.profilePhoto,
      msg: "Profile photo updated successfully"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};