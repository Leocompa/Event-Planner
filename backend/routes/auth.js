// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Modified to use the correct function names
router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);

module.exports = router;
