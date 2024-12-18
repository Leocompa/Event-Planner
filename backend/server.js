const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Importa le route per l'autenticazione e gli eventi
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');

// Crea un'applicazione Express
const app = express();
const PORT = process.env.PORT || 5001;

// Configurazione CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Consenti solo il dominio del frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Metodi permessi
  credentials: true, // Permetti l'invio di cookie e token
};
app.use(cors(corsOptions)); // Applica il middleware CORS

// Middleware
app.use(express.json()); // Abilita il parsing del corpo delle richieste come JSON

// Connessione a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Successfully connected to MongoDB!"))
  .catch(err => console.error("MongoDB connection error:", err));

// Configurazione delle route
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

// Gestione degli errori globali
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Avvia il server sulla porta definita
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
