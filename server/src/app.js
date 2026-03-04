const express = require("express");

const app = express();

app.use(express.json()); // parse JSON bodies
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/test", require("./routes/testRoutes")); // <-- added
app.use("/api/users", require("./routes/userRoutes")); // protected


// Test route
app.get("/", (req, res) => {
  res.send("TeamBoard Pro API is running 🚀");
});

module.exports = app; // ✅ important