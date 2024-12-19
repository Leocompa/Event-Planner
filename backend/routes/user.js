const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Crea un router Express
const router = express.Router();

// Route per la registrazione dell'utente
router.post('/register', async (req, res) => {
    const { email, password } = req.body; // Estrae i dati di email e password dal corpo della richiesta

    try {
        // Verifica se l'utente con la stessa email esiste già nel database
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            // Se l'utente esiste già, restituisce un errore 400 (utente già registrato)
            return res.status(400).json({ message: 'User already registered' });
        }

        // Crittografa la password prima di salvarla nel database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crea un nuovo utente con l'email e la password crittografata
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save(); // Salva il nuovo utente nel database

        // Restituisce una risposta di successo con codice 201 (Creato)
        res.status(201).json({ message: 'Registration successful!' });
    } catch (error) {
        // Gestisce gli errori durante la registrazione
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Route per il login dell'utente
router.post('/login', async (req, res) => {
    const { email, password } = req.body; // Estrae i dati di email e password dal corpo della richiesta

    try {
        // Cerca l'utente nel database in base all'email fornita
        const user = await User.findOne({ email });
        if (!user) {
            // Se l'utente non esiste, restituisce un errore 400 (utente non trovato)
            return res.status(400).json({ message: 'User not found' });
        }

        // Confronta la password fornita con quella memorizzata nel database (crittografata)
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            // Se la password non corrisponde, restituisce un errore 400 (password errata)
            return res.status(400).json({ message: 'Incorrect password' });
        }

        // Se il login è riuscito, crea un token JWT
        const token = jwt.sign(
            { id: user._id, email: user.email }, // Dati da includere nel token
            'yourSecretKey', 
            { expiresIn: '1h' } // Imposta la scadenza del token (1 ora)
        );

        // Restituisce il token di autenticazione
        res.json({ token });
    } catch (error) {
        // Gestisce gli errori durante il login
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
