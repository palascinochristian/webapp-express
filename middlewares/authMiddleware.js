const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

const authMiddleware = (req, res, next) => {
  // Prendi il token dalla header 'Authorization'
  const token = req.headers["authorization"];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Accesso negato, nessun token fornito" });
  }

  try {
    // Verifica il token (rimuovi 'Bearer ' se presente)
    const decoded = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET);
    req.user = decoded; // Aggiungi i dati decodificati all'oggetto richiesta
    next(); // Vai alla prossima funzione (la rotta)
  } catch (error) {
    res.status(401).json({ message: "Token non valido" });
  }
};

module.exports = authMiddleware;
