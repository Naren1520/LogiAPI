const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    // Check for API key first
    const apiKey = req.header('x-api-key');
    if (apiKey) {
        const user = await User.findOne({ apiKey });
        if (user) {
            req.user = user;
            return next();
        }
        return res.status(401).json({ error: 'Invalid API Key' });
    }

    // Fallback to JWT
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ error: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.userId).select('-password');
        next();
    } catch (err) {
        res.status(401).json({ error: 'Token is not valid' });
    }
};

const adminMiddleware = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ error: 'Admin access require' });
    }
};

module.exports = { authMiddleware, adminMiddleware };
