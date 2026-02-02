const matchSymptomsToDoctor = require("../utils/matchSymptoms");
const geminiModel = require("../utils/gemini");
const Doctor = require("../models/Doctor");

exports.suggestDoctor = async (req, res) => {
  try {
    const { symptoms } = req.body;
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

exports.suggestSpecialization = async (req, res) => {
  try {
    const { symptoms } = req.body;
    console.log("Symptoms",symptoms);
    if (!symptoms) {
      return res.status(400).json({ msg: "Symptoms required" });
    }

    const prompt = `
    You are a medical assistant.
    Respond with ONLY ONE doctor specialization.
    No explanation.

    Symptoms: ${symptoms}
    `;

    const result = await geminiModel.generateContent(prompt);
    console.log("result",result);
    const response = result.response.text().trim();
    console.log("specialization:", response);

    const doctors = await Doctor.find({
      specialization: response,
      approved: true,
    }).limit(5);

    res.json({
      specialization: response,
      suggestedDoctors: doctors,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gemini AI failed" });
  }
};