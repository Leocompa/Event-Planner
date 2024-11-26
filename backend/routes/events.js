// routes/events.js

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const Event = require('../models/event');

// Route to get events for the authenticated user
router.get('/', authMiddleware, async (req, res) => {
    try {
        const events = await Event.find({ userId: req.user.id });
        const formattedEvents = events.map(event => ({
            ...event.toObject(),
            start: event.start.toISOString(),
            end: event.end.toISOString()
        }));

        res.status(200).json(formattedEvents);
    } catch (err) {
        console.error('Error retrieving events:', err);
        res.status(500).json({ message: 'Error retrieving events' });
    }
});

// Route to create a new event
router.post('/', authMiddleware, async (req, res) => {
    const { title, start, end } = req.body;

    if (!title || !start || !end) {
        return res.status(400).json({ message: 'Title and dates are required' });
    }

    try {
        const newEvent = new Event({
            title,
            start: new Date(start), // Converte la data in UTC
            end: new Date(end),     // Converte la data in UTC
            userId: req.user.id,
        });

        const savedEvent = await newEvent.save();
        res.status(201).json(savedEvent);
    } catch (err) {
        console.error('Error during event creation:', err);
        res.status(500).json({ message: 'Error during event creation' });
    }
});


// Route to update an existing event
router.put('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { title, start, end } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid event ID' });
    }

    try {
        const updatedEvent = await Event.findOneAndUpdate(
            { _id: id, userId: req.user.id },
            {
                $set: {
                    title,
                    start: start ? new Date(start) : undefined,
                    end: end ? new Date(end) : undefined
                }
            },
            { new: true, runValidators: true }
        );

        if (!updatedEvent) {
            return res.status(404).json({ message: 'Event not found or unauthorized' });
        }

        res.status(200).json(updatedEvent);
    } catch (err) {
        console.error('Error updating event:', err);
        res.status(500).json({ message: 'Error updating event' });
    }
});

// Route to delete an event
router.delete('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid event ID' });
    }

    try {
        const deletedEvent = await Event.findOneAndDelete({ _id: id, userId: req.user.id });

        if (!deletedEvent) {
            return res.status(404).json({ message: 'Event not found or unauthorized' });
        }

        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (err) {
        console.error('Error deleting event:', err);
        res.status(500).json({ message: 'Error deleting event' });
    }
});

module.exports = router;
