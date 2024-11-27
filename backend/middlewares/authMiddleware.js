const jwt = require('jsonwebtoken');

// Middleware per l'autenticazione
const authMiddleware = (req, res, next) => {
    // Estrae il token dall'header 'Authorization'
    const token = req.headers['authorization']?.split(' ')[1]; // L'header è nel formato "Bearer <token>"

    // Verifica che il token sia presente
    if (!token) {
        return res.status(403).json({ message: 'Access denied, token missing' });
    }

    try {
        // Decodifica e verifica il token utilizzando la chiave segreta
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Aggiunge i dati dell'utente decodificati all'oggetto `req`
        req.user = decoded;

        // Passa il controllo al middleware o controller successivo
        next();
    } catch (err) {
        // Se il token non è valido, restituisce un errore di autenticazione
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authMiddleware;
