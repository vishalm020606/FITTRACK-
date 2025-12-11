const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();

app.use(cors());
app.use(express.json());
const authRoute = require("./routes/auth");
const healthRoute = require("./routes/health");
const routineRoute = require("./routes/routine");
const dashboardRoute = require("./routes/dashboard");
// Connect to DB
mongoose.connect("mongodb://127.0.0.1:27017/fittrack")
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// Routes
app.use("/auth", require("./routes/auth"));
app.use("/health", require("./routes/health"));
app.use("/routine", require("./routes/routine"));
app.use("/dashboard", require("./routes/dashboard"));


// Default
app.get("/", (req, res) => {
    res.send("Backend Running Successfully 🚀");
});

// Start server
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});