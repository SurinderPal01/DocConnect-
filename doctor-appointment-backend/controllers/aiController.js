const matchSymptomsToDoctor = require("../utils/matchSymptoms");
const Doctor = require("../models/Doctor");

exports.suggestDoctor = async (req, res) => {
  try {
    const { symptoms } = req.body;
    console.log("REQ BODY:", req.body); // debug
    if (!symptoms) {
      return res.status(400).json({ msg: "Symptoms required" });
    }

    // 1. find specialization from text
    const specialization = matchSymptomsToDoctor(symptoms);

    // 2. find doctors from DB
    const doctors = await Doctor.find({ specialization, approved: true })
      .limit(5);

    res.json({
      specialization,
      suggestedDoctors: doctors
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "AI suggestion failed" });
  }
};
