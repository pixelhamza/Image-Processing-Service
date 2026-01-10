const mongoose = require("mongoose");

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Successfully connected to DATABASE");
  } catch (e) {
    console.error("Unable to connect to Database", e.message);
    process.exit(1); 
  }
};

module.exports = connectToDB;
