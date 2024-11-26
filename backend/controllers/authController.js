const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// User Registration
exports.registerUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validate the email format
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                message: 'Invalid email address', 
                errorType: 'validation' 
            });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                message: 'User already registered', 
                errorType: 'duplicate' 
            });
        }

        // Password strength check
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ 
                message: 'Password must be at least 8 characters long, contain an uppercase letter, a number, and a special character.', 
                errorType: 'validation' 
            });
        }

        // Encrypt the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        // Generate a token immediately after registration
        const token = jwt.sign(
            { id: newUser._id, email: newUser.email },
            process.env.JWT_SECRET, // Use the secret key from the .env file
            { expiresIn: '1h' }
        );

        res.status(201).json({ message: 'Registration successful!', token });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ 
            message: 'Server error', 
            error: error.message,
            errorType: 'server' 
        });
    }
};

// User Login
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ 
                message: 'User not found', 
                errorType: 'not_found' 
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ 
                message: 'Incorrect password', 
                errorType: 'invalid_credentials' 
            });
        }

        // Generate the JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET, // Use the secret key from the .env file
            { expiresIn: '1h' }
        );

        res.json({ token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ 
            message: 'Server error', 
            error: error.message,
            errorType: 'server' 
        });
    }
};
