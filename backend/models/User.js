const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true  // Ensures the email is unique in the collection
    },
    password: {
        type: String,
        required: true  // Password is required for the user
    }
});

module.exports = mongoose.model('User', UserSchema);
