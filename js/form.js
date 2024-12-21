const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database'); // Import the database connection

const app = express();
const PORT = 3000;

// Middleware to parse JSON data
app.use(bodyParser.json());

// Route to handle form submission
app.post('/submit', (req, res) => {
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

  // Insert data into the database
  const query = `
    INSERT INTO bookings 
    (first_name, last_name, age, email, phone, eircode, production_company, artist_stage_name, tour, date, expected_audience) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [firstName, lastName, age, email, phone, eircode, productionCompany, artistStageName, tour, date, expectedAudience],
    (err, result) => {
      if (err) {
        console.error('Error inserting data:', err.message);
        return res.status(500).json({ message: 'Failed to save data to the database.' });
      }
      res.status(200).json({ message: 'Booking saved successfully!' });
    }
  );
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});




document.getElementById("year").textContent = new Date().getFullYear();

// JavaScript for handling form submission
document.getElementById("bookingForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = {
        firstName: document.getElementById("firstName").value.trim(),
        lastName: document.getElementById("lastName").value.trim(),
        age: parseInt(document.getElementById("age").value, 10),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        eircode: document.getElementById("eircode").value.trim(),
        productionCompany: document.getElementById("productionCompany").value.trim(),
        artistStageName: document.getElementById("artistStageName").value.trim(),
        tour: document.getElementById("tour").value.trim(),
        date: document.getElementById("date").value,
        expectedAudience: parseInt(document.getElementById("expectedAudience").value, 10),
    };

    try {
        // Indicate loading state
        const submitButton = event.target.querySelector("button[type='submit']");
        submitButton.disabled = true;
        submitButton.textContent = "Submitting...";

        const response = await fetch("http://localhost:3000/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            throw new Error("Submission failed.");
        }

        const result = await response.json();
        alert(result.message);
        document.getElementById("bookingForm").reset();
    } catch (error) {
        console.error("Error during submission:", error.message);
        alert("Failed to submit. Please try again.");
    } finally {
        const submitButton = event.target.querySelector("button[type='submit']");
        submitButton.disabled = false;
        submitButton.textContent = "Send";
    }
});
