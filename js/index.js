const fs = require("fs");
const connection = require("./database");

// Simulated CSV Data
const csvData = `"John, Doe",30,"johndoe@example.com",0893216548,1YR5DD, "Parkwood", "Beyonce", "Cowboy Carter Tour", "2025-08-10", 60000 
"Jane, Smith",25,"janesmith@example.com",0892856548,8MH7WE, "Calabresos Production", "Davi", "Postmodern BBB 2000", "2026-01-01", 60000
"Michael, Johnson",40,"michaeljohnson@example.com",0898523694,7RP0RR, "Sweat", "Charli XCX", "BRAT tour", "2025-04-01", 10000
"Tommy, Bean",35,"michaeljohnson@example.com",0894859612,EYR5DD, "Lisbela Productions", "Os prisioneiros", "The tour", 2026-05-23, 40000`;

// Parsing and Validating the CSV Data
function processCSVData(csvData) {
  const csvRows = csvData.split("\n"); // Split the CSV data into rows
  const validRecords = [];
  const errors = [];
  const seenEmails = new Set();
  const seenPhones = new Set();

  csvRows.forEach((row, index) => {
    // Split the row into fields using ','
    let fields = row.split(",").map((field) => field.trim());

    if (fields.length !== 11) {
      errors.push(`Row ${index + 1}: Incorrect number of fields`);
      return;
    }

    let [firstName, lastName, age, email, phone, eircode, productionCompany, stageName, tour, date, expectedAudience] = fields;
    const rowErrors = [];

  

    // Validate first Name
    if (!/^[A-Za-z"]{1,15}$/.test(firstName)) {
      rowErrors.push("Name must contain only letters and be at maximum than 15 characters long");
    }

    //validate last name
    if(!/^[A-Za-z"]{1,25}$/.test(lastName)){
      rowErrors.push("Last name must contain only letters and be at maximum 25 characters long");
    }

    // Validate Age (Number without quotes)
    if (!/^\d{1,2}$/.test(age)) {
      rowErrors.push("Age must be a number!");
    } else if (parseInt(age, 10) < 18 || parseInt(age, 10) > 99) {
      rowErrors.push("Age must be between 18 and 99");
    }

    // Validate Email
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
      rowErrors.push("Invalid email format");
    }

    // Validate Phone (10 digits, no quotes)
    if (!/^\d{10}$/.test(phone)) {
      rowErrors.push("Phone must be a 10-digit number");
    }

    // Validate Eircode
    if (!/^[A-Z0-9]{1}[A-Z0-9]{5}$/.test(eircode)) {
      rowErrors.push("Invalid eircode format!");
    }

    // Check for Duplicates
    if (seenEmails.has(email)) {
      rowErrors.push("This email is already in use!");
    }
    if (seenPhones.has(phone)) {
      rowErrors.push("This phone number is already in use!");
    }

    // Add valid records
    if (rowErrors.length === 0) {
      validRecords.push({
        firstName: firstName.replace(/"/g, ""), // Remove quotes for DB insertion
        lastName: lastName.replace(/"/g, ""),
        age: parseInt(age, 10),
        email: email.replace(/"/g, ""),
        phone,
        eircode: eircode.replace(/"/g, ""),
        productionCompany: productionCompany.replace(/"/g, ""),
        stageName: stageName.replace(/"/g, ""),
        tour: tour.replace(/"/g, ""),
        date: date.replace(/"/g, ""), 
        expectedAudience: parseInt(expectedAudience, 10)
      });
      seenEmails.add(email);
      seenPhones.add(phone);
    } else {
      errors.push(`Row ${index + 1}: ${rowErrors.join(", ")}`);
    }
  });

  return { validRecords, errors };
}

// Insert Records into Database
function insertIntoDatabase(records) {
  records.forEach((record) => {
    const { firstName, lastName, age, email, phone, eircode, productionCompany, stageName, tour, date, expectedAudience } = record;

    const query = `INSERT INTO mysql_table (first_name, last_name, age, email, phone, eircode, production_company, artist_stage_name, tour, date, expected_audience) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    connection.query(
      query,
      [firstName, lastName, age, email, phone, eircode, productionCompany, stageName, tour, date, expectedAudience],
      (err) => {
        if (err) {
          console.error("Error inserting record:", err.message);
        } else {
          console.log("Record inserted successfully:", record);
        }
      }
    );
  });
}

// Log Errors
function logErrors(errors) {
  if (errors.length > 0) {
    console.log("Validation errors found:");
    errors.forEach((error) => console.log(error));

    fs.writeFileSync("error_log.txt", errors.join("\n"));
    console.log("Errors logged to error_log.txt");
  }
}

// Process the CSV Data
const { validRecords, errors } = processCSVData(csvData);
logErrors(errors);
insertIntoDatabase(validRecords);
