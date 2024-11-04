const mongoose = require("mongoose");
require("dotenv").config();
function connectDB() {
  mongoose
    .connect(process.env.MONGO_URL, {})
    .then(() => {
      console.log("Database connected successfully");
      console.log("http://localhost:3000");
    })
    .catch((err) => {
      console.log(err, "error occurred in database connection");
    });
}

module.exports = connectDB;
