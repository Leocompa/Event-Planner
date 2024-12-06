const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Importa il middleware per l'autenticazione
const authMiddleware = require('../middlewares/authMiddleware');

// Importa il modello Event per interagire con il database
const Event = require('../models/event');

// Route per ottenere gli eventi per l'utente autenticato
router.get('/', authMiddleware, async (req, res) => {
    try {
        // Trova gli eventi associati all'utente autenticato (userId ottenuto dal middleware)
        const events = await Event.find({ userId: req.user.id });

        // Formatta le date degli eventi in formato ISO (UTC)
        const formattedEvents = events.map(event => ({
            ...event.toObject(),
            start: event.start.toISOString(),
            end: event.end.toISOString()
        }));

        // Restituisce gli eventi formattati con status 200 (OK)
        res.status(200).json(formattedEvents);
    } catch (err) {
        // Gestisce errori di recupero eventi
        console.error('Error retrieving events:', err);
        res.status(500).json({ message: 'Error retrieving events' });
    }
});

// Route per creare un nuovo evento
router.post('/', authMiddleware, async (req, res) => {
    const { title, start, end } = req.body;

    // Verifica che titolo, inizio e fine siano forniti
    if (!title || !start || !end) {
        return res.status(400).json({ message: 'Title and dates are required' });
    }

    try {
        // Crea un nuovo evento con i dati ricevuti e l'ID dell'utente autenticato
        const newEvent = new Event({
            title,
            start: new Date(start), // Converte la data in UTC
            end: new Date(end),     // Converte la data in UTC
            userId: req.user.id,    // Associa l'evento all'utente autenticato
        });

        // Salva il nuovo evento nel database
        const savedEvent = await newEvent.save();
        
        // Risponde con l'evento salvato e un codice di stato 201 (Creato)
        res.status(201).json(savedEvent);
    } catch (err) {
        // Gestisce errori durante la creazione dell'evento
        console.error('Error during event creation:', err);
        res.status(500).json({ message: 'Error during event creation' });
    }
});

// Route per aggiornare un evento esistente
router.put('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { title, start, end } = req.body;

    // Verifica che l'ID dell'evento sia valido
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid event ID' });
    }

    try {
        // Cerca e aggiorna l'evento con l'ID specificato, solo se appartiene all'utente autenticato
        const updatedEvent = await Event.findOneAndUpdate(
            { _id: id, userId: req.user.id },
            {
                $set: {
                    title,
                    start: start ? new Date(start) : undefined,
                    end: end ? new Date(end) : undefined
                }
            },
            { new: true, runValidators: true } // Ritorna il documento aggiornato e applica i validatori
        );

        // Se l'evento non è stato trovato o l'utente non è autorizzato, risponde con un errore
        if (!updatedEvent) {
            return res.status(404).json({ message: 'Event not found or unauthorized' });
        }

        // Restituisce l'evento aggiornato
        res.status(200).json(updatedEvent);
    } catch (err) {
        // Gestisce errori durante l'aggiornamento dell'evento
        console.error('Error updating event:', err);
        res.status(500).json({ message: 'Error updating event' });
    }
});

// Route per eliminare un evento esistente
router.delete('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;

    // Verifica che l'ID dell'evento sia valido
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid event ID' });
    }

    try {
        // Cerca e elimina l'evento con l'ID specificato, solo se appartiene all'utente autenticato
        const deletedEvent = await Event.findOneAndDelete({ _id: id, userId: req.user.id });

        // Se l'evento non è stato trovato o l'utente non è autorizzato, risponde con un errore
        if (!deletedEvent) {
            return res.status(404).json({ message: 'Event not found or unauthorized' });
        }

        // Restituisce un messaggio di successo
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (err) {
        // Gestisce errori durante l'eliminazione dell'evento
        console.error('Error deleting event:', err);
        res.status(500).json({ message: 'Error deleting event' });
    }
});

module.exports = router;
