const Log = require('../models/Log');

const logger = async (req, res, next) => {
    try {
        // Will be run asynchronously without blocking the request
        const logPromise = Log.create({
            method: req.method,
            route: req.originalUrl,
            userId: req.user ? req.user._id : null
        });
        
        // Let it run in background to not block the current request
        logPromise.catch(err => console.error('Logging failed:', err.message));
        
        console.log(`${req.method} ${req.originalUrl}`);
    } catch (err) {
        console.error('Logger Middleware Error', err);
    }
    next();
};

module.exports = { logger };
