const express = require("express");
const cors = require("cors");
const path = require("path");
const log = require("./logger");
const db = require("./app/models/db");
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
app.use("/api", adminRoutes);
app.use("/api", authRoutes);
app.use("/api", carRoutes);
app.use("/api", bookingRoutes);

app.use(express.static(path.join(__dirname, "client")));

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        await db.sync();
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