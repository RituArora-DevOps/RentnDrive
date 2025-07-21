const express = require("express");
const cors = require("cors");
const path = require("path");
const log = require("./logger");
const sequelize = require("./app/models/db");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const adminRoutes = require("./app/routes/admin.routes.js");
const authRoutes = require("./app/routes/auth.routes.js");
const carRoutes = require("./app/routes/car.routes.js");
const bookingRoutes = require("./app/routes/booking.routes.js");

// Use routes
app.use("/api/admin", adminRoutes);
app.use("/api", authRoutes);
app.use("/api/car", carRoutes);
app.use("/api/booking", bookingRoutes);

// Serve static files from the client directory
app.use(express.static(path.join(__dirname, "client")));

app.get("/test", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "pages", "test.html"));
});

// Serve index.html for the root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "pages", "index.html"));
});

// Serve login.html for the /login route
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "pages", "login.html"));
});

// Serve register.html for the /register route
app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "pages", "register.html"));
});

app.get("/search_results", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "pages", "search_results.html"));
});

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "pages", "dashboard.html"));
});

app.get("/booking/:carId", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "pages", "booking.html"));
});

app.get("/booking-payment", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "pages", "booking-payment.html"));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "pages", "admin.html"));
});

const PORT = process.env.PORT || 8088;

async function startServer() {
  try {
    await sequelize.sync();
    console.log("Database synced successfully");
    log.info("Database", "Database synchronized successfully.");

    app.listen(PORT, () => {
      log.info("Server", `Server is running on port ${PORT}`);
    });
  } catch (error) {
    log.error("Database", `Database sync failed: ${error.message}`);
    process.exit(1);
  }
}

startServer();
