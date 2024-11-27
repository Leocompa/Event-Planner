const mongoose = require('mongoose');

// Definizione dello schema per il modello User
const UserSchema = new mongoose.Schema({
    // Email dell'utente
    email: {
        type: String,      // Deve essere una stringa
        required: true,    // Campo obbligatorio
        unique: true       // Garantisce che l'email sia unica nella collezione
    },
    // Password dell'utente
    password: {
        type: String,      // Deve essere una stringa
        required: true     // Campo obbligatorio
    }
});

// Esporta il modello User basato sullo schema definito
module.exports = mongoose.model('User', UserSchema);
