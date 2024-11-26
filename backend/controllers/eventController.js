const Event = require('../models/event');

// Get events for the authenticated user
exports.getEvents = async (req, res) => {
    try {
        const events = await Event.find({ userId: req.user.id });
        // Ensure all dates are in UTC when sent to the frontend
        const utcEvents = events.map(event => ({
            ...event.toObject(),
            start: event.start ? event.start.toISOString() : null,
            end: event.end ? event.end.toISOString() : null
        }));
        res.json(utcEvents);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving events' });
    }
};

// Create a new event
exports.createEvent = async (req, res) => {
    const { title, start, end } = req.body;

    if (!title || !start || !end) {
        return res.status(400).json({ message: 'Title and dates are required' });
    }

    try {
        const newEvent = new Event({
            title,
            start: new Date(start), // Convert date to UTC
            end: new Date(end),     // Convert date to UTC
            userId: req.user.id,
        });
        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update an existing event
exports.updateEvent = async (req, res) => {
    const { title, start, end } = req.body;

    // Check that the dates are valid
    if (!start || !end || isNaN(new Date(start)) || isNaN(new Date(end))) {
        return res.status(400).json({ error: 'Start and end dates are required and must be valid.' });
    }

    try {
        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id,
            {
                title,
                start: new Date(start),
                end: new Date(end)
            },
            { new: true }
        );
        res.json(updatedEvent);
    } catch (error) {
        res.status(500).json({ error: 'Error updating event' });
    }
};

// Delete an existing event
exports.deleteEvent = async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting event' });
    }
};

// Get a specific event by ID
exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.json(event);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving event' });
    }
};
