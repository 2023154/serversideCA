// Import the required modules
const express = require("express");
const path = require("path");
const connection = require("./js/database"); // Import database connection

// Create the express application
const app = express();
const PORT = 3000;

// Middleware to handle JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (e.g., HTML, CSS, JS)
app.use(express.static(__dirname));

// Connect to the database and set up
connection.changeUser({ database: "mysql_db" }, (err) => {
  if (err) {
    console.error("Error switching to database:", err.message);
    process.exit(1);
  }
  console.log("Using database 'mysql_db'.");

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

// Form submission route
app.post("/submit", (req, res) => {
  const {
    firstName,
    lastName,
    age,
    email,
    phone,
    eircode,
    productionCompany,
    artistStageName,
    tour,
    date,
    expectedAudience,
  } = req.body;

  const query = `
    INSERT INTO mysql_table 
    (first_name, last_name, age, email, phone, eircode, production_company, artist_stage_name, tour, date, expected_audience) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  connection.query(
    query,
    [firstName, lastName, age, email, phone, eircode, productionCompany, artistStageName, tour, date, expectedAudience],
    (err) => {
      if (err) {
        console.error("Error inserting data:", err.message);
        return res.status(500).json({ message: "Failed to save data to the database." });
      }
      res.status(200).json({ message: "Booking saved successfully!" });
    }
  );
});

// Serve the form
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

// Start the server
function startServer() {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}



app.get("/bookings", (req, res) => {
    const query = "SELECT * FROM mysql_table";
    connection.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching bookings:", err.message);
            return res.status(500).json({ message: "Failed to fetch bookings." });
        }
        res.json(results);
     });
    });
