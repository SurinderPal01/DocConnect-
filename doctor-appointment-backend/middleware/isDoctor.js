const Doctor = require("../models/Doctor");

module.exports = (req, res, next) => {
  if (!req.user || req.user.role !== "doctor") {
    return res.status(403).json({
      success: false,
      message: "Doctor access only"
    });
  }
  next();
};
