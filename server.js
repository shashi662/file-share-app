require("dotenv").config();
const express = require("express");
const path = require("path");
const { connectDB } = require("./config/db");
const app = express();

app.use(express.json());
app.use(express.static("public"));
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
/* routes */

app.use("/api/files", require("./routes/files"));
app.use("/files", require("./routes/show"));
app.use("/files/download", require("./routes/download"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  connectDB(process.env.MONGO_URL);
  console.log(`listening on port ${PORT}`);
});
