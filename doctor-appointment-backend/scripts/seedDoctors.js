import mongoose from "mongoose";
import dotenv from "dotenv";
import Doctor from "../models/Doctor.js";
import bcrypt from "bcrypt";
import specializations from "../data/specializations.js";
dotenv.config();

const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedDoctors = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    // await Doctor.deleteMany({}); // clean old fake data (optional)

    const doctors = [];

    for (let i = 1; i <= 100; i++) {
      const hashed = await bcrypt.hash("123456", 10);

      doctors.push({
        firstName: `Doctor${i}`,
        lastName: `Test${i}`,
        email: `doctor${i}@gmail.com`,
        password: hashed,              // 🔥 encrypted password
        phone: 9000000000 + i,
        age: 30 + (i % 25),
        experience: 1 + (i % 20),
        consultationFee: 300 + (i % 10) * 100,
        specialization: random(specializations),
        approved: true,
        role: "doctor",
        profilePhoto: null,
        availability: []               // abhi empty, baad me fill kar sakte
      });
    }

    await Doctor.insertMany(doctors);

    process.exit();
  } catch (err) {
    console.error(" Seeding error:", err);
    process.exit(1);
  }
};

seedDoctors();