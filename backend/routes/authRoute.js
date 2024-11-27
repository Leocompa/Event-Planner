// Importa il modulo Express per creare il router
const express = require('express');

// Importa direttamente le funzioni del controller per la registrazione e il login
const { registerUser, loginUser } = require('../controllers/authController');

// Crea un nuovo router con Express
const router = express.Router();

// Rotta per la registrazione di un nuovo utente
// Quando viene fatta una richiesta POST a /register, la funzione `registerUser` gestirà la logica
router.post('/register', registerUser);

// Rotta per il login di un utente esistente
// Quando viene fatta una richiesta POST a /login, la funzione `loginUser` gestirà la logica
router.post('/login', loginUser);

// Esporta il router in modo che possa essere utilizzato nel file principale dell'app
module.exports = router;
