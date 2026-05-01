const rateLimit = require('express-rate-limit');

// Rate limiting middleware
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each client to 100 requests per window
    keyGenerator: (req) => {
        // Enforce rate limit specifically per API Key, fallback to IP
        return req.header('x-api-key') || req.ip;
    },
    message: { error: 'Too many requests, please try again later.' },
    standardHeaders: true, 
    legacyHeaders: false, 
});

module.exports = { apiLimiter };
