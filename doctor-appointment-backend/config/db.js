const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("url",process.env.MONGO_URL)
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB Connected");
  } catch (err) {
    console.log("DB ERROR:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
