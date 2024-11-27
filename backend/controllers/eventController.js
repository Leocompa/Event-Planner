const Event = require('../models/event');

// Recupera gli eventi associati all'utente autenticato
exports.getEvents = async (req, res) => {
    try {
        // Trova tutti gli eventi che appartengono all'utente attuale
        const events = await Event.find({ userId: req.user.id });

        // Converte le date in formato UTC prima di inviarle al frontend
        const utcEvents = events.map(event => ({
            ...event.toObject(),
            start: event.start ? event.start.toISOString() : null,
            end: event.end ? event.end.toISOString() : null
        }));

        // Restituisce gli eventi al client
        res.json(utcEvents);
    } catch (error) {
        // Gestione degli errori in caso di problemi nel recupero degli eventi
        res.status(500).json({ error: 'Error retrieving events' });
    }
};

// Crea un nuovo evento
exports.createEvent = async (req, res) => {
    const { title, start, end } = req.body;

    // Controlla che tutti i campi richiesti siano presenti
    if (!title || !start || !end) {
        return res.status(400).json({ message: 'Title and dates are required' });
    }

    try {
        // Crea un nuovo evento associandolo all'utente autenticato
        const newEvent = new Event({
            title,
            start: new Date(start), // Converte la data in formato UTC
            end: new Date(end),     // Converte la data in formato UTC
            userId: req.user.id,    // Associa l'evento all'ID dell'utente
        });

        // Salva l'evento nel database
        await newEvent.save();

        // Restituisce l'evento creato
        res.status(201).json(newEvent);
    } catch (error) {
        // Gestione degli errori in caso di problemi durante la creazione
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Aggiorna un evento esistente
exports.updateEvent = async (req, res) => {
    const { title, start, end } = req.body;

    // Verifica che le date siano valide
    if (!start || !end || isNaN(new Date(start)) || isNaN(new Date(end))) {
        return res.status(400).json({ error: 'Start and end dates are required and must be valid.' });
    }

    try {
        // Aggiorna l'evento specificato dall'ID con i nuovi valori
        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id,
            {
                title,
                start: new Date(start), // Converte la data in formato UTC
                end: new Date(end)      // Converte la data in formato UTC
            },
            { new: true } // Restituisce l'evento aggiornato
        );

        // Restituisce l'evento aggiornato al client
        res.json(updatedEvent);
    } catch (error) {
        // Gestione degli errori in caso di problemi durante l'aggiornamento
        res.status(500).json({ error: 'Error updating event' });
    }
};

// Elimina un evento esistente
exports.deleteEvent = async (req, res) => {
    try {
        // Rimuove l'evento specificato dall'ID
        await Event.findByIdAndDelete(req.params.id);

        // Conferma l'eliminazione al client
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        // Gestione degli errori in caso di problemi durante l'eliminazione
        res.status(500).json({ error: 'Error deleting event' });
    }
};

// Recupera un evento specifico tramite il suo ID
exports.getEventById = async (req, res) => {
    try {
        // Trova l'evento corrispondente all'ID fornito
        const event = await Event.findById(req.params.id);

        // Se l'evento non esiste, restituisce un errore 404
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        // Restituisce l'evento al client
        res.json(event);
    } catch (error) {
        // Gestione degli errori in caso di problemi durante il recupero
        res.status(500).json({ error: 'Error retrieving event' });
    }
};
