const express = require("express");
const cors = require("cors");

const app = express();
const errorHandler = require("./middlewares/errorHandler");

// CORS must be first
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json()); // parse JSON bodies
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/test", require("./routes/testRoutes")); // <-- added
app.use("/api/users", require("./routes/userRoutes")); // protected/ admin only
app.use("/api/projects", require("./routes/projectRoutes")); // admin/manager
app.use("/api/tasks", require("./routes/taskRoutes")); // admin/manager/member



// Test route
app.get("/", (req, res) => {
  res.send("TeamBoard Pro API is running 🚀");
});

// ✅ MUST BE LAST
app.use(errorHandler);
module.exports = app; // ✅ important