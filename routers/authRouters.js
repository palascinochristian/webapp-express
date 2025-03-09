// routers/authRouters.js
const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");

const router = express.Router();

// 📌 Registrazione utente
router.post("/register", registerUser);

// 📌 Login utente
router.post("/login", loginUser);

module.exports = router;
