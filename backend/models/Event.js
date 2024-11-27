const mongoose = require('mongoose');

// Definizione dello schema per il modello Event
const EventSchema = new mongoose.Schema({
    // Titolo dell'evento
    title: {
        type: String,   // Il titolo è una stringa
        required: true  // Campo obbligatorio
    },
    // Data e ora di inizio dell'evento
    start: {
        type: Date,     // Deve essere una data valida
        required: true  // Campo obbligatorio
    },
    // Data e ora di fine dell'evento
    end: {
        type: Date,     // Deve essere una data valida
        required: true  // Campo obbligatorio
    },
    // ID dell'utente proprietario dell'evento
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Riferimento a un ID di MongoDB
        ref: 'User',  // Specifica che questo campo fa riferimento al modello 'User'
        required: true  // Campo obbligatorio
    }
});

// Esporta il modello Event basato sullo schema definito
module.exports = mongoose.model('Event', EventSchema);
