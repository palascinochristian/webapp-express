// controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../data/db");
const { JWT_SECRET } = process.env;

// 📌 Registrazione utente
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Tutti i campi sono obbligatori" });
  }

  try {
    // Controlla se l'utente esiste già
    const [existingUser] = await db
      .promise()
      .query("SELECT * FROM users WHERE email = ?", [email]);

    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Email già in uso" });
    }

    // Cripta la password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Salva nel database
    await db
      .promise()
      .query("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [
        username,
        email,
        hashedPassword,
      ]);

    res.status(201).json({ message: "Utente registrato con successo" });
  } catch (error) {
    console.error("Errore registrazione:", error);
    res.status(500).json({ message: "Errore interno del server" });
  }
};

// 📌 Login utente
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Tutti i campi sono obbligatori" });
  }

  try {
    // Controlla se l'utente esiste
    const [user] = await db
      .promise()
      .query("SELECT * FROM users WHERE email = ?", [email]);

    if (user.length === 0) {
      return res.status(401).json({ message: "Credenziali non valide" });
    }

    // Confronta la password
    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      return res.status(401).json({ message: "Credenziali non valide" });
    }

    // Genera il token JWT
    const token = jwt.sign(
      { id: user[0].id, username: user[0].username },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login riuscito", token });
  } catch (error) {
    console.error("Errore login:", error);
    res.status(500).json({ message: "Errore interno del server" });
  }
};

module.exports = { registerUser, loginUser };
