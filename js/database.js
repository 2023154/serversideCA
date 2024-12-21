const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "12345678",
    database: "mysql_db"
});

connection.connect((err) => {
    if (err) {
        console.error("Error connecting to the database:", err.message);
        process.exit(1);
    }
    console.log("Connected to the database.");
});

module.exports = connection;
