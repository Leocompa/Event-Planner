// Importa i moduli necessari
const express = require('express'); // Framework web per gestire le richieste HTTP
const mongoose = require('mongoose'); // Modulo per interagire con MongoDB
const cors = require('cors'); // Middleware per gestire le richieste da altri domini (CORS)
require('dotenv').config(); // Carica le variabili d'ambiente da un file .env

// Importa le route per l'autenticazione e gli eventi
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');

// Crea un'applicazione Express
const app = express();
const PORT = process.env.PORT || 5001; // Usa la porta definita nelle variabili d'ambiente o 5001 di default

// Middleware
app.use(cors()); // Abilita CORS per tutte le richieste (evita problemi di accesso da domini diversi)
app.use(express.json()); // Abilita il parsing del corpo delle richieste come JSON

// Connessione a MongoDB
mongoose.connect(process.env.MONGO_URI) // Connetti a MongoDB usando la stringa di connessione dal file .env
  .then(() => console.log("Successfully connected to MongoDB!")) // Se la connessione è riuscita, stampa un messaggio di successo
  .catch(err => console.error("MongoDB connection error:", err)); // Se c'è un errore, lo stampa nella console

// Configurazione delle route
app.use('/api/auth', authRoutes); // Mappa le rotte di autenticazione sotto '/api/auth'
app.use('/api/events', eventRoutes); // Mappa le rotte per gli eventi sotto '/api/events'

// Gestione degli errori globali
app.use((err, req, res, next) => {
    console.error(err.stack); // Stampa lo stack dell'errore nella console
    res.status(500).send('Something went wrong!'); // Restituisce un messaggio di errore generico se c'è un problema
});

// Avvia il server sulla porta definita
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`); // Stampa un messaggio per confermare che il server è in esecuzione
});
