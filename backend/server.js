const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth'); 
const eventRoutes = require('./routes/events'); 

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Successfully connected to MongoDB!"))
  .catch(err => console.error("MongoDB connection error:", err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
