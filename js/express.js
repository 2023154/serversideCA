// Import the required modules
const express = require("express");
const path = require("path"); // Fix: Ensure path module is imported
const connection = require("./database"); // Import your database connection file

// Create the express application
const app = express();
const PORT = 3000;

// Middleware to handle JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (e.g., HTML, CSS, JS)
app.use(express.static(__dirname));

// Connect to the database and switch to the target database
connection.changeUser({ database: "mysql_db" }, (err) => {
  if (err) {
    console.error("Error switching to database:", err.message);
    process.exit(1);
  }
  console.log("Using database 'mysql_db'.");

  // Create the table if it does not exist
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS mysql_table (
      id INT AUTO_INCREMENT PRIMARY KEY,
      first_name VARCHAR(15) NOT NULL,
      last_name VARCHAR(25) NOT NULL,
      age INT NOT NULL,
      email VARCHAR(100) NOT NULL,
      phone VARCHAR(15) NOT NULL,
      eircode VARCHAR(10) NOT NULL,
      production_company VARCHAR(25) NOT NULL,
      artist_stage_name VARCHAR(50) NOT NULL,
      tour VARCHAR(50) NOT NULL,
      date DATE NOT NULL,
      expected_audience INT
    )`;

  connection.query(createTableQuery, (err) => {
    if (err) {
      console.error("Error creating table:", err.message);
      process.exit(1);
    }
    console.log("Table 'mysql_table' is ready or already exists.");

    // Start the server after the database setup is complete
    startServer();
  });
});

// Function to define routes and start the server
function startServer() {
  // Route to serve the login page
  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "login.html")); // Ensure login.html is in the root directory
  });

  // Start the server
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
