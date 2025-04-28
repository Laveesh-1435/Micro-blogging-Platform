const express = require('express');
const router = express.Router();
const userController = require('./userController');

// Login route
router.post('/login', userController.login);

// Register route
router.post('/register', userController.register);

// Logout route
router.get('/logout', userController.logout);


module.exports = router;
