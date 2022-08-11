const mongoose = require("mongoose");

exports.connectDB = (URL) => {
  mongoose.connect(URL);
  const connection = mongoose.connection;
  connection.once("open", () => {
    console.log("Connected to DB");
  });
};
