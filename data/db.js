require("dotenv").config();
const mysql = require("mysql2");

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

const connectDB = () => {
  const connection = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
  });

  connection.connect((err) => {
    if (err) {
      console.error("Errore di connessione al database:", err);
      setTimeout(connectDB, 5000); // Riprova dopo 5 secondi
    } else {
      console.log("✅ Connessione al database riuscita!");
    }
  });

  connection.on("error", (err) => {
    console.error("Errore nel database:", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.log("Tentativo di riconnessione...");
      connectDB();
    } else {
      throw err;
    }
  });

  return connection;
};

const connection = connectDB();
module.exports = connection;
