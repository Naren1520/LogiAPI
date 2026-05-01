const mongoose = require('mongoose');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    apiKey: { type: String, default: () => crypto.randomBytes(32).toString('hex') },
    webhookUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
