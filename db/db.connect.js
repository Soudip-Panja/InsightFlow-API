const mongoose = require("mongoose");

const { MongoUrl } = require("../config/env");

const initializeDatabase = async () => {
  try {
    await mongoose.connect(MongoUrl);
    console.log("Connected to database.");
  } catch (error) {
    console.log("Databse connection failed:", error);
    process.exit(1);
  }
};

module.exports = { initializeDatabase };
