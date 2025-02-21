const express = require("express");
const cors = require("cors");
const path = require("path");
const log = require("./logger"); // Import npmlog logger
const db = require("./app/models/db"); // Import database configuration
require("dotenv").config(); // Load environment variables

const app = express(); // Create an Express application

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Middleware to parse incoming requests with JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import and set up routes for admin-related functionality
const adminRoutes = require("./app/routes/admin.routes.js");
app.use("/api", adminRoutes);

// Serve static files from the 'client' folder (e.g., frontend assets)
app.use(express.static(path.join(__dirname, "client")));

// Set the server port from environment variables or default to 8088
const PORT = process.env.PORT || 8088;

// Synchronize the database and start the server
async function startServer() {
  try {
    await db.sync(); // Ensure the database is synchronized before starting the server
    log.info("Database", "Database synchronized successfully.");

    app.listen(PORT, () => {
      log.info("Server", `Server is running on port ${PORT}`);
    });
  } catch (error) {
    log.error("Database", ` Database sync failed: ${error.message}`);
    process.exit(1); // Exit the process if the database fails to sync
  }
}

// Start the server
startServer();
