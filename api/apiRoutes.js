const express = require('express');
const router = express.Router();
const userController = require('./userController');
const postController = require('./postController'); // Add this line

router.post('/login', userController.login);
router.post('/register', userController.register);
router.get('/logout', userController.logout);

router.post('/posts', postController.createPost); // Add this line

module.exports = router;