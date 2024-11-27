const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// User Registration
exports.registerUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validazione del formato dell'email tramite una regex
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                message: 'Invalid email address', 
                errorType: 'validation' 
            });
        }

        // Controlla se l'utente con la stessa email è già registrato nel database
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                message: 'User already registered', 
                errorType: 'duplicate' 
            });
        }

        // Controlla che la password rispetti i requisiti di complessità tramite una regex
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ 
                message: 'Password must be at least 8 characters long, contain an uppercase letter, a number, and a special character.', 
                errorType: 'validation' 
            });
        }

        // Crittografia della password usando bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // Creazione di un nuovo utente con email e password crittografata
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        // Generazione di un token JWT per autenticare l'utente immediatamente dopo la registrazione
        const token = jwt.sign(
            { id: newUser._id, email: newUser.email },
            process.env.JWT_SECRET, // Chiave segreta recuperata dall'ambiente
            { expiresIn: '1h' } // Token valido per 1 ora
        );

        // Risposta con un messaggio di successo e il token generato
        res.status(201).json({ message: 'Registration successful!', token });
    } catch (error) {
        // Gestione di eventuali errori durante il processo di registrazione
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
        // Ricerca di un utente nel database con l'email fornita
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ 
                message: 'User not found', 
                errorType: 'not_found' 
            });
        }

        // Confronto della password fornita con quella memorizzata nel database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ 
                message: 'Incorrect password', 
                errorType: 'invalid_credentials' 
            });
        }

        // Generazione di un token JWT per autenticare l'utente
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET, // Chiave segreta recuperata dall'ambiente
            { expiresIn: '1h' } // Token valido per 1 ora
        );

        // Risposta con il token generato
        res.json({ token });
    } catch (error) {
        // Gestione di eventuali errori durante il processo di login
        console.error('Error during login:', error);
        res.status(500).json({ 
            message: 'Server error', 
            error: error.message,
            errorType: 'server' 
        });
    }
};
