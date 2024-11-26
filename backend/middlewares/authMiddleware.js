const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract the token from the header
    
    if (!token) {
        return res.status(403).json({ message: 'Access denied, token missing' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use the secret key from environment variables
        req.user = decoded; // Add the user data to the request
        next(); // Pass control to the next middleware or controller
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authMiddleware;
