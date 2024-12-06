// Importa il modulo Express per creare il router
const express = require('express');
const router = express.Router();

// Importa il controller per gestire le operazioni di autenticazione
const authController = require('../controllers/authController');

// Rotta per la registrazione di un nuovo utente
// Chiama il metodo `registerUser` del controller
router.post('/register', authController.registerUser);

// Rotta per il login di un utente esistente
// Chiama il metodo `loginUser` del controller
router.post('/login', authController.loginUser);

module.exports = router;
