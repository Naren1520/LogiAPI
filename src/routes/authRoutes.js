const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { apiLimiter } = require('../middleware/rateLimiter');

router.post('/register', apiLimiter, authController.register);
router.post('/login', apiLimiter, authController.login);

module.exports = router;
